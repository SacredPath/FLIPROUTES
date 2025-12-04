import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const windowMs = 15 * 60 * 1000 // 15 minutes
  const maxRequests = 100 // Max requests per window

  const record = rateLimitStore.get(ip)
  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (record.count >= maxRequests) {
    return false
  }

  record.count++
  return true
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Rate limiting
  const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown'
  if (!checkRateLimit(ip)) {
    return new NextResponse('Too Many Requests', { status: 429 })
  }

  // Security headers
  res.headers.set('X-Frame-Options', 'DENY')
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  res.headers.set('X-XSS-Protection', '1; mode=block')
  res.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')

  // Create Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          res.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          res.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Refresh session if expired - required for Server Components
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Debug: Log environment variables (safe ones only)
  if (process.env.NODE_ENV !== 'production') {
    console.log('[MIDDLEWARE DEBUG] ENV', {
      SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      NODE_ENV: process.env.NODE_ENV,
    })
  }
  // Debug log for session and path (development only)
  if (process.env.NODE_ENV !== 'production') {
    console.log('[MIDDLEWARE DEBUG] Path:', req.nextUrl.pathname)
    console.log('[MIDDLEWARE DEBUG] Session:', session)
  }

  // Define protected routes
  const protectedRoutes = [
    '/dashboard',
    '/admin',
    '/profile',
    '/shipments',
    '/reports'
  ]

  // Define admin-only routes
  const adminRoutes = [
    '/admin'
  ]

  // Define sensitive API routes
  const sensitiveApiRoutes = [
    '/api/admin',
    '/api/shipments',
    '/api/users'
  ]

  const { pathname } = req.nextUrl

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )

  const isAdminRoute = adminRoutes.some(route => 
    pathname.startsWith(route)
  )

  const isSensitiveApiRoute = sensitiveApiRoutes.some(route =>
    pathname.startsWith(route)
  )

  // If accessing a protected route without authentication
  if (isProtectedRoute && !session) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[MIDDLEWARE DEBUG] Redirecting to /login because not authenticated', { pathname })
    }
    const redirectUrl = new URL('/login', req.url)
    redirectUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If accessing admin routes, check if user is admin
  if (isAdminRoute && session) {
    try {
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single()
      if (process.env.NODE_ENV !== 'production') {
        console.log('[MIDDLEWARE DEBUG] Admin route profile:', profile)
      }
      if (profile?.role !== 'admin') {
        if (process.env.NODE_ENV !== 'production') {
          console.log('[MIDDLEWARE DEBUG] User is not admin, redirecting to /dashboard')
        }
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('[MIDDLEWARE DEBUG] Error checking admin role:', error)
      }
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  // If accessing sensitive API routes, require authentication
  if (isSensitiveApiRoute && !session) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[MIDDLEWARE DEBUG] Sensitive API route, not authenticated')
    }
    return new NextResponse('Unauthorized', { status: 401 })
  }

  // If user is authenticated and trying to access login page, redirect to dashboard
  if (session && pathname === '/login') {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[MIDDLEWARE DEBUG] Authenticated user tried to access /login, redirecting to /dashboard')
    }
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // If user is authenticated and trying to access signup page, redirect to dashboard
  if (session && pathname === '/signup') {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[MIDDLEWARE DEBUG] Authenticated user tried to access /signup, redirecting to /dashboard')
    }
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
} 