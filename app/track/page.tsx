'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { shipmentApi } from '@/lib/api'
import type { Shipment } from '@/lib/supabase'
import Navigation from '@/components/Navigation'
import { MapPin, ArrowRight } from 'lucide-react'
import { useRealtimeTracking } from '@/lib/hooks/useRealtimeTracking'
import { useRealtimeShipment } from '@/lib/hooks/useRealtimeShipment'
import { MultiStepTracking } from '@/components/shipment/MultiStepTracking'

export default function TrackPage() {
  const [trackingNumber, setTrackingNumber] = useState('')
  const [shipmentId, setShipmentId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Real-time hooks - will automatically subscribe when shipmentId is set
  const { shipment } = useRealtimeShipment(shipmentId)
  const { trackingEvents, loading: eventsLoading } = useRealtimeTracking(shipmentId)

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!trackingNumber.trim()) return

    setLoading(true)
    setError('')
    setShipmentId(null)

    try {
      const foundShipment = await shipmentApi.getByTrackingNumber(trackingNumber)
      if (foundShipment) {
        // Ensure we have the tracking number from the found shipment
        if (!foundShipment.tracking_number && trackingNumber) {
          foundShipment.tracking_number = trackingNumber
        }
        setShipmentId(foundShipment.id)
      } else {
        setError('Shipment not found. Please check your tracking number.')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to track shipment')
    } finally {
      setLoading(false)
    }
  }

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

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'pickup':
        return '📦'
      case 'in_transit':
        return '🚢'
      case 'out_for_delivery':
        return '🚚'
      case 'delivered':
        return '✅'
      case 'failed':
        return '❌'
      default:
        return '📍'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-12 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Track Your Shipment</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Enter your tracking number to get real-time updates on your shipment's location and status.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tracking Form */}
        <Card className="p-8 mb-8">
          <form onSubmit={handleTrack} className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="tracking" className="block text-sm font-medium text-gray-700 mb-2">
                  Tracking Number
                </label>
                <input
                  type="text"
                  id="tracking"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter your tracking number (e.g., FLIP123456789)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="flex items-end">
                <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                  {loading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Tracking...
                    </div>
                  ) : (
                    'Track Shipment'
                  )}
                </Button>
              </div>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex">
                <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}
        </Card>

        {/* Sample Tracking Numbers */}
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Try these sample tracking numbers:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {['FLIP123456789', 'FLIP987654321', 'FLIP456789123'].map((number) => (
              <button
                key={number}
                onClick={() => setTrackingNumber(number)}
                className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
              >
                <p className="font-medium text-gray-900">{number}</p>
                <p className="text-sm text-gray-500">Click to try</p>
              </button>
            ))}
          </div>
        </Card>

            {/* Shipment Details */}
        {shipment && (
          <div className="space-y-8">
            {/* Real-time indicator */}
            <div className="flex items-center justify-center gap-2 text-sm text-blue-600">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
              <span>Live tracking active</span>
            </div>

            {/* Shipment Overview */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Shipment Details</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(shipment.status)}`}>
                  {getStatusLabel(shipment.status)}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipment Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tracking Number:</span>
                      <span className="font-medium">{shipment.tracking_number || trackingNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Origin:</span>
                      <span className="font-medium">{shipment.origin}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Destination:</span>
                      <span className="font-medium">{shipment.destination}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Carrier:</span>
                      <span className="font-medium">{shipment.carrier}</span>
                    </div>
                    {shipment.weight && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Weight:</span>
                        <span className="font-medium">{shipment.weight} kg</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estimated Delivery:</span>
                      <span className="font-medium">{shipment.estimated_delivery}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Dimensions</h3>
                  <div className="space-y-3">
                    {shipment.dimensions ? (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Length:</span>
                          <span className="font-medium">{shipment.dimensions.length} cm</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Width:</span>
                          <span className="font-medium">{shipment.dimensions.width} cm</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Height:</span>
                          <span className="font-medium">{shipment.dimensions.height} cm</span>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-gray-500">Dimensions not available</p>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Multi-Step Journey Tracking */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Shipment Journey</h3>
                {eventsLoading && (
                  <span className="text-sm text-gray-500">Loading journey details...</span>
                )}
              </div>
              {shipment && trackingEvents.length > 0 ? (
                <MultiStepTracking
                  origin={shipment.origin}
                  destination={shipment.destination}
                  events={trackingEvents}
                  currentStatus={shipment.status}
                  progress={shipment.progress || 0}
                />
              ) : trackingEvents.length === 0 && shipment ? (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Journey Starting Soon</h3>
                  <p className="text-gray-600">Tracking information will appear here once your shipment begins its journey.</p>
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div className="text-center flex-1">
                        <MapPin className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                        <p className="text-sm font-medium text-gray-700">{shipment.origin}</p>
                        <p className="text-xs text-gray-500">Origin</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-blue-600 mx-4" />
                      <div className="text-center flex-1">
                        <MapPin className="w-5 h-5 text-green-600 mx-auto mb-1" />
                        <p className="text-sm font-medium text-gray-700">{shipment.destination}</p>
                        <p className="text-xs text-gray-500">Destination</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </Card>

            {/* Detailed Event Timeline */}
            {trackingEvents.length > 0 && (
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Detailed Event History</h3>
                <div className="space-y-4">
                  {trackingEvents.map((event, index) => (
                    <div key={event.id} className="flex items-start space-x-4 pb-4 border-b border-gray-200 last:border-0">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-lg">{getEventIcon(event.event_type)}</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-base font-medium text-gray-900 capitalize">
                            {event.event_type.replace('_', ' ')}
                          </h4>
                          <span className="text-sm text-gray-500">
                            {new Date(event.timestamp).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                        {event.description && (
                          <p className="text-sm text-gray-500 mt-1">{event.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Map Placeholder */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Shipment Route</h3>
              <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <p className="text-gray-600">Interactive map coming soon</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Features Section */}
        <div className="mt-12">
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Why Track with FlipRoutes?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Updates</h3>
                <p className="text-gray-600">Get instant notifications and real-time tracking updates for your shipments.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure & Reliable</h3>
                <p className="text-gray-600">Your shipment data is protected with enterprise-grade security measures.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Global Coverage</h3>
                <p className="text-gray-600">Track shipments across the globe with our extensive carrier network.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
} 