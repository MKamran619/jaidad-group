import { useRef, useEffect, useState } from 'react'
import { motion, animate, useInView } from 'framer-motion'
import { useSettings } from '@/hooks/useSettings'

function AnimatedCounter({ value, prefix, suffix }: { value: number; prefix: string; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, value, {
      duration: 2,
      ease: 'easeOut',
      onUpdate: (v) => setCount(Math.floor(v)),
    })
    return () => controls.stop()
  }, [inView, value])

  return <span ref={ref}>{prefix}{count}{suffix}</span>
}

function parseStatValue(raw: unknown): { value: number; prefix: string; suffix: string } {
  const str = String(raw ?? '0')
  const match = str.match(/^([^0-9]*)([0-9,]+)(.*)$/)
  if (!match) return { value: 0, prefix: '', suffix: str }
  return {
    prefix: match[1] ?? '',
    value: parseInt(match[2].replace(/,/g, '')),
    suffix: match[3] ?? '',
  }
}

export function StatsSection() {
  const { data: settings, isLoading } = useSettings()

  const statDefs = [
    { label: 'Properties Sold',     key: 'stats_properties' },
    { label: 'Happy Clients',       key: 'stats_clients'    },
    { label: 'Years of Experience', key: 'stats_years'      },
    { label: 'Cities Covered',      key: 'stats_cities'     },
    { label: 'Total Revenue',       key: 'stats_revenue'    },
    { label: 'Active Agents',       key: 'stats_agents'     },
  ]

  const stats = statDefs
    .map((def) => ({ label: def.label, raw: settings?.[def.key] }))
    .filter((s) => s.raw != null && s.raw !== '')

  if (!isLoading && stats.length === 0) return null

  return (
    <section className="relative py-20 overflow-hidden bg-[var(--color-brand-black)]">
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-full max-w-2xl bg-gradient-to-r from-transparent via-[var(--color-brand-gold)] to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-full max-w-2xl bg-gradient-to-r from-transparent via-[var(--color-brand-gold)] to-transparent" />

      <div className="container relative mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="h-10 w-24 rounded shimmer bg-white/10" />
                  <div className="h-3 w-20 rounded shimmer bg-white/10" />
                </div>
              ))
            : stats.map((stat, i) => {
                const parsed = parseStatValue(stat.raw)
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="flex flex-col items-center text-center gap-1"
                  >
                    <p className="font-display text-3xl md:text-4xl font-black text-[var(--color-brand-gold)]">
                      <AnimatedCounter value={parsed.value} prefix={parsed.prefix} suffix={parsed.suffix} />
                    </p>
                    <p className="text-xs text-white/50 uppercase tracking-widest">{stat.label}</p>
                  </motion.div>
                )
              })}
        </div>
      </div>
    </section>
  )
}
