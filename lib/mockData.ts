import type { Shipment, TrackingEvent } from '@/lib/supabase'

// Mock shipment data - Germany to Madrid, Spain (At Port)
export const mockShipmentGermanyMadrid: Shipment = {
  id: 'a7f3b2c1-8d4e-4f5a-9b6c-2e1d3f4a5b6c',
  tracking_number: 'FLIP782951',
  status: 'at_port',
  origin: 'Berlin, Germany',
  destination: 'Madrid, Spain',
  created_at: '2025-07-15T08:00:00Z',
  updated_at: '2025-08-05T14:45:00Z',
  estimated_delivery: '2025-08-10',
  actual_delivery: undefined,
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
  progress: 85,
  shipper_name: 'TechCorp GmbH',
  consignee_name: 'Iberia Logistics S.A.',
  container: 'TRK-7890123',
  port_of_loading: undefined,
  port_of_discharge: 'Madrid Distribution Center',
  bill_of_lading: undefined,
  customs_status: 'Pending',
  insurance: 'Full Coverage',
  eta: '2025-08-10',
  volume: 5.18,
  special_instructions: 'Handle with care - Fragile electronics',
  image_url: '/images/trucking.png'
}

// Mock shipment data - New York to London, UK (In Transit)
export const mockShipmentNewYorkLondon: Shipment = {
  id: 'b8e4c3d2-9e5f-5g6b-0c7d-3f2e4g5b6c7d',
  tracking_number: 'FLIP123456',
  status: 'at_port',
  origin: 'New York, USA',
  destination: 'London, UK',
  created_at: '2025-08-01T10:00:00Z',
  updated_at: '2025-08-15T11:00:00Z',
  estimated_delivery: '2025-08-16',
  actual_delivery: undefined,
  customer_id: '00000000-0000-0000-0000-000000000003',
  carrier: 'FedEx International',
  weight: 850,
  dimensions: {
    length: 180,
    width: 100,
    height: 150
  },
  value: 12500,
  cargo_type: 'Pharmaceuticals',
  progress: 65,
  shipper_name: 'MedSupply Inc.',
  consignee_name: 'UK Medical Distributors Ltd.',
  container: 'FED-4567890',
  port_of_loading: undefined,
  port_of_discharge: undefined,
  bill_of_lading: undefined,
  customs_status: 'In Progress',
  insurance: 'Standard Coverage',
  eta: '2025-08-16',
  volume: 2.7,
  special_instructions: 'Temperature controlled - Keep refrigerated',
  image_url: '/images/air-freight.png'
}

// Mock shipment data - Shanghai to Los Angeles, USA (At Port)
export const mockShipmentShanghaiLA: Shipment = {
  id: 'c9f5d4e3-0f6g-6h7c-1d8e-4g3f5h6c7d8e',
  tracking_number: 'FLIP789012',
  status: 'at_port',
  origin: 'Shanghai, China',
  destination: 'Los Angeles, USA',
  created_at: '2025-07-20T06:00:00Z',
  updated_at: '2025-08-09T12:00:00Z',
  estimated_delivery: '2025-08-12',
  actual_delivery: undefined,
  customer_id: '00000000-0000-0000-0000-000000000004',
  carrier: 'Maersk Line',
  weight: 2500,
  dimensions: {
    length: 600,
    width: 240,
    height: 260
  },
  value: 45000,
  cargo_type: 'Consumer Goods',
  progress: 40,
  shipper_name: 'Global Manufacturing Co.',
  consignee_name: 'West Coast Distribution LLC',
  container: 'MAE-1234567',
  port_of_loading: 'Shanghai Port',
  port_of_discharge: 'Port of Los Angeles',
  bill_of_lading: 'BL-789012345',
  customs_status: 'Pending',
  insurance: 'Premium Coverage',
  eta: '2025-08-12',
  volume: 37.44,
  special_instructions: 'Container seal intact - Verify upon arrival',
  image_url: '/images/Ocean-freight.jpg'
}

export const mockTrackingEventsGermanyMadrid: TrackingEvent[] = [
  {
    id: 'evt-001',
    shipment_id: 'a7f3b2c1-8d4e-4f5a-9b6c-2e1d3f4a5b6c',
    event_type: 'pickup',
    location: 'Berlin, Germany',
    timestamp: '2025-07-15T08:00:00Z',
    description: 'Shipment picked up from TechCorp GmbH warehouse',
    icon: '📦'
  },
  {
    id: 'evt-002',
    shipment_id: 'a7f3b2c1-8d4e-4f5a-9b6c-2e1d3f4a5b6c',
    event_type: 'in_transit',
    location: 'Berlin Distribution Center',
    timestamp: '2025-07-15T10:30:00Z',
    description: 'Package processed and loaded onto truck',
    icon: '🚚'
  },
  {
    id: 'evt-003',
    shipment_id: 'a7f3b2c1-8d4e-4f5a-9b6c-2e1d3f4a5b6c',
    event_type: 'in_transit',
    location: 'Leipzig, Germany',
    timestamp: '2025-07-15T14:20:00Z',
    description: 'Truck en route - Passed through Leipzig',
    icon: '🚚'
  },
  {
    id: 'evt-004',
    shipment_id: 'a7f3b2c1-8d4e-4f5a-9b6c-2e1d3f4a5b6c',
    event_type: 'in_transit',
    location: 'Nuremberg, Germany',
    timestamp: '2025-07-15T17:45:00Z',
    description: 'Truck en route - Passed through Nuremberg',
    icon: '🚚'
  },
  {
    id: 'evt-005',
    shipment_id: 'a7f3b2c1-8d4e-4f5a-9b6c-2e1d3f4a5b6c',
    event_type: 'in_transit',
    location: 'Munich, Germany',
    timestamp: '2025-07-15T20:15:00Z',
    description: 'Truck en route - Passed through Munich',
    icon: '🚚'
  },
  {
    id: 'evt-006',
    shipment_id: 'a7f3b2c1-8d4e-4f5a-9b6c-2e1d3f4a5b6c',
    event_type: 'in_transit',
    location: 'Austria Border',
    timestamp: '2025-07-20T09:00:00Z',
    description: 'Crossed into Austria - Customs clearance completed',
    icon: '✅'
  },
  {
    id: 'evt-007',
    shipment_id: 'a7f3b2c1-8d4e-4f5a-9b6c-2e1d3f4a5b6c',
    event_type: 'in_transit',
    location: 'Innsbruck, Austria',
    timestamp: '2025-07-20T11:30:00Z',
    description: 'Truck en route - Passed through Innsbruck',
    icon: '🚚'
  },
  {
    id: 'evt-008',
    shipment_id: 'a7f3b2c1-8d4e-4f5a-9b6c-2e1d3f4a5b6c',
    event_type: 'in_transit',
    location: 'Brenner Pass',
    timestamp: '2025-07-20T13:00:00Z',
    description: 'Crossed Brenner Pass into Italy',
    icon: '🏔️'
  },
  {
    id: 'evt-009',
    shipment_id: 'a7f3b2c1-8d4e-4f5a-9b6c-2e1d3f4a5b6c',
    event_type: 'in_transit',
    location: 'Verona, Italy',
    timestamp: '2025-07-22T16:20:00Z',
    description: 'Truck en route - Passed through Verona',
    icon: '🚚'
  },
  {
    id: 'evt-010',
    shipment_id: 'a7f3b2c1-8d4e-4f5a-9b6c-2e1d3f4a5b6c',
    event_type: 'in_transit',
    location: 'Milan, Italy',
    timestamp: '2025-07-22T18:45:00Z',
    description: 'Truck en route - Passed through Milan',
    icon: '🚚'
  },
  {
    id: 'evt-011',
    shipment_id: 'a7f3b2c1-8d4e-4f5a-9b6c-2e1d3f4a5b6c',
    event_type: 'in_transit',
    location: 'France Border',
    timestamp: '2025-07-25T08:30:00Z',
    description: 'Crossed into France - Customs clearance completed',
    icon: '✅'
  },
  {
    id: 'evt-012',
    shipment_id: 'a7f3b2c1-8d4e-4f5a-9b6c-2e1d3f4a5b6c',
    event_type: 'in_transit',
    location: 'Lyon, France',
    timestamp: '2025-07-25T12:15:00Z',
    description: 'Truck en route - Passed through Lyon',
    icon: '🚚'
  },
  {
    id: 'evt-013',
    shipment_id: 'a7f3b2c1-8d4e-4f5a-9b6c-2e1d3f4a5b6c',
    event_type: 'in_transit',
    location: 'Barcelona, Spain',
    timestamp: '2025-07-28T18:00:00Z',
    description: 'Truck en route - Passed through Barcelona',
    icon: '🚚'
  },
  {
    id: 'evt-014',
    shipment_id: 'a7f3b2c1-8d4e-4f5a-9b6c-2e1d3f4a5b6c',
    event_type: 'at_port',
    location: 'Madrid Distribution Center',
    timestamp: '2025-08-02T10:00:00Z',
    description: 'Arrived at Madrid Distribution Center - Container held at facility. Contact Fliproute for local delivery arrangements',
    icon: '⚠️'
  },
  {
    id: 'evt-015',
    shipment_id: 'a7f3b2c1-8d4e-4f5a-9b6c-2e1d3f4a5b6c',
    event_type: 'at_port',
    location: 'Madrid Distribution Center',
    timestamp: '2025-08-05T08:30:00Z',
    description: 'Arrived at Madrid Distribution Center - Container held at facility. Contact Fliproute for local delivery arrangements',
    icon: '⚠️'
  },
  {
    id: 'evt-016',
    shipment_id: 'a7f3b2c1-8d4e-4f5a-9b6c-2e1d3f4a5b6c',
    event_type: 'at_port',
    location: 'Madrid Distribution Center',
    timestamp: '2025-08-05T14:45:00Z',
    description: 'Container still held at distribution center - Awaiting local delivery coordination. Please contact Fliproute for assistance',
    icon: '⏸️'
  },
  {
    id: 'evt-017',
    shipment_id: 'a7f3b2c1-8d4e-4f5a-9b6c-2e1d3f4a5b6c',
    event_type: 'at_port',
    location: 'Madrid Distribution Center',
    timestamp: '2025-08-07T10:00:00Z',
    description: 'Container remains at distribution center - Action required: Contact Fliproute immediately for local delivery and customs clearance',
    icon: '🚨'
  }
]

// Mock tracking events - New York to London, UK (In Transit)
export const mockTrackingEventsNewYorkLondon: TrackingEvent[] = [
  {
    id: 'evt-101',
    shipment_id: 'b8e4c3d2-9e5f-5g6b-0c7d-3f2e4g5b6c7d',
    event_type: 'pickup',
    location: 'New York, USA',
    timestamp: '2025-08-01T10:00:00Z',
    description: 'Shipment picked up from MedSupply Inc. facility',
    icon: '📦'
  },
  {
    id: 'evt-102',
    shipment_id: 'b8e4c3d2-9e5f-5g6b-0c7d-3f2e4g5b6c7d',
    event_type: 'in_transit',
    location: 'JFK International Airport',
    timestamp: '2025-08-01T14:30:00Z',
    description: 'Package processed and loaded onto aircraft',
    icon: '✈️'
  },
  {
    id: 'evt-103',
    shipment_id: 'b8e4c3d2-9e5f-5g6b-0c7d-3f2e4g5b6c7d',
    event_type: 'in_transit',
    location: 'In Flight',
    timestamp: '2025-08-01T18:00:00Z',
    description: 'Aircraft departed JFK - En route to London',
    icon: '✈️'
  },
  {
    id: 'evt-104',
    shipment_id: 'b8e4c3d2-9e5f-5g6b-0c7d-3f2e4g5b6c7d',
    event_type: 'at_port',
    location: 'Heathrow Airport, London',
    timestamp: '2025-08-02T06:15:00Z',
    description: 'Aircraft arrived at Heathrow - Package held at port. Contact Fliproute for local delivery arrangements',
    icon: '⚠️'
  },
  {
    id: 'evt-105',
    shipment_id: 'b8e4c3d2-9e5f-5g6b-0c7d-3f2e4g5b6c7d',
    event_type: 'at_port',
    location: 'Heathrow Airport, London',
    timestamp: '2025-08-05T10:00:00Z',
    description: 'Package still held at port - Awaiting local delivery coordination. Please contact Fliproute for assistance',
    icon: '⏸️'
  },
  {
    id: 'evt-106',
    shipment_id: 'b8e4c3d2-9e5f-5g6b-0c7d-3f2e4g5b6c7d',
    event_type: 'at_port',
    location: 'Heathrow Airport, London',
    timestamp: '2025-08-08T14:00:00Z',
    description: 'Package remains at port - Contact Fliproute immediately for local delivery and customs clearance assistance',
    icon: '🚨'
  },
  {
    id: 'evt-107',
    shipment_id: 'b8e4c3d2-9e5f-5g6b-0c7d-3f2e4g5b6c7d',
    event_type: 'at_port',
    location: 'Heathrow Airport, London',
    timestamp: '2025-08-11T09:30:00Z',
    description: 'Package still held at port - Action required: Contact Fliproute for local delivery coordination',
    icon: '⏸️'
  },
  {
    id: 'evt-108',
    shipment_id: 'b8e4c3d2-9e5f-5g6b-0c7d-3f2e4g5b6c7d',
    event_type: 'at_port',
    location: 'Heathrow Airport, London',
    timestamp: '2025-08-14T11:00:00Z',
    description: 'Package held at port - Contact Fliproute customer service for local delivery arrangements',
    icon: '⚠️'
  },
  {
    id: 'evt-109',
    shipment_id: 'b8e4c3d2-9e5f-5g6b-0c7d-3f2e4g5b6c7d',
    event_type: 'at_port',
    location: 'Heathrow Airport, London',
    timestamp: '2025-08-15T09:00:00Z',
    description: 'Package awaiting local delivery coordination - Please contact Fliproute immediately',
    icon: '🚨'
  }
]

// Mock tracking events - Shanghai to Los Angeles, USA (At Port)
export const mockTrackingEventsShanghaiLA: TrackingEvent[] = [
  {
    id: 'evt-201',
    shipment_id: 'c9f5d4e3-0f6g-6h7c-1d8e-4g3f5h6c7d8e',
    event_type: 'pickup',
    location: 'Shanghai, China',
    timestamp: '2025-07-20T06:00:00Z',
    description: 'Container loaded at Global Manufacturing Co. warehouse',
    icon: '📦'
  },
  {
    id: 'evt-202',
    shipment_id: 'c9f5d4e3-0f6g-6h7c-1d8e-4g3f5h6c7d8e',
    event_type: 'in_transit',
    location: 'Shanghai Port',
    timestamp: '2025-07-22T08:00:00Z',
    description: 'Container arrived at Shanghai Port - Awaiting vessel',
    icon: '🚢'
  },
  {
    id: 'evt-203',
    shipment_id: 'c9f5d4e3-0f6g-6h7c-1d8e-4g3f5h6c7d8e',
    event_type: 'at_port',
    location: 'Shanghai Port',
    timestamp: '2025-07-25T10:30:00Z',
    description: 'Container loaded onto vessel Maersk Line - Vessel departed',
    icon: '🚢'
  },
  {
    id: 'evt-204',
    shipment_id: 'c9f5d4e3-0f6g-6h7c-1d8e-4g3f5h6c7d8e',
    event_type: 'in_transit',
    location: 'Pacific Ocean',
    timestamp: '2025-07-28T12:00:00Z',
    description: 'Vessel en route across Pacific Ocean',
    icon: '🌊'
  },
  {
    id: 'evt-205',
    shipment_id: 'c9f5d4e3-0f6g-6h7c-1d8e-4g3f5h6c7d8e',
    event_type: 'in_transit',
    location: 'Pacific Ocean',
    timestamp: '2025-08-02T14:00:00Z',
    description: 'Vessel continues journey across Pacific Ocean',
    icon: '🌊'
  },
  {
    id: 'evt-206',
    shipment_id: 'c9f5d4e3-0f6g-6h7c-1d8e-4g3f5h6c7d8e',
    event_type: 'in_transit',
    location: 'Pacific Ocean',
    timestamp: '2025-08-05T10:00:00Z',
    description: 'Vessel en route - Approaching US West Coast',
    icon: '🌊'
  },
  {
    id: 'evt-207',
    shipment_id: 'c9f5d4e3-0f6g-6h7c-1d8e-4g3f5h6c7d8e',
    event_type: 'at_port',
    location: 'Port of Los Angeles',
    timestamp: '2025-08-09T12:00:00Z',
    description: 'Vessel arrived at Port of Los Angeles - Container held at port. Contact Fliproute for local delivery arrangements',
    icon: '⚠️'
  },
  {
    id: 'evt-208',
    shipment_id: 'c9f5d4e3-0f6g-6h7c-1d8e-4g3f5h6c7d8e',
    event_type: 'at_port',
    location: 'Port of Los Angeles',
    timestamp: '2025-08-11T14:00:00Z',
    description: 'Container still held at port - Awaiting local delivery coordination. Please contact Fliproute for assistance',
    icon: '⏸️'
  },
  {
    id: 'evt-209',
    shipment_id: 'c9f5d4e3-0f6g-6h7c-1d8e-4g3f5h6c7d8e',
    event_type: 'at_port',
    location: 'Port of Los Angeles',
    timestamp: '2025-08-13T10:00:00Z',
    description: 'Container remains at port - Action required: Contact Fliproute immediately for local delivery and customs clearance',
    icon: '🚨'
  }
]

// Helper function to get mock shipment by tracking number
export function getMockShipmentByTrackingNumber(trackingNumber: string): Shipment | null {
  // Normalize tracking number (trim whitespace, uppercase)
  const normalized = trackingNumber.trim().toUpperCase()
  if (normalized === 'FLIP782951') {
    return mockShipmentGermanyMadrid
  }
  if (normalized === 'FLIP123456') {
    return mockShipmentNewYorkLondon
  }
  if (normalized === 'FLIP789012') {
    return mockShipmentShanghaiLA
  }
  return null
}

// Helper function to get mock tracking events by shipment ID
export function getMockTrackingEventsByShipmentId(shipmentId: string): TrackingEvent[] {
  if (shipmentId === 'a7f3b2c1-8d4e-4f5a-9b6c-2e1d3f4a5b6c') {
    return mockTrackingEventsGermanyMadrid
  }
  if (shipmentId === 'b8e4c3d2-9e5f-5g6b-0c7d-3f2e4g5b6c7d') {
    return mockTrackingEventsNewYorkLondon
  }
  if (shipmentId === 'c9f5d4e3-0f6g-6h7c-1d8e-4g3f5h6c7d8e') {
    return mockTrackingEventsShanghaiLA
  }
  return []
}

// Helper function to get mock tracking events by tracking number
export function getMockTrackingEventsByTrackingNumber(trackingNumber: string): TrackingEvent[] {
  // Normalize tracking number (trim whitespace, uppercase)
  const normalized = trackingNumber.trim().toUpperCase()
  if (normalized === 'FLIP782951') {
    return mockTrackingEventsGermanyMadrid
  }
  if (normalized === 'FLIP123456') {
    return mockTrackingEventsNewYorkLondon
  }
  if (normalized === 'FLIP789012') {
    return mockTrackingEventsShanghaiLA
  }
  return []
}

