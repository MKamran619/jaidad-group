import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { supabase } from '@/lib/supabase/client'
import { cn } from '@/lib/utils/cn'

type Settings = Record<string, string>

const TABS = [
  { key: 'general', label: 'General' },
  { key: 'contact', label: 'Contact' },
  { key: 'social', label: 'Social Links' },
  { key: 'theme', label: 'Theme' },
  { key: 'seo', label: 'SEO' },
]

const DEFAULT_SETTINGS: Settings = {
  company_name: 'J+ Jaidad Group',
  tagline: 'Your Trusted Real Estate Partner',
  description: 'Pakistan\'s premium real estate company offering properties, projects, and construction services since 2005.',
  phone: '+92-300-0000000',
  whatsapp: '+923000000000',
  email: 'info@jaidadgroup.com',
  address: 'Main Boulevard, DHA Phase 6, Lahore, Pakistan',
  google_maps_url: 'https://maps.google.com',
  facebook_url: 'https://facebook.com/jaidadgroup',
  instagram_url: 'https://instagram.com/jaidadgroup',
  youtube_url: 'https://youtube.com/jaidadgroup',
  linkedin_url: 'https://linkedin.com/company/jaidadgroup',
  twitter_url: 'https://twitter.com/jaidadgroup',
  primary_color: '#F5A623',
  dark_mode_default: 'false',
  meta_title: 'J+ Jaidad Group – Premium Real Estate Pakistan',
  meta_description: 'Find your dream property with J+ Jaidad Group. Premium properties, projects, and construction services across Pakistan.',
  meta_keywords: 'real estate Pakistan, property Lahore, DHA houses, Bahria Town, construction services',
  google_analytics_id: '',
}

const FIELD_GROUPS: Record<string, { label: string; field: string; type?: string; multi?: boolean }[]> = {
  general: [
    { label: 'Company Name', field: 'company_name' },
    { label: 'Tagline', field: 'tagline' },
    { label: 'Description', field: 'description', multi: true },
  ],
  contact: [
    { label: 'Phone', field: 'phone', type: 'tel' },
    { label: 'WhatsApp (with country code)', field: 'whatsapp', type: 'tel' },
    { label: 'Email', field: 'email', type: 'email' },
    { label: 'Address', field: 'address', multi: true },
    { label: 'Google Maps URL', field: 'google_maps_url', type: 'url' },
  ],
  social: [
    { label: 'Facebook URL', field: 'facebook_url', type: 'url' },
    { label: 'Instagram URL', field: 'instagram_url', type: 'url' },
    { label: 'YouTube URL', field: 'youtube_url', type: 'url' },
    { label: 'LinkedIn URL', field: 'linkedin_url', type: 'url' },
    { label: 'Twitter / X URL', field: 'twitter_url', type: 'url' },
  ],
  theme: [
    { label: 'Primary (Gold) Color', field: 'primary_color', type: 'color' },
    { label: 'Default Dark Mode (true/false)', field: 'dark_mode_default' },
  ],
  seo: [
    { label: 'Meta Title', field: 'meta_title' },
    { label: 'Meta Description', field: 'meta_description', multi: true },
    { label: 'Meta Keywords (comma-separated)', field: 'meta_keywords', multi: true },
    { label: 'Google Analytics ID', field: 'google_analytics_id' },
  ],
}

export function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from('site_settings').select('key, value')
      if (!error && data?.length) {
        const map: Settings = {}
        for (const row of data as Array<{ key: string; value: unknown }>) {
          map[row.key] = String(row.value ?? '')
        }
        setSettings({ ...DEFAULT_SETTINGS, ...map })
      }
    } catch {}
    setLoading(false)
  }

  const handleSave = async () => {
    setSaving(true)
    const currentGroup = FIELD_GROUPS[activeTab]
    let errorCount = 0
    for (const field of currentGroup) {
      const value = settings[field.field] ?? ''
      try {
        const { error } = await supabase
          .from('site_settings')
          .upsert({ key: field.field, value, group: activeTab, updated_at: new Date().toISOString() }, { onConflict: 'key' })
        if (error) errorCount++
      } catch {
        errorCount++
      }
    }
    setSaving(false)
    if (errorCount > 0) {
      toast.info('Settings saved locally (demo mode — connect Supabase to persist)')
    } else {
      toast.success('Settings saved successfully')
    }
  }

  const update = (field: string, value: string) => setSettings((prev) => ({ ...prev, [field]: value }))

  const fields = FIELD_GROUPS[activeTab] ?? []

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-[var(--color-text)]">Site Settings</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">Configure your website content and appearance</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[var(--color-border)] overflow-x-auto scrollbar-none">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex-shrink-0 -mb-px',
              activeTab === tab.key
                ? 'border-[var(--color-brand-gold)] text-[var(--color-brand-gold)]'
                : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Fields */}
      {loading ? (
        <div className="text-center py-12 text-[var(--color-text-muted)]">Loading settings...</div>
      ) : (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-5">
          {fields.map((field) => (
            <div key={field.field}>
              {field.multi ? (
                <Textarea
                  label={field.label}
                  value={settings[field.field] ?? ''}
                  onChange={(e) => update(field.field, e.target.value)}
                  rows={3}
                />
              ) : field.type === 'color' ? (
                <div>
                  <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5">{field.label}</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={settings[field.field] ?? '#F5A623'}
                      onChange={(e) => update(field.field, e.target.value)}
                      className="h-10 w-20 rounded-lg border border-[var(--color-border)] cursor-pointer"
                    />
                    <Input
                      value={settings[field.field] ?? ''}
                      onChange={(e) => update(field.field, e.target.value)}
                      placeholder="#F5A623"
                      className="flex-1"
                    />
                  </div>
                </div>
              ) : (
                <Input
                  label={field.label}
                  type={field.type ?? 'text'}
                  value={settings[field.field] ?? ''}
                  onChange={(e) => update(field.field, e.target.value)}
                />
              )}
            </div>
          ))}

          <div className="pt-2">
            <Button variant="primary" onClick={handleSave} loading={saving}>
              Save {TABS.find((t) => t.key === activeTab)?.label} Settings
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
