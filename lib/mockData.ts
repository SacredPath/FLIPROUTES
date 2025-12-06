import type { Shipment, TrackingEvent } from '@/lib/supabase'

// Mock shipment data - Germany to Madrid, Spain (Delivered)
export const mockShipmentGermanyMadrid: Shipment = {
  id: '44444444-4444-4444-4444-444444444444',
  tracking_number: 'FLIP789012345',
  status: 'delivered',
  origin: 'Berlin, Germany',
  destination: 'Madrid, Spain',
  created_at: '2024-12-15T08:00:00Z',
  updated_at: '2024-12-19T14:45:00Z',
  estimated_delivery: '2024-12-20',
  actual_delivery: '2024-12-19',
  customer_id: '00000000-0000-0000-0000-000000000002',
  carrier: 'DHL Freight',
  weight: 1250,
  dimensions: {
    length: 240,
    width: 120,
    height: 180
  },
  value: 18500,
  cargo_type: 'Electronics',
  progress: 100,
  shipper_name: 'TechCorp GmbH',
  consignee_name: 'Iberia Logistics S.A.',
  container: 'TRK-7890123',
  port_of_loading: undefined,
  port_of_discharge: undefined,
  bill_of_lading: undefined,
  customs_status: 'Cleared',
  insurance: 'Full Coverage',
  eta: '2024-12-20',
  volume: 5.18,
  special_instructions: 'Handle with care - Fragile electronics'
}

export const mockTrackingEventsGermanyMadrid: TrackingEvent[] = [
  {
    id: 'evt-001',
    shipment_id: '44444444-4444-4444-4444-444444444444',
    event_type: 'pickup',
    location: 'Berlin, Germany',
    timestamp: '2024-12-15T08:00:00Z',
    description: 'Shipment picked up from TechCorp GmbH warehouse',
    icon: '📦'
  },
  {
    id: 'evt-002',
    shipment_id: '44444444-4444-4444-4444-444444444444',
    event_type: 'in_transit',
    location: 'Berlin Distribution Center',
    timestamp: '2024-12-15T10:30:00Z',
    description: 'Package processed and loaded onto truck',
    icon: '🚚'
  },
  {
    id: 'evt-003',
    shipment_id: '44444444-4444-4444-4444-444444444444',
    event_type: 'in_transit',
    location: 'Leipzig, Germany',
    timestamp: '2024-12-15T14:20:00Z',
    description: 'Truck en route - Passed through Leipzig',
    icon: '🚚'
  },
  {
    id: 'evt-004',
    shipment_id: '44444444-4444-4444-4444-444444444444',
    event_type: 'in_transit',
    location: 'Nuremberg, Germany',
    timestamp: '2024-12-15T17:45:00Z',
    description: 'Truck en route - Passed through Nuremberg',
    icon: '🚚'
  },
  {
    id: 'evt-005',
    shipment_id: '44444444-4444-4444-4444-444444444444',
    event_type: 'in_transit',
    location: 'Munich, Germany',
    timestamp: '2024-12-15T20:15:00Z',
    description: 'Truck en route - Passed through Munich',
    icon: '🚚'
  },
  {
    id: 'evt-006',
    shipment_id: '44444444-4444-4444-4444-444444444444',
    event_type: 'in_transit',
    location: 'Austria Border',
    timestamp: '2024-12-16T09:00:00Z',
    description: 'Crossed into Austria - Customs clearance completed',
    icon: '✅'
  },
  {
    id: 'evt-007',
    shipment_id: '44444444-4444-4444-4444-444444444444',
    event_type: 'in_transit',
    location: 'Innsbruck, Austria',
    timestamp: '2024-12-16T11:30:00Z',
    description: 'Truck en route - Passed through Innsbruck',
    icon: '🚚'
  },
  {
    id: 'evt-008',
    shipment_id: '44444444-4444-4444-4444-444444444444',
    event_type: 'in_transit',
    location: 'Brenner Pass',
    timestamp: '2024-12-16T13:00:00Z',
    description: 'Crossed Brenner Pass into Italy',
    icon: '🏔️'
  },
  {
    id: 'evt-009',
    shipment_id: '44444444-4444-4444-4444-444444444444',
    event_type: 'in_transit',
    location: 'Verona, Italy',
    timestamp: '2024-12-16T16:20:00Z',
    description: 'Truck en route - Passed through Verona',
    icon: '🚚'
  },
  {
    id: 'evt-010',
    shipment_id: '44444444-4444-4444-4444-444444444444',
    event_type: 'in_transit',
    location: 'Milan, Italy',
    timestamp: '2024-12-16T18:45:00Z',
    description: 'Truck en route - Passed through Milan',
    icon: '🚚'
  },
  {
    id: 'evt-011',
    shipment_id: '44444444-4444-4444-4444-444444444444',
    event_type: 'in_transit',
    location: 'France Border',
    timestamp: '2024-12-17T08:30:00Z',
    description: 'Crossed into France - Customs clearance completed',
    icon: '✅'
  },
  {
    id: 'evt-012',
    shipment_id: '44444444-4444-4444-4444-444444444444',
    event_type: 'in_transit',
    location: 'Lyon, France',
    timestamp: '2024-12-17T12:15:00Z',
    description: 'Truck en route - Passed through Lyon',
    icon: '🚚'
  },
  {
    id: 'evt-013',
    shipment_id: '44444444-4444-4444-4444-444444444444',
    event_type: 'in_transit',
    location: 'Barcelona, Spain',
    timestamp: '2024-12-17T18:00:00Z',
    description: 'Truck en route - Passed through Barcelona',
    icon: '🚚'
  },
  {
    id: 'evt-014',
    shipment_id: '44444444-4444-4444-4444-444444444444',
    event_type: 'in_transit',
    location: 'Madrid Distribution Center',
    timestamp: '2024-12-18T10:00:00Z',
    description: 'Arrived at Madrid distribution center - Sorting in progress',
    icon: '📦'
  },
  {
    id: 'evt-015',
    shipment_id: '44444444-4444-4444-4444-444444444444',
    event_type: 'out_for_delivery',
    location: 'Madrid, Spain',
    timestamp: '2024-12-19T08:30:00Z',
    description: 'Shipment out for final delivery to Iberia Logistics S.A.',
    icon: '🚚'
  },
  {
    id: 'evt-016',
    shipment_id: '44444444-4444-4444-4444-444444444444',
    event_type: 'delivered',
    location: 'Madrid, Spain',
    timestamp: '2024-12-19T14:45:00Z',
    description: 'Shipment delivered successfully to consignee - Signed by recipient',
    icon: '✅'
  }
]

// Helper function to get mock shipment by tracking number
export function getMockShipmentByTrackingNumber(trackingNumber: string): Shipment | null {
  // Normalize tracking number (trim whitespace, uppercase)
  const normalized = trackingNumber.trim().toUpperCase()
  if (normalized === 'FLIP789012345') {
    return mockShipmentGermanyMadrid
  }
  return null
}

// Helper function to get mock tracking events by shipment ID
export function getMockTrackingEventsByShipmentId(shipmentId: string): TrackingEvent[] {
  if (shipmentId === '44444444-4444-4444-4444-444444444444') {
    return mockTrackingEventsGermanyMadrid
  }
  return []
}

// Helper function to get mock tracking events by tracking number
export function getMockTrackingEventsByTrackingNumber(trackingNumber: string): TrackingEvent[] {
  // Normalize tracking number (trim whitespace, uppercase)
  const normalized = trackingNumber.trim().toUpperCase()
  if (normalized === 'FLIP789012345') {
    return mockTrackingEventsGermanyMadrid
  }
  return []
}

