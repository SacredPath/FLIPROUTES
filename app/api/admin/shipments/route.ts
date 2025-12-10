import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { generateTrackingEvents, generateTrackingNumber, calculateETA } from '@/lib/trackingGenerator'

// GET - Fetch all shipments
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('shipments')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json(data || [])
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch shipments' },
      { status: 500 }
    )
  }
}

// POST - Create new shipment with auto-generated tracking events
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { origin, destination, startDate } = body

    if (!origin || !destination) {
      return NextResponse.json(
        { error: 'Origin and destination are required' },
        { status: 400 }
      )
    }

    // Generate tracking number
    const trackingNumber = generateTrackingNumber()
    const shipmentStartDate = startDate ? new Date(startDate) : new Date()
    const eta = calculateETA(shipmentStartDate, origin, destination)

    // Create shipment
    const shipmentData: any = {
      tracking_number: trackingNumber,
      status: 'at_port' as const,
      origin,
      destination,
      estimated_delivery: eta.toISOString().split('T')[0],
      eta: eta.toISOString().split('T')[0],
      progress: 85,
      customs_status: 'Pending',
      customer_id: '00000000-0000-0000-0000-000000000001', // Default admin customer ID
      created_at: shipmentStartDate.toISOString(),
      updated_at: shipmentStartDate.toISOString()
    }

    const { data: shipment, error: shipmentError } = await supabase
      .from('shipments')
      .insert([shipmentData])
      .select()
      .single()

    if (shipmentError) throw shipmentError

    // Auto-generate tracking events
    const trackingEvents = generateTrackingEvents({
      origin,
      destination,
      shipmentId: shipment.id,
      startDate: shipmentStartDate
    })

    // Insert tracking events
    const eventsToInsert = trackingEvents.map(({ id, ...event }) => ({
      ...event,
      shipment_id: shipment.id
    }))

    const { error: eventsError } = await supabase
      .from('tracking_events')
      .insert(eventsToInsert)

    if (eventsError) {
      console.error('Error creating tracking events:', eventsError)
      // Don't fail the entire operation if events fail
    }

    return NextResponse.json({
      ...shipment,
      eventsGenerated: trackingEvents.length
    })
  } catch (error: any) {
    console.error('Error creating shipment:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create shipment' },
      { status: 500 }
    )
  }
}

// PUT - Update shipment
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Shipment ID is required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('shipments')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update shipment' },
      { status: 500 }
    )
  }
}

// DELETE - Delete shipment
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Shipment ID is required' },
        { status: 400 }
      )
    }

    // Delete shipment (tracking events will be cascade deleted)
    const { error } = await supabase
      .from('shipments')
      .delete()
      .eq('id', id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete shipment' },
      { status: 500 }
    )
  }
}
