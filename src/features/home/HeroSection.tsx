import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiSearch, FiMapPin, FiHome } from 'react-icons/fi'
import { Button } from '@/components/ui/Button'
import { PROPERTY_PURPOSES, PROPERTY_TYPES } from '@/lib/utils/constants'
import { useSettings } from '@/hooks/useSettings'

export function HeroSection() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState({ purpose: 'sale', type: '', location: '' })
  const { data: settings } = useSettings()

  const heroImage = settings?.['hero_image'] as string | undefined
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
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-[var(--color-brand-black)]">
      {/* Background */}
      <div className="absolute inset-0">
        {heroImage ? (
          <img
            src={heroImage}
            alt="Luxury Property"
            className="h-full w-full object-cover opacity-40"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-black via-zinc-900 to-black" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Floating Gold Orbs */}
      <div className="absolute top-20 right-[20%] h-64 w-64 rounded-full bg-[var(--color-brand-gold)]/20 blur-3xl" />
      <div className="absolute bottom-32 right-[10%] h-40 w-40 rounded-full bg-[var(--color-brand-gold)]/10 blur-2xl" />

      <div className="container relative mx-auto px-4 py-20">
        <div className="max-w-3xl">
          {/* Label */}
          {tagline && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-brand-gold)]/30 bg-[var(--color-brand-gold)]/10 px-4 py-1.5"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-brand-gold)] pulse-gold" />
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-brand-gold)]">
                {tagline}
              </span>
            </motion.div>
          )}

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-4xl font-black leading-tight text-white md:text-5xl lg:text-7xl"
          >
            Find Your{' '}
            <span className="gradient-text">Dream</span>
            <br />
            Property in{' '}
            <span className="text-[var(--color-brand-gold)]">Pakistan</span>
          </motion.h1>

          {heroDesc && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-5 max-w-xl text-base text-white/70 md:text-lg"
            >
              {heroDesc}
            </motion.p>
          )}

          {/* Search Box */}
          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-8"
          >
            {/* Purpose Tabs */}
            <div className="mb-4 flex gap-1">
              {PROPERTY_PURPOSES.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setFilters((f) => ({ ...f, purpose: p.value }))}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                    filters.purpose === p.value
                      ? 'bg-[var(--color-brand-gold)] text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Search Fields */}
            <div className="glass rounded-2xl p-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="relative">
                  <FiHome className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50 pointer-events-none" />
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
                    className="h-12 w-full appearance-none rounded-xl bg-white/10 border border-white/20 pl-9 pr-4 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)]"
                  >
                    <option value="" className="text-black">All Types</option>
                    {PROPERTY_TYPES.map((t) => (
                      <option key={t.value} value={t.value} className="text-black">{t.label}</option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50 pointer-events-none" />
                  <input
                    type="text"
                    value={filters.location}
                    onChange={(e) => setFilters((f) => ({ ...f, location: e.target.value }))}
                    placeholder="City or Society..."
                    className="h-12 w-full rounded-xl bg-white/10 border border-white/20 pl-9 pr-4 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)]"
                  />
                </div>

                <Button type="submit" variant="primary" size="lg" className="h-12 w-full">
                  <FiSearch className="h-4 w-4" />
                  Search Properties
                </Button>
              </div>
            </div>
          </motion.form>

          {/* Popular Locations */}
          {popularLocations.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-4 flex flex-wrap items-center gap-2 text-sm text-white/50"
            >
              <span>Popular:</span>
              {popularLocations.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => { setFilters((f) => ({ ...f, location: loc })); handleSearch(new Event('submit') as unknown as React.FormEvent) }}
                  className="rounded-full border border-white/20 px-3 py-0.5 text-white/70 hover:border-[var(--color-brand-gold)] hover:text-[var(--color-brand-gold)] transition-all"
                >
                  {loc}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Stats Bar — only render if at least one stat has a value */}
      {heroStats.some((s) => s.value) && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="absolute bottom-0 left-0 right-0"
        >
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10 border-t border-white/10 bg-black/40 backdrop-blur-sm">
              {heroStats.map((stat) => (
                stat.value ? (
                  <div key={stat.label} className="flex flex-col items-center py-5 px-4 gap-0.5">
                    <span className="font-display text-2xl font-black text-[var(--color-brand-gold)]">{stat.value}</span>
                    <span className="text-xs text-white/60">{stat.label}</span>
                  </div>
                ) : null
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </section>
  )
}
