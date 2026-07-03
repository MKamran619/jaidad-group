import { useState, useEffect } from 'react'
import { FiPlus, FiTrash2, FiX, FiImage, FiVideo } from 'react-icons/fi'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { MediaUpload } from '@/components/ui/MediaUpload'
import { supabase } from '@/lib/supabase/client'
import { DEMO_GALLERY_ITEMS } from '@/lib/utils/demoData'
import { GALLERY_CATEGORIES } from '@/lib/utils/constants'
import { cn } from '@/lib/utils/cn'
import type { GalleryItem } from '@/types/database'

const CATEGORIES = GALLERY_CATEGORIES.filter((c) => c !== 'All')

type FormState = {
  title: string
  category: string
  type: 'image' | 'video'
  url: string
  thumbnail: string
  description: string
}

const EMPTY_FORM: FormState = {
  title: '', category: 'Properties', type: 'image', url: '', thumbnail: '', description: '',
}

export function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [showForm, setShowForm] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchItems() }, [])

  const fetchItems = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from('gallery_items').select('*').order('sort_order')
      setItems(error ? DEMO_GALLERY_ITEMS : (data ?? DEMO_GALLERY_ITEMS))
    } catch {
      setItems(DEMO_GALLERY_ITEMS)
    }
    setLoading(false)
  }

  const handleSave = async () => {
    if (!form.title || !form.url) { toast.error('Title and URL are required'); return }
    setSaving(true)
    const payload = {
      ...form,
      thumbnail: form.thumbnail || form.url,
      is_active: true,
      sort_order: items.length + 1,
    }
    try {
      const { error } = await supabase.from('gallery_items').insert(payload)
      if (error) throw error
      toast.success('Image added to gallery')
    } catch {
      toast.info('Added (demo mode)')
    }
    setSaving(false)
    setShowForm(false)
    setForm(EMPTY_FORM)
    fetchItems()
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      const { error } = await supabase.from('gallery_items').delete().eq('id', deleteId)
      if (error) throw error
      toast.success('Deleted from gallery')
    } catch {
      toast.info('Deleted (demo mode)')
    }
    setDeleteId(null)
    fetchItems()
  }

  const toggleActive = async (item: GalleryItem) => {
    try {
      await supabase.from('gallery_items').update({ is_active: !item.is_active }).eq('id', item.id)
    } catch {}
    setItems((prev) => prev.map((g) => g.id === item.id ? { ...g, is_active: !g.is_active } : g))
  }

  const filtered = activeCategory === 'All' ? items : items.filter((i) => i.category === activeCategory)
  const f = (field: keyof FormState, value: unknown) => setForm((prev) => ({ ...prev, [field]: value }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-[var(--color-text)]">Gallery</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">{items.length} items</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setShowForm(true)}>
          <FiPlus className="h-4 w-4" /> Add Photo
        </Button>
      </div>

      {/* Category Filter */}
      <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
        {['All', ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex-shrink-0',
              activeCategory === cat
                ? 'bg-[var(--color-brand-gold)] text-white'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)] border border-[var(--color-border)]'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-center py-12 text-[var(--color-text-muted)]">Loading...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filtered.map((item) => (
            <div key={item.id} className="group relative rounded-xl overflow-hidden aspect-square border border-[var(--color-border)]">
              <img
                src={item.thumbnail ?? item.url}
                alt={item.title}
                className="h-full w-full object-cover"
                loading="lazy"
              />
              {item.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <FiVideo className="h-8 w-8 text-white drop-shadow-lg" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => setDeleteId(item.id)}
                  className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  <FiTrash2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => toggleActive(item)}
                  className="text-xs px-2 py-1 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
                >
                  {item.is_active ? 'Hide' : 'Show'}
                </button>
              </div>
              {!item.is_active && (
                <div className="absolute top-1 right-1">
                  <Badge variant="secondary" className="text-xs py-0">Hidden</Badge>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-xs font-medium truncate">{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {filtered.length === 0 && !loading && (
        <div className="text-center py-16 text-[var(--color-text-muted)]">
          <FiImage className="h-12 w-12 mx-auto mb-3 opacity-20" />
          <p>No gallery items in this category.</p>
        </div>
      )}

      {/* Add Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setShowForm(false)}>
          <div className="bg-[var(--color-surface)] rounded-2xl w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-[var(--color-border)] flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-[var(--color-text)]">Add to Gallery</h2>
              <button onClick={() => setShowForm(false)}><FiX className="h-5 w-5 text-[var(--color-text-muted)]" /></button>
            </div>
            <div className="p-5 space-y-4">
              <Input label="Title *" value={form.title} onChange={(e) => f('title', e.target.value)} placeholder="Photo title" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => f('category', e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)]"
                  >
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5">Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => f('type', e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)]"
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </div>
              </div>
              {form.type === 'image' ? (
                <MediaUpload
                  label="Image *"
                  value={form.url}
                  onChange={(url) => f('url', url)}
                  folder="gallery"
                  accept="image/*"
                />
              ) : (
                <Input
                  label="Video URL *"
                  value={form.url}
                  onChange={(e) => f('url', e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                />
              )}
              <MediaUpload
                label="Thumbnail (optional — leave empty to use main image)"
                value={form.thumbnail}
                onChange={(url) => f('thumbnail', url)}
                folder="gallery"
                accept="image/*"
                aspectRatio="square"
              />
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button variant="primary" className="flex-1" onClick={handleSave} loading={saving}>Add Photo</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setDeleteId(null)}>
          <div className="bg-[var(--color-surface)] rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-lg font-bold text-[var(--color-text)] mb-2">Remove from Gallery?</h3>
            <p className="text-sm text-[var(--color-text-muted)] mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setDeleteId(null)}>Cancel</Button>
              <Button variant="destructive" className="flex-1" onClick={handleDelete}>Remove</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
