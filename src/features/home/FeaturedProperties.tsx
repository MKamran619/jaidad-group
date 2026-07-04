import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowRight } from 'react-icons/fi'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { PropertyCard } from '@/features/properties/PropertyCard'
import { PropertyCardSkeleton } from '@/components/ui/Skeleton'
import { buttonVariants } from '@/components/ui/Button'
import { useFeaturedProperties } from '@/hooks/useProperties'

export function FeaturedProperties() {
  const { data, isLoading } = useFeaturedProperties(6)
  const properties = data?.properties ?? []

  if (!isLoading && properties.length === 0) return null

  return (
    <section className="section-padding bg-[var(--background)]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <SectionHeader
            label="Premium Listings"
            title="Featured"
            highlightedWord="Properties"
            description="Handpicked premium properties for discerning buyers and investors"
            align="left"
            className="mb-0"
          />
          <Link to="/properties" className={buttonVariants({ variant: 'outline', size: 'md' }) + ' flex-shrink-0'}>
            View All Properties <FiArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <PropertyCardSkeleton key={i} />)
            : properties.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <PropertyCard property={p} />
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  )
}
