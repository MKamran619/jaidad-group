import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Header } from './Header'
import { Footer } from './Footer'

const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.25 },
} as const

export function Layout() {
  const location = useLocation()
  const isSinglePageFooterRoute = location.pathname === '/construction/b-17-mpchs/5-marla-house-construction-in-b-17'

  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      <Header />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          {...pageTransition}
          className="flex-1"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      {!isSinglePageFooterRoute && <Footer />}
    </div>
  )
}
