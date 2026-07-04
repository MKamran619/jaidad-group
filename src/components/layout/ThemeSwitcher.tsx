import { FiSun, FiMoon } from 'react-icons/fi'
import { useTheme } from '@/hooks/useTheme'

export function ThemeSwitcher() {
  const { isDark, toggle } = useTheme()

  return (
    <button
      onClick={toggle}
      className="h-9 w-9 rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)] transition-all"
      aria-label="Toggle light/dark theme"
    >
      {isDark ? <FiSun className="h-4 w-4" /> : <FiMoon className="h-4 w-4" />}
    </button>
  )
}
