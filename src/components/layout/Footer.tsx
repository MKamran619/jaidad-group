import { Link } from 'react-router-dom'
import { FiPhone, FiMail, FiMapPin, FiArrowRight } from 'react-icons/fi'
import { FaFacebook, FaInstagram, FaYoutube, FaLinkedin, FaWhatsapp } from 'react-icons/fa'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { NAV_ITEMS } from '@/lib/utils/constants'
import { useLocation } from 'react-router-dom'
import { useSettings } from '@/hooks/useSettings'

const PROPERTY_LINKS = [
  { label: 'Residential Properties', href: '/properties?type=residential' },
  { label: 'Commercial Properties',  href: '/properties?type=commercial'  },
  { label: 'Plots & Land',           href: '/properties?type=plot'        },
  { label: 'Apartments',             href: '/properties?type=apartment'   },
  { label: 'Farm Houses',            href: '/properties?type=farmhouse'   },
]

const QUICK_LINKS = NAV_ITEMS.slice(0, 6)

export function Footer() {
  const location = useLocation()
  const { data: settings } = useSettings()

  if (location.pathname.startsWith('/admin')) return null

  const phone      = settings?.['phone']        as string | undefined
  const email      = settings?.['email']        as string | undefined
  const address    = settings?.['address']      as string | undefined
  const whatsapp   = (settings?.['whatsapp'] as string | undefined)?.replace(/\D/g, '')
  const footerDesc = settings?.['footer_description'] as string | undefined

  const facebook  = settings?.['social_facebook']  as string | undefined
  const instagram = settings?.['social_instagram'] as string | undefined
  const youtube   = settings?.['social_youtube']   as string | undefined
  const linkedin  = settings?.['social_linkedin']  as string | undefined

  const socialLinks = [
    { icon: FaFacebook,  href: facebook,                     label: 'Facebook'  },
    { icon: FaInstagram, href: instagram,                    label: 'Instagram' },
    { icon: FaYoutube,   href: youtube,                      label: 'YouTube'   },
    { icon: FaLinkedin,  href: linkedin,                     label: 'LinkedIn'  },
    { icon: FaWhatsapp,  href: whatsapp ? `https://wa.me/${whatsapp}` : undefined, label: 'WhatsApp' },
  ].filter((s) => s.href)

  return (
    <footer className="bg-[var(--color-brand-black)] text-white">
      {/* Newsletter Banner */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-2xl font-bold text-white mb-1">Stay Updated</h3>
              <p className="text-white/60 text-sm">Get the latest property listings & news delivered to you</p>
            </div>
            <form className="flex gap-3 w-full md:w-auto" onSubmit={(e) => e.preventDefault()}>
              <Input
                placeholder="Your email address"
                type="email"
                className="md:w-72 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:ring-[var(--primary)]"
              />
              <Button variant="primary" type="submit" size="md">
                Subscribe <FiArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-5">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-[var(--primary)] shadow-lg">
                <span className="font-display font-black text-white text-lg">J+</span>
              </div>
              <div>
                <p className="font-display font-bold text-white text-sm">Jaidad Group</p>
                <p className="text-[10px] text-white/50">Premium Real Estate</p>
              </div>
            </Link>
            {footerDesc && (
              <p className="text-white/60 text-sm leading-relaxed">{footerDesc}</p>
            )}
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-3">
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="h-9 w-9 rounded-lg bg-white/10 flex items-center justify-center text-white/70 hover:bg-[var(--primary)] hover:text-white transition-all duration-200"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3">
              {QUICK_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="text-white/60 text-sm hover:text-[var(--primary)] transition-colors flex items-center gap-2 group"
                  >
                    <FiArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Properties */}
          <div>
            <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">Properties</h4>
            <ul className="space-y-3">
              {PROPERTY_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="text-white/60 text-sm hover:text-[var(--primary)] transition-colors flex items-center gap-2 group"
                  >
                    <FiArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-4">
              {phone && (
                <li>
                  <a href={`tel:${phone}`} className="flex gap-3 text-sm text-white/60 hover:text-white transition-colors">
                    <FiPhone className="h-4 w-4 text-[var(--primary)] mt-0.5 flex-shrink-0" />
                    <span>{phone}</span>
                  </a>
                </li>
              )}
              {email && (
                <li>
                  <a href={`mailto:${email}`} className="flex gap-3 text-sm text-white/60 hover:text-white transition-colors">
                    <FiMail className="h-4 w-4 text-[var(--primary)] mt-0.5 flex-shrink-0" />
                    <span>{email}</span>
                  </a>
                </li>
              )}
              {address && (
                <li>
                  <div className="flex gap-3 text-sm text-white/60">
                    <FiMapPin className="h-4 w-4 text-[var(--primary)] mt-0.5 flex-shrink-0" />
                    <span>{address}</span>
                  </div>
                </li>
              )}
              {whatsapp && (
                <li className="pt-2">
                  <a
                    href={`https://wa.me/${whatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white text-sm px-4 py-2 rounded-xl transition-colors"
                  >
                    <FaWhatsapp className="h-4 w-4" />
                    Chat on WhatsApp
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>© {new Date().getFullYear()} J+ Jaidad Group. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
