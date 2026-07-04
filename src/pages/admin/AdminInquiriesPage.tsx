import { useState, useEffect } from 'react'
import { FiSearch, FiMail, FiPhone, FiEye, FiX } from 'react-icons/fi'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { supabase } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils/format'
import { cn } from '@/lib/utils/cn'
import type { Inquiry } from '@/types/database'

const DEMO_INQUIRIES: Inquiry[] = [
  { id: '1', name: 'Ali Hassan', email: 'ali@example.com', phone: '+92-300-1234567', subject: 'Inquiry about DHA Villa', message: 'I am interested in the 5-Marla villa in DHA Phase 6. Could you please provide more details and arrange a viewing?', property_id: '1', inquiry_type: 'property', status: 'new', source: 'website', created_at: '2025-01-20T10:00:00Z' },
  { id: '2', name: 'Sarah Ahmed', email: 'sarah@example.com', phone: '+92-321-9876543', subject: 'Construction Quote Request', message: 'We need a quote for a 10-Marla house construction in Bahria Town. Please send us your packages and timeline.', inquiry_type: 'construction', status: 'in_progress', source: 'whatsapp', created_at: '2025-01-19T14:30:00Z' },
  { id: '3', name: 'Umar Farooq', email: 'umar@company.com', phone: '+92-333-5556789', subject: 'Commercial Space Needed', message: 'Looking for a 4-Marla commercial space in Gulberg III for our office. Budget is flexible. Please contact at earliest.', inquiry_type: 'property', status: 'resolved', source: 'referral', created_at: '2025-01-18T09:15:00Z' },
  { id: '4', name: 'Fatima Malik', email: 'fatima@gmail.com', phone: '+92-345-7894561', subject: 'Investment Consultation', message: 'I want to invest PKR 50 Lakh in real estate. Please advise which properties would give the best ROI in Lahore currently.', inquiry_type: 'investment', status: 'new', source: 'social', created_at: '2025-01-17T16:45:00Z' },
  { id: '5', name: 'Kamran Butt', email: 'kamran@office.pk', phone: '+92-300-0001234', subject: 'Bahria Town Apartment Rental', message: 'Need a 2-bedroom furnished apartment for rent in Bahria Town Lahore. Budget around PKR 60,000/month. Available from February.', inquiry_type: 'property', status: 'closed', source: 'website', created_at: '2025-01-15T11:20:00Z' },
]

const STATUS_OPTIONS = ['new', 'in_progress', 'resolved', 'closed']
const STATUS_COLORS: Record<string, 'info' | 'warning' | 'success' | 'secondary'> = {
  new: 'info',
  in_progress: 'warning',
  resolved: 'success',
  closed: 'secondary',
}

export function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [viewItem, setViewItem] = useState<Inquiry | null>(null)

  useEffect(() => {
    fetchInquiries()
  }, [])

  const fetchInquiries = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false })
      setInquiries(error ? DEMO_INQUIRIES : (data ?? DEMO_INQUIRIES))
    } catch {
      setInquiries(DEMO_INQUIRIES)
    }
    setLoading(false)
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase.from('inquiries').update({ status }).eq('id', id)
      if (error) throw error
      toast.success('Status updated')
    } catch {
      toast.info('Status updated (demo mode)')
    }
    setInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, status: status as Inquiry['status'] } : i)))
    if (viewItem?.id === id) setViewItem((v) => v ? { ...v, status: status as Inquiry['status'] } : v)
  }

  const filtered = inquiries.filter((i) => {
    const matchSearch = !search || i.name.toLowerCase().includes(search.toLowerCase()) || i.email.toLowerCase().includes(search.toLowerCase()) || i.subject.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || i.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[var(--text)]">Inquiries</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">{inquiries.length} total inquiries</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search by name, email, or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<FiSearch className="h-4 w-4" />}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        >
          <option value="all">All Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-[var(--border)] bg-[var(--background)]">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">Subject</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">Date</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-[var(--text-muted)]">Loading...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-[var(--text-muted)]">No inquiries found</td>
                </tr>
              ) : filtered.map((inq) => (
                <tr key={inq.id} className="hover:bg-[var(--background)] transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-[var(--text)]">{inq.name}</p>
                    <p className="text-xs text-[var(--text-muted)] flex items-center gap-1 mt-0.5">
                      <FiMail className="h-3 w-3" /> {inq.email}
                    </p>
                    <p className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                      <FiPhone className="h-3 w-3" /> {inq.phone}
                    </p>
                  </td>
                  <td className="px-4 py-3 max-w-[200px]">
                    <p className="text-[var(--text)] truncate">{inq.subject}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary" className="capitalize">{inq.inquiry_type}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={inq.status}
                      onChange={(e) => updateStatus(inq.id, e.target.value)}
                      className={cn(
                        'text-xs font-semibold px-2 py-1 rounded-lg border-0 focus:outline-none cursor-pointer',
                        inq.status === 'new' && 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
                        inq.status === 'in_progress' && 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
                        inq.status === 'resolved' && 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
                        inq.status === 'closed' && 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
                      )}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--text-muted)] whitespace-nowrap">
                    {formatDate(inq.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setViewItem(inq)}
                      aria-label="View"
                    >
                      <FiEye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setViewItem(null)}>
          <div
            className="bg-[var(--surface)] rounded-2xl w-full max-w-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-[var(--border)] flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-[var(--text)]">Inquiry Details</h2>
              <button onClick={() => setViewItem(null)} className="text-[var(--text-muted)] hover:text-[var(--text)]">
                <FiX className="h-5 w-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-[var(--text-muted)] mb-1">Name</p>
                  <p className="font-semibold text-[var(--text)]">{viewItem.name}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-muted)] mb-1">Phone</p>
                  <p className="font-semibold text-[var(--text)]">{viewItem.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-muted)] mb-1">Email</p>
                  <p className="font-semibold text-[var(--text)]">{viewItem.email}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-muted)] mb-1">Type</p>
                  <Badge variant="secondary" className="capitalize">{viewItem.inquiry_type}</Badge>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-[var(--text-muted)] mb-1">Subject</p>
                  <p className="font-semibold text-[var(--text)]">{viewItem.subject}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-[var(--text-muted)] mb-1">Message</p>
                  <p className="text-[var(--text)] leading-relaxed text-sm bg-[var(--background)] rounded-xl p-3">
                    {viewItem.message}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <p className="text-sm text-[var(--text-muted)]">Update Status:</p>
                <select
                  value={viewItem.status}
                  onChange={(e) => updateStatus(viewItem.id, e.target.value)}
                  className="text-sm px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--text)] focus:outline-none"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
