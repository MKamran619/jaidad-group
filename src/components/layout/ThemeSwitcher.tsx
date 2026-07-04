import { useEffect, useRef, useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'
import { useTheme } from '@/hooks/useTheme'
import { getLightThemes, getDarkThemes } from '@/lib/themes'
import { cn } from '@/lib/utils/cn'

export function ThemeSwitcher() {
  const { theme, themeId, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const lightThemes = getLightThemes()
  const darkThemes = getDarkThemes()

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="h-9 px-3 rounded-xl border border-[var(--border)] flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)] transition-all"
        aria-label="Choose theme"
      >
        <span className="text-base leading-none">{theme.icon}</span>
        <FiChevronDown className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 max-h-96 overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--card-bg)] backdrop-blur-xl shadow-2xl p-3 z-50">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-2 px-1">Light</p>
          <div className="grid grid-cols-2 gap-1.5 mb-3">
            {lightThemes.map((t) => (
              <button
                key={t.id}
                onClick={() => { setTheme(t.id); setOpen(false) }}
                className={cn(
                  'flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-left transition-all',
                  themeId === t.id
                    ? 'bg-[var(--primary)]/15 text-[var(--primary)] font-semibold'
                    : 'text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--text)]'
                )}
              >
                <span>{t.icon}</span>
                <span className="truncate">{t.name}</span>
              </button>
            ))}
          </div>

          <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-2 px-1">Dark</p>
          <div className="grid grid-cols-2 gap-1.5">
            {darkThemes.map((t) => (
              <button
                key={t.id}
                onClick={() => { setTheme(t.id); setOpen(false) }}
                className={cn(
                  'flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-left transition-all',
                  themeId === t.id
                    ? 'bg-[var(--primary)]/15 text-[var(--primary)] font-semibold'
                    : 'text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--text)]'
                )}
              >
                <span>{t.icon}</span>
                <span className="truncate">{t.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
