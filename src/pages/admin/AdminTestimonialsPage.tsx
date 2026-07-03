import { useState, useEffect } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiStar, FiX } from 'react-icons/fi'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Badge } from '@/components/ui/Badge'
import { MediaUpload } from '@/components/ui/MediaUpload'
import { supabase } from '@/lib/supabase/client'
import { DEMO_TESTIMONIALS } from '@/lib/utils/demoData'
import type { Testimonial } from '@/types/database'

type FormState = {
  name: string
  designation: string
  company: string
  image: string
  rating: number
  review: string
  property_purchased: string
  is_featured: boolean
  is_active: boolean
}

const EMPTY_FORM: FormState = {
  name: '', designation: '', company: '', image: '', rating: 5,
  review: '', property_purchased: '', is_featured: false, is_active: true,
}

export function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<Testimonial | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchItems() }, [])

  const fetchItems = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false })
      setItems(error ? DEMO_TESTIMONIALS : (data ?? DEMO_TESTIMONIALS))
    } catch {
      setItems(DEMO_TESTIMONIALS)
    }
    setLoading(false)
  }

  const openAdd = () => {
    setEditItem(null)
    setForm(EMPTY_FORM)
    setShowForm(true)
  }

  const openEdit = (item: Testimonial) => {
    setEditItem(item)
    setForm({
      name: item.name,
      designation: item.designation ?? '',
      company: item.company ?? '',
      image: item.image ?? '',
      rating: item.rating,
      review: item.review,
      property_purchased: item.property_purchased ?? '',
      is_featured: item.is_featured,
      is_active: item.is_active,
    })
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!form.name || !form.review) { toast.error('Name and review are required'); return }
    setSaving(true)
    try {
      if (editItem) {
        const { error } = await supabase.from('testimonials').update(form).eq('id', editItem.id)
        if (error) throw error
        toast.success('Testimonial updated')
      } else {
        const { error } = await supabase.from('testimonials').insert(form)
        if (error) throw error
        toast.success('Testimonial added')
      }
    } catch {
      toast.info(editItem ? 'Updated (demo mode)' : 'Added (demo mode)')
    }
    setSaving(false)
    setShowForm(false)
    fetchItems()
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      const { error } = await supabase.from('testimonials').delete().eq('id', deleteId)
      if (error) throw error
      toast.success('Deleted')
    } catch {
      toast.info('Deleted (demo mode)')
    }
    setDeleteId(null)
    fetchItems()
  }

  const toggleFeatured = async (item: Testimonial) => {
    try {
      await supabase.from('testimonials').update({ is_featured: !item.is_featured }).eq('id', item.id)
    } catch {}
    setItems((prev) => prev.map((t) => t.id === item.id ? { ...t, is_featured: !t.is_featured } : t))
  }

  const f = (field: keyof FormState, value: unknown) => setForm((prev) => ({ ...prev, [field]: value }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-[var(--color-text)]">Testimonials</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">{items.length} reviews</p>
        </div>
        <Button variant="primary" size="sm" onClick={openAdd}>
          <FiPlus className="h-4 w-4" /> Add Testimonial
        </Button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-center py-12 text-[var(--color-text-muted)]">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="h-10 w-10 rounded-full object-cover" />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-[var(--color-brand-gold)] flex items-center justify-center text-white font-bold text-sm">
                      {item.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-[var(--color-text)] text-sm">{item.name}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{item.designation} {item.company && `· ${item.company}`}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg hover:bg-[var(--color-background)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
                    <FiEdit2 className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => setDeleteId(item.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-[var(--color-text-muted)] hover:text-red-500">
                    <FiTrash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-0.5 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FiStar key={i} className={`h-3.5 w-3.5 ${i < item.rating ? 'text-[var(--color-brand-gold)] fill-[var(--color-brand-gold)]' : 'text-[var(--color-border)]'}`} />
                ))}
              </div>

              <p className="text-xs text-[var(--color-text-muted)] line-clamp-3 mb-3">"{item.review}"</p>

              {item.property_purchased && (
                <p className="text-xs text-[var(--color-brand-gold)] mb-3">{item.property_purchased}</p>
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleFeatured(item)}
                  className={`text-xs px-2 py-1 rounded-lg border transition-colors ${item.is_featured ? 'border-[var(--color-brand-gold)] text-[var(--color-brand-gold)] bg-[var(--color-brand-gold)]/10' : 'border-[var(--color-border)] text-[var(--color-text-muted)]'}`}
                >
                  {item.is_featured ? 'Featured' : 'Set Featured'}
                </button>
                <Badge variant={item.is_active ? 'success' : 'secondary'} className="text-xs">
                  {item.is_active ? 'Active' : 'Hidden'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setShowForm(false)}>
          <div className="bg-[var(--color-surface)] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-[var(--color-border)] flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-[var(--color-text)]">{editItem ? 'Edit' : 'Add'} Testimonial</h2>
              <button onClick={() => setShowForm(false)}><FiX className="h-5 w-5 text-[var(--color-text-muted)]" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Name *" value={form.name} onChange={(e) => f('name', e.target.value)} placeholder="Client name" />
                <Input label="Designation" value={form.designation} onChange={(e) => f('designation', e.target.value)} placeholder="e.g. CEO" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Company" value={form.company} onChange={(e) => f('company', e.target.value)} placeholder="Company name" />
                <div>
                  <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5">Rating</label>
                  <select
                    value={form.rating}
                    onChange={(e) => f('rating', parseInt(e.target.value))}
                    className="w-full h-10 px-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)]"
                  >
                    {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} Star{r !== 1 ? 's' : ''}</option>)}
                  </select>
                </div>
              </div>
              <MediaUpload
                label="Client Photo"
                value={form.image}
                onChange={(url) => f('image', url)}
                folder="testimonials"
                accept="image/*"
                aspectRatio="square"
              />
              <Input label="Property Purchased" value={form.property_purchased} onChange={(e) => f('property_purchased', e.target.value)} placeholder="e.g. Villa in DHA Phase 5" />
              <Textarea label="Review *" value={form.review} onChange={(e) => f('review', e.target.value)} rows={4} placeholder="Client's review..." />
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_featured} onChange={(e) => f('is_featured', e.target.checked)} className="w-4 h-4 accent-[var(--color-brand-gold)]" />
                  <span className="text-sm text-[var(--color-text)]">Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_active} onChange={(e) => f('is_active', e.target.checked)} className="w-4 h-4 accent-[var(--color-brand-gold)]" />
                  <span className="text-sm text-[var(--color-text)]">Active</span>
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button variant="primary" className="flex-1" onClick={handleSave} loading={saving}>
                  {editItem ? 'Update' : 'Add'} Testimonial
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setDeleteId(null)}>
          <div className="bg-[var(--color-surface)] rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-lg font-bold text-[var(--color-text)] mb-2">Delete Testimonial?</h3>
            <p className="text-sm text-[var(--color-text-muted)] mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setDeleteId(null)}>Cancel</Button>
              <Button variant="destructive" className="flex-1" onClick={handleDelete}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
