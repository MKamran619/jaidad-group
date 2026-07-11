import { useState, useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import {
  FiArrowRight,
  FiCheck,
  FiChevronDown,
  FiCompass,
  FiHome,
  FiLayers,
  FiPhone,
  FiShield,
  FiStar,
  FiTool,
  FiTrendingUp,
  FiUsers,
} from 'react-icons/fi'
import type { IconType } from 'react-icons'
import { FaWhatsapp } from 'react-icons/fa'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { buttonVariants } from '@/components/ui/Button'
import { useSettings } from '@/hooks/useSettings'
import { cn } from '@/lib/utils/cn'

interface ServicePreview {
  icon: IconType
  title: string
  description: string
}

interface DetailService {
  title: string
  subtitle: string
  description: string
  benefits: string[]
  includes: string[]
  image: string
  reverse?: boolean
}

const servicePreviews: ServicePreview[] = [
  {
    icon: FiLayers,
    title: 'Turnkey Construction',
    description: 'End-to-end project delivery from design to the final handover, with premium finishes and project control.',
  },
  {
    icon: FiHome,
    title: 'Construction with Material',
    description: 'Complete construction execution including high-quality material procurement and site supervision.',
  },
  {
    icon: FiTool,
    title: 'Labour Contract (Without Material)',
    description: 'Skilled labour and site management for clients who supply their own materials and want reliable execution.',
  },
  {
    icon: FiTrendingUp,
    title: 'Percentage-Based Construction',
    description: 'Flexible contract model where payment follows construction progress in transparent percentage milestones.',
  },
  {
    icon: FiCompass,
    title: 'Construction Consultancy',
    description: 'Expert guidance on project planning, approvals, BOQs, and construction strategy for smoother delivery.',
  },
  {
    icon: FiShield,
    title: 'Grey Structure Construction',
    description: 'Strong structural building work including foundation, columns, slabs, and weatherproof shell completion.',
  },
  {
    icon: FiStar,
    title: 'Renovation & Remodeling',
    description: 'Modern renovation solutions for refreshed interiors, facades, and improved living spaces with quality finishes.',
  },
]

const detailedServices: DetailService[] = [
  {
    title: 'Turnkey Construction',
    subtitle: 'Complete delivery, one contract, premium finish',
    description:
      'Our Turnkey Construction package gives you a complete, hassle-free home building experience. We manage everything from design coordination and material planning to execution, quality assurance, and final handover.',
    benefits: ['Single point of accountability', 'Premium material selection', 'Detailed BOQ and transparent costing', 'Dedicated project management'],
    includes: ['Design review and approvals', 'Procurement of premium materials', 'Construction execution', 'Finishing, fixtures, and handover'],
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Construction with Material',
    subtitle: 'Material-inclusive execution with expert supervision',
    description:
      'This service model includes the procurement and management of construction materials on your behalf. We ensure quality products are sourced, delivered on time, and installed correctly throughout the build.',
    benefits: ['Quality-controlled materials', 'Vendor management', 'Accurate material planning', 'Cost efficiency through bulk sourcing'],
    includes: ['Material procurement', 'Inventory tracking', 'Site supervision', 'Quality checks at every stage'],
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    reverse: true,
  },
  {
    title: 'Labour Contract (Without Material)',
    subtitle: 'Skilled execution when you supply the materials',
    description:
      'This option is ideal if you already have the material supply chain in place. We provide experienced labour, technical supervision, and structured site management to deliver the build to specification.',
    benefits: ['Skilled workforce', 'Efficient site coordination', 'Reduced client procurement responsibility', 'Strict quality standards'],
    includes: ['Labour deployment', 'Daily site supervision', 'Work scheduling', 'Quality inspection'],
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Percentage-Based Construction',
    subtitle: 'Flexible milestone-based payment model',
    description:
      'Our percentage-based construction offering allows you to pay in clear stages based on completed work. This model gives you control and visibility while ensuring progress aligns with your budget.',
    benefits: ['Transparent milestone billing', 'Aligned incentives', 'Easier budget planning', 'Progress-based accountability'],
    includes: ['Milestone planning', 'Regular progress reports', 'Transparent invoicing', 'Completion verification'],
    image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
    reverse: true,
  },
  {
    title: 'Construction Consultancy',
    subtitle: 'Expert advice for smarter project decisions',
    description:
      'Our consultancy service helps you navigate approvals, select the right construction model, and refine your project scope for efficient, cost-effective execution.',
    benefits: ['Project feasibility guidance', 'BOQ review', 'Approval support', 'Construction strategy planning'],
    includes: ['Site assessment', 'Technical consultation', 'Cost optimization advice', 'Execution recommendations'],
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Grey Structure Construction',
    subtitle: 'Strong foundation and structural shell delivery',
    description:
      'We build the structural core of your home with precise engineering, quality reinforcement, and trusted construction practices that form the base for future finishing work.',
    benefits: ['Trusted structural engineering', 'Quality concrete work', 'Accurate reinforcement placement', 'Clear structural milestones'],
    includes: ['Foundations and footings', 'Columns and beams', 'Slab and roof work', 'Masonry and rough plumbing'],
    image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80',
    reverse: true,
  },
  {
    title: 'Renovation & Remodeling',
    subtitle: 'Refresh, expand, and modernize existing spaces',
    description:
      'Our renovation service reinvigorates homes with modern design, functional layouts, and high-quality finishes, helping you transform your existing property into a contemporary living space.',
    benefits: ['Stylish interior updates', 'Improved space planning', 'Quality finish execution', 'Minimal disruption with smart staging'],
    includes: ['Renovation planning', 'Interior refinish', 'Structural adjustments', 'Detail-oriented finishes'],
    image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
  },
]

const whyChooseUs = [
  {
    icon: FiShield,
    title: 'Trusted Quality',
    description: 'Premium materials and rigorous inspections ensure every project meets our highest durability standards.',
  },
  {
    icon: FiUsers,
    title: 'Dedicated Project Management',
    description: 'A single point of contact keeps communication clear, timelines on track, and work aligned with your vision.',
  },
  {
    icon: FiLayers,
    title: 'Transparent Pricing',
    description: 'Clear estimates, BOQ-based planning, and milestone reporting make project costs easy to understand.',
  },
  {
    icon: FiStar,
    title: 'Premium Finishes',
    description: 'We deliver refined results with careful detailing, modern styling, and reliability in every finish.',
  },
]

const processSteps = [
  { step: '01', title: 'Consultation', description: 'Understand your goals, plot, and preferred construction outcomes.' },
  { step: '02', title: 'Design & Planning', description: 'Refine layouts, approvals, and BOQ estimates before work begins.' },
  { step: '03', title: 'Material Selection', description: 'Choose trusted materials and brands to match quality expectations.' },
  { step: '04', title: 'Construction', description: 'Execute the build with experienced teams and disciplined supervision.' },
  { step: '05', title: 'Finishing', description: 'Install finishes, fixtures, and details with craftsmanship and precision.' },
  { step: '06', title: 'Handover', description: 'Complete handover with quality checks, walkthroughs, and support.' },
]

const testimonials = [
  {
    name: 'Ayesha Khan',
    role: 'Homeowner, Islamabad',
    quote: 'They delivered a beautiful home on schedule and kept everything transparent throughout the build.',
  },
  {
    name: 'Hassan Ali',
    role: 'Project Owner, B-17',
    quote: 'Top-quality materials and excellent site supervision made the renovation process smooth.',
  },
  {
    name: 'Sana Malik',
    role: 'Client, DHA Islamabad',
    quote: 'Professional communication and strong execution — the finished home exceeded our expectations.',
  },
]

const faqs = [
  {
    question: 'What types of construction services do you offer?',
    answer: 'We offer turnkey construction, material-inclusive builds, labour-only contracts, percentage-based models, grey structure work, consultancy, and renovation services.',
  },
  {
    question: 'Do you provide cost estimates before starting work?',
    answer: 'Yes, every project begins with a transparent estimate and BOQ guidance so you can make an informed decision.',
  },
  {
    question: 'How do you ensure material quality?',
    answer: 'We source trusted brands, inspect deliveries, and manage material usage carefully throughout construction.',
  },
  {
    question: 'Can you handle both new builds and renovations?',
    answer: 'Absolutely. Our team is experienced in new construction, grey structure projects, and complex renovation work.',
  },
]

export function ConstructionPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const { data: settings } = useSettings()

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})
  const [activeServiceId, setActiveServiceId] = useState<string | null>(null)
  const [hoveredServiceId, setHoveredServiceId] = useState<string | null>(null)
  const HEADER_OFFSET = 96

  const slugify = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

  useEffect(() => {
    const ids = detailedServices.map((s) => slugify(s.title))
    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    if (!elements.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (visible?.target?.id) {
          setActiveServiceId(visible.target.id)
        }
      },
      { root: null, rootMargin: '-20% 0px -55% 0px', threshold: [0.2, 0.4, 0.6] }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const scrollToSection = (id: string) => {
    const target = document.getElementById(id)
    if (!target) return
    const top = target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET
    window.scrollTo({ top, behavior: 'smooth' })
    setActiveServiceId(id)
  }

  const phone = settings?.['phone'] as string | undefined
  const whatsapp = (settings?.['whatsapp'] as string | undefined)?.replace(/\D/g, '')
  const ctaLink = whatsapp ? `https://wa.me/${whatsapp}` : phone ? `tel:${phone}` : '#contact'

  return (
    <>
      <Helmet>
        <title>Construction Services � J+ Jaidad Group</title>
        <meta
          name="description"
          content="Premium construction services in Pakistan. Turnkey construction, material-inclusive builds, consultancy, renovation, and structural services by J+ Jaidad Group."
        />
      </Helmet>

      <main className="bg-white text-[var(--text)]">
        <section className="relative overflow-hidden bg-slate-900 text-white">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/85 via-slate-950/65 to-slate-950/75" />
          <div className="relative z-10 container mx-auto px-4 py-24 sm:py-28">
            <div className="max-w-3xl">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <p className="text-sm uppercase tracking-[0.32em] text-[var(--primary)] mb-4">Construction Services</p>
                <h1 className="font-display text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
                  Professional House Construction Services
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200/90">
                  From Grey Structure to Complete Turnkey Construction, we provide reliable, transparent, and high-quality construction solutions tailored to your project.
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <a href={ctaLink} className={cn(buttonVariants({ variant: 'primary', size: 'lg' }), 'inline-flex items-center gap-3')}>
                    Get Free Estimate <FiArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="bg-[var(--background)] py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <p className="text-sm uppercase tracking-[0.3em] text-[var(--primary)]">Our Construction Services</p>
              <h2 className="mt-4 font-display text-3xl font-black text-[var(--text)] sm:text-4xl">
                Our Construction Services
              </h2>
              <p className="mt-6 text-sm leading-7 text-[var(--text-muted)] sm:text-base">
                We provide multiple construction service options to meet different client needs, from fully managed turnkey projects to specialised labour and consultancy services.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {servicePreviews.map((service, index) => {
                const Icon = service.icon
                const id = slugify(service.title)
                const isHovered = hoveredServiceId === id
                const isHighlighted = isHovered
                return (
                  <motion.a
                    key={service.title}
                    href={`#${id}`}
                    onClick={(event) => {
                      event.preventDefault()
                      scrollToSection(id)
                    }}
                    onMouseEnter={() => setHoveredServiceId(id)}
                    onMouseLeave={() => setHoveredServiceId(null)}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    className={cn(
                      'group flex h-full flex-col rounded-[2rem] border p-8 shadow-sm transition-all duration-300',
                      isHighlighted
                        ? 'border-[var(--primary)] bg-[var(--primary)]/10 shadow-[0_18px_50px_rgba(59,130,246,0.12)] -translate-y-1.5'
                        : 'border-[var(--border)] bg-white hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(15,23,42,0.08)]'
                    )}
                  >
                    <div className={cn(
                      'mb-6 inline-flex h-14 w-14 items-center justify-center rounded-3xl transition-colors duration-300',
                      isHighlighted ? 'bg-[var(--primary)]/15 text-[var(--primary)]' : 'bg-[var(--primary)]/10 text-[var(--primary)] group-hover:bg-[var(--primary)]/15'
                    )}>
                      <Icon className={cn('h-6 w-6 transition-colors duration-300', isHighlighted ? 'text-[var(--primary)]' : 'text-[var(--primary)]')} />
                    </div>
                    <h3 className="font-display text-xl font-semibold text-[var(--text)] mb-3">{service.title}</h3>
                    <p className="text-sm leading-7 text-[var(--text-muted)] flex-1">{service.description}</p>
                    <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-[var(--primary)] transition-all duration-300">
                      <span>Click for Details</span>
                      <span className="inline-flex transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </div>
                  </motion.a>
                )
              })}
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="container mx-auto px-4">
            {detailedServices.map((service, index) => {
              const id = slugify(service.title)
              return (
                <motion.div
                  id={id}
                  key={service.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  ref={(el) => {
                    sectionRefs.current[id] = el
                  }}
                  className={cn(
                    'mb-20 grid gap-10 lg:grid-cols-2 lg:items-center',
                    service.reverse ? 'lg:grid-flow-col-dense' : ''
                  )}
                >
                  <div className="relative overflow-hidden rounded-[2rem] bg-[var(--surface)] shadow-sm">
                    <img src={service.image} alt={service.title} className="h-full w-full min-h-[360px] object-cover" />
                  </div>
                  <div className="max-w-2xl">
                    <p className="text-sm uppercase tracking-[0.28em] text-[var(--primary)] mb-4">{service.subtitle}</p>
                    <h2 className="font-display text-3xl font-black text-[var(--text)] sm:text-4xl">{service.title}</h2>
                    <p className="mt-6 text-base leading-8 text-[var(--text-muted)]">{service.description}</p>
                    <div className="mt-8 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6">
                        <p className="text-sm font-semibold text-[var(--text)]">Key Benefits</p>
                        <ul className="mt-4 space-y-3 text-sm text-[var(--text-muted)]">
                          {service.benefits.map((item) => (
                            <li key={item} className="flex items-start gap-3">
                              <FiCheck className="mt-1 h-4 w-4 flex-shrink-0 text-[var(--primary)]" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6">
                        <p className="text-sm font-semibold text-[var(--text)]">What&apos;s Included</p>
                        <ul className="mt-4 space-y-3 text-sm text-[var(--text-muted)]">
                          {service.includes.map((item) => (
                            <li key={item} className="flex items-start gap-3">
                              <FiCheck className="mt-1 h-4 w-4 flex-shrink-0 text-[var(--primary)]" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="mt-8">
                      <a href={ctaLink} className={cn(buttonVariants({ variant: 'primary', size: 'md' }), 'inline-flex items-center gap-3')}>
                        Get Free Estimate <FiArrowRight className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </section>

        <section className="bg-[var(--background)] py-20">
          <div className="container mx-auto px-4">
            <SectionHeader
              label="Why Choose Us"
              title="Why Clients Trust Our Construction Team"
              highlightedWord="Trust"
              description="We combine premium materials, transparent pricing, and dedicated management to deliver projects that feel elevated and dependable."
              className="mb-12"
            />
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {whyChooseUs.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="rounded-[2rem] border border-[var(--border)] bg-white p-8 shadow-sm"
                >
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-[var(--primary)]/10 text-[var(--primary)]">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-[var(--text)] mb-3">{item.title}</h3>
                  <p className="text-sm leading-7 text-[var(--text-muted)]">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="container mx-auto px-4">
            <SectionHeader
              label="Our Process"
              title="Our Construction Process"
              highlightedWord="Process"
              description="A clear, disciplined process keeps your project on time and aligned with quality expectations from start to finish."
              className="mb-12"
            />
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {processSteps.map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="rounded-[2rem] border border-[var(--border)] bg-[var(--background)] p-8 shadow-sm"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[var(--primary)]/10 text-[var(--primary)] font-display text-lg font-black">
                    {item.step}
                  </div>
                  <h3 className="mt-5 font-display text-xl font-semibold text-[var(--text)]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[var(--background)] py-20">
          <div className="container mx-auto px-4">
            <SectionHeader
              label="Testimonials"
              title="What Our Clients Say"
              highlightedWord="Clients"
              description="Read how our construction approach delivered confidence, quality, and peace of mind for homeowners."
              className="mb-12"
            />
            <div className="grid gap-6 md:grid-cols-3">
              {testimonials.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="rounded-[2rem] border border-[var(--border)] bg-white p-8 shadow-sm"
                >
                  <div className="text-[var(--text-muted)] text-4xl leading-none">�</div>
                  <p className="mt-6 text-sm leading-8 text-[var(--text-muted)]">{item.quote}</p>
                  <div className="mt-8">
                    <p className="font-semibold text-[var(--text)]">{item.name}</p>
                    <p className="text-sm text-[var(--text-muted)]">{item.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-20" id="contact">
          <div className="container mx-auto px-4">
            <div className="grid gap-10 lg:grid-cols-[0.95fr_0.85fr] lg:items-center">
              <div>
                <SectionHeader
                  label="Get Started"
                  title="Start Your Construction Project Today"
                  highlightedWord="Today"
                  description="Reach out now to discuss your plot, preferred construction type, or renovation project with our expert team."
                  className="mb-8"
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--background)] p-6 shadow-sm">
                    <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--primary)]">Call Us</p>
                    <p className="mt-4 text-lg font-semibold text-[var(--text)]">{phone ?? '+92 300 0000000'}</p>
                    <p className="mt-2 text-sm text-[var(--text-muted)]">Speak with our construction team for a personalized estimate.</p>
                  </div>
                  <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--background)] p-6 shadow-sm">
                    <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--primary)]">WhatsApp</p>
                    <p className="mt-4 text-lg font-semibold text-[var(--text)]">{whatsapp ? `+${whatsapp}` : 'WhatsApp Available'}</p>
                    <p className="mt-2 text-sm text-[var(--text-muted)]">Quick consultation, progress updates, and direct support.</p>
                  </div>
                </div>
              </div>
              <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-xl">
                <p className="text-sm uppercase tracking-[0.28em] text-[var(--primary)] mb-4">Free Estimate</p>
                <h2 className="font-display text-3xl font-black text-[var(--text)]">Ready to plan your next build?</h2>
                <p className="mt-5 text-sm leading-7 text-[var(--text-muted)]">
                  Connect with us and get a tailored estimate, material guidance, and project planning support in just a few steps.
                </p>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <a href={ctaLink} className={cn(buttonVariants({ variant: 'primary', size: 'lg' }), 'inline-flex items-center justify-center gap-3')}>
                    Get Free Estimate <FiArrowRight className="h-4 w-4" />
                  </a>
                  {whatsapp && (
                    <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer" className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'inline-flex items-center justify-center gap-3')}>
                      <FaWhatsapp className="h-4 w-4" /> WhatsApp Now
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[var(--background)] py-20">
          <div className="container mx-auto px-4 max-w-5xl">
            <SectionHeader
              label="Frequently Asked Questions"
              title="Frequently Asked Questions"
              highlightedWord="Questions"
              description="Answers to the most common questions about our construction services, pricing, and process."
              className="mb-12"
            />
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={faq.question} className="rounded-[2rem] border border-[var(--border)] bg-white p-6 shadow-sm">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="flex w-full items-center justify-between gap-4 text-left"
                  >
                    <span className="font-semibold text-[var(--text)]">{faq.question}</span>
                    <FiChevronDown className={cn('h-5 w-5 text-[var(--text-muted)] transition-transform duration-200', openFaq === index && 'rotate-180')} />
                  </button>
                  {openFaq === index && (
                    <p className="mt-4 text-sm leading-7 text-[var(--text-muted)]">{faq.answer}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
