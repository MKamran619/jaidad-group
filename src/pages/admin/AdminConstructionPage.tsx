import { useState, useEffect } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiX, FiEye, FiEyeOff } from 'react-icons/fi'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Badge } from '@/components/ui/Badge'
import { MediaUpload } from '@/components/ui/MediaUpload'
import { supabase } from '@/lib/supabase/client'
import { DEMO_CONSTRUCTION_SERVICES } from '@/lib/utils/demoData'
import { slugify } from '@/lib/utils/format'
import { cn } from '@/lib/utils/cn'
import type { ConstructionService } from '@/types/database'

type FormState = {
  title: string
  slug: string
  description: string
  icon: string
  image: string
  features: string
  sort_order: string
  is_active: boolean
}

const EMPTY_FORM: FormState = {
  title: '', slug: '', description: '', icon: '', image: '', features: '', sort_order: '0', is_active: true,
}

export function AdminConstructionPage() {
  const [items, setItems] = useState<ConstructionService[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<ConstructionService | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchItems() }, [])

  const fetchItems = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from('construction_services').select('*').order('sort_order')
      setItems(error ? DEMO_CONSTRUCTION_SERVICES : (data ?? DEMO_CONSTRUCTION_SERVICES))
    } catch {
      setItems(DEMO_CONSTRUCTION_SERVICES)
    }
    setLoading(false)
  }

  const openAdd = () => { setEditItem(null); setForm(EMPTY_FORM); setShowForm(true) }

  const openEdit = (item: ConstructionService) => {
    setEditItem(item)
    setForm({
      title: item.title,
      slug: item.slug,
      description: item.description,
      icon: item.icon ?? '',
      image: item.image ?? '',
      features: item.features.join('\n'),
      sort_order: String(item.sort_order),
      is_active: item.is_active,
    })
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!form.title) { toast.error('Title is required'); return }
    setSaving(true)
    const payload = {
      title: form.title,
      slug: form.slug || slugify(form.title),
      description: form.description,
      icon: form.icon || undefined,
      image: form.image || undefined,
      features: form.features.split('\n').map((s) => s.trim()).filter(Boolean),
      packages: editItem?.packages ?? [],
      sort_order: parseInt(form.sort_order) || 0,
      is_active: form.is_active,
    }
    try {
      if (editItem) {
        const { error } = await supabase.from('construction_services').update(payload).eq('id', editItem.id)
        if (error) throw error
        toast.success('Service updated')
      } else {
        const { error } = await supabase.from('construction_services').insert(payload)
        if (error) throw error
        toast.success('Service created')
      }
    } catch {
      toast.info(`${editItem ? 'Updated' : 'Saved'} (demo mode)`)
    }
    setSaving(false)
    setShowForm(false)
    fetchItems()
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      const { error } = await supabase.from('construction_services').delete().eq('id', deleteId)
      if (error) throw error
      toast.success('Service deleted')
    } catch {
      toast.info('Deleted (demo mode)')
    }
    setDeleteId(null)
    fetchItems()
  }

  const toggleActive = async (item: ConstructionService) => {
    try {
      await supabase.from('construction_services').update({ is_active: !item.is_active }).eq('id', item.id)
    } catch {}
    setItems((prev) => prev.map((s) => s.id === item.id ? { ...s, is_active: !s.is_active } : s))
  }

  const f = (field: keyof FormState, value: unknown) => setForm((prev) => ({ ...prev, [field]: value }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-[var(--color-text)]">Construction Services</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">{items.length} services</p>
        </div>
        <Button variant="primary" size="sm" onClick={openAdd}>
          <FiPlus className="h-4 w-4" /> New Service
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-[var(--color-text-muted)]">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <div
              key={item.id}
              className={cn(
                'rounded-2xl border bg-[var(--color-surface)] overflow-hidden transition-all',
                item.is_active ? 'border-[var(--color-border)]' : 'border-[var(--color-border)] opacity-60'
              )}
            >
              {item.image && (
                <div className="aspect-video overflow-hidden">
                  <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-[var(--color-text)] truncate">{item.title}</h3>
                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{item.packages.length} packages</p>
                  </div>
                  <Badge variant={item.is_active ? 'success' : 'secondary'} className="ml-2 flex-shrink-0">
                    {item.is_active ? 'Active' : 'Hidden'}
                  </Badge>
                </div>

                <p className="text-sm text-[var(--color-text-muted)] line-clamp-2 mb-3">{item.description}</p>

                {item.features.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {item.features.slice(0, 3).map((feat) => (
                      <span key={feat} className="text-xs bg-[var(--color-background)] border border-[var(--color-border)] rounded-full px-2 py-0.5 text-[var(--color-text-muted)]">
                        {feat}
                      </span>
                    ))}
                    {item.features.length > 3 && (
                      <span className="text-xs text-[var(--color-text-muted)]">+{item.features.length - 3} more</span>
                    )}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => openEdit(item)}>
                    <FiEdit2 className="h-3.5 w-3.5" /> Edit
                  </Button>
                  <button
                    onClick={() => toggleActive(item)}
                    className="p-2 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-background)] text-[var(--color-text-muted)] transition-colors"
                    title={item.is_active ? 'Hide' : 'Show'}
                  >
                    {item.is_active ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => setDeleteId(item.id)}
                    className="p-2 rounded-lg border border-[var(--color-border)] hover:bg-red-50 dark:hover:bg-red-900/10 text-[var(--color-text-muted)] hover:text-red-500 transition-colors"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {items.length === 0 && !loading && (
        <div className="text-center py-16 text-[var(--color-text-muted)]">
          <p>No services yet. Click "New Service" to add one.</p>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 overflow-y-auto" onClick={() => setShowForm(false)}>
          <div
            className="bg-[var(--color-surface)] rounded-2xl w-full max-w-lg shadow-2xl my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-4 rounded-t-2xl">
              <h2 className="font-display text-lg font-bold text-[var(--color-text)]">
                {editItem ? 'Edit Service' : 'New Service'}
              </h2>
              <button onClick={() => setShowForm(false)}>
                <FiX className="h-5 w-5 text-[var(--color-text-muted)]" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Title *"
                  value={form.title}
                  onChange={(e) => { f('title', e.target.value); if (!editItem) f('slug', slugify(e.target.value)) }}
                  placeholder="e.g. Architecture & Design"
                />
                <Input label="Slug" value={form.slug} onChange={(e) => f('slug', e.target.value)} placeholder="auto-generated" />
              </div>

              <Textarea
                label="Description"
                value={form.description}
                onChange={(e) => f('description', e.target.value)}
                rows={3}
                placeholder="Brief description of this service..."
              />

              <div className="grid grid-cols-2 gap-4">
                <Input label="Icon (emoji or icon name)" value={form.icon} onChange={(e) => f('icon', e.target.value)} placeholder="🏗️" />
                <Input label="Sort Order" type="number" value={form.sort_order} onChange={(e) => f('sort_order', e.target.value)} />
              </div>

              <MediaUpload
                label="Cover Image"
                value={form.image}
                onChange={(url) => f('image', url)}
                folder="construction"
              />

              <Textarea
                label="Features (one per line)"
                value={form.features}
                onChange={(e) => f('features', e.target.value)}
                rows={4}
                placeholder="3D Architectural Design&#10;Structural Engineering&#10;Material Selection&#10;Project Management"
              />

              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => f('is_active', e.target.checked)}
                    className="h-4 w-4 rounded accent-[var(--color-brand-gold)]"
                  />
                  <span className="text-sm text-[var(--color-text)]">Active (visible on website)</span>
                </label>
              </div>


              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button variant="primary" className="flex-1" onClick={handleSave} loading={saving}>
                  {editItem ? 'Save Changes' : 'Create Service'}
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
            <h3 className="font-display text-lg font-bold text-[var(--color-text)] mb-2">Delete Service?</h3>
            <p className="text-sm text-[var(--color-text-muted)] mb-5">This will permanently remove this construction service.</p>
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
