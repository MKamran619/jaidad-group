import { motion } from 'framer-motion'
import { FiShield, FiTrendingUp, FiHome, FiUsers, FiAward, FiClock } from 'react-icons/fi'
import type { IconType } from 'react-icons'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { useSettings } from '@/hooks/useSettings'

const ICON_MAP: Record<string, IconType> = {
  FiShield, FiTrendingUp, FiHome, FiUsers, FiAward, FiClock,
}

interface Reason {
  icon: string
  title: string
  description: string
  color: string
}

export function WhyChooseUs() {
  const { data: settings, isLoading } = useSettings()
  const reasons: Reason[] = (settings?.['why_choose_us'] as Reason[] | undefined) ?? []

  if (!isLoading && reasons.length === 0) return null

  return (
    <section className="section-padding bg-[var(--color-surface)]">
      <div className="container mx-auto px-4">
        <SectionHeader
          label="Why Jaidad Group"
          title="Why Choose"
          highlightedWord="Us"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-7 h-44 shimmer" />
              ))
            : reasons.map((reason, i) => {
                const Icon = ICON_MAP[reason.icon] ?? FiShield
                return (
                  <motion.div
                    key={reason.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="group relative rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-7 hover:border-[var(--color-brand-gold)]/50 hover:shadow-lg transition-all duration-300"
                  >
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${reason.color} shadow-lg mb-5`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-[var(--color-text)] mb-2">{reason.title}</h3>
                    <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{reason.description}</p>
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl bg-gradient-to-r from-[var(--color-brand-gold)] to-[var(--color-brand-gold-dark)] scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                  </motion.div>
                )
              })}
        </div>
      </div>
    </section>
  )
}
