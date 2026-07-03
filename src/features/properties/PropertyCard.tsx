import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Bed, Bath, Maximize2 } from 'lucide-react'
import { FiHeart, FiMapPin } from 'react-icons/fi'
import { Badge } from '@/components/ui/Badge'
import type { Property } from '@/types/database'
import { formatPrice, formatArea } from '@/lib/utils/format'
import { useSettings } from '@/hooks/useSettings'
import { cn } from '@/lib/utils/cn'

interface PropertyCardProps {
  property: Property
  className?: string
  compact?: boolean
}

const PURPOSE_COLORS: Record<string, string> = {
  sale: 'default',
  rent: 'info',
  construction: 'warning',
}

const STATUS_COLORS: Record<string, string> = {
  available: 'success',
  sold: 'danger',
  rented: 'info',
  under_construction: 'warning',
  off_plan: 'gold',
}

export function PropertyCard({ property, className, compact = false }: PropertyCardProps) {
  const { data: settings } = useSettings()
  const fallbackImage = String(settings?.['property_fallback_image'] ?? '')
  const image = property.images?.[0] || fallbackImage || null

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'group relative rounded-2xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm hover:shadow-xl transition-all duration-300',
        className
      )}
    >
      {/* Image */}
      <Link to={`/properties/${property.slug}`} className="block relative overflow-hidden">
        <div className={cn('relative overflow-hidden bg-[var(--color-surface-alt)]', compact ? 'h-44' : 'h-56')}>
          {image ? (
            <img
              src={image}
              alt={property.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full bg-[var(--color-brand-black)] flex items-center justify-center">
              <span className="text-white/30 text-sm">No image</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <Badge variant={PURPOSE_COLORS[property.property_purpose] as never}>
            {property.property_purpose === 'sale' ? 'For Sale' : property.property_purpose === 'rent' ? 'For Rent' : 'Construction'}
          </Badge>
          {property.is_featured && (
            <Badge variant="default" className="bg-[var(--color-brand-gold-dark)]">
              Featured
            </Badge>
          )}
        </div>

        {/* Wishlist */}
        <button
          className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 dark:bg-black/60 flex items-center justify-center text-[var(--color-text-muted)] hover:text-red-500 transition-colors shadow-sm"
          onClick={(e) => e.preventDefault()}
          aria-label="Add to wishlist"
        >
          <FiHeart className="h-4 w-4" />
        </button>

        {/* Status */}
        <div className="absolute bottom-3 left-3">
          <Badge variant={STATUS_COLORS[property.property_status] as never}>
            {property.property_status.replace('_', ' ')}
          </Badge>
        </div>
      </Link>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <p className="text-xs text-[var(--color-text-muted)] capitalize">{property.property_type}</p>
            <Link
              to={`/properties/${property.slug}`}
              className="font-display font-semibold text-[var(--color-text)] text-base hover:text-[var(--color-brand-gold)] transition-colors line-clamp-2 leading-tight mt-0.5"
            >
              {property.title}
            </Link>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-xs text-[var(--color-text-muted)] mb-3">
          <FiMapPin className="h-3 w-3 text-[var(--color-brand-gold)] flex-shrink-0" />
          <span className="truncate">{property.address}</span>
        </div>

        {/* Price */}
        <p className="font-display text-xl font-bold text-[var(--color-brand-gold)] mb-4">
          {formatPrice(property.price, property.currency)}
        </p>

        {/* Features */}
        {!compact && (
          <div className="flex items-center gap-4 py-3 border-t border-[var(--color-border)] text-xs text-[var(--color-text-muted)]">
            {property.bedrooms != null && (
              <span className="flex items-center gap-1">
                <Bed className="h-3.5 w-3.5" />
                {property.bedrooms} Beds
              </span>
            )}
            {property.bathrooms != null && (
              <span className="flex items-center gap-1">
                <Bath className="h-3.5 w-3.5" />
                {property.bathrooms} Baths
              </span>
            )}
            <span className="flex items-center gap-1 ml-auto">
              <Maximize2 className="h-3.5 w-3.5" />
              {formatArea(property.area, property.area_unit)}
            </span>
          </div>
        )}
      </div>
    </motion.article>
  )
}
