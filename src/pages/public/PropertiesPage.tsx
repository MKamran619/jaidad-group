import { useState, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { useLocation, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiSearch, FiFilter, FiGrid, FiList, FiX } from 'react-icons/fi'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { PropertyCard } from '@/features/properties/PropertyCard'
import { PropertyCardSkeleton } from '@/components/ui/Skeleton'
import { useProperties } from '@/hooks/useProperties'
import { PROPERTY_TYPES, PROPERTY_PURPOSES } from '@/lib/utils/constants'
import { SectionHeader } from '@/components/ui/SectionHeader'

const PRICE_OPTIONS = [
  { value: '', label: 'Any Price' },
  { value: '5000000', label: 'Up to 50 Lakh' },
  { value: '10000000', label: 'Up to 1 Crore' },
  { value: '30000000', label: 'Up to 3 Crore' },
  { value: '50000000', label: 'Up to 5 Crore' },
]

const BEDROOM_OPTIONS = [
  { value: '', label: 'Any Beds' },
  { value: '1', label: '1+ Bedroom' },
  { value: '2', label: '2+ Bedrooms' },
  { value: '3', label: '3+ Bedrooms' },
  { value: '4', label: '4+ Bedrooms' },
  { value: '5', label: '5+ Bedrooms' },
]

export function PropertiesPage() {
  const [params, setParams] = useSearchParams()
  const location = useLocation()
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [page, setPage] = useState(1)

  const pathFilters = useMemo(() => {
    const key = location.pathname.toLowerCase()
    const mapping: Record<string, { type?: string; purpose?: string; search?: string }> = {
      '/residential-plots': { type: 'plot' },
      '/residential-plots/all-residential': { type: 'plot' },
      '/residential-plots/luxury-plots': { type: 'plot', search: 'luxury' },
      '/residential-plots/affordable-plots': { type: 'plot', search: 'affordable' },
      '/commercial-plots': { type: 'commercial' },
      '/commercial-plots/retail-plots': { type: 'commercial', search: 'retail' },
      '/commercial-plots/office-sites': { type: 'commercial', search: 'office' },
      '/commercial-plots/industrial-land': { type: 'industrial' },
      '/houses': { type: 'house' },
      '/houses/for-sale': { type: 'house', purpose: 'sale' },
      '/houses/villas': { type: 'house', search: 'villa' },
      '/houses/townhouses': { type: 'house', search: 'townhouse' },
      '/apartments': { type: 'apartment' },
      '/apartments/studio-apartments': { type: 'apartment', search: 'studio' },
      '/apartments/1-bedroom-apartments': { type: 'apartment', search: '1-bedroom' },
      '/apartments/2-bedroom-apartments': { type: 'apartment', search: '2-bedroom' },
      '/agricultural-land': { type: 'agricultural' },
      '/agricultural-land/farming-land': { type: 'agricultural' },
      '/agricultural-land/orchard-land': { type: 'agricultural' },
      '/agricultural-land/rural-development-land': { type: 'agricultural' },
      '/industrial-land': { type: 'industrial' },
      '/industrial-land/factory-sites': { type: 'industrial' },
      '/industrial-land/warehouse-plots': { type: 'industrial' },
      '/industrial-land/logistics-yards': { type: 'industrial' },
      '/farmhouses': { type: 'farmhouse' },
      '/farmhouses/luxury-farmhouses': { type: 'farmhouse', search: 'luxury' },
      '/farmhouses/budget-farmhouses': { type: 'farmhouse', search: 'budget' },
      '/farmhouses/farmhouse-plots': { type: 'farmhouse' },
      '/shop-flat-offices': { type: 'shop' },
      '/shop-flat-offices/shops': { type: 'shop' },
      '/shop-flat-offices/flats': { type: 'apartment', search: 'flats' },
      '/shop-flat-offices/offices': { type: 'office' },
    }
    return mapping[key] ?? {}
  }, [location.pathname])

  const filters = {
    purpose: params.get('purpose') ?? pathFilters.purpose,
    type: params.get('type') ?? pathFilters.type,
    search: params.get('search') ?? pathFilters.search,
    maxPrice: params.get('maxPrice') ? Number(params.get('maxPrice')) : undefined,
    bedrooms: params.get('bedrooms') ? Number(params.get('bedrooms')) : undefined,
    page,
    limit: 12,
  }

  const { data, isLoading } = useProperties(filters)
  const properties = data?.properties ?? []

  const setFilter = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next)
    setPage(1)
  }

  const clearFilters = () => {
    setParams(new URLSearchParams())
    setPage(1)
  }

  const hasFilters = params.toString().length > 0

  return (
    <>
      <Helmet>
        <title>Properties for Sale & Rent – J+ Jaidad Group</title>
        <meta name="description" content="Browse thousands of verified properties for sale and rent across Pakistan. Residential, commercial, plots, and more." />
      </Helmet>

      {/* Page Header */}
      <div className="bg-[var(--surface)] py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--primary)] mb-3">
              Find Your Property
            </p>
            <h1 className="font-display text-3xl md:text-5xl font-black text-[var(--text)] mb-4">
              Properties for Sale & Rent
            </h1>
            <p className="text-[var(--text-muted)] max-w-xl mx-auto">
              Explore our curated portfolio of verified premium properties across Pakistan
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {/* Filters */}
        <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-5 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <Input
              placeholder="Search properties..."
              leftIcon={<FiSearch className="h-4 w-4" />}
              defaultValue={params.get('search') ?? ''}
              onChange={(e) => setFilter('search', e.target.value)}
            />
            <Select
              placeholder="All Types"
              options={PROPERTY_TYPES.map((t) => ({ label: t.label, value: t.value }))}
              value={params.get('type') ?? ''}
              onChange={(e) => setFilter('type', e.target.value)}
            />
            <Select
              placeholder="Any Purpose"
              options={PROPERTY_PURPOSES.map((p) => ({ label: p.label, value: p.value }))}
              value={params.get('purpose') ?? ''}
              onChange={(e) => setFilter('purpose', e.target.value)}
            />
            <Select
              placeholder="Any Price"
              options={PRICE_OPTIONS}
              value={params.get('maxPrice') ?? ''}
              onChange={(e) => setFilter('maxPrice', e.target.value)}
            />
            <Select
              placeholder="Any Beds"
              options={BEDROOM_OPTIONS}
              value={params.get('bedrooms') ?? ''}
              onChange={(e) => setFilter('bedrooms', e.target.value)}
            />
          </div>
          {hasFilters && (
            <div className="mt-3 flex items-center justify-end">
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <FiX className="h-3.5 w-3.5" />
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-[var(--text-muted)]">
            <span className="font-semibold text-[var(--text)]">{properties.length}</span> properties found
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => setView('grid')}
              className={`h-9 w-9 rounded-lg flex items-center justify-center transition-colors ${view === 'grid' ? 'bg-[var(--primary)] text-white' : 'bg-[var(--surface)] text-[var(--text-muted)]'}`}
            >
              <FiGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView('list')}
              className={`h-9 w-9 rounded-lg flex items-center justify-center transition-colors ${view === 'list' ? 'bg-[var(--primary)] text-white' : 'bg-[var(--surface)] text-[var(--text-muted)]'}`}
            >
              <FiList className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Grid */}
        {!isLoading && properties.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-[var(--text-muted)] text-lg mb-4">No properties found matching your search.</p>
            {hasFilters && (
              <Button variant="outline" size="md" onClick={clearFilters}>Clear Filters</Button>
            )}
          </div>
        ) : (
          <div className={`grid gap-6 ${view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => <PropertyCardSkeleton key={i} />)
              : properties.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <PropertyCard property={p} compact={view === 'list'} />
                  </motion.div>
                ))}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && properties.length === 12 && (
          <div className="mt-10 flex justify-center">
            <Button variant="outline" size="lg" onClick={() => setPage((p) => p + 1)}>
              Load More Properties
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
