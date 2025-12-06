'use client'

import Image from 'next/image'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  Package, 
  MapPin, 
  Calendar, 
  Truck, 
  Ship, 
  Plane,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight
} from 'lucide-react'
import { useRealtimeShipment } from '@/lib/hooks/useRealtimeShipment'
import { useRealtimeTracking } from '@/lib/hooks/useRealtimeTracking'
import { shipmentApi } from '@/lib/api'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MultiStepTracking } from '@/components/shipment/MultiStepTracking'

export default function ShipmentDetailPage({ params }: { params: { id: string } }) {
  const [shipmentId, setShipmentId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Real-time hooks
  const { shipment, loading: shipmentLoading } = useRealtimeShipment(shipmentId)
  const { trackingEvents, loading: eventsLoading } = useRealtimeTracking(shipmentId)

  useEffect(() => {
    const loadShipment = async () => {
      try {
        // Try to get shipment by ID first
        const foundShipment = await shipmentApi.getById(params.id)
        if (foundShipment) {
          setShipmentId(foundShipment.id)
        } else {
          // If not found by ID, try as tracking number
          const byTracking = await shipmentApi.getByTrackingNumber(params.id)
          if (byTracking) {
            setShipmentId(byTracking.id)
          }
        }
      } catch (error) {
        console.error('Error loading shipment:', error)
      } finally {
        setLoading(false)
      }
    }

    loadShipment()
  }, [params.id])

  if (loading || shipmentLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading shipment details...</p>
        </div>
      </div>
    )
  }

  if (!shipment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Shipment Not Found</h2>
          <p className="text-gray-600 mb-4">The shipment you're looking for doesn't exist.</p>
          <Link href="/dashboard/shipments">
            <Button>Back to Shipments</Button>
          </Link>
        </div>
      </div>
    )
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-100'
      case 'in_transit':
        return 'text-blue-600 bg-blue-100'
      case 'at_port':
        return 'text-yellow-600 bg-yellow-100'
      case 'pending':
        return 'text-gray-600 bg-gray-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />
      case 'in_transit':
        return <Clock className="w-4 h-4" />
      case 'at_port':
        return <MapPin className="w-4 h-4" />
      case 'pending':
        return <AlertCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900">Shipment Details</h1>
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                  <span>Live</span>
                </div>
              </div>
              <div className="mt-1 space-y-1">
                <p className="text-gray-600">
                  <span className="font-medium">Tracking Number:</span> <span className="text-blue-600 font-semibold">
                    {shipment.tracking_number && shipment.tracking_number !== shipment.id 
                      ? shipment.tracking_number 
                      : 'N/A'}
                  </span>
                </p>
                <p className="text-xs text-gray-500 font-mono">
                  <span className="font-medium">Shipment ID:</span> {shipment.id}
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" size="sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export
              </Button>
              <Button size="sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipment Overview */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Shipment Overview</h2>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(shipment.status)}`}>
                  {getStatusIcon(shipment.status)}
                  <span className="ml-2 capitalize">{shipment.status.replace('_', ' ')}</span>
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tracking Number</label>
                    <p className="text-lg font-semibold text-blue-600">
                      {shipment.tracking_number && shipment.tracking_number !== shipment.id 
                        ? shipment.tracking_number 
                        : 'N/A'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Use this number to track your shipment</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Shipment ID (UUID)</label>
                    <p className="text-sm font-mono text-gray-600 break-all">{shipment.id}</p>
                    <p className="text-xs text-gray-500 mt-1">Internal reference identifier</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Route</label>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{shipment.origin}</span>
                      <span className="text-gray-400">→</span>
                      <span className="text-gray-900">{shipment.destination}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Carrier</label>
                    <div className="flex items-center space-x-2">
                      <Ship className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{shipment.carrier || 'N/A'}</span>
                    </div>
                  </div>
                  {shipment.vessel && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Vessel</label>
                      <p className="text-gray-900">{shipment.vessel} {shipment.voyage ? `- ${shipment.voyage}` : ''}</p>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  {shipment.eta && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ETA</label>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">{shipment.eta}</span>
                      </div>
                    </div>
                  )}
                  {shipment.container && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Container</label>
                      <p className="text-gray-900">{shipment.container}</p>
                    </div>
                  )}
                  {shipment.cargo_type && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cargo Type</label>
                      <p className="text-gray-900">{shipment.cargo_type}</p>
                    </div>
                  )}
                  {shipment.value && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                      <p className="text-gray-900">${shipment.value.toLocaleString()}</p>
                    </div>
                  )}
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
                {trackingEvents.length > 0 && (
                  <span className="text-sm text-gray-500">{trackingEvents.length} milestones</span>
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
              ) : shipment ? (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Journey Starting Soon</h3>
                  <p className="text-gray-600">Tracking information will appear here once your shipment begins its journey.</p>
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
                          <span className="text-lg">{event.icon || getEventIcon(event.event_type)}</span>
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
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Shipment Progress</span>
                    <span className="text-gray-900">{shipment.progress || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${shipment.progress || 0}%` }}
                    ></div>
                  </div>
                </div>
                {shipment.eta && (
                  <div className="text-sm text-gray-600">
                    <p>Estimated arrival: {shipment.eta}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Details */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipment Details</h3>
              <div className="space-y-3">
                {shipment.weight && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Weight</span>
                    <span className="text-sm text-gray-900">{shipment.weight} kg</span>
                  </div>
                )}
                {shipment.volume && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Volume</span>
                    <span className="text-sm text-gray-900">{shipment.volume} m³</span>
                  </div>
                )}
                {shipment.shipper_name && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Shipper</span>
                    <span className="text-sm text-gray-900">{shipment.shipper_name}</span>
                  </div>
                )}
                {shipment.consignee_name && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Consignee</span>
                    <span className="text-sm text-gray-900">{shipment.consignee_name}</span>
                  </div>
                )}
                {shipment.port_of_loading && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Port of Loading</span>
                    <span className="text-sm text-gray-900">{shipment.port_of_loading}</span>
                  </div>
                )}
                {shipment.port_of_discharge && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Port of Discharge</span>
                    <span className="text-sm text-gray-900">{shipment.port_of_discharge}</span>
                  </div>
                )}
                {shipment.bill_of_lading && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Bill of Lading</span>
                    <span className="text-sm text-gray-900">{shipment.bill_of_lading}</span>
                  </div>
                )}
                {shipment.customs_status && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Customs Status</span>
                    <span className="text-sm text-gray-900">{shipment.customs_status}</span>
                  </div>
                )}
                {shipment.insurance && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Insurance</span>
                    <span className="text-sm text-gray-900">{shipment.insurance}</span>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 