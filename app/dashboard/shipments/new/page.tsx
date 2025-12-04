'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  Package, 
  MapPin, 
  Calendar, 
  Ship, 
  Plus,
  Save,
  X,
  AlertCircle
} from 'lucide-react'
import { shipmentApi } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'

interface ShipmentFormData {
  shipper_name: string
  consignee_name: string
  cargo_type: string
  value: string
  origin: string
  destination: string
  carrier: string
  vessel: string
  voyage: string
  weight: string
  volume: string
  container: string
  port_of_loading: string
  port_of_discharge: string
  bill_of_lading: string
  special_instructions: string
  eta: string
}

export default function NewShipmentPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<ShipmentFormData>({
    shipper_name: '',
    consignee_name: '',
    cargo_type: '',
    value: '',
    origin: '',
    destination: '',
    carrier: '',
    vessel: '',
    voyage: '',
    weight: '',
    volume: '',
    container: '',
    port_of_loading: '',
    port_of_discharge: '',
    bill_of_lading: '',
    special_instructions: '',
    eta: ''
  })

  const generateTrackingNumber = () => {
    const prefix = 'FLIP'
    const timestamp = Date.now().toString().slice(-8)
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `${prefix}${timestamp}${random}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      setError('You must be logged in to create a shipment')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Generate tracking number
      const trackingNumber = generateTrackingNumber()

      // Prepare shipment data
      const shipmentData = {
        tracking_number: trackingNumber,
        status: 'pending' as const,
        origin: formData.origin,
        destination: formData.destination,
        customer_id: user.id,
        shipper_name: formData.shipper_name,
        consignee_name: formData.consignee_name,
        cargo_type: formData.cargo_type || null,
        value: formData.value ? parseFloat(formData.value) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        volume: formData.volume ? parseFloat(formData.volume) : null,
        carrier: formData.carrier || null,
        vessel: formData.vessel || null,
        voyage: formData.voyage || null,
        container: formData.container || null,
        port_of_loading: formData.port_of_loading || null,
        port_of_discharge: formData.port_of_discharge || null,
        bill_of_lading: formData.bill_of_lading || null,
        special_instructions: formData.special_instructions || null,
        eta: formData.eta || null,
        progress: 0
      }

      // Create shipment
      const shipment = await shipmentApi.create(shipmentData)

      // Create initial tracking event
      if (shipment.id) {
        const { trackingApi } = await import('@/lib/api')
        await trackingApi.create({
          shipment_id: shipment.id,
          event_type: 'pickup',
          location: formData.origin,
          description: `Shipment created and ready for pickup`,
          icon: '📦'
        })
      }

      // Redirect to shipment detail page
      router.push(`/dashboard/shipments/${shipment.id}`)
    } catch (err: any) {
      console.error('Error creating shipment:', err)
      setError(err.message || 'Failed to create shipment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Shipment</h1>
              <p className="text-gray-600 mt-1">Set up a new shipment with all required details.</p>
            </div>
            <div className="flex space-x-3">
              <Link href="/dashboard/shipments">
                <Button variant="outline" size="sm">
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 text-red-400 mr-3 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Basic Information */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Shipper Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="shipper_name"
                      value={formData.shipper_name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter shipper name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Consignee Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="consignee_name"
                      value={formData.consignee_name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter consignee name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cargo Type
                    </label>
                    <select
                      name="cargo_type"
                      value={formData.cargo_type}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select cargo type</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Machinery">Machinery</option>
                      <option value="Textiles">Textiles</option>
                      <option value="Automotive">Automotive</option>
                      <option value="Chemicals">Chemicals</option>
                      <option value="Food">Food</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cargo Value (USD)
                    </label>
                    <input
                      type="number"
                      name="value"
                      value={formData.value}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter cargo value"
                    />
                  </div>
                </div>
              </Card>

              {/* Route Information */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Route Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Origin <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="origin"
                      value={formData.origin}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter origin (e.g., Shanghai, China)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Destination <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="destination"
                      value={formData.destination}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter destination (e.g., Los Angeles, CA)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Port of Loading
                    </label>
                    <input
                      type="text"
                      name="port_of_loading"
                      value={formData.port_of_loading}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter port of loading"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Port of Discharge
                    </label>
                    <input
                      type="text"
                      name="port_of_discharge"
                      value={formData.port_of_discharge}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter port of discharge"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Carrier
                    </label>
                    <select
                      name="carrier"
                      value={formData.carrier}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select carrier</option>
                      <option value="Maersk">Maersk</option>
                      <option value="MSC">MSC</option>
                      <option value="Hapag-Lloyd">Hapag-Lloyd</option>
                      <option value="ONE">ONE</option>
                      <option value="CMA CGM">CMA CGM</option>
                      <option value="Evergreen">Evergreen</option>
                      <option value="COSCO">COSCO</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vessel
                    </label>
                    <input
                      type="text"
                      name="vessel"
                      value={formData.vessel}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter vessel name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Voyage Number
                    </label>
                    <input
                      type="text"
                      name="voyage"
                      value={formData.voyage}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter voyage number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Container Number
                    </label>
                    <input
                      type="text"
                      name="container"
                      value={formData.container}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter container number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bill of Lading
                    </label>
                    <input
                      type="text"
                      name="bill_of_lading"
                      value={formData.bill_of_lading}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter bill of lading number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Delivery Date
                    </label>
                    <input
                      type="date"
                      name="eta"
                      value={formData.eta}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </Card>

              {/* Cargo Details */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Cargo Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter weight"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Volume (m³)
                    </label>
                    <input
                      type="number"
                      name="volume"
                      value={formData.volume}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter volume"
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Instructions
                  </label>
                  <textarea
                    name="special_instructions"
                    value={formData.special_instructions}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter any special instructions or requirements"
                  />
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Summary */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipment Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <span className="text-sm font-medium text-gray-900">Pending</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Created</span>
                    <span className="text-sm text-gray-900">Today</span>
                  </div>
                  {formData.origin && formData.destination && (
                    <div className="pt-3 border-t">
                      <span className="text-sm text-gray-600">Route</span>
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {formData.origin} → {formData.destination}
                      </p>
                    </div>
                  )}
                </div>
              </Card>

              {/* Actions */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
                <div className="space-y-3">
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Shipment
                      </>
                    )}
                  </Button>
                  <Link href="/dashboard/shipments">
                    <Button variant="outline" className="w-full" type="button">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
