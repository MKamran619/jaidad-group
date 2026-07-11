import { useState, useEffect, useRef, type MouseEvent } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX, FiPhone, FiChevronDown } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { Button, buttonVariants } from '@/components/ui/Button'
import { NAV_ITEMS } from '@/lib/utils/constants'
import { ThemeSwitcher } from '@/components/layout/ThemeSwitcher'
import { useSettings } from '@/hooks/useSettings'
import { cn } from '@/lib/utils/cn'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [hoveredMenuItem, setHoveredMenuItem] = useState<string | null>(null)
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null)
  const { data: settings } = useSettings()
  const location = useLocation()
  const headerRef = useRef<HTMLElement | null>(null)
  const closeTimerRef = useRef<number | null>(null)

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

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleOutsideClick = (event: Event) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setActiveMenu(null)
        setHoveredMenuItem(null)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('touchstart', handleOutsideClick)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('touchstart', handleOutsideClick)
    }
  }, [])

  const isAdminPage = location.pathname.startsWith('/admin')
  if (isAdminPage) return null

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }

  const scheduleMenuClose = () => {
    clearCloseTimer()
    closeTimerRef.current = window.setTimeout(() => {
      setActiveMenu(null)
      setHoveredMenuItem(null)
    }, 240)
  }

  const handleMenuEnter = (label: string) => {
    clearCloseTimer()
    setActiveMenu(label)
  }

  const handleMenuLeave = () => {
    scheduleMenuClose()
  }

  const toggleMenuOnTouch = (label: string, event: MouseEvent<HTMLAnchorElement>) => {
    const item = NAV_ITEMS.find((entry) => entry.label === label)
    if (!item) return

    const submenuItems = 'subItems' in item ? item.subItems : undefined
    const submenuGroups = 'groups' in item ? item.groups : undefined
    const hasSubmenu = Boolean(submenuItems?.length || submenuGroups?.length)

    if (!hasSubmenu) return

    event.preventDefault()
    setActiveMenu((current) => (current === label ? null : label))
  }

  const toggleMobileDropdown = (label: string) => {
    setMobileDropdown((current) => (current === label ? null : label))
  }

  return (
    <>
      {/* Top Bar — only shown when there's content to display */}
      {(welcomeText || phone || whatsapp) && (
        <div className="hidden md:block bg-[var(--surface-alt)] text-[var(--text-muted)] text-xs py-2">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <p>{welcomeText}</p>
            <div className="flex items-center gap-4">
              {phone && (
                <a href={`tel:${phone}`} className="flex items-center gap-1 hover:text-[var(--primary)] transition-colors">
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
        ref={headerRef}
        className={cn(
          'sticky top-0 z-40 w-full transition-all duration-300',
          scrolled
            ? 'bg-[var(--background)]/95 backdrop-blur-xl shadow-lg border-b border-[var(--border)]'
            : 'bg-[var(--background)] border-b border-[var(--border)]'
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-18 items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-[var(--primary)] shadow-lg">
                <span className="font-display font-black text-white text-lg">J+</span>
              </div>
              <div className="hidden sm:block">
                <p className="font-display font-bold text-[var(--text)] text-sm leading-tight">Jaidad Group</p>
                <p className="text-[10px] text-[var(--text-muted)] leading-tight">Premium Real Estate</p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const submenuItems = 'subItems' in item ? item.subItems : undefined
                const submenuGroups = 'groups' in item ? item.groups : undefined
                const hasSubmenu = Boolean(submenuItems?.length || submenuGroups?.length)
                const isActiveMenu = activeMenu === item.label

                return (
                <div
                  key={item.label}
                  className="relative px-2"
                  onMouseEnter={() => {
                    if (hasSubmenu) handleMenuEnter(item.label)
                  }}
                  onMouseLeave={handleMenuLeave}
                >
                  <NavLink
                    to={item.href}
                    onClick={(event) => {
                      if (hasSubmenu && ('ontouchstart' in window)) {
                        toggleMenuOnTouch(item.label, event as unknown as MouseEvent<HTMLAnchorElement>)
                      }
                    }}
                    onMouseEnter={() => setHoveredMenuItem(item.label)}
                    onMouseLeave={() => setHoveredMenuItem(null)}
                    className={({ isActive }) => {
                      const isHovered = hoveredMenuItem === item.label
                      return cn(
                        'inline-flex h-12 items-center gap-1 px-3.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer',
                        isActive
                          ? 'text-[var(--primary)] bg-[var(--primary)]/10 font-semibold shadow-sm'
                          : isHovered
                          ? 'text-[var(--primary)] bg-[var(--primary)]/20 shadow-sm'
                          : 'text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/20 hover:shadow-sm'
                      )
                    }}
                  >
                    {item.label}
                    {hasSubmenu ? <FiChevronDown className="ml-1 h-3 w-3 text-[var(--text-muted)] transition-transform duration-150" /> : null}
                  </NavLink>

                  {hasSubmenu ? (
                    <AnimatePresence>
                      {isActiveMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.22, ease: 'easeOut' }}
                          className="absolute left-0 top-full z-[60] mt-0 flex min-w-[620px] max-w-[740px] rounded-2xl border border-[var(--border)] bg-[var(--background)] p-2 pr-3 text-xs shadow-xl"
                          onMouseEnter={clearCloseTimer}
                          onMouseLeave={handleMenuLeave}
                        >
                          {submenuGroups ? (
                            <div className="grid grid-cols-2 gap-2">
                              {submenuGroups.map((group) => (
                                <div key={group.title} className="space-y-2 rounded-2xl bg-[var(--surface-alt)] p-3 text-center">
                                  <NavLink
                                    to={group.href ?? item.href}
                                    className="block w-full text-center text-[0.72rem] font-semibold text-[var(--text)] hover:text-[var(--primary)]"
                                  >
                                    {group.title}
                                  </NavLink>
                                  <div className="space-y-1">
                                    {group.items.map((subItem) => (
                                      <NavLink
                                        key={subItem.href + subItem.label}
                                        to={subItem.href}
                                        className={({ isActive }) =>
                                          cn(
                                            'block rounded-xl px-2.5 py-2 text-[0.70rem] font-medium transition-all duration-150',
                                            isActive
                                              ? 'text-[var(--primary)] bg-[var(--primary)]/10'
                                              : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)]'
                                          )
                                        }
                                      >
                                        {subItem.label}
                                      </NavLink>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            submenuItems?.map((subItem) => (
                              <NavLink
                                key={subItem.href}
                                to={subItem.href}
                                className={({ isActive }) =>
                                  cn(
                                    'block rounded-xl px-2.5 py-2 text-[0.70rem] font-medium transition-all duration-150',
                                    isActive
                                      ? 'text-[var(--primary)] bg-[var(--primary)]/10'
                                      : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)]'
                                  )
                                }
                              >
                                {subItem.label}
                              </NavLink>
                            ))
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  ) : null}
                </div>
                )
              })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <ThemeSwitcher />

              <Link
                to="/contact"
                className={cn(buttonVariants({ variant: 'primary', size: 'sm' }), 'hidden sm:inline-flex')}
              >
                Get Quote
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden h-9 w-9 rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)]"
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
              className="lg:hidden border-t border-[var(--border)] bg-[var(--background)]"
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
                          ? 'text-[var(--primary)] bg-[var(--primary)]/10'
                          : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)]'
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
