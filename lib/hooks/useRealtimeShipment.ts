/**
 * Hook for real-time shipment updates
 * Fixed for Vercel deployment
 */
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Shipment } from '@/lib/supabase'

export function useRealtimeShipment(shipmentId: string | null) {
  const [shipment, setShipment] = useState<Shipment | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!shipmentId) {
      return
    }

    // Initial fetch - no mock data
    const fetchShipment = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch from Supabase - no mock data
        const { data, error } = await supabase
          .from('shipments')
          .select('*')
          .eq('id', shipmentId)
          .single()

        if (error) {
          console.error('Error fetching shipment:', error)
          setError(error.message)
        } else {
          setShipment(data)
        }
      } catch (err) {
        console.error('Error fetching shipment:', err)
        setError('Failed to fetch shipment')
      } finally {
        setLoading(false)
      }
    }

    // Set up real-time subscription
    const channel = supabase
      .channel(`shipment-${shipmentId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'shipments',
          filter: `id=eq.${shipmentId}`,
        },
        (payload: any) => {
          console.log('Real-time shipment update received:', payload)
          setShipment(payload.new as Shipment)
        }
      )
      .subscribe((status: string) => {
        console.log('Shipment subscription status:', status)
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to shipment updates')
        } else if (status === 'CHANNEL_ERROR') {
          setError('Failed to subscribe to real-time updates')
        }
      })

    // Initial fetch
    fetchShipment()

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel)
    }
  }, [shipmentId])

  return { shipment, loading, error }
}
