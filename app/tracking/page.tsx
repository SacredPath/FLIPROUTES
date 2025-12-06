'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { CheckCircle, ArrowRight, Clock, DollarSign, MapPin, Search, Globe, Shield, Zap, Users, BarChart3, FileText, Truck, Package, Star, ChevronRight, Phone, Mail, MessageSquare, Eye, Bell, Smartphone } from 'lucide-react'
import { useState } from 'react'
import Navigation from '@/components/Navigation'

interface TrackingEvent {
  timestamp: string
  location: string
  status: string
  description: string
}

interface Shipment {
  id: string
  status: string
  origin: string
  destination: string
  carrier: string
  eta: string
  currentLocation: string
  progress: number
  events?: TrackingEvent[]
  billOfLading?: string
  weight?: number
  dimensions?: { length: number; width: number; height: number }
  volume?: number
  value?: number
  cargoType?: string
  container?: string
  vessel?: string
  voyage?: string
  portOfLoading?: string
  portOfDischarge?: string
  insurance?: string
}

export default function TrackingPage() {
  const [trackingNumber, setTrackingNumber] = useState('')
  const [shipment, setShipment] = useState<Shipment | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!trackingNumber.trim()) return

    setLoading(true)
    setError(null)
    setShipment(null)
    
    try {
      const response = await fetch(`/api/tracking/${trackingNumber}`)
      
      if (response.ok) {
        const data = await response.json()
        setShipment(data)
      } else if (response.status === 404) {
        setError('Shipment not found. Please check your tracking number.')
      } else {
        setError('Error tracking shipment. Please try again.')
      }
    } catch (error) {
      setError('Network error. Please check your connection and try again.')
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
      case 'pending':
        return 'bg-gray-100 text-gray-800'
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
        return status.replace('_', ' ')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
        <div className="absolute top-0 right-0 w-full h-full">
          <Image
            src="/tracking-dashboard.svg"
            alt="Tracking Dashboard Illustration"
            fill
            className="object-cover opacity-20"
          />
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Search className="w-4 h-4 mr-2" />
              Real-Time Shipment Tracking
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Track Your Shipments
            </h1>
            <p className="text-2xl font-bold text-gray-700 mb-8 max-w-3xl mx-auto">
              Get real-time updates on your shipments with GPS tracking, milestone notifications, and predictive ETAs. 
              Monitor your cargo from pickup to delivery with complete visibility.
            </p>
            
            {/* Tracking Form */}
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Enter tracking number or Bill of Lading (e.g., FLIP123456789 or BOL123)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <Button type="submit" disabled={loading} className="px-8 py-3">
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Tracking...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Search className="w-5 h-5 mr-2" />
                      Track Shipment
                    </div>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Error Message */}
      {error && (
        <section className="py-8 bg-red-50">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Shipment Details */}
      {shipment && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold text-gray-900">Shipment Details</h2>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(shipment.status)}`}>
                    {getStatusLabel(shipment.status)}
                  </span>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Shipment Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tracking Number:</span>
                        <span className="font-medium">{shipment.id}</span>
                      </div>
                      {shipment.billOfLading && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Bill of Lading:</span>
                          <span className="font-medium">{shipment.billOfLading}</span>
                        </div>
                      )}
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
                      <div className="flex justify-between">
                        <span className="text-gray-600">ETA:</span>
                        <span className="font-medium">{shipment.eta}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Current Location:</span>
                        <span className="font-medium">{shipment.currentLocation}</span>
                      </div>
                      {shipment.weight && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Weight:</span>
                          <span className="font-medium">{shipment.weight} kg</span>
                        </div>
                      )}
                      {shipment.dimensions && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Dimensions:</span>
                          <span className="font-medium">{shipment.dimensions.length} x {shipment.dimensions.width} x {shipment.dimensions.height} cm</span>
                        </div>
                      )}
                      {shipment.volume && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Volume:</span>
                          <span className="font-medium">{shipment.volume} m³</span>
                        </div>
                      )}
                      {shipment.value && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Value:</span>
                          <span className="font-medium">${shipment.value}</span>
                        </div>
                      )}
                      {shipment.cargoType && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Cargo Type:</span>
                          <span className="font-medium">{shipment.cargoType}</span>
                        </div>
                      )}
                      {shipment.container && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Container:</span>
                          <span className="font-medium">{shipment.container}</span>
                        </div>
                      )}
                      {shipment.vessel && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Vessel:</span>
                          <span className="font-medium">{shipment.vessel}</span>
                        </div>
                      )}
                      {shipment.voyage && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Voyage:</span>
                          <span className="font-medium">{shipment.voyage}</span>
                        </div>
                      )}
                      {shipment.portOfLoading && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Port of Loading:</span>
                          <span className="font-medium">{shipment.portOfLoading}</span>
                        </div>
                      )}
                      {shipment.portOfDischarge && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Port of Discharge:</span>
                          <span className="font-medium">{shipment.portOfDischarge}</span>
                        </div>
                      )}
                      {shipment.insurance && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Insurance:</span>
                          <span className="font-medium">{shipment.insurance}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Progress</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Shipment Progress</span>
                          <span>{shipment.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-blue-600 h-3 rounded-full transition-all duration-500" 
                            style={{ width: `${shipment.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-900 mb-2">Estimated Delivery</h4>
                        <p className="text-blue-700">{shipment.eta}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tracking Events */}
                {shipment.events && shipment.events.length > 0 && (
                  <div className="border-t pt-8">
                    <h3 className="text-lg font-semibold mb-6">Tracking Events</h3>
                    <div className="space-y-4">
                      {shipment.events.map((event, index) => (
                        <div key={index} className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium text-gray-900">{event.status}</h4>
                                <p className="text-sm text-gray-600">{event.description}</p>
                                <p className="text-xs text-gray-500 mt-1">{event.location}</p>
                              </div>
                              <span className="text-xs text-gray-500">
                                {formatDate(event.timestamp)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Choose Our Tracking?</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Advanced tracking technology with real-time updates and comprehensive visibility
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Real-Time Updates</h3>
              <p className="text-gray-600">Live tracking with GPS precision and instant notifications</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Smart Notifications</h3>
              <p className="text-gray-600">Get alerts for milestones, delays, and important updates</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Mobile Access</h3>
              <p className="text-gray-600">Track shipments anywhere with our mobile app</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure & Reliable</h3>
              <p className="text-gray-600">Enterprise-grade security and 99.9% uptime</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Need Help with Your Shipment?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Contact our support team for assistance with tracking or shipping questions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4">
                Contact Support
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4">
                Access Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
} 