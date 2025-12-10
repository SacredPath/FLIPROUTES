import type { TrackingEvent } from './supabase'

interface RouteInfo {
  origin: string
  destination: string
  shipmentId: string
  startDate: Date
}

/**
 * Auto-generates tracking events from origin to destination port
 * Events are generated to show the shipment getting stuck at the destination port
 */
export function generateTrackingEvents({ origin, destination, shipmentId, startDate }: RouteInfo): TrackingEvent[] {
  const events: TrackingEvent[] = []
  const baseDate = new Date(startDate)
  
  // Extract city names (remove country if present)
  const originCity = origin.split(',')[0].trim()
  const destinationCity = destination.split(',')[0].trim()
  
  // Determine if it's air, ocean, or ground freight based on distance
  const isInternational = origin !== destination && (
    origin.includes(',') || destination.includes(',')
  )
  
  let currentDate = new Date(baseDate)
  let eventIndex = 1
  
  // 1. Pickup event
  events.push({
    id: `evt-${eventIndex++}`,
    shipment_id: shipmentId,
    event_type: 'pickup',
    location: origin,
    timestamp: new Date(currentDate).toISOString(),
    description: `Shipment picked up from ${originCity}`,
    icon: '📦'
  })
  
  currentDate.setHours(currentDate.getHours() + 2)
  
  // 2. Processing at origin facility
  events.push({
    id: `evt-${eventIndex++}`,
    shipment_id: shipmentId,
    event_type: 'in_transit',
    location: `${originCity} Distribution Center`,
    timestamp: new Date(currentDate).toISOString(),
    description: `Package processed and loaded for transport`,
    icon: '📦'
  })
  
  currentDate.setHours(currentDate.getHours() + 4)
  
  // 3-6. Intermediate transit events (generate 3-4 events based on route)
  const intermediateLocations = generateIntermediateLocations(originCity, destinationCity, isInternational)
  
  intermediateLocations.forEach((location, index) => {
    currentDate.setHours(currentDate.getHours() + (isInternational ? 12 : 6))
    events.push({
      id: `evt-${eventIndex++}`,
      shipment_id: shipmentId,
      event_type: 'in_transit',
      location: location,
      timestamp: new Date(currentDate).toISOString(),
      description: `En route - Passed through ${location}`,
      icon: isInternational ? (index === 0 ? '✈️' : '🚢') : '🚚'
    })
  })
  
  // 7. Arrival at destination port/facility
  currentDate.setHours(currentDate.getHours() + (isInternational ? 24 : 12))
  const destinationPort = isInternational 
    ? `${destinationCity} Port` 
    : `${destinationCity} Distribution Center`
  
  events.push({
    id: `evt-${eventIndex++}`,
    shipment_id: shipmentId,
    event_type: 'at_port',
    location: destinationPort,
    timestamp: new Date(currentDate).toISOString(),
    description: `Arrived at ${destinationPort} - Container held at facility. Contact Fliproute for local delivery arrangements`,
    icon: '⚠️'
  })
  
  // 8-10. Stuck at port events (3 events showing it's stuck)
  for (let i = 0; i < 3; i++) {
    currentDate.setDate(currentDate.getDate() + 2)
    const messages = [
      `Container still held at ${destinationPort.toLowerCase()} - Awaiting local delivery coordination. Please contact Fliproute for assistance`,
      `Container remains at ${destinationPort.toLowerCase()} - Action required: Contact Fliproute immediately for local delivery and customs clearance`,
      `Container awaiting local delivery coordination - Please contact Fliproute customer service for assistance`
    ]
    
    events.push({
      id: `evt-${eventIndex++}`,
      shipment_id: shipmentId,
      event_type: 'at_port',
      location: destinationPort,
      timestamp: new Date(currentDate).toISOString(),
      description: messages[i],
      icon: i === 2 ? '🚨' : '⏸️'
    })
  }
  
  return events
}

/**
 * Generates intermediate locations based on origin and destination
 */
function generateIntermediateLocations(origin: string, destination: string, isInternational: boolean): string[] {
  if (!isInternational) {
    // Ground freight - generate 2-3 intermediate cities
    return [
      `${origin} Border`,
      `${destination} Region`
    ]
  }
  
  // International - check if it's likely air or ocean
  const isOceanRoute = Math.random() > 0.5 // 50% chance for ocean
  
  if (isOceanRoute) {
    return [
      `${origin} Port`,
      'In Transit - Ocean',
      'Approaching Destination'
    ]
  } else {
    return [
      `${origin} International Airport`,
      'In Flight',
      `${destination} International Airport`
    ]
  }
}

/**
 * Generates a tracking number
 */
export function generateTrackingNumber(): string {
  const prefix = 'FLIP'
  const randomNum = Math.floor(Math.random() * 1000000).toString().padStart(6, '0')
  return `${prefix}${randomNum}`
}

/**
 * Calculates estimated delivery date based on route
 */
export function calculateETA(startDate: Date, origin: string, destination: string): Date {
  const isInternational = origin !== destination && (
    origin.includes(',') || destination.includes(',')
  )
  
  const days = isInternational ? 20 : 14 // Ocean: 20 days, Air: 14 days minimum
  const eta = new Date(startDate)
  eta.setDate(eta.getDate() + days)
  return eta
}

