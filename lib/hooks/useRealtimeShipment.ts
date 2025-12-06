'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Shipment } from '@/lib/supabase'
import { 
  mockShipmentGermanyMadrid, 
  mockShipmentNewYorkLondon, 
  mockShipmentShanghaiLA 
} from '@/lib/mockData'

/**
 * Hook for real-time shipment updates
 * Automatically subscribes to shipments table changes for a specific shipment
 */
export function useRealtimeShipment(shipmentId: string | null) {
  const [shipment, setShipment] = useState<Shipment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!shipmentId) {
      setLoading(false)
      return
    }

    // Initial fetch - check mock data first
    const fetchShipment = async () => {
      try {
        // Check if this is a mock shipment
        if (shipmentId === mockShipmentGermanyMadrid.id) {
          setShipment({ ...mockShipmentGermanyMadrid })
          setError(null)
          setLoading(false)
          return
        }
        if (shipmentId === mockShipmentNewYorkLondon.id) {
          setShipment({ ...mockShipmentNewYorkLondon })
          setError(null)
          setLoading(false)
          return
        }
        if (shipmentId === mockShipmentShanghaiLA.id) {
          setShipment({ ...mockShipmentShanghaiLA })
          setError(null)
          setLoading(false)
          return
        }

        // Fall back to database
        const { data, error: fetchError } = await supabase
          .from('shipments')
          .select('*')
          .eq('id', shipmentId)
          .single()

        if (fetchError) throw fetchError
        setShipment(data)
        setError(null)
      } catch (err: any) {
        console.error('Error fetching shipment:', err)
        setError(err.message || 'Failed to load shipment')
      } finally {
        setLoading(false)
      }
    }

    fetchShipment()

    // Only set up real-time subscription for non-mock shipments
    const isMockShipment = shipmentId === mockShipmentGermanyMadrid.id || 
                          shipmentId === mockShipmentNewYorkLondon.id || 
                          shipmentId === mockShipmentShanghaiLA.id
    
    if (!isMockShipment) {
      const channel = supabase
        .channel(`shipment:${shipmentId}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'shipments',
            filter: `id=eq.${shipmentId}`,
          },
          (payload) => {
            console.log('Real-time shipment update received:', payload)
            setShipment(payload.new as Shipment)
          }
        )
        .subscribe((status) => {
          console.log('Shipment subscription status:', status)
          if (status === 'SUBSCRIBED') {
            console.log('Successfully subscribed to shipment updates')
          } else if (status === 'CHANNEL_ERROR') {
            setError('Failed to subscribe to real-time updates')
          }
        })

      // Cleanup subscription on unmount
      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [shipmentId])

  return { shipment, loading, error }
}

