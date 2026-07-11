// Auto-generated Supabase database types
// Run: supabase gen types typescript --linked > src/types/database.ts

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      properties: {
        Row: Property
        Insert: Omit<Property, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Property, 'id'>>
        Relationships: []
      }
      projects: {
        Row: Project
        Insert: Omit<Project, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Project, 'id'>>
        Relationships: []
      }
      blogs: {
        Row: Blog
        Insert: Omit<Blog, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Blog, 'id'>>
        Relationships: []
      }
      testimonials: {
        Row: Testimonial
        Insert: Omit<Testimonial, 'id' | 'created_at'>
        Update: Partial<Omit<Testimonial, 'id'>>
        Relationships: []
      }
      gallery_items: {
        Row: GalleryItem
        Insert: Omit<GalleryItem, 'id' | 'created_at'>
        Update: Partial<Omit<GalleryItem, 'id'>>
        Relationships: []
      }
      construction_services: {
        Row: ConstructionService
        Insert: Omit<ConstructionService, 'id' | 'created_at'>
        Update: Partial<Omit<ConstructionService, 'id'>>
        Relationships: []
      }
      inquiries: {
        Row: Inquiry
        Insert: Omit<Inquiry, 'id' | 'created_at'>
        Update: Partial<Omit<Inquiry, 'id'>>
        Relationships: []
      }
      site_settings: {
        Row: SiteSetting
        Insert: Omit<SiteSetting, 'id' | 'updated_at'>
        Update: Partial<SiteSetting>
        Relationships: []
      }
      agents: {
        Row: Agent
        Insert: Omit<Agent, 'id' | 'created_at'>
        Update: Partial<Omit<Agent, 'id'>>
        Relationships: []
      }
      faqs: {
        Row: FAQ
        Insert: Omit<FAQ, 'id' | 'created_at'>
        Update: Partial<Omit<FAQ, 'id'>>
        Relationships: []
      }
      cities: {
        Row: City
        Insert: Omit<City, 'id'>
        Update: Partial<City>
        Relationships: []
      }
      societies: {
        Row: Society
        Insert: Omit<Society, 'id'>
        Update: Partial<Society>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      property_purpose: 'sale' | 'rent' | 'construction'
      property_status: 'available' | 'sold' | 'rented' | 'under_construction' | 'off_plan'
      property_type: 'residential' | 'commercial' | 'apartment' | 'plot' | 'agricultural' | 'industrial' | 'farmhouse' | 'shop' | 'office' | 'warehouse' | 'building'
      area_unit: 'marla' | 'kanal' | 'sqft' | 'sqm' | 'sqyd'
      blog_status: 'draft' | 'published' | 'archived'
      inquiry_status: 'new' | 'in_progress' | 'resolved' | 'closed'
      project_status: 'completed' | 'ongoing' | 'upcoming'
    }
  }
}

// ─── Domain Types ──────────────────────────────────────────────────────────────

export interface Property {
  id: string
  title: string
  slug: string
  description: string
  property_type: Database['public']['Enums']['property_type']
  property_purpose: Database['public']['Enums']['property_purpose']
  property_status: Database['public']['Enums']['property_status']
  price: number
  currency: string
  area: number
  area_unit: Database['public']['Enums']['area_unit']
  bedrooms?: number
  bathrooms?: number
  garage?: number
  kitchen?: number
  year_built?: number
  city_id?: string
  society_id?: string
  address: string
  latitude?: number
  longitude?: number
  images: string[]
  videos?: string[]
  floor_plans?: string[]
  brochure_url?: string
  tour_360_url?: string
  features: string[]
  amenities: string[]
  nearby_places: NearbyPlace[]
  agent_id?: string
  is_featured: boolean
  is_active: boolean
  view_count: number
  meta_title?: string
  meta_description?: string
  tags: string[]
  created_at: string
  updated_at: string
}

export interface NearbyPlace {
  name: string
  type: string
  distance: string
}

export interface Project {
  id: string
  title: string
  slug: string
  description: string
  project_status: Database['public']['Enums']['project_status']
  location: string
  city_id?: string
  images: string[]
  videos?: string[]
  completion_date?: string
  completion_percentage?: number
  total_units?: number
  available_units?: number
  starting_price?: number
  investment_details?: string
  timeline: ProjectTimeline[]
  downloads: ProjectDownload[]
  is_featured: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ProjectTimeline {
  date: string
  title: string
  description: string
}

export interface ProjectDownload {
  title: string
  url: string
  type: string
}

export interface Blog {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  cover_image?: string
  author_id?: string
  category: string
  tags: string[]
  status: Database['public']['Enums']['blog_status']
  is_featured: boolean
  view_count: number
  meta_title?: string
  meta_description?: string
  published_at?: string
  created_at: string
  updated_at: string
}

export interface Testimonial {
  id: string
  name: string
  designation?: string
  company?: string
  image?: string
  video_url?: string
  rating: number
  review: string
  property_purchased?: string
  is_featured: boolean
  is_active: boolean
  created_at: string
}

export interface GalleryItem {
  id: string
  title: string
  category: string
  type: 'image' | 'video'
  url: string
  thumbnail?: string
  description?: string
  is_active: boolean
  sort_order: number
  created_at: string
}

export interface ConstructionService {
  id: string
  title: string
  slug: string
  description: string
  icon?: string
  image?: string
  features: string[]
  packages: ConstructionPackage[]
  is_active: boolean
  sort_order: number
  created_at: string
}

export interface ConstructionPackage {
  name: string
  price: string
  per_unit: string
  features: string[]
  is_popular: boolean
}

export interface Inquiry {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  property_id?: string
  inquiry_type: string
  status: Database['public']['Enums']['inquiry_status']
  source?: string
  created_at: string
}

export interface SiteSetting {
  id: string
  key: string
  value: Json
  group: string
  updated_at: string
}

export interface Agent {
  id: string
  name: string
  designation: string
  email: string
  phone: string
  whatsapp?: string
  image?: string
  bio?: string
  languages: string[]
  specializations: string[]
  social_links: Record<string, string>
  is_active: boolean
  created_at: string
}

export interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  sort_order: number
  is_active: boolean
  created_at: string
}

export interface City {
  id: string
  name: string
  province: string
  is_active: boolean
}

export interface Society {
  id: string
  name: string
  city_id: string
  is_active: boolean
}
