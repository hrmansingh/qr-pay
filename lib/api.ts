import { supabase } from './supabase'

export interface ApiError {
  error: string
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const data = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(data.error || 'Request failed')
  }
  return response.json()
}

export const api = {
  profiles: {
    create: async (id: string, name: string, role: 'admin' | 'business_owner' | 'user' = 'user') => {
      const response = await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name, role }),
      })
      return handleResponse<{ profile: any }>(response)
    },
    get: async (role?: string) => {
      const params = new URLSearchParams()
      if (role) params.append('role', role)
      const response = await fetch(`/api/profiles?${params.toString()}`)
      return handleResponse<{ profiles: any[] }>(response)
    }
  },

  businesses: {
    create: async (name: string, ownerId: string) => {
      const response = await fetch('/api/businesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, owner_id: ownerId }),
      })
      return handleResponse<{ business: any }>(response)
    },
    list: async () => {
        // This endpoint currently returns ALL businesses. 
        // In a real app we'd filter by user, but for now we follow the existing route.
      const response = await fetch('/api/businesses')
      return handleResponse<{ businesses: any[] }>(response)
    }
  },

  products: {
    create: async (data: { name: string; base_price: number; currency?: string }) => {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      return handleResponse<{ product: any }>(response)
    },
    list: async () => {
      const response = await fetch('/api/products')
      return handleResponse<{ products: any[] }>(response)
    }
  }
}
