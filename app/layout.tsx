import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import Footer from '@/components/ui/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fliproutes - Global Logistics Platform',
  description: 'Streamline your global logistics with Fliproutes. Track shipments, manage customs, and optimize your supply chain.',
  keywords: 'logistics, shipping, freight, customs, supply chain, tracking',
  authors: [{ name: 'Fliproutes Team' }],
  creator: 'Fliproutes',
  publisher: 'Fliproutes',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://fliproutes.com'),
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'Fliproutes - Global Logistics Platform',
    description: 'Streamline your global logistics with Fliproutes. Track shipments, manage customs, and optimize your supply chain.',
    url: '/',
    siteName: 'Fliproutes',
    images: [
      {
        url: '/logo-large.svg',
        width: 200,
        height: 60,
        alt: 'Fliproutes Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fliproutes - Global Logistics Platform',
    description: 'Streamline your global logistics with Fliproutes. Track shipments, manage customs, and optimize your supply chain.',
    images: ['/logo-large.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" sizes="any" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Footer />
      </body>
    </html>
  )
} 