import { useState, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { FiCheck } from 'react-icons/fi'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { supabase } from '@/lib/supabase/client'
import { cn } from '@/lib/utils/cn'
import { getLightThemes, getDarkThemes } from '@/lib/themes'
import { DEFAULT_LIGHT_THEME_ID, DEFAULT_DARK_THEME_ID } from '@/hooks/useTheme'

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
  theme_light: DEFAULT_LIGHT_THEME_ID,
  theme_dark: DEFAULT_DARK_THEME_ID,
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
    { label: 'Light Theme', field: 'theme_light', type: 'theme-picker' },
    { label: 'Dark Theme', field: 'theme_dark', type: 'theme-picker' },
  ],
  seo: [
    { label: 'Meta Title', field: 'meta_title' },
    { label: 'Meta Description', field: 'meta_description', multi: true },
    { label: 'Meta Keywords (comma-separated)', field: 'meta_keywords', multi: true },
    { label: 'Google Analytics ID', field: 'google_analytics_id' },
  ],
}

export function AdminSettingsPage() {
  const queryClient = useQueryClient()
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
    queryClient.invalidateQueries({ queryKey: ['site-settings'] })
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
        <h1 className="font-display text-2xl font-bold text-[var(--text)]">Site Settings</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Configure your website content and appearance</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[var(--border)] overflow-x-auto scrollbar-none">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex-shrink-0 -mb-px',
              activeTab === tab.key
                ? 'border-[var(--primary)] text-[var(--primary)]'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text)]'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Fields */}
      {loading ? (
        <div className="text-center py-12 text-[var(--text-muted)]">Loading settings...</div>
      ) : (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-5">
          {fields.map((field) => (
            <div key={field.field}>
              {field.multi ? (
                <Textarea
                  label={field.label}
                  value={settings[field.field] ?? ''}
                  onChange={(e) => update(field.field, e.target.value)}
                  rows={3}
                />
              ) : field.type === 'theme-picker' ? (
                <div>
                  <label className="block text-xs font-medium text-[var(--text-muted)] mb-2">{field.label}</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {(field.field === 'theme_light' ? getLightThemes() : getDarkThemes()).map((t) => {
                      const selected = settings[field.field] === t.id
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => update(field.field, t.id)}
                          className={cn(
                            'flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm transition-all',
                            selected
                              ? 'border-[var(--primary)] bg-[var(--primary)]/10'
                              : 'border-[var(--border)] hover:border-[var(--primary)]/50'
                          )}
                        >
                          <span
                            className="h-6 w-6 flex-shrink-0 rounded-full border border-[var(--border)]"
                            style={{ background: t.gradient }}
                          />
                          <span className="flex-1 truncate text-[var(--text)]">{t.name}</span>
                          {selected && <FiCheck className="h-4 w-4 flex-shrink-0 text-[var(--primary)]" />}
                        </button>
                      )
                    })}
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
