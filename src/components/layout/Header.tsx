import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX, FiPhone, FiMoon, FiSun } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { Button, buttonVariants } from '@/components/ui/Button'
import { NAV_ITEMS } from '@/lib/utils/constants'
import { useTheme } from '@/hooks/useTheme'
import { useSettings } from '@/hooks/useSettings'
import { cn } from '@/lib/utils/cn'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { isDark, toggle } = useTheme()
  const { data: settings } = useSettings()
  const location = useLocation()

  const phone       = settings?.['phone']          as string | undefined
  const whatsapp    = (settings?.['whatsapp'] as string | undefined)?.replace(/\D/g, '')
  const welcomeText = settings?.['header_welcome'] as string | undefined

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  const isAdminPage = location.pathname.startsWith('/admin')
  if (isAdminPage) return null

  return (
    <>
      {/* Top Bar — only shown when there's content to display */}
      {(welcomeText || phone || whatsapp) && (
        <div className="hidden md:block bg-[var(--color-brand-black)] text-white/80 text-xs py-2">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <p>{welcomeText}</p>
            <div className="flex items-center gap-4">
              {phone && (
                <a href={`tel:${phone}`} className="flex items-center gap-1 hover:text-[var(--color-brand-gold)] transition-colors">
                  <FiPhone className="h-3 w-3" />
                  {phone}
                </a>
              )}
              {whatsapp && (
                <a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:text-green-400 transition-colors"
                >
                  <FaWhatsapp className="h-3 w-3" />
                  WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Header */}
      <header
        className={cn(
          'sticky top-0 z-40 w-full transition-all duration-300',
          scrolled
            ? 'bg-[var(--color-background)]/95 backdrop-blur-xl shadow-lg border-b border-[var(--color-border)]'
            : 'bg-[var(--color-background)] border-b border-[var(--color-border)]'
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-18 items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-[var(--color-brand-black)] shadow-lg">
                <span className="font-display font-black text-[var(--color-brand-gold)] text-lg">J+</span>
              </div>
              <div className="hidden sm:block">
                <p className="font-display font-bold text-[var(--color-text)] text-sm leading-tight">Jaidad Group</p>
                <p className="text-[10px] text-[var(--color-text-muted)] leading-tight">Premium Real Estate</p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      'px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'text-[var(--color-brand-gold)] bg-[var(--color-brand-gold)]/10'
                        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)]'
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggle}
                className="h-9 w-9 rounded-xl border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-all"
                aria-label="Toggle theme"
              >
                {isDark ? <FiSun className="h-4 w-4" /> : <FiMoon className="h-4 w-4" />}
              </button>

              <Link
                to="/contact"
                className={cn(buttonVariants({ variant: 'primary', size: 'sm' }), 'hidden sm:inline-flex')}
              >
                Get Quote
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden h-9 w-9 rounded-xl border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-muted)]"
                aria-label="Toggle menu"
              >
                {isOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden border-t border-[var(--color-border)] bg-[var(--color-background)]"
            >
              <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
                {NAV_ITEMS.map((item) => (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all',
                        isActive
                          ? 'text-[var(--color-brand-gold)] bg-[var(--color-brand-gold)]/10'
                          : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)]'
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
                <Link to="/contact" className={cn(buttonVariants({ variant: 'primary' }), 'mt-2')}>
                  Get a Free Quote
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}
