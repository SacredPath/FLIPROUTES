'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Shipment } from '@/lib/supabase'

/**
 * Hook for real-time shipments list updates
 * Automatically subscribes to shipments table changes for a specific customer
 */
export function useRealtimeShipments(customerId: string | null) {
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!customerId) {
      setLoading(false)
      return
    }

    // Initial fetch
    const fetchShipments = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('shipments')
          .select('*')
          .eq('customer_id', customerId)
          .order('created_at', { ascending: false })

        if (fetchError) throw fetchError
        setShipments(data || [])
        setError(null)
      } catch (err: any) {
        console.error('Error fetching shipments:', err)
        setError(err.message || 'Failed to load shipments')
      } finally {
        setLoading(false)
      }
    }

    fetchShipments()

    // Set up real-time subscription for all changes
    const channel = supabase
      .channel(`shipments:customer:${customerId}`)
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events
          schema: 'public',
          table: 'shipments',
          filter: `customer_id=eq.${customerId}`,
        },
        (payload) => {
          console.log('Real-time shipment change received:', payload)

          if (payload.eventType === 'INSERT') {
            // Add new shipment to the beginning
            setShipments((prev) => [payload.new as Shipment, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            // Update existing shipment
            setShipments((prev) =>
              prev.map((shipment) =>
                shipment.id === payload.new.id ? (payload.new as Shipment) : shipment
              )
            )
          } else if (payload.eventType === 'DELETE') {
            // Remove deleted shipment
            setShipments((prev) =>
              prev.filter((shipment) => shipment.id !== payload.old.id)
            )
          }
        }
      )
      .subscribe((status) => {
        console.log('Shipments subscription status:', status)
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to shipments updates')
        } else if (status === 'CHANNEL_ERROR') {
          setError('Failed to subscribe to real-time updates')
        }
      })

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel)
    }
  }, [customerId])

  return { shipments, loading, error }
}

