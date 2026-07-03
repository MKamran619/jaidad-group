import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { useSettings } from '@/hooks/useSettings'
import { supabase } from '@/lib/supabase/client'

const CATEGORY_DEFS = [
  { label: 'Residential', type: 'residential', imageKey: 'category_image_residential' },
  { label: 'Apartments',  type: 'apartment',   imageKey: 'category_image_apartment'   },
  { label: 'Commercial',  type: 'commercial',  imageKey: 'category_image_commercial'  },
  { label: 'Plots & Land',type: 'plot',        imageKey: 'category_image_plot'        },
  { label: 'Farm Houses', type: 'farmhouse',   imageKey: 'category_image_farmhouse'   },
  { label: 'Offices',     type: 'office',      imageKey: 'category_image_office'      },
]

export function PropertyCategories() {
  const { data: settings } = useSettings()

  const { data: countMap } = useQuery<Record<string, number>>({
    queryKey: ['property-category-counts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('property_type')
        .eq('is_active', true)
      if (error) throw error
      const map: Record<string, number> = {}
      for (const row of (data ?? [])) {
        const t = (row as { property_type: string }).property_type
        map[t] = (map[t] ?? 0) + 1
      }
      return map
    },
    staleTime: 1000 * 60 * 5,
  })

  return (
    <section className="section-padding bg-[var(--color-surface)]">
      <div className="container mx-auto px-4">
        <SectionHeader
          label="Browse by Type"
          title="Property"
          highlightedWord="Categories"
          description="Explore our diverse portfolio across all property types"
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORY_DEFS.map((cat, i) => {
            const image = settings?.[cat.imageKey] as string | undefined
            const count = countMap?.[cat.type]
            return (
              <motion.div
                key={cat.label}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  to={`/properties?type=${cat.type}`}
                  className="group relative flex flex-col items-center justify-center h-36 rounded-2xl overflow-hidden text-center"
                >
                  {image ? (
                    <img
                      src={image}
                      alt={cat.label}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-brand-black)] via-[var(--color-brand-black)] to-[var(--color-brand-gold)]/20" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 group-hover:from-black/90 transition-all" />
                  <div className="relative z-10 flex flex-col items-center gap-1">
                    <span className="font-display font-bold text-white text-sm">{cat.label}</span>
                    {count != null && count > 0 && (
                      <span className="text-[var(--color-brand-gold)] text-xs font-semibold">{count}+</span>
                    )}
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
