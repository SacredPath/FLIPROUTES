'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { TrackingEvent } from '@/lib/supabase'

/**
 * Hook for real-time tracking events subscription
 * Automatically subscribes to tracking_events table changes for a specific shipment
 */
export function useRealtimeTracking(shipmentId: string | null) {
  const [trackingEvents, setTrackingEvents] = useState<TrackingEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!shipmentId) {
      setLoading(false)
      return
    }

    // Initial fetch
    const fetchTrackingEvents = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('tracking_events')
          .select('*')
          .eq('shipment_id', shipmentId)
          .order('timestamp', { ascending: false })

        if (fetchError) throw fetchError
        setTrackingEvents(data || [])
        setError(null)
      } catch (err: any) {
        console.error('Error fetching tracking events:', err)
        setError(err.message || 'Failed to load tracking events')
      } finally {
        setLoading(false)
      }
    }

    fetchTrackingEvents()

    // Set up real-time subscription
    const channel = supabase
      .channel(`tracking_events:${shipmentId}`)
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'tracking_events',
          filter: `shipment_id=eq.${shipmentId}`,
        },
        (payload) => {
          console.log('Real-time tracking event received:', payload)

          if (payload.eventType === 'INSERT') {
            // Add new event to the beginning of the array (most recent first)
            setTrackingEvents((prev) => [payload.new as TrackingEvent, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            // Update existing event
            setTrackingEvents((prev) =>
              prev.map((event) =>
                event.id === payload.new.id ? (payload.new as TrackingEvent) : event
              )
            )
          } else if (payload.eventType === 'DELETE') {
            // Remove deleted event
            setTrackingEvents((prev) =>
              prev.filter((event) => event.id !== payload.old.id)
            )
          }
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status)
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to tracking events')
        } else if (status === 'CHANNEL_ERROR') {
          setError('Failed to subscribe to real-time updates')
        }
      })

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel)
    }
  }, [shipmentId])

  return { trackingEvents, loading, error }
}

