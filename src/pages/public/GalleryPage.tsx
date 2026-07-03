import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiChevronLeft, FiChevronRight, FiZoomIn } from 'react-icons/fi'
import { useQuery } from '@tanstack/react-query'
import { GALLERY_CATEGORIES } from '@/lib/utils/constants'
import { supabase } from '@/lib/supabase/client'
import { cn } from '@/lib/utils/cn'
import type { GalleryItem } from '@/types/database'

function GallerySkeleton() {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="break-inside-avoid rounded-2xl overflow-hidden shimmer bg-[var(--color-surface)]"
          style={{ height: i % 3 === 0 ? '280px' : i % 3 === 1 ? '200px' : '240px' }}
        />
      ))}
    </div>
  )
}

export function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const { data: allItems, isLoading } = useQuery<GalleryItem[]>({
    queryKey: ['gallery-page'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
      if (error) throw error
      return (data ?? []) as GalleryItem[]
    },
    staleTime: 1000 * 60 * 5,
  })

  const filtered = activeCategory === 'All'
    ? (allItems ?? [])
    : (allItems ?? []).filter((item) => item.category === activeCategory)

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setLightboxIndex(null)
    document.body.style.overflow = ''
  }

  const prev = () => setLightboxIndex((i) => (i == null || i === 0) ? filtered.length - 1 : i - 1)
  const next = () => setLightboxIndex((i) => (i == null || i === filtered.length - 1) ? 0 : i + 1)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [lightboxIndex, filtered.length])

  return (
    <>
      <Helmet>
        <title>Gallery – J+ Jaidad Group</title>
        <meta name="description" content="Browse our photo gallery showcasing premium properties, projects, and construction work by J+ Jaidad Group." />
      </Helmet>

      {/* Hero */}
      <div className="bg-[var(--color-brand-black)] py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="text-[var(--color-brand-gold)] text-xs font-bold uppercase tracking-widest mb-3">Visual Portfolio</p>
          <h1 className="font-display text-4xl md:text-5xl font-black text-white mb-4">
            Our <span className="text-[var(--color-brand-gold)]">Gallery</span>
          </h1>
          <p className="text-white/60 max-w-xl mx-auto text-sm">
            Explore our collection of premium properties, ongoing projects, and construction work across Pakistan.
          </p>
        </motion.div>
      </div>

      {/* Filter */}
      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)] sticky top-[73px] z-10">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 py-3 overflow-x-auto scrollbar-none">
            {GALLERY_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'px-5 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex-shrink-0',
                  activeCategory === cat
                    ? 'bg-[var(--color-brand-gold)] text-white'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-background)]'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="section-padding bg-[var(--color-background)]">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <GallerySkeleton />
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-[var(--color-text-muted)] text-lg">No gallery items found.</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-[var(--color-text-muted)] mb-6">{filtered.length} photos</p>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4"
                >
                  {filtered.map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className="break-inside-avoid group relative cursor-pointer overflow-hidden rounded-2xl"
                      onClick={() => openLightbox(i)}
                    >
                      <img
                        src={item.thumbnail ?? item.url}
                        alt={item.title}
                        className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                        <FiZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <p className="text-white text-xs font-medium truncate">{item.title}</p>
                        <p className="text-white/60 text-xs">{item.category}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </>
          )}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && filtered[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <button
              className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
              onClick={closeLightbox}
              aria-label="Close"
            >
              <FiX className="h-6 w-6" />
            </button>
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
              onClick={(e) => { e.stopPropagation(); prev() }}
              aria-label="Previous"
            >
              <FiChevronLeft className="h-6 w-6" />
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
              onClick={(e) => { e.stopPropagation(); next() }}
              aria-label="Next"
            >
              <FiChevronRight className="h-6 w-6" />
            </button>

            <motion.img
              key={lightboxIndex}
              src={filtered[lightboxIndex].url}
              alt={filtered[lightboxIndex].title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="max-h-[85vh] max-w-[85vw] object-contain rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            <div className="absolute bottom-6 text-center pointer-events-none">
              <p className="text-white font-medium text-sm">{filtered[lightboxIndex].title}</p>
              <p className="text-white/50 text-xs mt-0.5">{lightboxIndex + 1} / {filtered.length}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
