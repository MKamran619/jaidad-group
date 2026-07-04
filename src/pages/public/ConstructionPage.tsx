import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { FiCheck, FiChevronDown, FiStar, FiTool, FiLayers, FiHome, FiShield, FiPhone } from 'react-icons/fi'
import type { IconType } from 'react-icons'
import { FaWhatsapp } from 'react-icons/fa'
import { useQuery } from '@tanstack/react-query'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { buttonVariants } from '@/components/ui/Button'
import { CTASection } from '@/features/home/CTASection'
import { useSettings } from '@/hooks/useSettings'
import { supabase } from '@/lib/supabase/client'
import { cn } from '@/lib/utils/cn'
import type { ConstructionService } from '@/types/database'

const SERVICE_ICON_MAP: Record<string, IconType> = {
  FiLayers, FiTool, FiHome, FiShield,
}

interface ProcessStep { step: string; title: string; description: string }
interface Package { name: string; price: string; per: string; popular: boolean; features: string[] }
interface Faq { q: string; a: string }

export function ConstructionPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const { data: settings } = useSettings()

  const phone     = settings?.['phone']    as string | undefined
  const whatsapp  = (settings?.['whatsapp'] as string | undefined)?.replace(/\D/g, '')

  const statsProjects  = settings?.['construction_stat_projects']  as string | undefined
  const statsYears     = settings?.['construction_stat_years']     as string | undefined
  const statsQuality   = settings?.['construction_stat_quality']   as string | undefined
  const statsEngineers = settings?.['construction_stat_engineers'] as string | undefined

  const statItems = [
    { value: statsProjects,  label: 'Projects Completed' },
    { value: statsYears,     label: 'Years Experience'   },
    { value: statsQuality,   label: 'Quality Guarantee'  },
    { value: statsEngineers, label: 'Expert Engineers'   },
  ].filter((s) => s.value)

  const process:  ProcessStep[] = (settings?.['construction_process']  as ProcessStep[]  | undefined) ?? []
  const packages: Package[]     = (settings?.['construction_packages'] as Package[]     | undefined) ?? []
  const faqs:     Faq[]         = (settings?.['construction_faqs']     as Faq[]         | undefined) ?? []

  const { data: services, isLoading: servicesLoading } = useQuery<ConstructionService[]>({
    queryKey: ['construction-services-page'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('construction_services')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
      if (error) throw error
      return (data ?? []) as ConstructionService[]
    },
    staleTime: 1000 * 60 * 10,
  })

  return (
    <>
      <Helmet>
        <title>Construction Services – J+ Jaidad Group</title>
        <meta name="description" content="Premium construction services in Pakistan. Architecture, grey structure, finishing, and renovation by J+ Jaidad Group." />
      </Helmet>

      {/* Hero */}
      <div className="relative bg-[var(--background)] py-28 overflow-hidden">
        <div className="hero-bg-effects">
          <div className="grid-pattern" />
          <div className="gradient-orb orb-1" />
          <div className="gradient-orb orb-2" />
        </div>
        <div className="relative z-[2] container mx-auto px-4">
          <div className="max-w-2xl">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
              <p className="text-[var(--primary)] text-xs font-bold uppercase tracking-widest mb-4">Premium Construction</p>
              <h1 className="font-display text-4xl md:text-6xl font-black text-[var(--text)] mb-6 leading-tight">
                Build Your Dream <br />
                <span className="text-[var(--primary)]">Home With Us</span>
              </h1>
              <p className="text-[var(--text-muted)] text-lg mb-8 leading-relaxed">
                From architecture to finishing, we deliver turnkey construction solutions with unmatched quality and transparency.
              </p>
              <div className="flex flex-wrap gap-4">
                {phone && (
                  <a href={`tel:${phone}`} className={cn(buttonVariants({ variant: 'primary', size: 'lg' }))}>
                    <FiPhone className="h-4 w-4" /> Call for Free Quote
                  </a>
                )}
                {whatsapp && (
                  <a
                    href={`https://wa.me/${whatsapp}`}
                    target="_blank" rel="noreferrer"
                    className={cn(buttonVariants({ variant: 'glass', size: 'lg' }), 'bg-green-500/20 border-green-400/30 hover:bg-green-500/40')}
                  >
                    <FaWhatsapp className="h-4 w-4" /> WhatsApp
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      {statItems.length > 0 && (
        <div className="bg-[var(--primary)] py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {statItems.map((stat) => (
                <div key={stat.label}>
                  <p className="font-display text-3xl font-black text-white">{stat.value}</p>
                  <p className="text-white/80 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Services */}
      {(servicesLoading || (services ?? []).length > 0) && (
        <div className="section-padding bg-[var(--background)]">
          <div className="container mx-auto px-4">
            <SectionHeader
              label="What We Build"
              title="Our Construction"
              highlightedWord="Services"
              description="Comprehensive construction solutions from foundation to finishing"
              className="mb-12"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {servicesLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
                      <div className="h-48 shimmer bg-[var(--background)]" />
                      <div className="p-6 space-y-3">
                        <div className="h-5 w-2/3 rounded shimmer bg-[var(--background)]" />
                        <div className="h-4 w-full rounded shimmer bg-[var(--background)]" />
                      </div>
                    </div>
                  ))
                : (services ?? []).map((service, i) => {
                    const Icon = SERVICE_ICON_MAP[service.icon ?? ''] ?? FiTool
                    return (
                      <motion.div
                        key={service.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="group rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--surface)] hover:shadow-xl transition-all duration-300"
                      >
                        <div className="h-48 overflow-hidden bg-[var(--surface)]">
                          {service.image ? (
                            <img
                              src={service.image}
                              alt={service.title}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              loading="lazy"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <Icon className="h-12 w-12 text-[var(--text-muted)]/40" />
                            </div>
                          )}
                        </div>
                        <div className="p-6">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="h-10 w-10 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0">
                              <Icon className="h-5 w-5 text-[var(--primary)]" />
                            </div>
                            <h3 className="font-display text-lg font-bold text-[var(--text)]">{service.title}</h3>
                          </div>
                          <p className="text-sm text-[var(--text-muted)] mb-4 leading-relaxed">{service.description}</p>
                          {service.features?.length > 0 && (
                            <div className="grid grid-cols-2 gap-2">
                              {service.features.map((f) => (
                                <div key={f} className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                                  <FiCheck className="h-3.5 w-3.5 text-[var(--primary)] flex-shrink-0" />
                                  {f}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )
                  })}
            </div>
          </div>
        </div>
      )}

      {/* Process */}
      {process.length > 0 && (
        <div className="section-padding bg-[var(--surface)]">
          <div className="container mx-auto px-4">
            <SectionHeader label="How We Work" title="Our Construction" highlightedWord="Process" className="mb-12" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {process.map((step, i) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative p-6 rounded-2xl bg-[var(--background)] border border-[var(--border)]"
                >
                  <p className="font-display text-5xl font-black text-[var(--primary)]/20 mb-3 leading-none">{step.step}</p>
                  <h3 className="font-display text-lg font-bold text-[var(--text)] mb-2">{step.title}</h3>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Packages */}
      {packages.length > 0 && (
        <div className="section-padding bg-[var(--background)]">
          <div className="container mx-auto px-4">
            <SectionHeader label="Transparent Pricing" title="Construction" highlightedWord="Packages" className="mb-12" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {packages.map((pkg, i) => (
                <motion.div
                  key={pkg.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={cn(
                    'relative rounded-2xl border-2 p-6 bg-[var(--surface)]',
                    pkg.popular
                      ? 'border-[var(--primary)] ring-2 ring-[var(--primary)] ring-offset-2 ring-offset-[var(--background)]'
                      : 'border-[var(--border)]'
                  )}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="bg-[var(--primary)] text-white text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1 whitespace-nowrap">
                        <FiStar className="h-3 w-3" /> Most Popular
                      </span>
                    </div>
                  )}
                  <h3 className="font-display text-xl font-bold text-[var(--text)] mb-1">{pkg.name}</h3>
                  <p className="font-display text-2xl font-black text-[var(--primary)]">PKR {pkg.price}</p>
                  <p className="text-xs text-[var(--text-muted)] mb-5">{pkg.per}</p>
                  <ul className="space-y-2.5 mb-6">
                    {pkg.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-[var(--text-muted)]">
                        <FiCheck className="h-4 w-4 text-[var(--primary)] flex-shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  {phone && (
                    <a
                      href={`tel:${phone}`}
                      className={cn(buttonVariants({ variant: pkg.popular ? 'primary' : 'outline' }), 'w-full justify-center')}
                    >
                      Get Quote
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <div className="section-padding bg-[var(--surface)]">
          <div className="container mx-auto px-4 max-w-3xl">
            <SectionHeader label="Questions & Answers" title="Frequently Asked" highlightedWord="Questions" className="mb-12" />
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="rounded-2xl border border-[var(--border)] bg-[var(--background)] overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between gap-4 p-5 text-left"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="font-semibold text-[var(--text)] text-sm">{faq.q}</span>
                    <FiChevronDown className={cn('h-4 w-4 text-[var(--text-muted)] flex-shrink-0 transition-transform duration-200', openFaq === i && 'rotate-180')} />
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5">
                      <p className="text-sm text-[var(--text-muted)] leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <CTASection />
    </>
  )
}
