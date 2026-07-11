import { useEffect, useMemo, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiArrowRight,
  FiCheck,
  FiClock,
  FiCompass,
  FiHome,
  FiLayers,
  FiMapPin,
  FiMessageCircle,
  FiPhone,
  FiShield,
  FiStar,
  FiTool,
  FiTrendingUp,
  FiUsers,
  FiZap,
} from 'react-icons/fi'
import { FiCheckCircle, FiBox } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import type { IconType } from 'react-icons'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { cn } from '@/lib/utils/cn'
import { buttonVariants } from '@/components/ui/Button'

interface HighlightItem {
  icon: IconType
  title: string
  description: string
}

interface PackageCard {
  title: string
  subtitle: string
  price: string
  bestFor: string
  features: string[]
  includes: string[]
  highlight?: boolean
}

interface TimelineStep {
  title: string
  description: string
}

interface FactorItem {
  title: string
  description: string
}

interface ServiceItem {
  icon: IconType
  title: string
  description: string
}

interface ProjectCard {
  title: string
  image: string
  location: string
  plotSize: string
  status: string
  description: string
}

interface BrandItem {
  name: string
  description: string
}

interface Testimonial {
  name: string
  location: string
  review: string
  rating: number
  image: string
}

interface SectionNavItem {
  id: string
  title: string
  description: string
  icon: IconType
}

interface SectionFooterProps {
  currentId: string
  items: SectionNavItem[]
}

const sectionNavItems: SectionNavItem[] = [
  { id: 'build-a-refined-5-marla-home-in-islamabad-with-jaidad-group', title: '🏠 Build a Refined 5 Marla Home in Islamabad with Jaidad Group', description: 'Overview and value proposition', icon: FiHome },
  { id: 'cost-calculator', title: '🧮 5 Marla House Construction Cost Calculator', description: 'Quick estimate guidance', icon: FiTrendingUp },
  { id: 'why-homeowners-choose-our-construction-team', title: '⭐ Why Homeowners Choose Our Construction Team', description: 'What makes us different', icon: FiStar },
  { id: 'construction-packages', title: '📦 Flexible Packages for Every Build Stage', description: 'Choose the right package', icon: FiLayers },
  { id: 'construction-process', title: '🛠️ A Smooth Path From Concept to Handover', description: 'See how the journey works', icon: FiClock },
  { id: 'cost-factors', title: '💰 What Influences the Cost of Building Your 5 Marla Home', description: 'Key cost drivers', icon: FiBox },
  { id: 'essential-stages', title: '🏗️ Every Essential Stage of Your Home Build', description: 'Coverage from structure to finish', icon: FiTool },
  { id: 'premium-craftsmanship', title: '🏡 Homes Delivered with Premium Craftsmanship', description: 'Recent work and delivery quality', icon: FiShield },
  { id: 'trusted-products', title: '🧱 Trusted Products for Stronger, Longer-Lasting Homes', description: 'Brands and material quality', icon: FiCheckCircle },
]

const serviceCardItems = [
  {
    id: 'turnkey-construction',
    title: 'Turnkey Construction',
    description: 'End-to-end delivery with premium finishes and a single point of accountability.',
    icon: FiLayers,
    targetId: 'construction-packages',
  },
  {
    id: 'construction-with-material',
    title: 'Construction with Material',
    description: 'Material-inclusive execution with careful sourcing and quality control.',
    icon: FiHome,
    targetId: 'cost-factors',
  },
  {
    id: 'labour-contract',
    title: 'Labour Contract (Without Material)',
    description: 'Skilled labour and site supervision for projects where materials are client-supplied.',
    icon: FiTool,
    targetId: 'construction-process',
  },
  {
    id: 'percentage-based-construction',
    title: 'Percentage-Based Construction',
    description: 'Clear milestone-based billing aligned with construction progress.',
    icon: FiTrendingUp,
    targetId: 'construction-process',
  },
  {
    id: 'construction-consultancy',
    title: 'Construction Consultancy',
    description: 'Expert planning, approvals, and project guidance for smoother execution.',
    icon: FiCompass,
    targetId: 'why-homeowners-choose-our-construction-team',
  },
  {
    id: 'grey-structure-construction',
    title: 'Grey Structure Construction',
    description: 'Strong structural building work from foundation to roof shell.',
    icon: FiShield,
    targetId: 'essential-stages',
  },
  {
    id: 'renovation-remodeling',
    title: 'Renovation & Remodeling',
    description: 'Modern renovation solutions to refresh interiors and exterior living spaces.',
    icon: FiStar,
    targetId: 'premium-craftsmanship',
  },
]

function SectionFooter({ currentId, items }: SectionFooterProps) {
  const currentIndex = items.findIndex((item) => item.id === currentId)
  const nextItem = currentIndex >= 0 ? items[currentIndex + 1] : undefined

  const scrollToSection = (id: string) => {
    const target = document.getElementById(id)
    if (!target) return
    const top = target.getBoundingClientRect().top + window.scrollY - 96
    window.scrollTo({ top, behavior: 'smooth' })
  }

  return (
    <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border)] pt-6">
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:border-[var(--primary)] hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
      >
        <FiArrowRight className="h-4 w-4 rotate-180" /> Back to Top
      </button>
      {nextItem ? (
        <button
          type="button"
          onClick={() => scrollToSection(nextItem.id)}
          className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white transition hover:translate-y-[-1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
        >
          Next Section <FiArrowRight className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  )
}

const highlights: HighlightItem[] = [
  { icon: FiUsers, title: 'Experienced Engineers', description: 'A skilled team that brings precision to every stage of your 5 marla house construction project.' },
  { icon: FiShield, title: 'Premium Materials', description: 'We specify durable steel, cement, tiles, and finish products chosen for long-term performance.' },
  { icon: FiClock, title: 'On-Time Delivery', description: 'Clear milestones and disciplined scheduling keep the build moving without avoidable delays.' },
  { icon: FiTrendingUp, title: 'Transparent Pricing', description: 'Every estimate is explained in a practical BOQ format so you know exactly where the budget goes.' },
  { icon: FiCheckCircle, title: 'Quality Assurance', description: 'Our construction checklist covers inspection, compliance, and finish standards at every stage.' },
  { icon: FiCompass, title: 'Daily Site Updates', description: 'Clients receive regular progress reports, photos, and site guidance for complete confidence.' },
  { icon: FiLayers, title: 'BOQ-Based Estimation', description: 'Structured quantities and accurate costing help you plan smartly from grey structure to handover.' },
  { icon: FiHome, title: 'Dedicated Project Manager', description: 'One point of contact ensures communication stays smooth from consultation to final execution.' },
]

const packages: PackageCard[] = [
  {
    title: 'Grey Structure',
    subtitle: 'Solid foundation, reliable structure',
    price: 'From PKR 12.5 Lakh',
    bestFor: 'Clients who want a strong structural base and phased completion',
    features: ['Foundation and footing', 'Column and beam work', 'Roof slab and lintels', 'Brickwork and plaster base'],
    includes: ['Structural drawings review', 'Material planning', 'Site supervision', 'Progress tracking'],
  },
  {
    title: 'Finishing',
    subtitle: 'Elegant interiors and premium finishing',
    price: 'From PKR 8 Lakh',
    bestFor: 'Homeowners focusing on luxury surfaces, fixtures, and refined interiors',
    highlight: true,
    features: ['Tiles and sanitary fittings', 'Paint and false ceiling', 'Wood work and wardrobes', 'Electrical and plumbing completion'],
    includes: ['Premium finish selection', 'Quality control checks', 'Fixture coordination', 'Final walkthrough'],
  },
  {
    title: 'Turnkey Construction',
    subtitle: 'Complete peace of mind',
    price: 'Custom Quote',
    bestFor: 'Clients who want a fully managed, end-to-end residential construction experience',
    features: ['Design and BOQ', 'Grey structure and finishing', 'Project coordination', 'Handover support'],
    includes: ['Single contract ownership', 'Dedicated project manager', 'Material procurement', 'Authority compliance support'],
  },
]

const processSteps: TimelineStep[] = [
  { title: '1. Consultation', description: 'We begin with your plot details, lifestyle goals, and preferred construction scope.' },
  { title: '2. Site Visit', description: 'A practical site review helps us assess access, layout, and buildability before planning begins.' },
  { title: '3. Design & BOQ', description: 'Our team translates your idea into a realistic design brief and transparent quantity estimate.' },
  { title: '4. Agreement', description: 'We define the construction scope, milestones, and payment structure in a clear contract.' },
  { title: '5. Construction', description: 'Execution starts with approved drawings, supervised site work, and controlled material flow.' },
  { title: '6. Finishing', description: 'We refine interiors, utilities, surfaces, and detailing with quality-driven precision.' },
  { title: '7. Handover', description: 'The final handover includes a polished home, documentation, and post-build support.' },
]

const costFactors: FactorItem[] = [
  { title: 'Plot Size', description: 'A 5 marla layout requires a precise plan for covered area, setbacks, and efficient room allocation.' },
  { title: 'Covered Area', description: 'The square footage directly affects structural quantities, finishes, and material demand.' },
  { title: 'Material Quality', description: 'Steel grade, cement quality, sanitary fittings, and finishing products influence both price and longevity.' },
  { title: 'Basement', description: 'A basement adds structural complexity, waterproofing requirements, and finishing scope.' },
  { title: 'Floors', description: 'Additional floors increase structural work, stair design, and utility coordination.' },
  { title: 'Finishing Level', description: 'Luxury interiors, imported fixtures, and custom detailing raise the overall construction budget.' },
  { title: 'Society By-Laws', description: 'Approved setbacks, height restrictions, and utility standards affect planning and approvals.' },
  { title: 'Labour Cost', description: 'Skilled labour quality, project duration, and site conditions shape build efficiency and cost.' },
]

const services: ServiceItem[] = [
  { icon: FiHome, title: 'Foundation', description: 'Strong footing and RCC foundation work that supports long-term structural stability.' },
  { icon: FiTool, title: 'Grey Structure', description: 'Columns, beams, slabs, and walls built to exact structural standards.' },
  { icon: FiLayers, title: 'Brick Work', description: 'Expert masonry execution for durable walls and clean finishing lines.' },
  { icon: FiShield, title: 'Plaster', description: 'Smooth finishes and surface preparation for a polished interior and exterior look.' },
  { icon: FiZap, title: 'Electrical', description: 'Complete wiring layouts, lighting points, and smart-ready electrical planning.' },
  { icon: FiCompass, title: 'Plumbing', description: 'Reliable sanitary and water distribution systems designed for daily use.' },
  { icon: FiHome, title: 'Tiles', description: 'Flooring and wall tile execution with accurate layout and proper waterproofing.' },
  { icon: FiCheckCircle, title: 'Paint', description: 'Premium paint solutions chosen for finish quality and lasting visual appeal.' },
  { icon: FiLayers, title: 'Wood Work', description: 'Custom doors, frames, cabinets, and carpentry built for function and style.' },
  { icon: FiHome, title: 'Kitchen', description: 'Practical kitchen layouts with efficient workflow and modern finish details.' },
  { icon: FiHome, title: 'Wardrobes', description: 'Custom storage solutions designed to match the architectural language of your home.' },
  { icon: FiLayers, title: 'False Ceiling', description: 'Refined ceiling work that creates beauty, lighting balance, and architectural depth.' },
  { icon: FiZap, title: 'Solar Ready', description: 'Electrical planning that supports future solar integration with minimal redesign.' },
  { icon: FiShield, title: 'Waterproofing', description: 'Protective waterproofing measures for roofs, terraces, and wet areas.' },
  { icon: FiHome, title: 'Boundary Wall', description: 'Strong, finished perimeter solutions that improve security and curb appeal.' },
]

const projects: ProjectCard[] = [
  {
    title: 'Contemporary 5 Marla Residence',
    image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=900&q=80',
    location: 'B-17, Islamabad',
    plotSize: '5 Marla',
    status: 'Completed',
    description: 'A refined family home with elevated finishing, smart space planning, and a premium façade.',
  },
  {
    title: 'Modern Family Home',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80',
    location: 'Faisal Hills',
    plotSize: '5 Marla',
    status: 'In Progress',
    description: 'A balanced exterior and premium interior package designed for modern family living.',
  },
  {
    title: 'Luxury Turnkey Build',
    image: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=900&q=80',
    location: 'DHA Islamabad',
    plotSize: '5 Marla',
    status: 'Completed',
    description: 'A turnkey home delivered with strong structural quality and premium finish selection.',
  },
]

const brands: BrandItem[] = [
  { name: 'Mughal Steel', description: 'Reinforcement steel for structural strength and reliability' },
  { name: 'Amreli Steel', description: 'Trusted steel solution for durable construction execution' },
  { name: 'Maple Leaf Cement', description: 'High-performance cement for strong, dependable builds' },
  { name: 'Bestway Cement', description: 'Consistent cement quality for robust grey structure work' },
  { name: 'Master Tiles', description: 'Elegant and resilient floor and wall tile solutions' },
  { name: 'Porta', description: 'Premium sanitary and fixture products for modern homes' },
  { name: 'Faisal Sanitary', description: 'Durable sanitary solutions for functional luxury' },
  { name: 'Popular Paint Brands', description: 'Finishes selected for lasting beauty and protection' },
]

const stats = [
  { value: '12+', label: 'Years Experience' },
  { value: '350+', label: 'Projects Completed' },
  { value: '250+', label: 'Happy Clients' },
  { value: '18', label: 'Engineers' },
  { value: '100%', label: 'Quality Checks' },
]

const testimonials: Testimonial[] = [
  {
    name: 'Ayesha Khan',
    location: 'B-17',
    review: 'The team was transparent from day one and delivered a house that feels premium in every detail.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Hassan Ali',
    location: 'Faisal Hills',
    review: 'They managed the construction process smoothly and kept us informed with regular site updates.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Sana Malik',
    location: 'DHA Islamabad',
    review: 'From BOQ to handover, everything felt organized and professionally handled.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=400&q=80',
  },
]

const faqs = [
  { question: 'What is the estimated construction cost for a 5 marla house in Islamabad?', answer: 'The cost depends on materials, covered area, finishing level, and whether the project includes a basement or additional floors. We provide a detailed BOQ so the estimate is clear and practical.' },
  { question: 'How long does a 5 marla house construction project take?', answer: 'Most projects follow a structured timeline based on design approval, material availability, and construction scope. We help clients set realistic milestones from the start.' },
  { question: 'Do you provide grey structure and turnkey construction?', answer: 'Yes. We offer grey structure packages, finishing packages, and complete turnkey construction for clients who want full project management.' },
  { question: 'Can you help with payment planning?', answer: 'Yes. We structure work phases and milestones in a way that supports transparent budgeting and smoother execution.' },
  { question: 'Which material brands do you use?', answer: 'We use trusted brands such as Mughal Steel, Amreli Steel, Maple Leaf Cement, Bestway Cement, Master Tiles, Porta, and Faisal Sanitary where suitable.' },
  { question: 'Do you provide warranty or quality support?', answer: 'We stand behind our workmanship and coordinate post-construction support where required, depending on the scope and agreement.' },
  { question: 'Do you support society approvals and by-laws?', answer: 'Yes. We work with the practical requirements of local area regulations, plot constraints, and approved construction standards.' },
  { question: 'What is included in a BOQ estimate?', answer: 'A BOQ includes a detailed breakdown of structural work, finishing scope, materials, and quantity-based costing for better transparency.' },
  { question: 'Do you offer labour and contractor management?', answer: 'Yes. Our team coordinates skilled labour, material flow, and site supervision so the project remains efficient and accountable.' },
  { question: 'What areas do you serve?', answer: 'We serve Islamabad, Rawalpindi, B-17, Faisal Hills, Multi Gardens, Top City, Faisal Town, DHA Islamabad, Bahria Town, Gulberg Greens, and CDA sectors.' },
]

export function FiveMarlaConstructionPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0)
  const [activeSection, setActiveSection] = useState(sectionNavItems[0].id)
  const [progress, setProgress] = useState(0)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    plotSize: '',
    constructionType: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

  const schemaData = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: '5 Marla House Construction Islamabad',
    serviceType: 'Residential House Construction',
    provider: {
      '@type': 'LocalBusiness',
      name: 'Jaidad Group',
      url: 'https://jaidadgroup.com',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Islamabad',
        addressCountry: 'PK',
      },
    },
    areaServed: [
      'Islamabad',
      'Rawalpindi',
      'B-17',
      'Faisal Hills',
      'Multi Gardens',
      'Top City',
      'Faisal Town',
      'DHA Islamabad',
      'Bahria Town',
      'Gulberg Greens',
      'CDA Sectors',
    ],
    description: 'Jaidad Group offers premium 5 marla house construction in Islamabad with grey structure, finishing, and turnkey construction services.',
  }), [])

  const breadcrumbSchema = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaidadgroup.com/' },
      { '@type': 'ListItem', position: 2, name: 'Construction', item: 'https://jaidadgroup.com/construction' },
      { '@type': 'ListItem', position: 3, name: '5 Marla House Construction in B-17', item: 'https://jaidadgroup.com/construction/b-17-mpchs/5-marla-house-construction-in-b-17' },
    ],
  }), [])

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight
      const nextProgress = documentHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / documentHeight) * 100)) : 0
      setProgress(nextProgress)
    }

    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    return () => window.removeEventListener('scroll', updateProgress)
  }, [])

  useEffect(() => {
    const sections = Object.values(sectionRefs.current).filter((section): section is HTMLElement => Boolean(section))
    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (visibleEntry?.target?.id) {
          setActiveSection(visibleEntry.target.id)
        }
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: [0.16, 0.35, 0.55] }
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  const scrollToSection = (id: string) => {
    const target = document.getElementById(id)
    if (!target) return
    const top = target.getBoundingClientRect().top + window.scrollY - 96
    window.scrollTo({ top, behavior: 'smooth' })
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <>
      <Helmet>
        <title>5 Marla House Construction Islamabad | Jaidad Group</title>
        <meta name="description" content="Premium 5 Marla house construction in Islamabad by Jaidad Group. Grey structure, finishing, turnkey construction, BOQ-based estimating, and trusted project delivery." />
        <link rel="canonical" href="" />
        <meta property="og:title" content="5 Marla House Construction Islamabad | Jaidad Group" />
        <meta property="og:description" content="Premium construction services for 5 marla homes in Islamabad with transparent pricing, expert supervision, and high-quality finishes." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="" />
        <meta property="og:image" content="https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="5 Marla House Construction Islamabad | Jaidad Group" />
        <meta name="twitter:description" content="Premium construction services for 5 marla homes in Islamabad with transparent pricing and trusted project delivery." />
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <main className="bg-[var(--background)] text-[var(--text)]" style={{ scrollBehavior: 'smooth' }}>
        <div className="fixed inset-x-0 top-0 z-[70] h-1 bg-transparent">
          <div className="h-full rounded-r-full bg-[var(--primary)] transition-all duration-200" style={{ width: `${progress}%` }} />
        </div>
        <div className="border-b border-[var(--border)] bg-white/85 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 text-sm">
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-[var(--text-muted)]">
              <Link to="/" className="rounded-full px-2 py-1 transition hover:bg-[var(--primary)]/10 hover:text-[var(--primary)]">Home</Link>
              <span>/</span>
              <Link to="/construction" className="rounded-full px-2 py-1 transition hover:bg-[var(--primary)]/10 hover:text-[var(--primary)]">Construction</Link>
              <span>/</span>
              <span className="rounded-full bg-[var(--primary)]/5 px-2 py-1 text-[var(--text)]">5 Marla House Construction in B-17</span>
            </nav>
          </div>
        </div>

        <section className="bg-[var(--background)] py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="overflow-hidden rounded-[2rem] border border-[var(--border)] bg-white shadow-[0_40px_120px_rgba(15,23,42,0.08)] p-8 md:p-10">
              <div className="max-w-4xl">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--primary)]">OUR CONSTRUCTION SERVICES</p>
                <h2 className="mt-4 text-3xl font-black text-[var(--text)] sm:text-4xl">Complete Construction Solutions, Tailored to Your Needs</h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--text-muted)]">We offer a range of construction service models to match different client requirements, budgets, and project goals.</p>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {serviceCardItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => scrollToSection(item.targetId)}
                      className="group h-full rounded-[1.75rem] border border-[var(--border)] bg-[var(--background)] p-6 text-center transition duration-200 hover:-translate-y-1 hover:border-[var(--primary)]/50 hover:shadow-[0_24px_80px_rgba(15,23,42,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
                    >
                      <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full border border-[var(--primary)]/20 bg-[var(--primary)]/10 text-[var(--primary)] transition group-hover:bg-[var(--primary)]/15">
                        <Icon className="h-7 w-7" />
                      </span>
                      <div className="mt-5">
                        <h3 className="text-base font-semibold text-[var(--text)]">{item.title}</h3>
                        <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">{item.description}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-10">
          <div className="container mx-auto px-4">
            <div className="relative overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--background)] p-6 shadow-2xl">
              <div className="pointer-events-none absolute -left-10 top-0 h-52 w-52 rounded-full bg-[var(--primary)]/10 blur-3xl" />
              <div className="pointer-events-none absolute right-0 top-10 h-40 w-40 rounded-full bg-[var(--primary)]/15 blur-3xl" />
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-2xl">
                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--primary)]">Quick Navigation</p>
                  <h2 className="mt-3 text-3xl font-black text-[var(--text)] sm:text-4xl">Ultra-modern guide navigation for your construction journey</h2>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--text-muted)]">Tap any section card to scroll instantly. The active section is highlighted so you always know where you are on the page.</p>
                </div>
                <div className="rounded-full border border-[var(--border)] bg-white/90 px-4 py-3 text-sm text-[var(--text-muted)] shadow-sm">Section finder with smooth scrolling</div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {sectionNavItems.map((item) => {
                  const Icon = item.icon
                  const isActive = activeSection === item.id
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => scrollToSection(item.id)}
                      className={cn(
                        'group flex flex-col gap-3 rounded-[1.75rem] border p-6 text-left transition duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]',
                        isActive
                          ? 'border-[var(--primary)] bg-[var(--primary)]/10 shadow-xl'
                          : 'border-[var(--border)] bg-white hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(15,23,42,0.08)]'
                      )}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className={cn('inline-flex h-11 w-11 items-center justify-center rounded-3xl text-lg', isActive ? 'bg-[var(--primary)]/15 text-[var(--primary)]' : 'bg-[var(--primary)]/10 text-[var(--primary)]')}>
                          <Icon className="h-5 w-5" />
                        </span>
                        <FiArrowRight className={cn('h-4 w-4 transition-transform duration-200', isActive ? 'text-[var(--primary)]' : 'text-[var(--text-muted)] group-hover:translate-x-1')} />
                      </div>
                      <div>
                        <h3 className={cn('font-semibold text-[var(--text)]', isActive ? 'text-[var(--text)]' : 'text-[var(--text)]')}>{item.title.replace(/^[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u, '')}</h3>
                        <p className={cn('mt-2 text-sm leading-6', isActive ? 'text-[var(--primary)]/80' : 'text-[var(--text-muted)]')}>{item.description}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        <section id="why-homeowners-choose-our-construction-team" ref={(node) => { sectionRefs.current['why-homeowners-choose-our-construction-team'] = node }} className="scroll-mt-24 bg-[var(--background)] py-20">
          <div className="container mx-auto px-4">
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {highlights.map((item, index) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: index * 0.05 }}
                    className="rounded-[1.5rem] border border-[var(--border)] bg-white p-6 shadow-sm"
                  >
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mb-2 font-display text-xl font-semibold text-[var(--text)]">{item.title}</h3>
                    <p className="text-sm leading-7 text-[var(--text-muted)]">{item.description}</p>
                  </motion.div>
                )
              })}
            </div>
            <SectionFooter currentId="why-homeowners-choose-our-construction-team" items={sectionNavItems} />
          </div>
        </section>

        <section id="construction-packages" ref={(node) => { sectionRefs.current['construction-packages'] = node }} className="scroll-mt-24 bg-white py-20">
          <div className="container mx-auto px-4">
            <SectionHeader
              label="Construction Packages"
              title="Flexible Packages for Every Build Stage"
              highlightedWord="Stage"
              description="Choose a package that supports your timeline, budget, and preferred level of finish."
              align="center"
            />
            <div className="grid gap-6 lg:grid-cols-3">
              {packages.map((pkg, index) => (
                <motion.div
                  key={pkg.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className={cn('rounded-[2rem] border p-8 shadow-sm', pkg.highlight ? 'border-[var(--primary)] bg-[var(--primary)]/5' : 'border-[var(--border)] bg-[var(--background)]')}
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">{pkg.subtitle}</p>
                  <h3 className="mt-3 font-display text-2xl font-semibold text-[var(--text)]">{pkg.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">{pkg.bestFor}</p>
                  <div className="mt-6 rounded-2xl bg-white p-4 shadow-sm">
                    <p className="text-sm font-semibold text-[var(--text-muted)]">Starting From</p>
                    <p className="mt-1 font-display text-2xl font-black text-[var(--primary)]">{pkg.price}</p>
                  </div>
                  <div className="mt-6">
                    <p className="text-sm font-semibold text-[var(--text)]">Features</p>
                    <ul className="mt-3 space-y-2 text-sm text-[var(--text-muted)]">
                      {pkg.features.map((item) => (
                        <li key={item} className="flex items-start gap-2"><FiCheck className="mt-1 h-4 w-4 text-[var(--primary)]" /> {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-6">
                    <p className="text-sm font-semibold text-[var(--text)]">What’s Included</p>
                    <ul className="mt-3 space-y-2 text-sm text-[var(--text-muted)]">
                      {pkg.includes.map((item) => (
                        <li key={item} className="flex items-start gap-2"><FiCheck className="mt-1 h-4 w-4 text-[var(--primary)]" /> {item}</li>
                      ))}
                    </ul>
                  </div>
                  <a href="#contact" className={cn(buttonVariants({ variant: pkg.highlight ? 'primary' : 'glass', size: 'md' }), 'mt-8 w-full justify-center')}>
                    Request This Package
                  </a>
                </motion.div>
              ))}
            </div>
            <SectionFooter currentId="construction-packages" items={sectionNavItems} />
          </div>
        </section>

        <section id="construction-process" ref={(node) => { sectionRefs.current['construction-process'] = node }} className="scroll-mt-24 bg-[var(--background)] py-20">
          <div className="container mx-auto px-4">
            <SectionHeader label="Construction Process" title="A Smooth Path From Concept to Handover" highlightedWord="Handover" description="We keep your project organized, transparent, and carefully supervised at each stage." align="center" />
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {processSteps.map((step, index) => (
                <motion.div key={step.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.04 }} className="rounded-[1.5rem] border border-[var(--border)] bg-white p-6 shadow-sm">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--primary)]/10 text-lg font-semibold text-[var(--primary)]">{index + 1}</div>
                  <h3 className="font-display text-xl font-semibold text-[var(--text)]">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">{step.description}</p>
                </motion.div>
              ))}
            </div>
            <SectionFooter currentId="construction-process" items={sectionNavItems} />
          </div>
        </section>

        <section id="cost-factors" ref={(node) => { sectionRefs.current['cost-factors'] = node }} className="scroll-mt-24 bg-white py-20">
          <div className="container mx-auto px-4">
            <SectionHeader label="Construction Cost Factors" title="What Influences the Cost of Building Your 5 Marla Home" highlightedWord="Home" description="Every build is shaped by design, structure, finish level, and site conditions." align="center" />
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {costFactors.map((factor, index) => (
                <motion.div key={factor.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.04 }} className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--background)] p-6 shadow-sm">
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
                    <FiBox className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-[var(--text)]">{factor.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">{factor.description}</p>
                </motion.div>
              ))}
            </div>
            <SectionFooter currentId="cost-factors" items={sectionNavItems} />
          </div>
        </section>

        <section id="essential-stages" ref={(node) => { sectionRefs.current['essential-stages'] = node }} className="scroll-mt-24 bg-[var(--background)] py-20">
          <div className="container mx-auto px-4">
            <SectionHeader label="Construction Services Included" title="Every Essential Stage of Your Home Build" highlightedWord="Build" description="A complete construction approach for structural strength, functionality, and elevated finishing." align="center" />
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {services.map((service, index) => {
                const Icon = service.icon
                return (
                  <motion.div key={service.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.03 }} className="rounded-[1.5rem] border border-[var(--border)] bg-white p-6 shadow-sm">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-display text-xl font-semibold text-[var(--text)]">{service.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">{service.description}</p>
                  </motion.div>
                )
              })}
            </div>
            <SectionFooter currentId="essential-stages" items={sectionNavItems} />
          </div>
        </section>

        <section id="premium-craftsmanship" ref={(node) => { sectionRefs.current['premium-craftsmanship'] = node }} className="scroll-mt-24 bg-white py-20">
          <div className="container mx-auto px-4">
            <SectionHeader label="Recent Projects" title="Homes Delivered with Premium Craftsmanship" highlightedWord="Craftsmanship" description="Each project reflects careful planning, refined execution, and lasting material quality." align="center" />
            <div className="grid gap-8 lg:grid-cols-3">
              {projects.map((project, index) => (
                <motion.article key={project.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: index * 0.06 }} className="overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--background)] shadow-sm">
                  <img src={project.image} alt={project.title} className="h-56 w-full object-cover" loading="lazy" />
                  <div className="p-6">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">{project.location}</p>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[var(--text-muted)]">{project.status}</span>
                    </div>
                    <h3 className="font-display text-xl font-semibold text-[var(--text)]">{project.title}</h3>
                    <p className="mt-2 text-sm text-[var(--text-muted)]">{project.description}</p>
                    <div className="mt-4 flex items-center justify-between text-sm text-[var(--text-muted)]">
                      <span className="inline-flex items-center gap-2"><FiMapPin className="h-4 w-4" /> {project.location}</span>
                      <span className="inline-flex items-center gap-2"><FiBox className="h-4 w-4" /> {project.plotSize}</span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
            <SectionFooter currentId="premium-craftsmanship" items={sectionNavItems} />
          </div>
        </section>

        <section id="trusted-products" ref={(node) => { sectionRefs.current['trusted-products'] = node }} className="scroll-mt-24 bg-[var(--background)] py-20">
          <div className="container mx-auto px-4">
            <SectionHeader label="Materials & Brands We Use" title="Trusted Products for Stronger, Longer-Lasting Homes" highlightedWord="Longer-Lasting" description="We select materials that balance beauty, reliability, and value for modern construction projects." align="center" />
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {brands.map((brand, index) => (
                <motion.div key={brand.name} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.04 }} className="rounded-[1.5rem] border border-[var(--border)] bg-white p-6 shadow-sm">
                  <h3 className="font-display text-xl font-semibold text-[var(--text)]">{brand.name}</h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">{brand.description}</p>
                </motion.div>
              ))}
            </div>
            <SectionFooter currentId="trusted-products" items={sectionNavItems} />
          </div>
        </section>

        <section id="testimonials" className="bg-white py-20">
          <div className="container mx-auto px-4">
            <SectionHeader label="Client Testimonials" title="What Our Clients Say About Working With Us" highlightedWord="Us" description="Client confidence matters to us, and our results reflect that commitment." align="center" />
            <div className="grid gap-8 lg:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <motion.div key={testimonial.name} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.06 }} className="rounded-[2rem] border border-[var(--border)] bg-[var(--background)] p-6 shadow-sm">
                  <img src={testimonial.image} alt={testimonial.name} className="h-16 w-16 rounded-full object-cover" loading="lazy" />
                  <div className="mt-4 flex items-center gap-1 text-[var(--primary)]">
                    {Array.from({ length: testimonial.rating }).map((_, idx) => (<FiStar key={idx} className="h-4 w-4" />))}
                  </div>
                  <p className="mt-4 text-sm leading-8 text-[var(--text-muted)]">“{testimonial.review}”</p>
                  <div className="mt-5">
                    <p className="font-semibold text-[var(--text)]">{testimonial.name}</p>
                    <p className="text-sm text-[var(--text-muted)]">{testimonial.location}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="faqs" className="bg-[var(--background)] py-20">
          <div className="container mx-auto px-4">
            <SectionHeader label="Frequently Asked Questions" title="Answers to the Questions Homeowners Ask Most" highlightedWord="Most" description="Clear answers about cost, timing, materials, and the construction journey." align="center" />
            <div className="mx-auto max-w-4xl space-y-4">
              {faqs.map((faq, index) => (
                <div key={faq.question} className="rounded-[1.25rem] border border-[var(--border)] bg-white shadow-sm">
                  <button type="button" className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left" onClick={() => setActiveFaq(activeFaq === index ? null : index)}>
                    <span className="font-semibold text-[var(--text)]">{faq.question}</span>
                    <span className="text-xl text-[var(--primary)]">{activeFaq === index ? '−' : '+'}</span>
                  </button>
                  {activeFaq === index && <p className="px-6 pb-6 text-sm leading-7 text-[var(--text-muted)]">{faq.answer}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="bg-white py-20">
          <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <SectionHeader label="Contact Jaidad Group" title="Start Building Your Dream Home Today" highlightedWord="Today" description="Tell us about your plot, preferred construction type, and the kind of home you want to create." align="left" className="mb-0" />
              <div className="mt-8 space-y-4 text-sm text-[var(--text-muted)]">
                <p className="flex items-center gap-3"><FiPhone className="h-4 w-4 text-[var(--primary)]" /> +92 300 0000000</p>
                <p className="flex items-center gap-3"><FaWhatsapp className="h-4 w-4 text-green-600" /> WhatsApp for instant consultation</p>
                <p className="flex items-center gap-3"><FiMapPin className="h-4 w-4 text-[var(--primary)]" /> Islamabad, Pakistan</p>
              </div>
            </div>

            <motion.form initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} onSubmit={handleSubmit} className="rounded-[2rem] border border-[var(--border)] bg-[var(--background)] p-6 shadow-sm">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[var(--text)]" htmlFor="name">Name</label>
                  <input id="name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--primary)]" placeholder="Your Name" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[var(--text)]" htmlFor="phone">Phone</label>
                  <input id="phone" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--primary)]" placeholder="03xx-xxxxxxx" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[var(--text)]" htmlFor="email">Email</label>
                  <input id="email" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--primary)]" placeholder="you@example.com" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[var(--text)]" htmlFor="city">City</label>
                  <input id="city" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--primary)]" placeholder="Islamabad" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[var(--text)]" htmlFor="plotSize">Plot Size</label>
                  <input id="plotSize" value={formData.plotSize} onChange={(e) => setFormData({ ...formData, plotSize: e.target.value })} className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--primary)]" placeholder="5 Marla" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[var(--text)]" htmlFor="constructionType">Construction Type</label>
                  <input id="constructionType" value={formData.constructionType} onChange={(e) => setFormData({ ...formData, constructionType: e.target.value })} className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--primary)]" placeholder="Grey Structure / Turnkey" />
                </div>
              </div>
              <div className="mt-4">
                <label className="mb-2 block text-sm font-semibold text-[var(--text)]" htmlFor="message">Message</label>
                <textarea id="message" rows={4} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--primary)]" placeholder="Tell us about your home build goals." />
              </div>
              <button type="submit" className={cn(buttonVariants({ variant: 'primary', size: 'lg' }), 'mt-6 w-full justify-center')}>
                <FiMessageCircle className="h-4 w-4" /> Request a Free Estimate
              </button>
              {submitted && <p className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">Thank you. Our team will contact you soon with a tailored estimate.</p>}
            </motion.form>
          </div>
        </section>

        <section className="bg-[var(--primary)] py-16 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-display text-3xl font-black md:text-4xl">Start Building Your Dream Home Today</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-white/80">Let us turn your 5 marla plot into a premium, lasting home with clear planning and dependable delivery.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a href="https://wa.me/923000000000" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[var(--primary)] transition hover:scale-[1.02]">
                <FaWhatsapp className="h-4 w-4" /> WhatsApp Now
              </a>
              <a href="tel:+923000000000" className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                <FiPhone className="h-4 w-4" /> Call Now
              </a>
              <a href="#contact" className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                <FiArrowRight className="h-4 w-4" /> Request Estimate
              </a>
            </div>
          </div>
        </section>

        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3">
          <a href="https://wa.me/923000000000" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-xl transition hover:scale-[1.02]">
            <FaWhatsapp className="h-4 w-4" /> WhatsApp
          </a>
          <a href="#contact" className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-white shadow-xl transition hover:scale-[1.02]">
            <FiArrowRight className="h-4 w-4" /> Get Free Estimate
          </a>
        </div>
      </main>
    </>
  )
}
