import { useState, useEffect } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiEye } from 'react-icons/fi'
import { Bed, Bath, Maximize2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Badge } from '@/components/ui/Badge'
import { MultiImageUpload } from '@/components/ui/MultiImageUpload'
import { supabase } from '@/lib/supabase/client'
import { formatPrice, slugify } from '@/lib/utils/format'
import { DEMO_PROPERTIES } from '@/lib/utils/demoData'
import { PROPERTY_TYPES, PROPERTY_PURPOSES, PROPERTY_STATUSES, AREA_UNITS } from '@/lib/utils/constants'
import type { Property } from '@/types/database'

type FormState = {
  title: string; slug: string; description: string
  property_type: string; property_purpose: string; property_status: string
  price: string; currency: string; area: string; area_unit: string
  bedrooms: string; bathrooms: string; garage: string; year_built: string
  address: string; images: string[]; features: string; amenities: string; tags: string
  is_featured: boolean; is_active: boolean
}

const EMPTY_FORM: FormState = {
  title: '', slug: '', description: '',
  property_type: 'residential', property_purpose: 'sale', property_status: 'available',
  price: '', currency: 'PKR', area: '', area_unit: 'marla',
  bedrooms: '', bathrooms: '', garage: '', year_built: '',
  address: '', images: [], features: '', amenities: '', tags: '',
  is_featured: false, is_active: true,
}

const PURPOSE_COLORS: Record<string, 'gold' | 'info' | 'success'> = {
  sale: 'gold', rent: 'info', construction: 'success',
}

export function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [purposeFilter, setPurposeFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<Property | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchProperties() }, [])

  const fetchProperties = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from('properties').select('*').order('created_at', { ascending: false })
      setProperties(error ? DEMO_PROPERTIES : (data ?? DEMO_PROPERTIES))
    } catch {
      setProperties(DEMO_PROPERTIES)
    }
    setLoading(false)
  }

  const openAdd = () => {
    setEditItem(null)
    setForm(EMPTY_FORM)
    setShowForm(true)
  }

  const openEdit = (p: Property) => {
    setEditItem(p)
    setForm({
      title: p.title, slug: p.slug, description: p.description,
      property_type: p.property_type, property_purpose: p.property_purpose, property_status: p.property_status,
      price: String(p.price), currency: p.currency, area: String(p.area), area_unit: p.area_unit,
      bedrooms: String(p.bedrooms ?? ''), bathrooms: String(p.bathrooms ?? ''), garage: String(p.garage ?? ''), year_built: String(p.year_built ?? ''),
      address: p.address,
      images: p.images ?? [],
      features: (p.features ?? []).join('\n'),
      amenities: (p.amenities ?? []).join('\n'),
      tags: (p.tags ?? []).join(', '),
      is_featured: p.is_featured, is_active: p.is_active,
    })
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!form.title || !form.price || !form.address) { toast.error('Title, price, and address are required'); return }
    setSaving(true)
    const payload = {
      title: form.title,
      slug: form.slug || slugify(form.title),
      description: form.description,
      property_type: form.property_type,
      property_purpose: form.property_purpose,
      property_status: form.property_status,
      price: parseFloat(form.price) || 0,
      currency: form.currency,
      area: parseFloat(form.area) || 0,
      area_unit: form.area_unit,
      bedrooms: form.bedrooms ? parseInt(form.bedrooms) : undefined,
      bathrooms: form.bathrooms ? parseInt(form.bathrooms) : undefined,
      garage: form.garage ? parseInt(form.garage) : undefined,
      year_built: form.year_built ? parseInt(form.year_built) : undefined,
      address: form.address,
      images: form.images,
      features: form.features.split('\n').map((s) => s.trim()).filter(Boolean),
      amenities: form.amenities.split('\n').map((s) => s.trim()).filter(Boolean),
      tags: form.tags.split(',').map((s) => s.trim()).filter(Boolean),
      nearby_places: [],
      is_featured: form.is_featured,
      is_active: form.is_active,
      view_count: 0,
    }
    try {
      if (editItem) {
        const { error } = await supabase.from('properties').update(payload).eq('id', editItem.id)
        if (error) throw error
        toast.success('Property updated')
      } else {
        const { error } = await supabase.from('properties').insert(payload)
        if (error) throw error
        toast.success('Property added')
      }
    } catch {
      toast.info(editItem ? 'Updated (demo mode)' : 'Added (demo mode)')
    }
    setSaving(false)
    setShowForm(false)
    fetchProperties()
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      const { error } = await supabase.from('properties').delete().eq('id', deleteId)
      if (error) throw error
      toast.success('Property deleted')
    } catch {
      toast.info('Deleted (demo mode)')
    }
    setDeleteId(null)
    fetchProperties()
  }

  const f = (field: keyof FormState, value: unknown) => setForm((prev) => ({ ...prev, [field]: value }))

  const filtered = properties.filter((p) => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.address.toLowerCase().includes(search.toLowerCase())
    const matchPurpose = purposeFilter === 'all' || p.property_purpose === purposeFilter
    return matchSearch && matchPurpose
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-[var(--color-text)]">Properties</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">{properties.length} listings</p>
        </div>
        <Button variant="primary" size="sm" onClick={openAdd}>
          <FiPlus className="h-4 w-4" /> Add Property
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input placeholder="Search properties..." value={search} onChange={(e) => setSearch(e.target.value)} leftIcon={<FiSearch className="h-4 w-4" />} />
        </div>
        <select
          value={purposeFilter}
          onChange={(e) => setPurposeFilter(e.target.value)}
          className="h-10 px-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)]"
        >
          <option value="all">All Purposes</option>
          {PROPERTY_PURPOSES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-[var(--color-border)] bg-[var(--color-background)]">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">Property</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">Purpose</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">Price</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">Details</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-12 text-[var(--color-text-muted)]">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-[var(--color-text-muted)]">No properties found</td></tr>
              ) : filtered.map((p) => (
                <tr key={p.id} className="hover:bg-[var(--color-background)] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {p.images?.[0] ? (
                        <img src={p.images[0]} alt={p.title} className="h-10 w-14 rounded-lg object-cover flex-shrink-0" />
                      ) : (
                        <div className="h-10 w-14 rounded-lg bg-[var(--color-background)] flex items-center justify-center flex-shrink-0">
                          <FiEye className="h-4 w-4 text-[var(--color-text-muted)]" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-[var(--color-text)] line-clamp-1">{p.title}</p>
                        <p className="text-xs text-[var(--color-text-muted)] capitalize">{p.property_type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={PURPOSE_COLORS[p.property_purpose] ?? 'secondary'} className="capitalize">
                      {p.property_purpose}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-[var(--color-brand-gold)]">{formatPrice(p.price, p.currency)}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
                      {p.bedrooms != null && <span className="flex items-center gap-1"><Bed className="h-3 w-3" />{p.bedrooms}</span>}
                      {p.bathrooms != null && <span className="flex items-center gap-1"><Bath className="h-3 w-3" />{p.bathrooms}</span>}
                      <span className="flex items-center gap-1"><Maximize2 className="h-3 w-3" />{p.area} {p.area_unit}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={p.property_status === 'available' ? 'success' : 'secondary'} className="capitalize text-xs">
                      {p.property_status.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon-sm" onClick={() => openEdit(p)}><FiEdit2 className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => setDeleteId(p.id)} className="hover:text-red-500"><FiTrash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setShowForm(false)}>
          <div className="bg-[var(--color-surface)] rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-[var(--color-border)] flex items-center justify-between sticky top-0 bg-[var(--color-surface)] z-10">
              <h2 className="font-display text-lg font-bold text-[var(--color-text)]">{editItem ? 'Edit' : 'Add'} Property</h2>
              <button onClick={() => setShowForm(false)}><FiX className="h-5 w-5 text-[var(--color-text-muted)]" /></button>
            </div>
            <div className="p-5 space-y-5">
              {/* Basic Info */}
              <div>
                <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-3">Basic Information</p>
                <div className="space-y-3">
                  <Input
                    label="Title *"
                    value={form.title}
                    onChange={(e) => { f('title', e.target.value); f('slug', slugify(e.target.value)) }}
                    placeholder="e.g. 5-Marla Modern Villa in DHA Phase 6"
                  />
                  <Input label="Slug" value={form.slug} onChange={(e) => f('slug', e.target.value)} placeholder="auto-generated" />
                  <Textarea label="Description" value={form.description} onChange={(e) => f('description', e.target.value)} rows={3} />
                </div>
              </div>

              {/* Classification */}
              <div>
                <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-3">Classification</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Type', field: 'property_type', options: PROPERTY_TYPES },
                    { label: 'Purpose', field: 'property_purpose', options: PROPERTY_PURPOSES },
                    { label: 'Status', field: 'property_status', options: PROPERTY_STATUSES },
                  ].map(({ label, field, options }) => (
                    <div key={field}>
                      <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5">{label}</label>
                      <select
                        value={(form as Record<string, string>)[field]}
                        onChange={(e) => f(field as keyof FormState, e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)]"
                      >
                        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing & Area */}
              <div>
                <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-3">Pricing & Area</p>
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Price *" type="number" value={form.price} onChange={(e) => f('price', e.target.value)} placeholder="e.g. 45000000" />
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5">Currency</label>
                    <select value={form.currency} onChange={(e) => f('currency', e.target.value)} className="w-full h-10 px-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)]">
                      {['PKR', 'USD', 'AED'].map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <Input label="Area *" type="number" value={form.area} onChange={(e) => f('area', e.target.value)} placeholder="e.g. 5" />
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5">Area Unit</label>
                    <select value={form.area_unit} onChange={(e) => f('area_unit', e.target.value)} className="w-full h-10 px-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)]">
                      {AREA_UNITS.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Rooms */}
              <div>
                <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-3">Rooms & Details</p>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: 'Bedrooms', field: 'bedrooms' },
                    { label: 'Bathrooms', field: 'bathrooms' },
                    { label: 'Garage', field: 'garage' },
                    { label: 'Year Built', field: 'year_built' },
                  ].map(({ label, field }) => (
                    <Input key={field} label={label} type="number" value={(form as Record<string, string>)[field]} onChange={(e) => f(field as keyof FormState, e.target.value)} placeholder="—" />
                  ))}
                </div>
              </div>

              {/* Location */}
              <Input label="Address *" value={form.address} onChange={(e) => f('address', e.target.value)} placeholder="e.g. DHA Phase 6, Lahore" />

              {/* Media */}
              <div>
                <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-3">Media & Features</p>
                <div className="space-y-3">
                  <MultiImageUpload
                    label="Property Images"
                    values={form.images}
                    onChange={(urls) => f('images', urls)}
                    folder="properties"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Textarea label="Features (one per line)" value={form.features} onChange={(e) => f('features', e.target.value)} rows={3} placeholder="Marble Flooring&#10;Central AC&#10;Solar Panels" />
                    <Textarea label="Amenities (one per line)" value={form.amenities} onChange={(e) => f('amenities', e.target.value)} rows={3} placeholder="Swimming Pool&#10;Gym&#10;Garden" />
                  </div>
                  <Input label="Tags (comma-separated)" value={form.tags} onChange={(e) => f('tags', e.target.value)} placeholder="luxury, dha, villa" />
                </div>
              </div>

              {/* Settings */}
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_featured} onChange={(e) => f('is_featured', e.target.checked)} className="w-4 h-4 accent-[var(--color-brand-gold)]" />
                  <span className="text-sm text-[var(--color-text)]">Featured Property</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_active} onChange={(e) => f('is_active', e.target.checked)} className="w-4 h-4 accent-[var(--color-brand-gold)]" />
                  <span className="text-sm text-[var(--color-text)]">Active / Published</span>
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button variant="primary" className="flex-1" onClick={handleSave} loading={saving}>
                  {editItem ? 'Update' : 'Add'} Property
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
            <h3 className="font-display text-lg font-bold text-[var(--color-text)] mb-2">Delete Property?</h3>
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
