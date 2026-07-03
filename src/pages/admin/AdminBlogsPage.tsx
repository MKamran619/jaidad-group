import { useState, useEffect } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiEye } from 'react-icons/fi'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Badge } from '@/components/ui/Badge'
import { MediaUpload } from '@/components/ui/MediaUpload'
import { supabase } from '@/lib/supabase/client'
import { formatDate, slugify } from '@/lib/utils/format'
import { DEMO_BLOGS } from '@/lib/utils/demoData'
import type { Blog } from '@/types/database'

const BLOG_CATEGORIES = ['Market Analysis', "Buyer's Guide", 'Investment', 'Construction', 'Tips & Advice', 'News', 'Project Updates']

type FormState = {
  title: string; slug: string; excerpt: string; content: string
  cover_image: string; category: string; tags: string
  status: string; is_featured: boolean
}

const EMPTY_FORM: FormState = {
  title: '', slug: '', excerpt: '', content: '',
  cover_image: '', category: 'Market Analysis', tags: '',
  status: 'draft', is_featured: false,
}

export function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<Blog | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'basic' | 'content'>('basic')

  useEffect(() => { fetchBlogs() }, [])

  const fetchBlogs = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from('blogs').select('*').order('created_at', { ascending: false })
      setBlogs(error ? DEMO_BLOGS : (data ?? DEMO_BLOGS))
    } catch {
      setBlogs(DEMO_BLOGS)
    }
    setLoading(false)
  }

  const openAdd = () => {
    setEditItem(null)
    setForm(EMPTY_FORM)
    setActiveTab('basic')
    setShowForm(true)
  }

  const openEdit = (b: Blog) => {
    setEditItem(b)
    setForm({
      title: b.title, slug: b.slug, excerpt: b.excerpt ?? '', content: b.content,
      cover_image: b.cover_image ?? '', category: b.category,
      tags: (b.tags ?? []).join(', '),
      status: b.status, is_featured: b.is_featured,
    })
    setActiveTab('basic')
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!form.title || !form.excerpt) { toast.error('Title and excerpt are required'); return }
    setSaving(true)
    const payload = {
      title: form.title,
      slug: form.slug || slugify(form.title),
      excerpt: form.excerpt,
      content: form.content,
      cover_image: form.cover_image || undefined,
      category: form.category,
      tags: form.tags.split(',').map((s) => s.trim()).filter(Boolean),
      status: form.status,
      is_featured: form.is_featured,
      view_count: editItem?.view_count ?? 0,
      published_at: form.status === 'published' ? new Date().toISOString() : undefined,
    }
    try {
      if (editItem) {
        const { error } = await supabase.from('blogs').update(payload).eq('id', editItem.id)
        if (error) throw error
        toast.success('Blog updated')
      } else {
        const { error } = await supabase.from('blogs').insert(payload)
        if (error) throw error
        toast.success('Blog created')
      }
    } catch {
      toast.info(editItem ? 'Updated (demo mode)' : 'Created (demo mode)')
    }
    setSaving(false)
    setShowForm(false)
    fetchBlogs()
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      const { error } = await supabase.from('blogs').delete().eq('id', deleteId)
      if (error) throw error
      toast.success('Blog deleted')
    } catch {
      toast.info('Deleted (demo mode)')
    }
    setDeleteId(null)
    fetchBlogs()
  }

  const togglePublish = async (b: Blog) => {
    const newStatus = b.status === 'published' ? 'draft' : 'published'
    try {
      await supabase.from('blogs').update({ status: newStatus }).eq('id', b.id)
    } catch {}
    setBlogs((prev) => prev.map((x) => x.id === b.id ? { ...x, status: newStatus as Blog['status'] } : x))
    toast.success(newStatus === 'published' ? 'Published!' : 'Moved to draft')
  }

  const f = (field: keyof FormState, value: unknown) => setForm((prev) => ({ ...prev, [field]: value }))

  const filtered = blogs.filter((b) => {
    const matchSearch = !search || b.title.toLowerCase().includes(search.toLowerCase()) || b.category.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || b.status === statusFilter
    return matchSearch && matchStatus
  })

  const STATUS_VARIANT: Record<string, 'success' | 'secondary' | 'warning'> = {
    published: 'success', draft: 'secondary', archived: 'warning',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-[var(--color-text)]">Blog Posts</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">{blogs.length} articles</p>
        </div>
        <Button variant="primary" size="sm" onClick={openAdd}>
          <FiPlus className="h-4 w-4" /> New Post
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input placeholder="Search posts..." value={search} onChange={(e) => setSearch(e.target.value)} leftIcon={<FiSearch className="h-4 w-4" />} />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)]"
        >
          <option value="all">All Statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-[var(--color-border)] bg-[var(--color-background)]">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">Post</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">Views</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">Date</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-12 text-[var(--color-text-muted)]">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-[var(--color-text-muted)]">No blog posts found</td></tr>
              ) : filtered.map((b) => (
                <tr key={b.id} className="hover:bg-[var(--color-background)] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {b.cover_image ? (
                        <img src={b.cover_image} alt={b.title} className="h-10 w-14 rounded-lg object-cover flex-shrink-0" />
                      ) : (
                        <div className="h-10 w-14 rounded-lg bg-[var(--color-background)] flex items-center justify-center flex-shrink-0">
                          <FiEye className="h-4 w-4 text-[var(--color-text-muted)]" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-[var(--color-text)] line-clamp-1">{b.title}</p>
                        <p className="text-xs text-[var(--color-text-muted)] line-clamp-1">{b.excerpt}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary" className="text-xs">{b.category}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => togglePublish(b)} title="Click to toggle">
                      <Badge variant={STATUS_VARIANT[b.status] ?? 'secondary'} className="capitalize cursor-pointer hover:opacity-80 transition-opacity">
                        {b.status}
                      </Badge>
                    </button>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-muted)]">{b.view_count.toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs text-[var(--color-text-muted)] whitespace-nowrap">
                    {formatDate(b.published_at ?? b.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon-sm" onClick={() => openEdit(b)}><FiEdit2 className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => setDeleteId(b.id)} className="hover:text-red-500"><FiTrash2 className="h-3.5 w-3.5" /></Button>
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
              <h2 className="font-display text-lg font-bold text-[var(--color-text)]">{editItem ? 'Edit' : 'New'} Blog Post</h2>
              <button onClick={() => setShowForm(false)}><FiX className="h-5 w-5 text-[var(--color-text-muted)]" /></button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[var(--color-border)] px-5">
              {(['basic', 'content'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors -mb-px capitalize ${activeTab === tab ? 'border-[var(--color-brand-gold)] text-[var(--color-brand-gold)]' : 'border-transparent text-[var(--color-text-muted)]'}`}
                >
                  {tab === 'basic' ? 'Details' : 'Content (HTML)'}
                </button>
              ))}
            </div>

            <div className="p-5 space-y-4">
              {activeTab === 'basic' ? (
                <>
                  <Input
                    label="Title *"
                    value={form.title}
                    onChange={(e) => { f('title', e.target.value); f('slug', slugify(e.target.value)) }}
                    placeholder="Blog post title"
                  />
                  <Input label="Slug" value={form.slug} onChange={(e) => f('slug', e.target.value)} placeholder="auto-generated" />
                  <Textarea label="Excerpt *" value={form.excerpt} onChange={(e) => f('excerpt', e.target.value)} rows={3} placeholder="Short description (shown in listing)" />
                  <MediaUpload
                    label="Cover Image"
                    value={form.cover_image}
                    onChange={(url) => f('cover_image', url)}
                    folder="blog"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5">Category</label>
                      <select value={form.category} onChange={(e) => f('category', e.target.value)} className="w-full h-10 px-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)]">
                        {BLOG_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5">Status</label>
                      <select value={form.status} onChange={(e) => f('status', e.target.value)} className="w-full h-10 px-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)]">
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                  </div>
                  <Input label="Tags (comma-separated)" value={form.tags} onChange={(e) => f('tags', e.target.value)} placeholder="market, investment, lahore" />
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.is_featured} onChange={(e) => f('is_featured', e.target.checked)} className="w-4 h-4 accent-[var(--color-brand-gold)]" />
                    <span className="text-sm text-[var(--color-text)]">Featured Post</span>
                  </label>
                </>
              ) : (
                <>
                  <p className="text-xs text-[var(--color-text-muted)]">Write your blog content as HTML. You can use &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;strong&gt;, etc.</p>
                  <Textarea
                    label="Content (HTML)"
                    value={form.content}
                    onChange={(e) => f('content', e.target.value)}
                    rows={20}
                    placeholder="<p>Your blog content here...</p>&#10;<h2>Section Title</h2>&#10;<p>More content...</p>"
                  />
                </>
              )}

              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button variant="primary" className="flex-1" onClick={handleSave} loading={saving}>
                  {editItem ? 'Update' : 'Create'} Post
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
            <h3 className="font-display text-lg font-bold text-[var(--color-text)] mb-2">Delete Blog Post?</h3>
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
