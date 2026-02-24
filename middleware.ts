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

  // Debug: Log environment variables (safe ones only)
  if (process.env.NODE_ENV !== 'production') {
    console.log('[MIDDLEWARE DEBUG] ENV', {
      SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      NODE_ENV: process.env.NODE_ENV,
    })
  }
  // Debug log for path (development only)
  if (process.env.NODE_ENV !== 'production') {
    console.log('[MIDDLEWARE DEBUG] Path:', req.nextUrl.pathname)
  }

  // Define protected routes (currently none)
  const protectedRoutes: string[] = []

  // Define sensitive API routes (currently none)
  const sensitiveApiRoutes: string[] = []

  const { pathname } = req.nextUrl

  // No protected routes - all routes are publicly accessible
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
