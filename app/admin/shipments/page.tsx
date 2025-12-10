'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Plus, Edit, Trash2, Package, MapPin, Clock, Truck, CheckCircle, X } from 'lucide-react'

interface Shipment {
  id: string
  tracking_number?: string
  status: string
  origin: string
  destination: string
  carrier?: string
  eta?: string
  estimated_delivery?: string
  currentLocation?: string
  progress?: number
  events?: Array<{
    timestamp: string
    location: string
    status: string
    description: string
  }>
}

export default function AdminShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingShipment, setEditingShipment] = useState<Shipment | null>(null)
  const [formData, setFormData] = useState({
    id: '',
    origin: '',
    destination: '',
    startDate: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    fetchShipments()
  }, [])

  const fetchShipments = async () => {
    try {
      const response = await fetch('/api/admin/shipments')
      const data = await response.json()
      setShipments(data)
    } catch (error) {
      console.error('Error fetching shipments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.origin || !formData.destination) {
      alert('Please enter both origin and destination cities')
      return
    }
    
    try {
      if (editingShipment) {
        // Update existing shipment
        const response = await fetch('/api/admin/shipments', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: formData.id,
            origin: formData.origin,
            destination: formData.destination
          })
        })

        if (response.ok) {
          setShowForm(false)
          setEditingShipment(null)
          resetForm()
          fetchShipments()
          alert('Shipment updated successfully!')
        } else {
          const error = await response.json()
          alert(error.error || 'Error updating shipment')
        }
      } else {
        // Create new shipment with auto-generated tracking
        const response = await fetch('/api/admin/shipments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            origin: formData.origin,
            destination: formData.destination,
            startDate: formData.startDate
          })
        })

        if (response.ok) {
          const data = await response.json()
          setShowForm(false)
          resetForm()
          fetchShipments()
          alert(`Shipment created successfully! Tracking: ${data.tracking_number}. ${data.eventsGenerated} tracking events auto-generated.`)
        } else {
          const error = await response.json()
          alert(error.error || 'Error creating shipment')
        }
      }
    } catch (error) {
      console.error('Error saving shipment:', error)
      alert('Error saving shipment')
    }
  }

  const handleEdit = (shipment: Shipment) => {
    setEditingShipment(shipment)
    setFormData({
      id: shipment.id,
      origin: shipment.origin,
      destination: shipment.destination,
      startDate: new Date().toISOString().split('T')[0]
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this shipment?')) return

    try {
      const response = await fetch(`/api/admin/shipments?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchShipments()
        alert('Shipment deleted successfully!')
      } else {
        alert('Error deleting shipment')
      }
    } catch (error) {
      console.error('Error deleting shipment:', error)
      alert('Error deleting shipment')
    }
  }

  const resetForm = () => {
    setFormData({
      id: '',
      origin: '',
      destination: '',
      startDate: new Date().toISOString().split('T')[0]
    })
  }


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'in_transit': return 'bg-blue-100 text-blue-800'
      case 'at_port': return 'bg-yellow-100 text-yellow-800'
      case 'pending': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading shipments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shipment Management</h1>
          <Button onClick={() => setShowForm(true)} className="flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Add Shipment
          </Button>
        </div>

        {/* Shipments List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">All Shipments</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tracking ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Origin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Destination
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Carrier
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ETA
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {shipments.map((shipment) => (
                  <tr key={shipment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {shipment.tracking_number || shipment.id.substring(0, 8) + '...'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(shipment.status)}`}>
                        {shipment.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {shipment.origin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {shipment.destination}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {shipment.carrier || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {shipment.eta || shipment.estimated_delivery || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${shipment.progress || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">{shipment.progress || 0}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(shipment)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(shipment.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">
                  {editingShipment ? 'Edit Shipment' : 'Add New Shipment'}
                </h3>
                <button
                  onClick={() => {
                    setShowForm(false)
                    setEditingShipment(null)
                    resetForm()
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {editingShipment && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> Editing will only update origin and destination. Tracking events remain unchanged.
                    </p>
                  </div>
                )}
                
                {!editingShipment && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-green-800">
                      <strong>Auto-Generation:</strong> Tracking events from origin to destination port will be automatically generated. The shipment will appear stuck at the destination port.
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Origin City *
                  </label>
                  <input
                    type="text"
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    placeholder="e.g., New York, USA or Berlin, Germany"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">Enter city name with optional country</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Destination City *
                  </label>
                  <input
                    type="text"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    placeholder="e.g., London, UK or Madrid, Spain"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">Enter city name with optional country</p>
                </div>

                {!editingShipment && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Shipment Start Date *
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">Pickup date - tracking events will start from this date</p>
                  </div>
                )}

                <div className="flex space-x-3 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingShipment ? 'Update Shipment' : 'Create Shipment'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false)
                      setEditingShipment(null)
                      resetForm()
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 