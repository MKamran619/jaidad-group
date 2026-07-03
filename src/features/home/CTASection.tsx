import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowRight, FiPhone } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { buttonVariants } from '@/components/ui/Button'
import { useSettings } from '@/hooks/useSettings'
import { cn } from '@/lib/utils/cn'

export function CTASection() {
  const { data: settings } = useSettings()
  const phone    = settings?.['phone']    as string | undefined
  const whatsapp = (settings?.['whatsapp'] as string | undefined)?.replace(/\D/g, '')

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 gold-gradient opacity-90" />
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}
      />

      <div className="container relative mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-3">Ready to Start?</p>
          <h2 className="font-display text-3xl md:text-5xl font-black text-white mb-5 leading-tight">
            Find Your Perfect Property Today
          </h2>
          <p className="text-white/80 text-base mb-8">
            Speak with our expert agents and let us guide you to your ideal home or investment.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/properties" className={buttonVariants({ variant: 'secondary', size: 'lg' })}>
              Browse Properties <FiArrowRight className="h-4 w-4" />
            </Link>
            {phone && (
              <a href={`tel:${phone}`} className={buttonVariants({ variant: 'glass', size: 'lg' })}>
                <FiPhone className="h-4 w-4" />
                Call Us Now
              </a>
            )}
            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className={cn(buttonVariants({ variant: 'glass', size: 'lg' }), 'bg-green-500/20 border-green-400/30 hover:bg-green-500/40')}
              >
                <FaWhatsapp className="h-4 w-4" />
                WhatsApp
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
