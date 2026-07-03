import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import type { Property } from '@/types/database'

export interface PropertyFilters {
  type?: string
  purpose?: string
  city?: string
  society?: string
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
  bathrooms?: number
  featured?: boolean
  search?: string
  limit?: number
  page?: number
}

export function useProperties(filters: PropertyFilters = {}) {
  return useQuery({
    queryKey: ['properties', filters],
    queryFn: async () => {
      let query = supabase
        .from('properties')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (filters.type) query = query.eq('property_type', filters.type)
      if (filters.purpose) query = query.eq('property_purpose', filters.purpose)
      if (filters.city) query = query.eq('city_id', filters.city)
      if (filters.featured) query = query.eq('is_featured', true)
      if (filters.bedrooms) query = query.gte('bedrooms', filters.bedrooms)
      if (filters.minPrice) query = query.gte('price', filters.minPrice)
      if (filters.maxPrice) query = query.lte('price', filters.maxPrice)
      if (filters.search) {
        query = query.or(
          `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,address.ilike.%${filters.search}%`
        )
      }

      const limit = filters.limit ?? 12
      const page = filters.page ?? 1
      const from = (page - 1) * limit
      query = query.range(from, from + limit - 1)

      const { data, error, count } = await query
      if (error) throw error
      return { properties: (data ?? []) as Property[], count: count ?? 0 }
    },
    staleTime: 1000 * 60 * 5,
  })
}

export function useProperty(slug: string) {
  return useQuery({
    queryKey: ['property', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single()
      if (error) throw error
      return data as Property
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 10,
  })
}

export function useFeaturedProperties(limit = 6) {
  return useProperties({ featured: true, limit })
}
