import { useEffect, useMemo, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  FiArrowLeft,
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
  badge?: string
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
  image: string
  alt: string
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

const EMAIL_ADDRESS = 'info@thejaidadgroup.com'
const PHONE_NUMBER = '+923310071314'
const WHATSAPP_NUMBER = '923310071314'
const OFFICE_ADDRESS = 'Plot #17, 1st Floor, Jaidad Group, Al Aziz Arcade, Commercial, Near Attock Petroleum, Main Markaz Block E, Multi Gardens B-17, Islamabad 42200'

const buildWhatsAppLink = (message: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
const buildMailtoLink = (email = EMAIL_ADDRESS) => `mailto:${email}`

const sectionNavItems: SectionNavItem[] = [
  { id: 'build-a-refined-5-marla-home-in-islamabad-with-jaidad-group', title: '🏠 Build a Refined 5 Marla Home in Islamabad with Jaidad Group', description: 'Overview and value proposition', icon: FiHome },
  { id: 'cost-calculator', title: '🧮 5 Marla House Construction Cost Calculator', description: 'Quick estimate guidance', icon: FiTrendingUp },
  { id: 'construction-packages', title: '📦 Flexible Packages for Every Build Stage', description: 'Choose the right package', icon: FiLayers },
  { id: 'soil-testing', title: '🧱 Soil Testing in Societies and CDA Sectors', description: 'MPCHS B-17, Faisal Town, Faisal Hills & Faisal Margalla City', icon: FiCompass },
  { id: 'noc-approval', title: '🛡️ NOC & Approval Process from Authorities', description: 'CDA, RDA, District Council, MPCHS B-17, Faisal Town, Faisal Hills & Faisal Margalla City', icon: FiShield },
  { id: 'premium-craftsmanship', title: '🏡 Homes Delivered with Premium Craftsmanship', description: 'Recent work and delivery quality', icon: FiShield },
  { id: 'trusted-products', title: '🧱 Trusted Products for Stronger, Longer-Lasting Homes', description: 'Brands and material quality', icon: FiCheckCircle },
]

const serviceCardItems = [
  {
    id: 'turnkey-construction',
    title: 'Turnkey Construction',
    description: 'End-to-end delivery with premium finishes and a single point of accountability for homes in MPCHS B-17 and nearby localities.',
    icon: FiLayers,
    targetId: 'construction-packages',
  },
  {
    id: 'construction-with-material',
    title: 'Construction with Material',
    description: 'Material-inclusive execution with careful sourcing and quality control for projects in Faisal Town, Faisal Hills, and Faisal Margalla City.',
    icon: FiHome,
    targetId: 'noc-approval',
  },
  {
    id: 'labour-contract',
    title: 'Labour Contract (Without Material)',
    description: 'Skilled labour and site supervision for projects where materials are client-supplied in Islamabad and Rawalpindi.',
    icon: FiTool,
    targetId: 'soil-testing',
  },
  {
    id: 'percentage-based-construction',
    title: 'Percentage-Based Construction',
    description: 'Clear milestone-based billing aligned with construction progress for homes in MPCHS B-17 and surrounding sectors.',
    icon: FiTrendingUp,
    targetId: 'soil-testing',
  },
  {
    id: 'construction-consultancy',
    title: 'Construction Consultancy',
    description: 'Expert planning, approvals, and project guidance for smoother execution in Faisal Town and Faisal Hills.',
    icon: FiCompass,
    targetId: 'construction-packages',
  },
  {
    id: 'grey-structure-construction',
    title: 'Grey Structure Construction',
    description: 'Strong structural building work from foundation to roof shell, planned to suit your plot and locality.',
    icon: FiShield,
    targetId: 'soil-testing',
  },
  {
    id: 'renovation-remodeling',
    title: 'Renovation & Remodeling',
    description: 'Modern renovation solutions to refresh interiors and exterior living spaces in MPCHS B-17 and surrounding communities.',
    icon: FiStar,
    targetId: 'premium-craftsmanship',
  },
]

interface SectionCtaProps {
  heading: string
  description: string
  primaryLabel: string
  primaryHref: string
  secondaryLabel: string
  secondaryHref: string
  secondaryType?: 'whatsapp' | 'email' | 'contact'
}

function SectionCta({ heading, description, primaryLabel, primaryHref, secondaryLabel, secondaryHref, secondaryType = 'whatsapp' }: SectionCtaProps) {
  return (
    <div className="mt-10 rounded-[2rem] border border-[var(--border)] bg-[var(--background)] p-6 shadow-sm">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--primary)]">Need guidance?</p>
          <h3 className="mt-3 text-2xl font-black text-[var(--text)]">{heading}</h3>
          <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">{description}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href={primaryHref} className={cn(buttonVariants({ variant: 'primary', size: 'md' }), 'justify-center')}>{primaryLabel}</a>
          <a href={secondaryHref} target={secondaryHref.startsWith('http') ? '_blank' : undefined} rel={secondaryHref.startsWith('http') ? 'noreferrer' : undefined} className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-5 py-3 text-sm font-semibold text-[var(--text)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]">
            {secondaryType === 'whatsapp' ? <FaWhatsapp className="h-4 w-4 text-green-600" /> : secondaryType === 'email' ? <FiMessageCircle className="h-4 w-4 text-[var(--primary)]" /> : <FiPhone className="h-4 w-4 text-[var(--primary)]" />}
            {secondaryLabel}
          </a>
        </div>
      </div>
    </div>
  )
}

const packages: PackageCard[] = [
  {
    title: 'Grey Structure',
    subtitle: 'Solid foundation, reliable structure',
    price: 'PKR 2,500 - 3,500 / Sqft',
    bestFor: 'Clients who want a strong structural base and phased completion',
    features: ['Foundation and footing', 'Column and beam work', 'Roof slab and lintels', 'Brickwork and plaster base'],
    includes: ['Structural drawings review', 'Material planning', 'Site supervision', 'Progress tracking'],
  },
  {
    title: 'Finishing',
    subtitle: 'Elegant interiors and premium finishing',
    price: 'PKR 5,000 - 7,000 / Sqft',
    bestFor: 'Homeowners focusing on luxury surfaces, fixtures, and refined interiors',
    features: ['Tiles and sanitary fittings', 'Paint and false ceiling', 'Wood work and wardrobes', 'Electrical and plumbing completion'],
    includes: ['Premium finish selection', 'Quality control checks', 'Fixture coordination', 'Final walkthrough'],
  },
  {
    title: 'Turnkey Construction',
    subtitle: 'Complete peace of mind',
    price: 'Custom Quote',
    bestFor: 'Clients who want a fully managed, end-to-end residential construction experience',
    highlight: true,
    badge: 'Trending',
    features: ['Design and BOQ', 'Grey structure and finishing', 'Project coordination', 'Handover support'],
    includes: ['Single contract ownership', 'Dedicated project manager', 'Material procurement', 'Authority compliance support'],
  },
]

const processSteps: TimelineStep[] = [
  { title: '1. Why it matters', description: 'Soil testing helps homeowners understand whether the ground can safely support the planned structure before construction begins in MPCHS B-17, Faisal Town, Faisal Hills, or Faisal Margalla City.' },
  { title: '2. Site investigation', description: 'A professional soil investigation assesses the ground conditions, bearing capacity, and overall suitability of the plot for the intended house design.' },
  { title: '3. Ground condition review', description: 'The findings help reveal whether the land requires special attention, drainage planning, or revised foundation assumptions.' },
  { title: '4. Soil report', description: 'A soil report gives homeowners a practical basis for design decisions and reduces the risk of surprises during construction.' },
  { title: '5. Foundation planning', description: 'When soil results are clear, foundation planning becomes more accurate, safer, and better aligned with the structure being built.' },
  { title: '6. Homeowner confidence', description: 'Testing the soil early helps homeowners make informed choices and proceed with greater certainty before starting work.' },
]

const costFactors: FactorItem[] = [
  { title: 'Authority Route', description: 'The approval path depends on whether your project falls under CDA, RDA, the District Council, or a housing society framework.' },
  { title: 'Society NOC', description: 'Many developments require a society-level NOC before drawings can be submitted or construction can begin.' },
  { title: 'Required Permissions', description: 'Homeowners often need clear permission before start, including planning and compliance approvals from the relevant authority.' },
  { title: 'Document Checklist', description: 'Ownership papers, site details, architectural drawings, and supporting records are commonly required for approval review.' },
  { title: 'Building Plan Approval', description: 'Approved building plans help confirm that the proposed house meets the needed standards before execution.' },
  { title: 'Jaidad Group Support', description: 'We guide clients through the approval journey, help prepare documentation, and coordinate with authorities or societies where applicable.' },
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
  { name: 'Mughal Steel', description: 'Reinforcement steel for structural strength and reliability', image: 'https://images.unsplash.com/photo-1581092335391-0e1b65e8a9d8?auto=format&fit=crop&w=600&q=80', alt: 'Steel reinforcement materials used in premium house construction' },
  { name: 'Amreli Steel', description: 'Trusted steel solution for durable construction execution', image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80', alt: 'Industrial steel material for robust structural construction' },
  { name: 'Maple Leaf Cement', description: 'High-performance cement for strong, dependable builds', image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=600&q=80', alt: 'Cement and concrete materials for sturdy home construction' },
  { name: 'Bestway Cement', description: 'Consistent cement quality for robust grey structure work', image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80', alt: 'Construction materials arranged on a building site' },
  { name: 'Master Tiles', description: 'Elegant and resilient floor and wall tile solutions', image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=600&q=80', alt: 'Modern tiled flooring and bathroom surfaces' },
  { name: 'Porta', description: 'Premium sanitary and fixture products for modern homes', image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=600&q=80', alt: 'Luxury bathroom fixtures and sanitary fittings' },
  { name: 'Faisal Sanitary', description: 'Durable sanitary solutions for functional luxury', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80', alt: 'Contemporary sanitary fixtures for a modern home' },
  { name: 'Popular Paint Brands', description: 'Finishes selected for lasting beauty and protection', image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=600&q=80', alt: 'Interior paint finish and color selection for premium homes' },
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
  {
    name: 'Nadia Shahzad',
    location: 'Faisal Town',
    review: 'Their guidance on approvals and material planning made our build much easier. We appreciated the calm, practical communication throughout.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Bilal Ahmed',
    location: 'Gulberg Greens',
    review: 'The finishing quality was excellent and the team stayed on schedule. We felt confident at every milestone of the project.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Farah Malik',
    location: 'Rawalpindi',
    review: 'We wanted a home that balanced quality and budget, and they helped us achieve both with a clear plan and great supervision.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Usman Tariq',
    location: 'Multi Gardens',
    review: 'The team handled the site very professionally and the final handover felt well organized. We would recommend them for residential construction.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Marium Rafiq',
    location: 'Bahria Town',
    review: 'We appreciated the focus on premium materials and the honest advice on what would work best for our plot and family needs.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Zainab Qureshi',
    location: 'Faisal Margalla City',
    review: 'Their approach to planning and coordination made the whole experience far less stressful than we expected.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Ali Haider',
    location: 'Top City',
    review: 'The team clearly understood our vision and delivered a home that feels practical, durable, and beautifully finished.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Saira Jamil',
    location: 'DHA Islamabad',
    review: 'From initial consultation to final walkthrough, the experience was smooth and professional. We are very pleased with the result.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Kamran Yousaf',
    location: 'Tarnol',
    review: 'They were proactive about approvals and very helpful in guiding our decisions around finishes and construction priorities.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
  },
]

const faqs = [
  { question: 'What is the estimated construction cost for a 5 marla house in Islamabad?', answer: 'The cost depends on materials, covered area, finishing level, and the scope of work for your site in MPCHS B-17, Faisal Town, Faisal Hills, or Faisal Margalla City. We provide a detailed BOQ so the estimate is clear and practical.' },
  { question: 'How long does a 5 marla house construction project take?', answer: 'Most projects follow a structured timeline based on design approval, soil testing, material availability, and construction scope. We help clients set realistic milestones from the start.' },
  { question: 'Do you provide grey structure and turnkey construction?', answer: 'Yes. We offer grey structure packages, finishing packages, and complete turnkey construction for clients who want full project management and premium delivery.' },
  { question: 'Can you help with payment planning?', answer: 'Yes. We structure work phases and milestones in a way that supports transparent budgeting and smoother execution from planning to handover.' },
  { question: 'Which material brands do you use?', answer: 'We use trusted brands such as Mughal Steel, Amreli Steel, Maple Leaf Cement, Bestway Cement, Master Tiles, Porta, and Faisal Sanitary where suitable.' },
  { question: 'Do you provide warranty or quality support?', answer: 'We stand behind our workmanship and coordinate post-construction support where required, depending on the scope and agreement.' },
  { question: 'Do you support society approvals and by-laws?', answer: 'Yes. We work with the practical requirements of local area regulations, plot constraints, CDA or RDA steps, and approved construction standards.' },
  { question: 'What is included in a BOQ estimate?', answer: 'A BOQ includes a detailed breakdown of structural work, finishing scope, materials, and quantity-based costing for better transparency.' },
  { question: 'Do you offer labour and contractor management?', answer: 'Yes. Our team coordinates skilled labour, material flow, and site supervision so the project remains efficient and accountable.' },
  { question: 'What areas do you serve?', answer: 'We serve Islamabad, Rawalpindi, MPCHS B-17, Faisal Town, Faisal Hills, Multi Gardens, Top City, DHA Islamabad, Bahria Town, Gulberg Greens, and Faisal Margalla City.' },
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
  const [formError, setFormError] = useState('')
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterState, setNewsletterState] = useState<'idle' | 'success' | 'error'>('idle')
  const [newsletterMessage, setNewsletterMessage] = useState('')
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
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
    const interval = window.setInterval(() => {
      setActiveTestimonial((current) => (current + 1) % testimonials.length)
    }, 6000)

    return () => window.clearInterval(interval)
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
    const trimmedEmail = formData.email.trim()

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setFormError('Please enter a valid email address.')
      return
    }

    window.localStorage.setItem('jaidad-group-contact-form', JSON.stringify({ ...formData, email: trimmedEmail }))
    setFormError('')
    setSubmitted(true)
  }

  const handleNewsletterSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedEmail = newsletterEmail.trim()

    if (!trimmedEmail || !/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      setNewsletterState('error')
      setNewsletterMessage('Please enter a valid email address.')
      return
    }

    window.localStorage.setItem('jaidad-group-newsletter-email', trimmedEmail)
    setNewsletterState('success')
    setNewsletterMessage('Thanks! Your email has been saved and we will keep you updated.')
    setNewsletterEmail('')
  }

  const goToTestimonial = (direction: 'prev' | 'next') => {
    setActiveTestimonial((current) => {
      if (direction === 'prev') {
        return (current - 1 + testimonials.length) % testimonials.length
      }
      return (current + 1) % testimonials.length
    })
  }

  const currentTestimonial = testimonials[activeTestimonial]
  const previousTestimonial = testimonials[(activeTestimonial - 1 + testimonials.length) % testimonials.length]
  const nextTestimonial = testimonials[(activeTestimonial + 1) % testimonials.length]

  return (
    <>
      <Helmet>
        <title>5 Marla House Construction in MPCHS B-17, Faisal Town, Faisal Hills & Faisal Margalla City | Jaidad Group</title>
        <meta name="description" content="Jaidad Group provides 5 Marla house construction guidance and turnkey delivery in MPCHS B-17, Faisal Town, Faisal Hills, and Faisal Margalla City with soil testing, approvals, grey structure, finishing, and premium materials." />
        <link rel="canonical" href="https://thejaidadgroup.com/construction/b-17-mpchs/5-marla-house-construction-in-b-17" />
        <meta property="og:title" content="5 Marla House Construction in MPCHS B-17, Faisal Town, Faisal Hills & Faisal Margalla City | Jaidad Group" />
        <meta property="og:description" content="Premium construction services for 5 Marla homes in MPCHS B-17, Faisal Town, Faisal Hills, and Faisal Margalla City with transparent pricing, expert supervision, and high-quality finishes." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://thejaidadgroup.com/construction/b-17-mpchs/5-marla-house-construction-in-b-17" />
        <meta property="og:image" content="https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="5 Marla House Construction in MPCHS B-17, Faisal Town, Faisal Hills & Faisal Margalla City | Jaidad Group" />
        <meta name="twitter:description" content="Premium construction services for 5 Marla homes in MPCHS B-17, Faisal Town, Faisal Hills, and Faisal Margalla City with transparent pricing and trusted project delivery." />
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
                <h1 className="mt-4 text-3xl font-black text-[var(--text)] sm:text-4xl">Premium 5 Marla House Construction in MPCHS B-17, Faisal Town, Faisal Hills and Faisal Margalla City</h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--text-muted)]">Jaidad Group delivers practical planning, soil testing, CDA or RDA coordination, architectural guidance, grey structure, finishing, and turnkey construction for homes in MPCHS B-17, Faisal Town, Faisal Hills, and Faisal Margalla City.</p>
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

        <section id="build-a-refined-5-marla-home-in-islamabad-with-jaidad-group" ref={(node) => { sectionRefs.current['build-a-refined-5-marla-home-in-islamabad-with-jaidad-group'] = node }} className="scroll-mt-24 bg-white py-10">
          <div className="container mx-auto px-4">
            <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--background)] p-6 shadow-sm md:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-2xl">
                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--primary)]">Why homeowners choose Jaidad Group</p>
                  <h2 className="mt-3 text-3xl font-black text-[var(--text)] sm:text-4xl">Build a Refined 5 Marla Home in Islamabad with Jaidad Group</h2>
                  <p className="mt-4 text-sm leading-7 text-[var(--text-muted)]">From planning and approvals to grey structure and turnkey delivery, we support homeowners with clear coordination, practical guidance, and dependable execution for 5 Marla homes in MPCHS B-17, Faisal Town, Faisal Hills, and Faisal Margalla City.</p>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[1.5rem] border border-[var(--border)] bg-white p-4">
                      <h3 className="font-semibold text-[var(--text)]">Complete construction guidance</h3>
                      <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">We help clients move from concept to construction with structured support at every step.</p>
                    </div>
                    <div className="rounded-[1.5rem] border border-[var(--border)] bg-white p-4">
                      <h3 className="font-semibold text-[var(--text)]">Transparent planning</h3>
                      <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">BOQ planning, milestone clarity, and practical communication help homeowners stay informed.</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-[1.75rem] border border-[var(--border)] bg-white p-6 shadow-sm lg:max-w-sm">
                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--primary)]">Start with confidence</p>
                  <h3 className="mt-3 text-xl font-semibold text-[var(--text)]">Planning support for your 5 Marla home</h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">We guide homeowners through construction planning, authority guidance, grey structure options, and turnkey delivery with a practical, quality-focused approach.</p>
                  <a href={buildWhatsAppLink('Hello Jaidad Group,\n\nI want guidance regarding building my 5 Marla house. Please share details about your construction services.\n\nThank you.')} target="_blank" rel="noreferrer" className={cn(buttonVariants({ variant: 'primary', size: 'md' }), 'mt-6 justify-center')}>WhatsApp Consultation</a>
                </div>
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
                  <h2 className="mt-3 text-3xl font-black text-[var(--text)] sm:text-4xl">A clear construction journey for your new home in MPCHS B-17 and nearby areas</h2>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--text-muted)]">Tap any section card to scroll instantly through planning, approvals, soil testing, construction, and premium finishing guidance tailored to your location.</p>
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

        <section id="cost-calculator" ref={(node) => { sectionRefs.current['cost-calculator'] = node }} className="scroll-mt-24 bg-[var(--background)] py-16">
          <div className="container mx-auto px-4">
            <div className="rounded-[2rem] border border-[var(--border)] bg-white p-6 shadow-sm md:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-2xl">
                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--primary)]">Cost guidance for homeowners</p>
                  <h2 className="mt-3 text-3xl font-black text-[var(--text)] sm:text-4xl">5 Marla House Construction Cost Calculator</h2>
                  <p className="mt-4 text-sm leading-7 text-[var(--text-muted)]">Construction cost estimates depend on covered area, grey structure scope, finishing level, material choices, and the requirements of the location. We help homeowners understand the estimate structure before work begins.</p>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--background)] p-4">
                      <h3 className="font-semibold text-[var(--text)]">Grey Structure planning</h3>
                      <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">Structural scope, foundation needs, and the shell of the house are assessed with practical planning.</p>
                    </div>
                    <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--background)] p-4">
                      <h3 className="font-semibold text-[var(--text)]">Finishing and turnkey estimation</h3>
                      <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">We help map finishing requirements and turnkey delivery scope into a clear, workable BOQ approach.</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--background)] p-6 shadow-sm lg:max-w-sm">
                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--primary)]">Request BOQ guidance</p>
                  <h3 className="mt-3 text-xl font-semibold text-[var(--text)]">Get a practical estimate for your project</h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">Share your plot details, preferred scope, and location so we can guide you on construction cost planning and BOQ preparation.</p>
                  <a href={buildWhatsAppLink('Hello Jaidad Group,\n\nI need a construction cost estimate and BOQ for my 5 Marla house in MPCHS B-17.\n\nPlease guide me.\n\nThank you.')} target="_blank" rel="noreferrer" className={cn(buttonVariants({ variant: 'primary', size: 'md' }), 'mt-6 justify-center')}>Request BOQ Estimate</a>
                </div>
              </div>
            </div>
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
                  {pkg.badge ? <div className="mt-3 inline-flex w-fit items-center rounded-full border border-[var(--primary)]/20 bg-[var(--primary)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">{pkg.badge}</div> : null}
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
                  <a href={buildWhatsAppLink(pkg.title === 'Grey Structure'
                    ? 'Hello Jaidad Group,\n\nI am interested in your Grey Structure Construction Package for my 5 Marla house in MPCHS B-17.\n\nPlease share details, pricing, and process.\n\nThank you.'
                    : pkg.title === 'Finishing'
                      ? 'Hello Jaidad Group,\n\nI am interested in your Finishing Construction Package for my 5 Marla house in MPCHS B-17.\n\nPlease share details, pricing, and process.\n\nThank you.'
                      : 'Hello Jaidad Group,\n\nI am interested in your Turnkey Construction Package for my 5 Marla house in MPCHS B-17.\n\nPlease share details, pricing, and complete process.\n\nThank you.')}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(buttonVariants({ variant: pkg.highlight ? 'primary' : 'glass', size: 'md' }), 'mt-8 w-full justify-center')}>
                    Request This Package
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="soil-testing" ref={(node) => { sectionRefs.current['soil-testing'] = node }} className="scroll-mt-24 bg-[var(--background)] py-20">
          <div className="container mx-auto px-4">
            <SectionHeader label="Soil Testing" title="Soil Testing in Societies and CDA Sectors" highlightedWord="Testing" description="Understanding ground conditions early helps homeowners in MPCHS B-17, Faisal Town, Faisal Hills, and Faisal Margalla City plan more safely before construction begins." align="center" />
            <div className="mx-auto mt-10 max-w-5xl rounded-[2rem] border border-[var(--border)] bg-white p-6 shadow-sm sm:p-8">
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {processSteps.map((step, index) => (
                  <motion.div key={step.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.04 }} className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--background)] p-6 shadow-sm">
                    <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--primary)]/10 text-lg font-semibold text-[var(--primary)]">{index + 1}</div>
                    <h3 className="font-display text-xl font-semibold text-[var(--text)]">{step.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">{step.description}</p>
                  </motion.div>
                ))}
              </div>
              <div className="mt-8 rounded-[1.5rem] border border-[var(--border)] bg-[var(--background)] p-6 text-sm leading-7 text-[var(--text-muted)]">
                <p>Jaidad Group helps homeowners understand the soil testing requirements relevant to their local authority or society, so the foundation plan is based on verified ground information rather than assumptions.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="noc-approval" ref={(node) => { sectionRefs.current['noc-approval'] = node }} className="scroll-mt-24 bg-white py-20">
          <div className="container mx-auto px-4">
            <SectionHeader label="Approval process" title="NOC & Approval Process from Authorities" highlightedWord="Authorities" description="Understanding the approval journey early helps homeowners in MPCHS B-17, Faisal Town, Faisal Hills, and Faisal Margalla City avoid delays, confusion, and repeated revisions before construction begins." align="center" />
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
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
          </div>
        </section>

        <section id="trusted-products" ref={(node) => { sectionRefs.current['trusted-products'] = node }} className="scroll-mt-24 bg-[var(--background)] py-20">
          <div className="container mx-auto px-4">
            <SectionHeader label="Materials & Brands We Use" title="Trusted Products for Stronger, Longer-Lasting Homes" highlightedWord="Longer-Lasting" description="We select materials that balance beauty, reliability, and value for modern construction projects in Islamabad and Rawalpindi." align="center" />
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {brands.map((brand, index) => (
                <motion.div key={brand.name} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.04 }} className="overflow-hidden rounded-[1.5rem] border border-[var(--border)] bg-white shadow-sm">
                  <img src={brand.image} alt={brand.alt} loading="lazy" className="h-32 w-full object-cover" />
                  <div className="p-6">
                    <h3 className="font-display text-xl font-semibold text-[var(--text)]">{brand.name}</h3>
                    <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">{brand.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="testimonials" className="bg-white py-20">
          <div className="container mx-auto px-4">
            <SectionHeader label="Client Testimonials" title="What Our Clients Say About Working With Us" highlightedWord="Us" description="Client confidence matters to us, and our results reflect that commitment." align="center" />
            <div className="mt-12">
              <div className="hidden items-center justify-center gap-4 md:flex">
                <button type="button" onClick={() => goToTestimonial('prev')} className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border)] bg-white text-[var(--text)] shadow-sm transition hover:border-[var(--primary)] hover:text-[var(--primary)]" aria-label="Previous testimonial">
                  <FiArrowLeft className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-4 lg:gap-6">
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 0.7, x: 0 }} transition={{ duration: 0.35 }} className="hidden w-72 rounded-[2rem] border border-[var(--border)] bg-[var(--background)] p-6 shadow-sm lg:block">
                    <img src={previousTestimonial.image} alt={previousTestimonial.name} className="h-14 w-14 rounded-full object-cover" loading="lazy" />
                    <div className="mt-4 flex gap-1 text-[var(--primary)]">{Array.from({ length: previousTestimonial.rating }).map((_, idx) => (<FiStar key={idx} className="h-4 w-4" />))}</div>
                    <p className="mt-4 text-sm leading-7 text-[var(--text-muted)]">“{previousTestimonial.review}”</p>
                    <p className="mt-5 font-semibold text-[var(--text)]">{previousTestimonial.name}</p>
                    <p className="text-sm text-[var(--text-muted)]">{previousTestimonial.location}</p>
                  </motion.div>
                  <motion.div key={currentTestimonial.name} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="w-full max-w-2xl rounded-[2rem] border border-[var(--primary)]/20 bg-[var(--background)] p-8 shadow-[0_30px_90px_rgba(15,23,42,0.08)] sm:p-10">
                    <img src={currentTestimonial.image} alt={currentTestimonial.name} className="h-20 w-20 rounded-full object-cover" loading="lazy" />
                    <div className="mt-5 flex gap-1 text-[var(--primary)]">{Array.from({ length: currentTestimonial.rating }).map((_, idx) => (<FiStar key={idx} className="h-4 w-4" />))}</div>
                    <p className="mt-5 text-lg leading-8 text-[var(--text-muted)]">“{currentTestimonial.review}”</p>
                    <div className="mt-6">
                      <p className="font-semibold text-[var(--text)]">{currentTestimonial.name}</p>
                      <p className="text-sm text-[var(--text-muted)]">{currentTestimonial.location}</p>
                    </div>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 0.7, x: 0 }} transition={{ duration: 0.35 }} className="hidden w-72 rounded-[2rem] border border-[var(--border)] bg-[var(--background)] p-6 shadow-sm lg:block">
                    <img src={nextTestimonial.image} alt={nextTestimonial.name} className="h-14 w-14 rounded-full object-cover" loading="lazy" />
                    <div className="mt-4 flex gap-1 text-[var(--primary)]">{Array.from({ length: nextTestimonial.rating }).map((_, idx) => (<FiStar key={idx} className="h-4 w-4" />))}</div>
                    <p className="mt-4 text-sm leading-7 text-[var(--text-muted)]">“{nextTestimonial.review}”</p>
                    <p className="mt-5 font-semibold text-[var(--text)]">{nextTestimonial.name}</p>
                    <p className="text-sm text-[var(--text-muted)]">{nextTestimonial.location}</p>
                  </motion.div>
                </div>
                <button type="button" onClick={() => goToTestimonial('next')} className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border)] bg-white text-[var(--text)] shadow-sm transition hover:border-[var(--primary)] hover:text-[var(--primary)]" aria-label="Next testimonial">
                  <FiArrowRight className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-6 md:hidden">
                <motion.div key={currentTestimonial.name} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="rounded-[2rem] border border-[var(--primary)]/20 bg-[var(--background)] p-6 shadow-sm" onTouchStart={(event) => setTouchStartX(event.touches[0].clientX)} onTouchEnd={(event) => {
                  if (touchStartX === null) return
                  const delta = event.changedTouches[0].clientX - touchStartX
                  if (delta > 50) {
                    goToTestimonial('prev')
                  } else if (delta < -50) {
                    goToTestimonial('next')
                  }
                  setTouchStartX(null)
                }}>
                  <img src={currentTestimonial.image} alt={currentTestimonial.name} className="h-16 w-16 rounded-full object-cover" loading="lazy" />
                  <div className="mt-4 flex gap-1 text-[var(--primary)]">{Array.from({ length: currentTestimonial.rating }).map((_, idx) => (<FiStar key={idx} className="h-4 w-4" />))}</div>
                  <p className="mt-4 text-sm leading-8 text-[var(--text-muted)]">“{currentTestimonial.review}”</p>
                  <div className="mt-5">
                    <p className="font-semibold text-[var(--text)]">{currentTestimonial.name}</p>
                    <p className="text-sm text-[var(--text-muted)]">{currentTestimonial.location}</p>
                  </div>
                </motion.div>
              </div>
              <div className="mt-8 flex justify-center gap-3">
                {testimonials.map((testimonial, index) => (
                  <button key={testimonial.name} type="button" onClick={() => setActiveTestimonial(index)} className={cn('h-2.5 rounded-full transition-all', activeTestimonial === index ? 'w-8 bg-[var(--primary)]' : 'w-2.5 bg-[var(--border)]')} aria-label={`Go to testimonial ${index + 1}`} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="faqs" className="bg-[var(--background)] py-20">
          <div className="container mx-auto px-4">
            <SectionHeader label="Frequently Asked Questions" title="Answers to the Questions Homeowners Ask Most" highlightedWord="Most" description="Clear answers about cost, timing, materials, and the construction journey." align="center" />
            <div className="mx-auto grid max-w-5xl gap-4 lg:grid-cols-2">
              {faqs.map((faq, index) => {
                const isOpen = activeFaq === index

                return (
                  <motion.div
                    key={faq.question}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: index * 0.04 }}
                    className="overflow-hidden rounded-[1.5rem] border border-[var(--border)] bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)]"
                  >
                    <button type="button" className="flex w-full items-start justify-between gap-4 px-6 py-5 text-left" onClick={() => setActiveFaq(isOpen ? null : index)}>
                      <span className="max-w-[90%] text-sm font-semibold leading-7 text-[var(--text)] sm:text-base">{faq.question}</span>
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--primary)]/10 text-lg font-semibold text-[var(--primary)]">
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen ? (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.24, ease: 'easeInOut' }}>
                          <p className="px-6 pb-6 text-sm leading-7 text-[var(--text-muted)]">{faq.answer}</p>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        <section id="contact" className="bg-white py-20">
          <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <SectionHeader label="Contact Jaidad Group" title="Start Building Your Dream Home Today" highlightedWord="Today" description="Tell us about your plot, preferred construction type, and the kind of home you want to create." align="left" className="mb-0" />
              <div className="mt-8 space-y-4 text-sm text-[var(--text-muted)]">
                <p className="flex items-center gap-3"><FiPhone className="h-4 w-4 text-[var(--primary)]" /> <a href="tel:+923310071314" className="transition hover:text-[var(--primary)]">+92 331 0071314</a></p>
                <p className="flex items-center gap-3"><FiMessageCircle className="h-4 w-4 text-[var(--primary)]" /> <a href="mailto:info@thejaidadgroup.com" className="transition hover:text-[var(--primary)]">info@thejaidadgroup.com</a></p>
                <p className="flex items-center gap-3"><FaWhatsapp className="h-4 w-4 text-green-600" /> <a href="https://wa.me/923310071314" target="_blank" rel="noreferrer" className="transition hover:text-[var(--primary)]">WhatsApp for instant consultation</a></p>
                <p className="flex items-center gap-3"><FiMapPin className="h-4 w-4 text-[var(--primary)]" /> Plot # 17, 1st Floor, Jaidad Group, Al Aziz Arcade, Commercial, Near Attock Petroleum, Main Markaz, Block E, Multi Gardens B-17, Islamabad 42200</p>
              </div>
              <div className="mt-8 overflow-hidden rounded-[2rem] border border-[var(--border)] bg-white p-3 shadow-sm">
                <iframe
                  title="Jaidad Group office map"
                  src="https://www.google.com/maps?q=J%20Jaidad%20Group%20B-17%20Islamabad&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-72 w-full rounded-[1.5rem] border-0"
                  allowFullScreen
                />
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
              <a href={buildWhatsAppLink('Hello Jaidad Group,\n\nI am interested in your construction services. Please contact me.\n\nThank you.')} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[var(--primary)] transition hover:scale-[1.02]">
                <FaWhatsapp className="h-4 w-4" /> WhatsApp Now
              </a>
              <a href={`tel:${PHONE_NUMBER.replace('+', '')}`} className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                <FiPhone className="h-4 w-4" /> Call Now
              </a>
              <a href={buildWhatsAppLink('Hello Jaidad Group,\n\nI would like to request a detailed construction estimate for my project. Please contact me.\n\nThank you.')} className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                <FiArrowRight className="h-4 w-4" /> Request Estimate
              </a>
            </div>
          </div>
        </section>

        <footer className="border-t border-[var(--border)] bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.85fr_0.85fr]">
              <div>
                <h3 className="font-display text-2xl font-semibold text-[var(--text)]">Jaidad Group</h3>
                <p className="mt-3 text-sm uppercase tracking-[0.24em] text-[var(--primary)]">Premium Real Estate</p>
                <p className="mt-4 max-w-md text-sm leading-7 text-[var(--text-muted)]">Premium property and construction guidance for homes, approvals, and quality-driven project delivery in Islamabad and nearby communities.</p>
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold text-[var(--text)]">Contact Information</h3>
                <div className="mt-4 space-y-3 text-sm text-[var(--text-muted)]">
                  <p className="font-semibold text-[var(--text)]">Office Address</p>
                  <p className="leading-7">{OFFICE_ADDRESS}</p>
                  <a href={buildMailtoLink(EMAIL_ADDRESS)} className="block transition hover:text-[var(--primary)]">Email: {EMAIL_ADDRESS}</a>
                  <a href={buildWhatsAppLink('Hello Jaidad Group,\n\nI need information about 5 Marla house construction in MPCHS B-17.\n\nPlease guide me.\n\nThank you.')} target="_blank" rel="noreferrer" className="block transition hover:text-[var(--primary)]">WhatsApp: +92 331 0071314</a>
                </div>
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold text-[var(--text)]">Quick Links</h3>
                <ul className="mt-4 space-y-3 text-sm text-[var(--text-muted)]">
                  <li><Link to="/" className="transition hover:text-[var(--primary)]">Home</Link></li>
                  <li><Link to="/construction" className="transition hover:text-[var(--primary)]">Construction</Link></li>
                  <li><Link to="/residential-plots" className="transition hover:text-[var(--primary)]">Residential Plots</Link></li>
                  <li><Link to="/commercial-plots" className="transition hover:text-[var(--primary)]">Commercial Plots</Link></li>
                  <li><Link to="/houses" className="transition hover:text-[var(--primary)]">Houses</Link></li>
                  <li><Link to="/shop-flat-offices" className="transition hover:text-[var(--primary)]">Shop Flat Offices</Link></li>
                  <li><Link to="/properties" className="transition hover:text-[var(--primary)]">Properties</Link></li>
                  <li><Link to="/residential-plots" className="transition hover:text-[var(--primary)]">Residential Properties</Link></li>
                  <li><Link to="/commercial-plots" className="transition hover:text-[var(--primary)]">Commercial Properties</Link></li>
                  <li><Link to="/properties" className="transition hover:text-[var(--primary)]">Plots & Land</Link></li>
                  <li><Link to="/apartments" className="transition hover:text-[var(--primary)]">Apartments</Link></li>
                  <li><Link to="/farmhouses" className="transition hover:text-[var(--primary)]">Farm Houses</Link></li>
                  <li><Link to="/contact" className="transition hover:text-[var(--primary)]">Contact Us</Link></li>
                </ul>
              </div>
            </div>
            <div className="mt-10 rounded-[2rem] border border-[var(--border)] bg-[var(--background)] p-6 shadow-sm">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h3 className="font-display text-xl font-semibold text-[var(--text)]">Stay Updated</h3>
                  <p className="mt-2 max-w-xl text-sm leading-7 text-[var(--text-muted)]">Get the latest property listings & news delivered to you.</p>
                </div>
                <form onSubmit={handleNewsletterSubmit} className="flex w-full max-w-xl flex-col gap-3 sm:flex-row">
                  <input value={newsletterEmail} onChange={(event) => { setNewsletterEmail(event.target.value); if (newsletterState !== 'idle') { setNewsletterState('idle'); setNewsletterMessage('') } }} type="email" placeholder="Your email address" className="w-full rounded-full border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--primary)]" />
                  <button type="submit" className={cn(buttonVariants({ variant: 'primary', size: 'md' }), 'justify-center')}>Subscribe</button>
                </form>
              </div>
              {newsletterMessage ? <p className={cn('mt-3 text-sm', newsletterState === 'success' ? 'text-emerald-600' : 'text-rose-600')}>{newsletterMessage}</p> : null}
            </div>
          </div>
        </footer>

        <div className="border-t border-[var(--border)] bg-white/90 py-6">
          <div className="container mx-auto flex flex-col gap-3 px-4 text-sm text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Jaidad Group. All rights reserved.</p>
            <div className="flex flex-wrap gap-4">
              <Link to="/privacy-policy" className="transition hover:text-[var(--primary)]">Privacy Policy</Link>
              <Link to="/terms" className="transition hover:text-[var(--primary)]">Terms</Link>
            </div>
          </div>
        </div>

      </main>
    </>
  )
}
