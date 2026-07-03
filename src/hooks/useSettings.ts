import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'

export interface SiteSettings {
  company_name: string
  tagline: string
  logo_url: string
  favicon_url: string
  phone: string
  whatsapp: string
  email: string
  address: string
  google_maps_url: string
  social_links: Record<string, string>
  theme_colors: {
    primary: string
    secondary: string
    accent: string
  }
  hero_video_url: string
  hero_image_url: string
  stats: { label: string; value: string; icon: string }[]
}

export function useSettings() {
  return useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value')
      if (error) throw error

      const settings: Record<string, unknown> = {}
      for (const row of (data ?? []) as Array<{ key: string; value: unknown }>) {
        settings[row.key] = row.value
      }
      return settings
    },
    staleTime: 1000 * 60 * 30,
  })
}
