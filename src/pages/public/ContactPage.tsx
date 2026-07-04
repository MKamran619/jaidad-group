import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FiPhone, FiMail, FiMapPin, FiClock, FiCheckCircle } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { useSettings } from '@/hooks/useSettings'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  subject: z.string().min(1, 'Please select a subject'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
})

type FormData = z.infer<typeof schema>

interface Office {
  city: string
  address: string
  phone: string
  hours: string
}

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const { data: settings } = useSettings()

  const email    = settings?.['email']    as string | undefined
  const whatsapp = (settings?.['whatsapp'] as string | undefined)?.replace(/\D/g, '')
  const offices: Office[] = (settings?.['offices'] as Office[] | undefined) ?? []

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    await new Promise((r) => setTimeout(r, 1000))
    console.log('Inquiry:', data)
    setSubmitted(true)
    reset()
  }

  return (
    <>
      <Helmet>
        <title>Contact Us – J+ Jaidad Group</title>
        <meta name="description" content="Get in touch with J+ Jaidad Group. Visit our offices or send us a message online." />
      </Helmet>

      {/* Header */}
      <div className="bg-[var(--color-brand-black)] py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--primary)] mb-3">Get in Touch</p>
            <h1 className="font-display text-4xl md:text-5xl font-black text-white mb-4">Contact <span className="gradient-text">Us</span></h1>
            <p className="text-white/60 max-w-xl mx-auto">Our team is here to help you find your perfect property. Reach out anytime.</p>
          </motion.div>
        </div>
      </div>

      <section className="section-padding">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Contact Info */}
            <div className="space-y-6">
              {offices.length > 0 && (
                <div>
                  <h2 className="font-display text-xl font-bold text-[var(--text)] mb-5">Our Offices</h2>
                  <div className="space-y-5">
                    {offices.map((office) => (
                      <div key={office.city} className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
                        <h3 className="font-semibold text-[var(--text)] mb-3">{office.city}</h3>
                        <div className="space-y-2 text-sm text-[var(--text-muted)]">
                          <div className="flex gap-2"><FiMapPin className="h-4 w-4 text-[var(--primary)] flex-shrink-0 mt-0.5" />{office.address}</div>
                          <div className="flex gap-2"><FiPhone className="h-4 w-4 text-[var(--primary)] flex-shrink-0 mt-0.5" /><a href={`tel:${office.phone}`} className="hover:text-[var(--primary)]">{office.phone}</a></div>
                          <div className="flex gap-2"><FiClock className="h-4 w-4 text-[var(--primary)] flex-shrink-0 mt-0.5" />{office.hours}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {email && (
                  <a href={`mailto:${email}`} className="flex items-center gap-3 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)] transition-colors">
                    <div className="h-10 w-10 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center">
                      <FiMail className="h-5 w-5 text-[var(--primary)]" />
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-muted)]">Email Us</p>
                      <p className="text-sm font-medium text-[var(--text)]">{email}</p>
                    </div>
                  </a>
                )}
                {whatsapp && (
                  <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-4 rounded-xl border border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/30 hover:border-green-400 transition-colors">
                    <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                      <FaWhatsapp className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-muted)]">WhatsApp</p>
                      <p className="text-sm font-medium text-[var(--text)]">+{whatsapp}</p>
                    </div>
                  </a>
                )}
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8">
                <h2 className="font-display text-2xl font-bold text-[var(--text)] mb-6">Send Us a Message</h2>

                {submitted ? (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                      <FiCheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-[var(--text)] mb-2">Message Sent!</h3>
                    <p className="text-[var(--text-muted)] mb-5">Our team will get back to you within 24 hours.</p>
                    <Button variant="outline" onClick={() => setSubmitted(false)}>Send Another</Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Input label="Full Name" placeholder="Your full name" required error={errors.name?.message} {...register('name')} />
                      <Input label="Email" type="email" placeholder="your@email.com" required error={errors.email?.message} {...register('email')} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Input label="Phone" type="tel" placeholder="+92 300 0000000" required error={errors.phone?.message} {...register('phone')} />
                      <Select
                        label="Subject"
                        required
                        options={[
                          { value: 'buy',          label: 'I want to buy a property'  },
                          { value: 'sell',         label: 'I want to sell my property' },
                          { value: 'rent',         label: 'I want to rent a property'  },
                          { value: 'invest',       label: 'Investment Inquiry'          },
                          { value: 'construction', label: 'Construction Services'       },
                          { value: 'other',        label: 'Other'                       },
                        ]}
                        placeholder="Select subject"
                        {...register('subject')}
                      />
                    </div>
                    <Textarea label="Message" placeholder="Tell us more about your requirements..." rows={5} required error={errors.message?.message} {...register('message')} />
                    <Button type="submit" variant="primary" size="lg" className="w-full" loading={isSubmitting}>
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map placeholder */}
      <div className="h-80 bg-[var(--surface)] border-t border-[var(--border)] flex items-center justify-center">
        <div className="text-center">
          <FiMapPin className="h-10 w-10 mx-auto mb-3 text-[var(--primary)]" />
          <p className="text-[var(--text-muted)] text-sm">Map will appear once Google Maps URL is set in settings</p>
        </div>
      </div>
    </>
  )
}
