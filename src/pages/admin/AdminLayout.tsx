import { useState, useEffect } from 'react'
import { Outlet, Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiHome, FiGrid, FiLayers, FiTool, FiFileText, FiImage,
  FiMessageSquare, FiUsers, FiSettings, FiMenu, FiX, FiBell,
  FiLogOut, FiBarChart2, FiStar, FiMail,
} from 'react-icons/fi'
import { supabase } from '@/lib/supabase/client'
import { cn } from '@/lib/utils/cn'

const NAV = [
  { icon: FiGrid, label: 'Dashboard', href: '/admin/dashboard' },
  { icon: FiHome, label: 'Residential Plots', href: '/admin/properties' },
  { icon: FiLayers, label: 'Projects', href: '/admin/projects' },
  { icon: FiTool, label: 'Construction', href: '/admin/construction' },
  { icon: FiFileText, label: 'Blogs', href: '/admin/blogs' },
  { icon: FiImage, label: 'Gallery', href: '/admin/gallery' },
  { icon: FiStar, label: 'Testimonials', href: '/admin/testimonials' },
  { icon: FiMessageSquare, label: 'Inquiries', href: '/admin/inquiries' },
  { icon: FiMail, label: 'Messages', href: '/admin/messages' },
  { icon: FiUsers, label: 'Agents', href: '/admin/agents' },
  { icon: FiBarChart2, label: 'Analytics', href: '/admin/analytics' },
  { icon: FiSettings, label: 'Settings', href: '/admin/settings' },
]

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate('/admin/login')
    })
  }, [navigate])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  return (
    <div className="flex h-screen bg-[var(--background)] overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 256, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0 h-full border-r border-[var(--border)] bg-[var(--surface)] flex flex-col overflow-hidden"
          >
            {/* Logo */}
            <div className="flex h-16 items-center gap-3 px-5 border-b border-[var(--border)] flex-shrink-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--primary)] flex-shrink-0">
                <span className="font-display font-black text-white text-sm">J+</span>
              </div>
              <div className="min-w-0">
                <p className="font-display font-bold text-[var(--text)] text-sm truncate">Jaidad Group</p>
                <p className="text-[10px] text-[var(--text-muted)]">Admin Panel</p>
              </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
              {NAV.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all transform',
                      isActive
                        ? 'bg-[var(--primary)] text-white shadow-sm'
                        : 'text-[var(--text-muted)] hover:bg-[var(--background)] hover:text-[var(--text)] hover:scale-105'
                    )
                  }
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              ))}
            </nav>

            {/* Footer */}
            <div className="border-t border-[var(--border)] p-3">
              <Link to="/" target="_blank" className="flex items-center gap-2 px-3 py-2 text-xs text-[var(--text-muted)] hover:text-[var(--text)] rounded-lg hover:bg-[var(--background)] transition-colors">
                <FiHome className="h-3.5 w-3.5" />
                View Website
              </Link>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
              >
                <FiLogOut className="h-3.5 w-3.5" />
                Sign Out
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 flex-shrink-0 border-b border-[var(--border)] bg-[var(--surface)] flex items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="h-9 w-9 rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--background)] transition-colors"
            >
              {sidebarOpen ? <FiX className="h-4 w-4" /> : <FiMenu className="h-4 w-4" />}
            </button>
            <div className="h-5 w-px bg-[var(--border)]" />
            <p className="text-sm font-medium text-[var(--text)] capitalize">
              {location.pathname.split('/').pop()?.replace('-', ' ') ?? 'Dashboard'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button className="relative h-9 w-9 rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--background)] transition-colors">
              <FiBell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[var(--primary)]" />
            </button>
            <div className="h-9 w-9 rounded-xl bg-[var(--primary)] flex items-center justify-center text-white font-bold text-xs">
              JG
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
