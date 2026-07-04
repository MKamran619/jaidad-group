import { useQuery } from '@tanstack/react-query'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import { FiStar } from 'react-icons/fi'
import { FaQuoteLeft } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { supabase } from '@/lib/supabase/client'
import type { Testimonial } from '@/types/database'

export function TestimonialsSection() {
  const { data: testimonials, isLoading } = useQuery<Testimonial[]>({
    queryKey: ['testimonials-home'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
      if (error) throw error
      return (data ?? []) as Testimonial[]
    },
    staleTime: 1000 * 60 * 10,
  })

  if (!isLoading && (!testimonials || testimonials.length === 0)) return null

  return (
    <section className="section-padding bg-[var(--surface)] relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, var(--text) 1px, transparent 0)', backgroundSize: '32px 32px' }}
      />
      <div className="container relative mx-auto px-4">
        <SectionHeader
          label="Client Stories"
          title="What Our"
          highlightedWord="Clients Say"
          description="Real experiences from our satisfied clients across Pakistan"
        />

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-2xl glass p-7 h-48 shimmer" />
            ))}
          </div>
        ) : (
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-12"
          >
            {testimonials!.map((t, i) => (
              <SwiperSlide key={t.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="glass rounded-2xl p-7 h-full flex flex-col gap-4"
                >
                  <FaQuoteLeft className="text-[var(--primary)] h-6 w-6 opacity-60" />

                  <div className="flex gap-1">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <FiStar key={j} className="h-4 w-4 fill-[var(--primary)] text-[var(--primary)]" />
                    ))}
                  </div>

                  <p className="text-[var(--text)]/80 text-sm leading-relaxed flex-1">"{t.review}"</p>

                  {t.property_purchased && (
                    <p className="text-[var(--primary)] text-xs font-medium">{t.property_purchased}</p>
                  )}

                  <div className="flex items-center gap-3 pt-3 border-t border-[var(--border)]">
                    {t.image ? (
                      <img
                        src={t.image}
                        alt={t.name}
                        className="h-10 w-10 rounded-full object-cover ring-2 ring-[var(--primary)]/30"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-[var(--primary)] flex items-center justify-center text-white font-bold text-sm">
                        {t.name[0]}
                      </div>
                    )}
                    <div>
                      <p className="text-[var(--text)] font-semibold text-sm">{t.name}</p>
                      {t.designation && (
                        <p className="text-[var(--text-muted)] text-xs">{t.designation}{t.company ? ` · ${t.company}` : ''}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  )
}
