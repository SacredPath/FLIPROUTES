import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// Database types
export interface Shipment {
  id: string
  tracking_number: string
  status: 'pending' | 'in_transit' | 'at_port' | 'delivered' | 'failed'
  origin: string
  destination: string
  created_at: string
  updated_at: string
  estimated_delivery?: string
  actual_delivery?: string
  customer_id: string
  carrier?: string
  weight?: number
  dimensions?: {
    length: number
    width: number
    height: number
  }
  eta?: string
  container?: string
  vessel?: string
  voyage?: string
  volume?: number | null
  value?: number | null
  cargo_type?: string | null
  special_instructions?: string
  progress?: number
  shipper_name?: string
  consignee_name?: string
  port_of_loading?: string
  port_of_discharge?: string
  bill_of_lading?: string
  customs_status?: string
  insurance?: string
}

export interface TrackingEvent {
  id: string
  shipment_id: string
  event_type: 'pickup' | 'in_transit' | 'at_port' | 'out_for_delivery' | 'delivered' | 'failed'
  location: string
  timestamp: string
  description: string
  icon?: string
}

export interface User {
  id: string
  email?: string
  full_name?: string
  company?: string
  phone?: string
  address?: string
  role: 'customer' | 'admin'
  created_at: string
  updated_at: string
}

// Form submission types
export interface ContactForm {
  id: string
  name: string
  email: string
  company?: string
  phone?: string
  subject: string
  message: string
  created_at: string
  status: 'new' | 'contacted' | 'resolved'
}

export interface QuoteRequest {
  id: string
  service_type: 'trucking' | 'air_freight' | 'ocean_freight' | 'customs' | 'warehousing'
  name: string
  email: string
  company?: string
  phone?: string
  origin: string
  destination: string
  cargo_type?: string
  weight?: string
  dimensions?: string
  volume?: string
  value?: string
  container_type?: string
  special_requirements?: string
  created_at: string
  status: 'pending' | 'quoted' | 'accepted' | 'rejected'
  quote_amount?: number
  quote_notes?: string
}

export interface DemoRequest {
  id: string
  name: string
  email: string
  company: string
  phone?: string
  company_size: string
  use_case: string
  preferred_time: string
  additional_info?: string
  created_at: string
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled'
  demo_date?: string
  demo_notes?: string
} 