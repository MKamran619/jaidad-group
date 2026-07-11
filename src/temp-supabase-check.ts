import { supabase } from './src/lib/supabase/client'
import type { Blog } from './src/types/database'

const payload = {
  title: 'test',
  slug: 'test',
  excerpt: 'test',
  content: 'test',
  cover_image: undefined,
  category: 'Market Analysis',
  tags: [] as string[],
  status: 'draft',
  is_featured: false,
  view_count: 0,
  published_at: undefined,
}

const q = supabase.from('blogs').insert(payload)
