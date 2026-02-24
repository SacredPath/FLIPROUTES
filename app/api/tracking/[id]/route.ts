import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import type { TrackingEvent } from '@/lib/supabase'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Fetch shipment from Supabase - no mock data
    const { data: shipment, error: shipmentError } = await supabase
      .from('shipments')
      .select('*')
      .eq('tracking_number', params.id)
      .single()

    if (shipmentError) {
      console.error('Error fetching shipment:', shipmentError)
      return NextResponse.json({ error: 'Shipment not found' }, { status: 404 })
    }

    if (!shipment) {
      return NextResponse.json({ error: 'Shipment not found' }, { status: 404 })
    }

    // Fetch tracking events from Supabase - no mock data
    const { data: events, error: eventsError } = await supabase
      .from('tracking_events')
      .select('*')
      .eq('shipment_id', shipment.id)
      .order('timestamp', { ascending: false })

    if (eventsError) {
      console.error('Error fetching tracking events:', eventsError)
      return NextResponse.json({ error: 'Failed to fetch tracking events' }, { status: 500 })
    }

    return NextResponse.json({ 
      shipment,
      events: events || []
    })
  } catch (error) {
    console.error('Error fetching tracking data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
