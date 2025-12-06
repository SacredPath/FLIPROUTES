import Link from 'next/link'
import { 
  Home, 
  Package, 
  Users, 
  Settings, 
  LogOut, 
  BarChart3,
  MessageCircle,
  Shield
} from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-6">
            <Link href="/admin" className="text-2xl font-bold text-blue-600">
              FlipRoutes Admin
            </Link>
          </div>
          
          <nav className="mt-8">
            <div className="px-4">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Overview
              </div>
              <div className="space-y-2">
                <Link 
                  href="/admin" 
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                >
                  <Home className="w-5 h-5 mr-3" />
                  Dashboard
                </Link>
                <Link 
                  href="/admin/shipments" 
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                >
                  <Package className="w-5 h-5 mr-3" />
                  All Shipments
                </Link>
                <Link 
                  href="/admin/analytics" 
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                >
                  <BarChart3 className="w-5 h-5 mr-3" />
                  Analytics
                </Link>
              </div>
            </div>
            
            <div className="px-4 mt-8">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Management
              </div>
              <div className="space-y-2">
                <Link 
                  href="/admin/users" 
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                >
                  <Users className="w-5 h-5 mr-3" />
                  Users
                </Link>
                <Link 
                  href="/admin/setup" 
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                >
                  <Shield className="w-5 h-5 mr-3" />
                  Admin Setup
                </Link>
                <Link 
                  href="/admin/support" 
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                >
                  <MessageCircle className="w-5 h-5 mr-3" />
                  Support
                </Link>
                <Link 
                  href="/admin/security" 
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                >
                  <Shield className="w-5 h-5 mr-3" />
                  Security
                </Link>
              </div>
            </div>
            
            <div className="px-4 mt-8">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                System
              </div>
              <div className="space-y-2">
                <Link 
                  href="/admin/settings" 
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                >
                  <Settings className="w-5 h-5 mr-3" />
                  Settings
                </Link>
                <button 
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors w-full text-left"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Sign Out
                </button>
              </div>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <main className="p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
} 