import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Try to find shipment by tracking number or bill of lading
    let { data: shipment, error: shipmentError } = await supabase
      .from('shipments')
      .select('*')
      .or(`id.eq.${params.id},bill_of_lading.eq.${params.id}`)
      .single()

    if (shipmentError || !shipment) {
      return NextResponse.json(
        { error: 'Shipment not found' },
        { status: 404 }
      )
    }

    // Get tracking events for this shipment
    const { data: events, error: eventsError } = await supabase
      .from('tracking_events')
      .select('*')
      .eq('shipment_id', shipment.id)
      .order('timestamp', { ascending: false })

    // Compose response with more fields
    const response = {
      id: shipment.id,
      status: shipment.status,
      origin: shipment.origin,
      destination: shipment.destination,
      carrier: shipment.carrier,
      eta: shipment.eta || shipment.estimated_delivery,
      currentLocation: shipment.currentLocation || shipment.current_location,
      progress: shipment.progress || 0,
      weight: shipment.weight,
      dimensions: shipment.dimensions,
      volume: shipment.volume,
      value: shipment.value,
      cargoType: shipment.cargo_type,
      container: shipment.container,
      vessel: shipment.vessel,
      voyage: shipment.voyage,
      portOfLoading: shipment.port_of_loading,
      portOfDischarge: shipment.port_of_discharge,
      billOfLading: shipment.bill_of_lading,
      insurance: shipment.insurance,
      events: events?.map(e => ({
        timestamp: e.timestamp,
        location: e.location,
        status: e.event_type,
        description: e.description,
      })) || [],
    }

    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 