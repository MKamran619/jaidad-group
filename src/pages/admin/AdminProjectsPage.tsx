import { useState, useEffect } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiX, FiMapPin, FiCalendar } from 'react-icons/fi'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Badge } from '@/components/ui/Badge'
import { MultiImageUpload } from '@/components/ui/MultiImageUpload'
import { supabase } from '@/lib/supabase/client'
import { DEMO_PROJECTS } from '@/lib/utils/demoData'
import { slugify } from '@/lib/utils/format'
import { cn } from '@/lib/utils/cn'
import type { Project } from '@/types/database'

type FormState = {
  title: string
  slug: string
  description: string
  project_status: 'ongoing' | 'upcoming' | 'completed'
  location: string
  city_id: string
  images: string[]
  completion_date: string
  completion_percentage: string
  total_units: string
  available_units: string
  starting_price: string
  investment_details: string
  is_featured: boolean
  is_active: boolean
}

const EMPTY_FORM: FormState = {
  title: '', slug: '', description: '', project_status: 'upcoming',
  location: '', city_id: '', images: [], completion_date: '', completion_percentage: '0',
  total_units: '', available_units: '', starting_price: '', investment_details: '',
  is_featured: false, is_active: true,
}

const STATUS_VARIANTS: Record<string, 'gold' | 'info' | 'success'> = {
  ongoing: 'gold', upcoming: 'info', completed: 'success',
}

export function AdminProjectsPage() {
  const [items, setItems] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<Project | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchItems() }, [])

  const fetchItems = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false })
      setItems(error ? DEMO_PROJECTS : (data ?? DEMO_PROJECTS))
    } catch {
      setItems(DEMO_PROJECTS)
    }
    setLoading(false)
  }

  const openAdd = () => { setEditItem(null); setForm(EMPTY_FORM); setShowForm(true) }

  const openEdit = (item: Project) => {
    setEditItem(item)
    setForm({
      title: item.title,
      slug: item.slug,
      description: item.description,
      project_status: item.project_status,
      location: item.location,
      city_id: item.city_id ?? '',
      images: item.images ?? [],
      completion_date: item.completion_date ?? '',
      completion_percentage: String(item.completion_percentage ?? 0),
      total_units: String(item.total_units ?? ''),
      available_units: String(item.available_units ?? ''),
      starting_price: String(item.starting_price ?? ''),
      investment_details: item.investment_details ?? '',
      is_featured: item.is_featured,
      is_active: item.is_active,
    })
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!form.title || !form.location) { toast.error('Title and Location are required'); return }
    setSaving(true)
    const payload: Partial<Project> & { title: string } = {
      title: form.title,
      slug: form.slug || slugify(form.title),
      description: form.description,
      project_status: form.project_status,
      location: form.location,
      city_id: form.city_id || undefined,
      images: form.images,
      completion_date: form.completion_date || undefined,
      completion_percentage: form.completion_percentage ? parseInt(form.completion_percentage) : undefined,
      total_units: form.total_units ? parseInt(form.total_units) : undefined,
      available_units: form.available_units ? parseInt(form.available_units) : undefined,
      starting_price: form.starting_price ? parseFloat(form.starting_price) : undefined,
      investment_details: form.investment_details || undefined,
      timeline: editItem?.timeline ?? [],
      downloads: editItem?.downloads ?? [],
      is_featured: form.is_featured,
      is_active: form.is_active,
    }
    try {
      if (editItem) {
        const { error } = await supabase.from('projects').update(payload).eq('id', editItem.id)
        if (error) throw error
        toast.success('Project updated')
      } else {
        const { error } = await supabase.from('projects').insert(payload)
        if (error) throw error
        toast.success('Project created')
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
      const { error } = await supabase.from('projects').delete().eq('id', deleteId)
      if (error) throw error
      toast.success('Project deleted')
    } catch {
      toast.info('Deleted (demo mode)')
    }
    setDeleteId(null)
    fetchItems()
  }

  const f = (field: keyof FormState, value: unknown) => setForm((prev) => ({ ...prev, [field]: value }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-[var(--color-text)]">Projects</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">{items.length} total projects</p>
        </div>
        <Button variant="primary" size="sm" onClick={openAdd}>
          <FiPlus className="h-4 w-4" /> New Project
        </Button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-12 text-[var(--color-text-muted)]">Loading...</div>
      ) : (
        <div className="rounded-2xl border border-[var(--color-border)] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
                <th className="px-4 py-3 text-left font-semibold text-[var(--color-text-muted)]">Project</th>
                <th className="px-4 py-3 text-left font-semibold text-[var(--color-text-muted)] hidden md:table-cell">Location</th>
                <th className="px-4 py-3 text-left font-semibold text-[var(--color-text-muted)]">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-[var(--color-text-muted)] hidden lg:table-cell">Progress</th>
                <th className="px-4 py-3 text-right font-semibold text-[var(--color-text-muted)]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)] bg-[var(--color-background)]">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-[var(--color-surface)] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {item.images[0] && (
                        <img src={item.images[0]} alt="" className="h-10 w-16 rounded-lg object-cover flex-shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className="font-medium text-[var(--color-text)] truncate max-w-[180px]">{item.title}</p>
                        {item.starting_price && (
                          <p className="text-xs text-[var(--color-brand-gold)]">
                            From PKR {(item.starting_price / 1000000).toFixed(0)}M
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-muted)] hidden md:table-cell">
                    <span className="flex items-center gap-1"><FiMapPin className="h-3.5 w-3.5" />{item.location}</span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={STATUS_VARIANTS[item.project_status]} className="capitalize">
                      {item.project_status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-24 rounded-full bg-[var(--color-border)]">
                        <div
                          className="h-full rounded-full bg-[var(--color-brand-gold)]"
                          style={{ width: `${item.project_status === 'completed' ? 100 : (item.completion_percentage ?? 0)}%` }}
                        />
                      </div>
                      <span className="text-xs text-[var(--color-text-muted)]">
                        {item.project_status === 'completed' ? '100' : (item.completion_percentage ?? 0)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(item)}
                        className="p-2 rounded-lg hover:bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-brand-gold)] transition-colors"
                      >
                        <FiEdit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteId(item.id)}
                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 text-[var(--color-text-muted)] hover:text-red-500 transition-colors"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && (
            <div className="text-center py-12 text-[var(--color-text-muted)]">No projects yet. Click "New Project" to add one.</div>
          )}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 overflow-y-auto" onClick={() => setShowForm(false)}>
          <div
            className="bg-[var(--color-surface)] rounded-2xl w-full max-w-2xl shadow-2xl my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sticky Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-4 rounded-t-2xl">
              <h2 className="font-display text-lg font-bold text-[var(--color-text)]">
                {editItem ? 'Edit Project' : 'New Project'}
              </h2>
              <button onClick={() => setShowForm(false)}>
                <FiX className="h-5 w-5 text-[var(--color-text-muted)]" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Title *" value={form.title} onChange={(e) => { f('title', e.target.value); if (!editItem) f('slug', slugify(e.target.value)) }} placeholder="Project name" className="col-span-2 sm:col-span-1" />
                <Input label="Slug" value={form.slug} onChange={(e) => f('slug', e.target.value)} placeholder="auto-generated" />
              </div>

              <Textarea label="Description" value={form.description} onChange={(e) => f('description', e.target.value)} rows={3} placeholder="Brief project overview..." />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5">Status *</label>
                  <select
                    value={form.project_status}
                    onChange={(e) => f('project_status', e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)]"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <Input label="Location" value={form.location} onChange={(e) => f('location', e.target.value)} placeholder="e.g. Gulberg, Lahore" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Completion Date"
                  type="date"
                  value={form.completion_date}
                  onChange={(e) => f('completion_date', e.target.value)}
                />
                <Input
                  label="Completion %"
                  type="number"
                  min="0"
                  max="100"
                  value={form.completion_percentage}
                  onChange={(e) => f('completion_percentage', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Input label="Total Units" type="number" value={form.total_units} onChange={(e) => f('total_units', e.target.value)} placeholder="120" />
                <Input label="Available Units" type="number" value={form.available_units} onChange={(e) => f('available_units', e.target.value)} placeholder="38" />
                <Input label="Starting Price (PKR)" type="number" value={form.starting_price} onChange={(e) => f('starting_price', e.target.value)} placeholder="25000000" />
              </div>

              <MultiImageUpload
                label="Project Images"
                values={form.images}
                onChange={(urls) => f('images', urls)}
                folder="projects"
              />

              <Textarea
                label="Investment Details"
                value={form.investment_details}
                onChange={(e) => f('investment_details', e.target.value)}
                rows={2}
                placeholder="ROI expectations, payment plans, etc."
              />

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_featured}
                    onChange={(e) => f('is_featured', e.target.checked)}
                    className="h-4 w-4 rounded accent-[var(--color-brand-gold)]"
                  />
                  <span className="text-sm text-[var(--color-text)]">Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => f('is_active', e.target.checked)}
                    className="h-4 w-4 rounded accent-[var(--color-brand-gold)]"
                  />
                  <span className="text-sm text-[var(--color-text)]">Active</span>
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button variant="primary" className="flex-1" onClick={handleSave} loading={saving}>
                  {editItem ? 'Save Changes' : 'Create Project'}
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
            <h3 className="font-display text-lg font-bold text-[var(--color-text)] mb-2">Delete Project?</h3>
            <p className="text-sm text-[var(--color-text-muted)] mb-5">This will permanently remove the project and all its data.</p>
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
