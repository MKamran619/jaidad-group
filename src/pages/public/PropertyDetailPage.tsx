import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Thumbs, FreeMode } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'
import 'swiper/css/free-mode'
import {
  FiHome, FiMapPin, FiPhone, FiShare2,
  FiPrinter, FiDownload, FiCalendar, FiCheckCircle, FiChevronRight,
} from 'react-icons/fi'
import { Bed, Bath, Maximize2 } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import { Badge } from '@/components/ui/Badge'
import { Button, buttonVariants } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { useProperty } from '@/hooks/useProperties'
import { formatPrice, formatArea } from '@/lib/utils/format'
import { useSettings } from '@/hooks/useSettings'

export function PropertyDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: property, isLoading } = useProperty(slug ?? '')
  const { data: settings } = useSettings()
  const [thumbsSwiper, setThumbsSwiper] = useState(null)

  const phone         = settings?.['phone']          as string | undefined
  const whatsapp      = (settings?.['whatsapp'] as string | undefined)?.replace(/\D/g, '')
  const googleMapsUrl = settings?.['google_maps_url'] as string | undefined

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10 space-y-6">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-[500px] w-full rounded-2xl" />
      </div>
    )
  }

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <p className="text-4xl font-black text-[var(--color-text)] mb-4">Property Not Found</p>
        <p className="text-[var(--color-text-muted)] mb-8">This listing may have been removed or the link is incorrect.</p>
        <Link to="/properties" className="inline-block px-6 py-3 bg-[var(--color-brand-gold)] text-white rounded-xl font-semibold hover:opacity-90 transition-opacity">
          Browse Properties
        </Link>
      </div>
    )
  }

  const prop = property
  const whatsappMsg = encodeURIComponent(`Hi, I'm interested in: ${prop.title} — ${prop.address}`)

  return (
    <>
      <Helmet>
        <title>{prop.title} – J+ Jaidad Group</title>
        <meta name="description" content={prop.description?.slice(0, 160)} />
      </Helmet>

      {/* Breadcrumb */}
      <div className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="container mx-auto px-4 py-3 flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
          <Link to="/" className="hover:text-[var(--color-brand-gold)]">Home</Link>
          <FiChevronRight className="h-3 w-3" />
          <Link to="/properties" className="hover:text-[var(--color-brand-gold)]">Properties</Link>
          <FiChevronRight className="h-3 w-3" />
          <span className="text-[var(--color-text)] truncate">{prop.title}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left / Main Content */}
          <div className="xl:col-span-2 space-y-8">
            {/* Gallery */}
            <div className="space-y-3">
              <Swiper
                modules={[Navigation, Thumbs]}
                navigation
                thumbs={{ swiper: thumbsSwiper }}
                className="rounded-2xl overflow-hidden aspect-[16/9]"
              >
                {prop.images?.length ? prop.images.map((img, i) => (
                  <SwiperSlide key={i}>
                    <img src={img} alt={`${prop.title} ${i + 1}`} className="h-full w-full object-cover" />
                  </SwiperSlide>
                )) : (
                  <SwiperSlide>
                    <div className="h-full w-full bg-[var(--color-surface)] flex items-center justify-center">
                      <span className="text-[var(--color-text-muted)] text-sm">No images available</span>
                    </div>
                  </SwiperSlide>
                )}
              </Swiper>
              {prop.images?.length > 1 && (
                <Swiper
                  modules={[FreeMode, Thumbs]}
                  freeMode
                  watchSlidesProgress
                  onSwiper={setThumbsSwiper as never}
                  spaceBetween={8}
                  slidesPerView={5}
                  className="rounded-xl overflow-hidden h-20"
                >
                  {prop.images.map((img, i) => (
                    <SwiperSlide key={i}>
                      <img src={img} alt="" className="h-full w-full object-cover cursor-pointer opacity-60 hover:opacity-100 transition-opacity" />
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </div>

            {/* Title & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="default">
                    {prop.property_purpose === 'sale' ? 'For Sale' : prop.property_purpose === 'rent' ? 'For Rent' : 'Construction'}
                  </Badge>
                  <Badge variant="secondary" className="capitalize">{prop.property_type}</Badge>
                </div>
                <h1 className="font-display text-2xl md:text-3xl font-bold text-[var(--color-text)]">{prop.title}</h1>
                <div className="flex items-center gap-1.5 mt-2 text-sm text-[var(--color-text-muted)]">
                  <FiMapPin className="h-4 w-4 text-[var(--color-brand-gold)]" />
                  {prop.address}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button variant="outline" size="icon" aria-label="Share"><FiShare2 className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon" aria-label="Print"><FiPrinter className="h-4 w-4" /></Button>
                {prop.brochure_url && (
                  <a href={prop.brochure_url} download className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                    <FiDownload className="h-4 w-4" /> Brochure
                  </a>
                )}
              </div>
            </div>

            {/* Price & Key Features */}
            <Card>
              <div className="p-6">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <p className="font-display text-3xl font-black text-[var(--color-brand-gold)]">
                    {formatPrice(prop.price, prop.currency)}
                  </p>
                  {prop.area_unit === 'marla' && (
                    <p className="text-sm text-[var(--color-text-muted)]">
                      PKR {Math.round(prop.price / prop.area).toLocaleString()} per Marla
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { icon: Bed, label: 'Bedrooms', value: prop.bedrooms ?? 'N/A' },
                    { icon: Bath, label: 'Bathrooms', value: prop.bathrooms ?? 'N/A' },
                    { icon: Maximize2, label: 'Area', value: formatArea(prop.area, prop.area_unit) },
                    { icon: FiHome, label: 'Year Built', value: prop.year_built ?? 'N/A' },
                  ].map((item) => (
                    <div key={item.label} className="flex flex-col items-center text-center gap-1.5 p-4 rounded-xl bg-[var(--color-surface)]">
                      <item.icon className="h-5 w-5 text-[var(--color-brand-gold)]" />
                      <span className="font-bold text-[var(--color-text)]">{item.value}</span>
                      <span className="text-xs text-[var(--color-text-muted)]">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Description */}
            <div>
              <h2 className="font-display text-xl font-bold text-[var(--color-text)] mb-4">About This Property</h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed text-sm">{prop.description}</p>
            </div>

            {/* Features */}
            {prop.features?.length > 0 && (
              <div>
                <h2 className="font-display text-xl font-bold text-[var(--color-text)] mb-4">Features</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {prop.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                      <FiCheckCircle className="h-4 w-4 text-[var(--color-brand-gold)] flex-shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities */}
            {prop.amenities?.length > 0 && (
              <div>
                <h2 className="font-display text-xl font-bold text-[var(--color-text)] mb-4">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {prop.amenities.map((a) => (
                    <Badge key={a} variant="secondary">{a}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Map Placeholder */}
            <div>
              <h2 className="font-display text-xl font-bold text-[var(--color-text)] mb-4">Location</h2>
              <div className="h-64 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center">
                <div className="text-center text-[var(--color-text-muted)]">
                  <FiMapPin className="h-8 w-8 mx-auto mb-2 text-[var(--color-brand-gold)]" />
                  <p className="text-sm">{prop.address}</p>
                  {googleMapsUrl && (
                    <a href={googleMapsUrl} target="_blank" rel="noreferrer" className="text-xs text-[var(--color-brand-gold)] hover:underline mt-1 block">
                      Open in Google Maps
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Contact Card */}
            <Card className="sticky top-24">
              <div className="p-6 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-[var(--color-brand-gold)] flex items-center justify-center font-bold text-white text-lg">
                    JG
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--color-text)]">Jaidad Group</p>
                    <p className="text-xs text-[var(--color-text-muted)]">Certified Property Advisor</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {phone && (
                    <a href={`tel:${phone}`} className={buttonVariants({ variant: 'primary', size: 'lg' }) + ' w-full'}>
                      <FiPhone className="h-4 w-4" /> Call Agent
                    </a>
                  )}
                  {whatsapp && (
                    <a
                      href={`https://wa.me/${whatsapp}?text=${whatsappMsg}`}
                      target="_blank"
                      rel="noreferrer"
                      className={buttonVariants({ variant: 'secondary', size: 'lg' }) + ' w-full bg-green-600 hover:bg-green-700'}
                    >
                      <FaWhatsapp className="h-4 w-4" /> WhatsApp
                    </a>
                  )}
                </div>

                <div className="border-t border-[var(--color-border)] pt-4">
                  <p className="text-sm font-semibold text-[var(--color-text)] mb-3">Send Inquiry</p>
                  <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                    <Input placeholder="Your Name" required />
                    <Input type="email" placeholder="Email Address" required />
                    <Input type="tel" placeholder="Phone Number" required />
                    <Textarea placeholder="I'm interested in this property..." rows={3} />
                    <Button type="submit" variant="primary" className="w-full">
                      Send Inquiry
                    </Button>
                  </form>
                </div>

                <Link to="/contact" className={buttonVariants({ variant: 'outline', size: 'sm' }) + ' w-full'}>
                  <FiCalendar className="h-3.5 w-3.5" />
                  Schedule a Visit
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
