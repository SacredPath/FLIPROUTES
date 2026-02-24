'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { Menu, X, ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleDropdownToggle = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown)
  }

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.svg"
                alt="Fliproutes"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {/* Solutions Dropdown */}
            <div className="relative" onMouseEnter={() => setActiveDropdown('solutions')} onMouseLeave={() => setActiveDropdown(null)}>
              <button 
                className="flex items-center text-gray-700 hover:text-blue-600 py-2 px-3 rounded-md transition-colors"
                onClick={() => handleDropdownToggle('solutions')}
              >
                Solutions
                <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${activeDropdown === 'solutions' ? 'rotate-180' : ''}`} />
              </button>
              {activeDropdown === 'solutions' && (
                <div 
                  className="absolute top-full left-0 w-64 bg-white shadow-lg border rounded-lg py-2 z-50"
                >
                  <Link href="/air-freight" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">Air Freight</Link>
                  <Link href="/ocean-freight" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">Ocean Freight</Link>
                  <Link href="/trucking" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">Trucking</Link>
                  <Link href="/warehousing" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">Warehousing</Link>
                  <Link href="/customs" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">Customs Clearance</Link>
                </div>
              )}
            </div>
            {/* Platform Dropdown */}
            <div className="relative" onMouseEnter={() => setActiveDropdown('platform')} onMouseLeave={() => setActiveDropdown(null)}>
              <button 
                className="flex items-center text-gray-700 hover:text-blue-600 py-2 px-3 rounded-md transition-colors"
                onClick={() => handleDropdownToggle('platform')}
              >
                Platform
                <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${activeDropdown === 'platform' ? 'rotate-180' : ''}`} />
              </button>
              {activeDropdown === 'platform' && (
                <div 
                  className="absolute top-full left-0 w-64 bg-white shadow-lg border rounded-lg py-2 z-50"
                >
                  <Link href="/analytics" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">Analytics & Insights</Link>
                  <Link href="/api" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">API & Integrations</Link>
                  <Link href="/mobile" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">Mobile App</Link>
                </div>
              )}
            </div>
            
            <Link href="/tracking.html" className="text-gray-700 hover:text-blue-600 transition-colors">Track</Link>
            <Link href="/pricing" className="text-gray-700 hover:text-blue-600 transition-colors">Pricing</Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 transition-colors">About</Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600 p-2 rounded-md transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <div className="border-b border-gray-200 pb-2 mb-2">
                <div className="text-sm font-medium text-gray-500 px-3 py-2">Solutions</div>
                <Link href="/air-freight" className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">Air Freight</Link>
                <Link href="/ocean-freight" className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">Ocean Freight</Link>
                <Link href="/trucking" className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">Trucking</Link>
                <Link href="/warehousing" className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">Warehousing</Link>
                <Link href="/customs" className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">Customs Clearance</Link>
              </div>
              <div className="border-b border-gray-200 pb-2 mb-2">
                <div className="text-sm font-medium text-gray-500 px-3 py-2">Platform</div>
                <Link href="/analytics" className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">Analytics & Insights</Link>
                <Link href="/api" className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">API & Integrations</Link>
                <Link href="/mobile" className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">Mobile App</Link>
              </div>
              <Link href="/tracking.html" className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">Track</Link>
              <Link href="/pricing" className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">Pricing</Link>
              <Link href="/about" className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">About</Link>
              <Link href="/careers" className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">Careers</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 