import { supabase } from './supabase'
import type { Shipment, TrackingEvent, User, QuoteRequest, DemoRequest } from './supabase'

// API base URL
const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api'

// Generic API client
class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  // Shipments API
  async getShipments(customerId?: string): Promise<Shipment[]> {
    const { data, error } = await supabase
      .from('shipments')
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  async getById(id: string): Promise<Shipment | null> {
    const { data, error } = await supabase
      .from('shipments')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error fetching shipment:', error)
      return null
    }

    return data
  }

  async getByTrackingNumber(trackingNumber: string): Promise<Shipment | null> {
    const { data, error } = await supabase
      .from('shipments')
      .select('*')
      .eq('tracking_number', trackingNumber)
      .single()
    
    if (error) {
      console.error('Error fetching shipment:', error)
      return null
    }

    return data
  }

  async create(shipment: Omit<Shipment, 'id' | 'created_at' | 'updated_at'>): Promise<Shipment> {
    const { data, error } = await supabase
      .from('shipments')
      .insert([shipment])
      .select()
      .single()
    
    if (error) throw error
    return data!
  }

  async update(id: string, updates: Partial<Shipment>): Promise<Shipment> {
    const { data, error } = await supabase
      .from('shipments')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data!
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('shipments')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  // Users API
  async getUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, full_name, company, role, created_at, updated_at')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  async getUserById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error fetching user:', error)
      return null
    }

    return data
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data!
  }

  async deleteUser(id: string): Promise<void> {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  // Quote Requests API
  async getQuoteRequests(): Promise<QuoteRequest[]> {
    const { data, error } = await supabase
      .from('quote_requests')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  async getQuoteRequestById(id: string): Promise<QuoteRequest | null> {
    const { data, error } = await supabase
      .from('quote_requests')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error fetching quote request:', error)
      return null
    }

    return data
  }

  async createQuoteRequest(quoteRequest: Omit<QuoteRequest, 'id' | 'created_at' | 'status'>): Promise<QuoteRequest> {
    const { data, error } = await supabase
      .from('quote_requests')
      .insert([{ ...quoteRequest, status: 'pending' }])
      .select()
      .single()
    
    if (error) throw error
    return data!
  }

  async updateQuoteRequest(id: string, updates: Partial<QuoteRequest>): Promise<QuoteRequest> {
    const { data, error } = await supabase
      .from('quote_requests')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data!
  }

  async deleteQuoteRequest(id: string): Promise<void> {
    const { error } = await supabase
      .from('quote_requests')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  // Demo Requests API
  async getDemoRequests(): Promise<DemoRequest[]> {
    const { data, error } = await supabase
      .from('demo_requests')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  async getDemoRequestById(id: string): Promise<DemoRequest | null> {
    const { data, error } = await supabase
      .from('demo_requests')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error fetching demo request:', error)
      return null
    }

    return data
  }

  async createDemoRequest(demoRequest: Omit<DemoRequest, 'id' | 'created_at'>): Promise<DemoRequest> {
    const { data, error } = await supabase
      .from('demo_requests')
      .insert([demoRequest])
      .select()
      .single()
    
    if (error) throw error
    return data!
  }

  async updateDemoRequest(id: string, updates: Partial<DemoRequest>): Promise<DemoRequest> {
    const { data, error } = await supabase
      .from('demo_requests')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data!
  }

  async deleteDemoRequest(id: string): Promise<void> {
    const { error } = await supabase
      .from('demo_requests')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Export API client instance
export const api = new ApiClient(API_BASE)

// Shipments API export
export const shipmentApi = {
  getShipments: api.getShipments,
  getById: api.getById,
  getByTrackingNumber: api.getByTrackingNumber,
  create: api.create,
  update: api.update,
  delete: api.delete
}

// Users API export
export const userApi = {
  getUsers: api.getUsers,
  getUserById: api.getUserById,
  updateUser: api.updateUser,
  deleteUser: api.deleteUser
}

// Tracking events API functions
export const trackingApi = {
  async getByShipmentId(shipmentId: string): Promise<TrackingEvent[]> {
    const { data, error } = await supabase
      .from('tracking_events')
      .select('*')
      .eq('shipment_id', shipmentId)
      .order('timestamp', { ascending: false })

    if (error) {
      console.error('Error fetching tracking events:', error)
      return []
    }

    return data || []
  },

  async create(trackingEvent: Omit<TrackingEvent, 'id' | 'created_at'>): Promise<TrackingEvent> {
    const { data, error } = await supabase
      .from('tracking_events')
      .insert([trackingEvent])
      .select()
      .single()
    
    if (error) throw error
    return data!
  },

  async update(id: string, updates: Partial<TrackingEvent>): Promise<TrackingEvent> {
    const { data, error } = await supabase
      .from('tracking_events')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data!
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('tracking_events')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}
