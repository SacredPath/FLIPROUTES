import { supabase } from './supabase'
import type { Shipment, TrackingEvent, User } from './supabase'
import { 
  getMockShipmentByTrackingNumber, 
  getMockTrackingEventsByTrackingNumber 
} from './mockData'

// API base URL
const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api'

// Generic API client
class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

// Create API client instance
export const apiClient = new ApiClient(API_BASE)

// Shipment API functions
export const shipmentApi = {
  async getAll(): Promise<Shipment[]> {
    const { data, error } = await supabase
      .from('shipments')
      .select(`
        *,
        users!inner(email, full_name, company)
      `)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getByCustomerId(customerId: string): Promise<Shipment[]> {
    const { data, error } = await supabase
      .from('shipments')
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getById(id: string): Promise<Shipment | null> {
    const { data, error } = await supabase
      .from('shipments')
      .select(`
        *,
        users!inner(email, full_name, company)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async getByTrackingNumber(trackingNumber: string): Promise<Shipment | null> {
    // Check mock data first
    const mockShipment = getMockShipmentByTrackingNumber(trackingNumber)
    if (mockShipment) {
      return mockShipment
    }

    // Fall back to database
    const { data, error } = await supabase
      .from('shipments')
      .select(`
        *,
        users!inner(email, full_name, company)
      `)
      .eq('tracking_number', trackingNumber)
      .single()
    
    if (error) throw error
    return data
  },

  async create(shipment: Omit<Shipment, 'id' | 'created_at' | 'updated_at'>): Promise<Shipment> {
    const { data, error } = await supabase
      .from('shipments')
      .insert([shipment])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, updates: Partial<Shipment>): Promise<Shipment> {
    const { data, error } = await supabase
      .from('shipments')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('shipments')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  async getStats(): Promise<{
    total: number
    inTransit: number
    delivered: number
    pending: number
  }> {
    const { data, error } = await supabase
      .from('shipments')
      .select('status')
    
    if (error) throw error

    const stats = {
      total: data?.length || 0,
      inTransit: data?.filter(s => s.status === 'in_transit').length || 0,
      delivered: data?.filter(s => s.status === 'delivered').length || 0,
      pending: data?.filter(s => s.status === 'pending').length || 0,
    }

    return stats
  }
}

// Tracking events API functions
export const trackingApi = {
  async getByShipmentId(shipmentId: string): Promise<TrackingEvent[]> {
    // Check mock data first
    const mockEvents = getMockTrackingEventsByShipmentId(shipmentId)
    if (mockEvents.length > 0) {
      return mockEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    }

    // Fall back to database
    const { data, error } = await supabase
      .from('tracking_events')
      .select('*')
      .eq('shipment_id', shipmentId)
      .order('timestamp', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async create(event: Omit<TrackingEvent, 'id'>): Promise<TrackingEvent> {
    const { data, error } = await supabase
      .from('tracking_events')
      .insert([event])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, updates: Partial<TrackingEvent>): Promise<TrackingEvent> {
    const { data, error } = await supabase
      .from('tracking_events')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

// User API functions
export const userApi = {
  async getCurrentUser(): Promise<User | null> {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return null
    
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()
    
    if (profileError) throw profileError
    return profile
  },

  async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getAllUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getUserById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }
}

// Document API functions
export const documentApi = {
  async getByShipmentId(shipmentId: string) {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('shipment_id', shipmentId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async uploadDocument(shipmentId: string, file: File) {
    const fileName = `${shipmentId}/${file.name}`
    const { data, error } = await supabase.storage
      .from('documents')
      .upload(fileName, file)
    
    if (error) throw error

    const { data: document, error: docError } = await supabase
      .from('documents')
      .insert([{
        shipment_id: shipmentId,
        name: file.name,
        file_path: data.path,
        file_size: file.size,
        mime_type: file.type
      }])
      .select()
      .single()
    
    if (docError) throw docError
    return document
  },

  async getDownloadUrl(filePath: string) {
    const { data } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath)
    
    return data.publicUrl
  }
}

// Support API functions
export const supportApi = {
  async createTicket(ticket: {
    user_id: string
    shipment_id?: string
    subject: string
    message: string
    priority?: string
  }) {
    const { data, error } = await supabase
      .from('support_tickets')
      .insert([ticket])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getTicketsByUser(userId: string) {
    const { data, error } = await supabase
      .from('support_tickets')
      .select(`
        *,
        shipments(tracking_number, origin, destination)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getAllTickets() {
    const { data, error } = await supabase
      .from('support_tickets')
      .select(`
        *,
        users(email, full_name),
        shipments(tracking_number, origin, destination)
      `)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async updateTicket(id: string, updates: {
    status?: string
    priority?: string
    message?: string
  }) {
    const { data, error } = await supabase
      .from('support_tickets')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
} 