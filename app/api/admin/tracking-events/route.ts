import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET - Fetch tracking events for a shipment
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const shipmentId = searchParams.get('shipmentId')

    if (!shipmentId) {
      return NextResponse.json(
        { error: 'Shipment ID is required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('tracking_events')
      .select('*')
      .eq('shipment_id', shipmentId)
      .order('timestamp', { ascending: false })

    if (error) throw error
    return NextResponse.json(data || [])
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch tracking events' },
      { status: 500 }
    )
  }
}

// POST - Create new tracking event
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { shipment_id, event_type, location, description, timestamp, icon } = body

    if (!shipment_id || !event_type || !location) {
      return NextResponse.json(
        { error: 'Shipment ID, event type, and location are required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('tracking_events')
      .insert([{
        shipment_id,
        event_type,
        location,
        description: description || '',
        timestamp: timestamp || new Date().toISOString(),
        icon: icon || '📦'
      }])
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create tracking event' },
      { status: 500 }
    )
  }
}

// PUT - Update tracking event
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('tracking_events')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update tracking event' },
      { status: 500 }
    )
  }
}

// DELETE - Delete tracking event
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('tracking_events')
      .delete()
      .eq('id', id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete tracking event' },
      { status: 500 }
    )
  }
}
