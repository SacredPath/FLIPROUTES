import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-100 py-10 mt-16">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <Image src="/logo-simple.svg" alt="Fliproutes Logo" width={40} height={40} className="mr-3" />
          <span className="font-bold text-lg">Fliproutes</span>
        </div>
        <nav className="flex flex-wrap gap-6 text-sm mb-4 md:mb-0">
          <Link href="/about" className="hover:underline">About</Link>
          <Link href="/pricing" className="hover:underline">Pricing</Link>
          <Link href="/careers" className="hover:underline">Careers</Link>
          <Link href="/blog" className="hover:underline">Blog</Link>
          <Link href="/contact" className="hover:underline">Contact</Link>
          <Link href="/privacy" className="hover:underline">Privacy</Link>
          <Link href="/terms" className="hover:underline">Terms</Link>
        </nav>
        <div className="text-xs text-gray-400 text-center md:text-right">
          &copy; {new Date().getFullYear()} Fliproutes. All rights reserved.
        </div>
      </div>
    </footer>
  )
} 