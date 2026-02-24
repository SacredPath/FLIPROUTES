/**
 * Hook for real-time tracking events subscription
 */
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { TrackingEvent } from '@/lib/supabase'

export function useRealtimeTracking(shipmentId: string | null) {
  const [trackingEvents, setTrackingEvents] = useState<TrackingEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!shipmentId) {
      // No shipment ID - don't set up subscription
      return
    }

    // Initial fetch - no mock data
    const fetchTrackingEvents = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const { data, error } = await supabase
          .from('tracking_events')
          .select('*')
          .eq('shipment_id', shipmentId)
          .order('timestamp', { ascending: false })

        if (error) {
          console.error('Error fetching tracking events:', error)
          setError(error.message)
        } else {
          setTrackingEvents(data || [])
        }
      } catch (err) {
        console.error('Error fetching tracking events:', err)
        setError('Failed to fetch tracking events')
      } finally {
        setLoading(false)
      }
    }

    fetchTrackingEvents()
  }, [shipmentId])

  useEffect(() => {
    if (!shipmentId) {
      return
    }

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

