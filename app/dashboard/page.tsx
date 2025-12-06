'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'
import { useRealtimeShipments } from '@/lib/hooks/useRealtimeShipments'
import type { Shipment } from '@/lib/supabase'

interface Stats {
  total: number
  inTransit: number
  delivered: number
  pending: number
}

export default function DashboardPage() {
  const { user, profile } = useAuth()
  
  // Use real-time hook to get shipments - automatically updates when data changes
  const { shipments, loading, error: shipmentsError } = useRealtimeShipments(user?.id || null)

  // Calculate stats from real-time shipments data
  const stats = useMemo<Stats>(() => {
    return {
      total: shipments.length,
      inTransit: shipments.filter(s => s.status === 'in_transit').length,
      delivered: shipments.filter(s => s.status === 'delivered').length,
      pending: shipments.filter(s => s.status === 'pending').length,
    }
  }, [shipments])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'in_transit':
        return 'bg-blue-100 text-blue-800'
      case 'at_port':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'Delivered'
      case 'in_transit':
        return 'In Transit'
      case 'at_port':
        return 'At Port'
      case 'pending':
        return 'Pending'
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (shipmentsError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-gray-600 mb-4">{shipmentsError}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  const dashboardStats = [
    { 
      label: 'Active Shipments', 
      value: stats.inTransit.toString(), 
      change: '+12%', 
      changeType: 'positive' 
    },
    { 
      label: 'Delivered This Week', 
      value: stats.delivered.toString(), 
      change: '+8%', 
      changeType: 'positive' 
    },
    { 
      label: 'Total Shipments', 
      value: stats.total.toString(), 
      change: '+15%', 
      changeType: 'positive' 
    },
    { 
      label: 'Pending', 
      value: stats.pending.toString(), 
      change: '+2%', 
      changeType: 'positive' 
    }
  ]

  const recentShipments = shipments.slice(0, 3).map(shipment => ({
    id: shipment.id,
    tracking_number: shipment.tracking_number,
    origin: shipment.origin,
    destination: shipment.destination,
    status: getStatusLabel(shipment.status),
    progress: shipment.progress || 0,
    eta: shipment.eta || shipment.estimated_delivery,
    carrier: shipment.carrier,
    container: shipment.container || `CONT-${shipment.id.slice(0, 8)}`,
    value: shipment.value ? `$${shipment.value.toLocaleString()}` : shipment.weight ? `$${(shipment.weight * 100).toLocaleString()}` : 'N/A'
  }))

  const quickActions = [
    { title: 'New Shipment', description: 'Create a new shipment request', icon: '📦', href: '/dashboard/shipments/new' },
    { title: 'Track Shipment', description: 'Track existing shipments', icon: '🔍', href: '/track' },
    { title: 'View Reports', description: 'Analytics and insights', icon: '📊', href: '/dashboard/reports' },
    { title: 'Contact Support', description: 'Get help and support', icon: '💬', href: '/support' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                  <span>Live</span>
                </div>
              </div>
              <p className="text-gray-600 mt-1">
                Welcome back, {profile?.full_name || user?.email}! Here's what's happening with your shipments.
              </p>
            </div>
            <div className="flex space-x-3">
              <Link href="/dashboard/shipments/new">
                <Button variant="outline" size="sm">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New Shipment
                </Button>
              </Link>
              <Button size="sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export Data
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`flex items-center text-sm ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L12 10.586 17.586 5H13z" clipRule="evenodd" />
                  </svg>
                  {stat.change}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Shipments */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Shipments</h2>
                <Link href="/dashboard/shipments">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
              {recentShipments.length > 0 ? (
                <div className="space-y-4">
                  {recentShipments.map((shipment) => (
                    <div key={shipment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{shipment.tracking_number}</p>
                          <p className="text-sm text-gray-600">{shipment.origin} → {shipment.destination}</p>
                          <p className="text-xs text-gray-500">{shipment.carrier}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{shipment.status}</p>
                          <p className="text-xs text-gray-500">ETA: {shipment.eta}</p>
                        </div>
                        <Link href={`/dashboard/shipments/${shipment.id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No shipments yet</h3>
                  <p className="text-gray-600 mb-4">Create your first shipment to get started</p>
                  <Link href="/dashboard/shipments/new">
                    <Button>
                      Create Shipment
                    </Button>
                  </Link>
                </div>
              )}
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
              <div className="space-y-4">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    href={action.href}
                    className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{action.icon}</span>
                      <div>
                        <h3 className="font-medium text-gray-900">{action.title}</h3>
                        <p className="text-sm text-gray-600">{action.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="p-6 mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {recentShipments.length > 0 ? (
                  recentShipments.slice(0, 3).map((shipment, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">Shipment {shipment.id} {shipment.status.toLowerCase()}</p>
                        <p className="text-xs text-gray-500">{shipment.origin} → {shipment.destination}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No recent activity</p>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="mt-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Analytics Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Shipment Growth</h3>
                <p className="text-3xl font-bold text-blue-600">+23%</p>
                <p className="text-sm text-gray-600">vs last month</p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">On-Time Delivery</h3>
                <p className="text-3xl font-bold text-green-600">98.5%</p>
                <p className="text-sm text-gray-600">excellent performance</p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Customer Satisfaction</h3>
                <p className="text-3xl font-bold text-purple-600">4.9/5</p>
                <p className="text-sm text-gray-600">based on reviews</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
} 