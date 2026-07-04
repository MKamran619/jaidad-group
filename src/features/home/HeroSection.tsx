import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiSearch, FiMapPin, FiHome, FiTag } from 'react-icons/fi'
import { Button } from '@/components/ui/Button'
import { PROPERTY_PURPOSES, PROPERTY_TYPES } from '@/lib/utils/constants'
import { useSettings } from '@/hooks/useSettings'

export function HeroSection() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState({ purpose: '', type: '', location: '' })
  const { data: settings } = useSettings()

  const tagline   = settings?.['tagline']    as string | undefined
  const heroDesc  = settings?.['description'] as string | undefined

  const heroStats = [
    { label: 'Properties Sold',  value: settings?.['stats_properties'] as string | undefined },
    { label: 'Happy Clients',    value: settings?.['stats_clients']    as string | undefined },
    { label: 'Years Experience', value: settings?.['stats_years']      as string | undefined },
    { label: 'Cities Covered',   value: settings?.['stats_cities']     as string | undefined },
  ]

  const popularLocations = (settings?.['popular_locations'] as string[] | undefined) ?? []

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (filters.purpose) params.set('purpose', filters.purpose)
    if (filters.type) params.set('type', filters.type)
    if (filters.location) params.set('location', filters.location)
    navigate(`/properties?${params.toString()}`)
  }

  return (
    <section className="relative overflow-hidden bg-[var(--background)] py-24 md:py-32">
      {/* Grid pattern + glow orbs */}
      <div className="hero-bg-effects">
        <div className="grid-pattern" />
        <div className="gradient-orb orb-1" />
        <div className="gradient-orb orb-2" />
      </div>

      <div className="container relative z-[2] mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          {/* Label */}
          {tagline && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-4 py-1.5"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)] pulse-gold" />
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--primary)]">
                {tagline}
              </span>
            </motion.div>
          )}

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-4xl font-black leading-tight text-[var(--text)] md:text-5xl lg:text-6xl"
          >
            Find Your <span className="gradient-text">Dream</span> Property in{' '}
            <span className="text-[var(--primary)]">Pakistan</span>
          </motion.h1>

          {heroDesc && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mx-auto mt-5 max-w-xl text-base text-[var(--text-muted)] md:text-lg"
            >
              {heroDesc}
            </motion.p>
          )}
        </div>

        {/* Search Bar */}
        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mx-auto mt-10 flex max-w-4xl flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card-bg,var(--surface))] p-3 shadow-sm backdrop-blur-xl sm:flex-row sm:items-center"
        >
          <div className="relative flex-1">
            <FiHome className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
            <select
              value={filters.type}
              onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
              className="h-12 w-full appearance-none rounded-xl border border-[var(--border)] bg-[var(--background)] pl-9 pr-4 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            >
              <option value="">All Types</option>
              {PROPERTY_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div className="relative flex-1">
            <FiTag className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
            <select
              value={filters.purpose}
              onChange={(e) => setFilters((f) => ({ ...f, purpose: e.target.value }))}
              className="h-12 w-full appearance-none rounded-xl border border-[var(--border)] bg-[var(--background)] pl-9 pr-4 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            >
              <option value="">Any Purpose</option>
              {PROPERTY_PURPOSES.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>

          <div className="relative flex-1">
            <FiMapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              value={filters.location}
              onChange={(e) => setFilters((f) => ({ ...f, location: e.target.value }))}
              placeholder="City or Society..."
              className="h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] pl-9 pr-4 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>

          <Button type="submit" variant="primary" size="lg" className="h-12 sm:w-auto">
            <FiSearch className="h-4 w-4" />
            Search
          </Button>
        </motion.form>

        {/* Popular Locations */}
        {popularLocations.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-sm text-[var(--text-muted)]"
          >
            <span className="font-medium">Popular:</span>
            {popularLocations.map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => { setFilters((f) => ({ ...f, location: loc })); handleSearch(new Event('submit') as unknown as React.FormEvent) }}
                className="underline decoration-transparent underline-offset-4 transition-all hover:text-[var(--primary)] hover:decoration-current"
              >
                {loc}
              </button>
            ))}
          </motion.div>
        )}

        {/* Stats */}
        {heroStats.some((s) => s.value) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-4"
          >
            {heroStats.map((stat) => (
              stat.value ? (
                <div key={stat.label} className="text-center">
                  <p className="font-display text-2xl font-black text-[var(--text)]">{stat.value}</p>
                  <p className="text-xs text-[var(--text-muted)] whitespace-nowrap">{stat.label}</p>
                </div>
              ) : null
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}
