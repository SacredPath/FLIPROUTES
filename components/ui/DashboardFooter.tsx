import Link from 'next/link'
import Image from 'next/image'

export default function DashboardFooter() {
  return (
    <footer className="bg-white border-t border-gray-200 py-6 mt-8">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <Image src="/logo-simple.svg" alt="Fliproutes Logo" width={32} height={32} className="mr-2" />
          <span className="font-bold text-blue-600">Fliproutes Dashboard</span>
        </div>
        <nav className="flex flex-wrap gap-6 text-sm mb-4 md:mb-0">
          <Link href="/dashboard" className="hover:underline">Dashboard</Link>
          <Link href="/dashboard/shipments" className="hover:underline">Shipments</Link>
          <Link href="/dashboard/analytics" className="hover:underline">Analytics</Link>
          <Link href="/dashboard/settings" className="hover:underline">Settings</Link>
          <Link href="/dashboard/profile" className="hover:underline">Profile</Link>
        </nav>
        <div className="text-xs text-gray-400 text-center md:text-right">
          &copy; {new Date().getFullYear()} Fliproutes Ops. Internal Use Only.
        </div>
      </div>
    </footer>
  )
} 