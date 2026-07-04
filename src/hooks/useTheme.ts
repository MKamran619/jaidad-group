import { useCallback, useEffect, useState } from 'react'
import { getTheme } from '@/lib/themes'
import { useSettings } from '@/hooks/useSettings'

const MODE_STORAGE_KEY = 'themeMode'
export const DEFAULT_LIGHT_THEME_ID = 'light-clean'
export const DEFAULT_DARK_THEME_ID = 'ocean-blue'

type Mode = 'light' | 'dark'

function applyTheme(themeId: string, mode: Mode) {
  const theme = getTheme(themeId)
  if (!theme) return
  const root = document.documentElement
  root.setAttribute('data-theme', theme.id)
  root.classList.toggle('dark', mode === 'dark')
  document.body.classList.remove('light-mode', 'dark-mode')
  document.body.classList.add(mode === 'light' ? 'light-mode' : 'dark-mode')
}

export function useTheme() {
  const { data: settings } = useSettings()
  const [mode, setMode] = useState<Mode>(() => {
    if (typeof window === 'undefined') return 'light'
    const stored = localStorage.getItem(MODE_STORAGE_KEY) as Mode | null
    if (stored === 'light' || stored === 'dark') return stored
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  const lightThemeId = (settings?.['theme_light'] as string | undefined) || DEFAULT_LIGHT_THEME_ID
  const darkThemeId = (settings?.['theme_dark'] as string | undefined) || DEFAULT_DARK_THEME_ID
  const activeThemeId = mode === 'light' ? lightThemeId : darkThemeId

  useEffect(() => {
    applyTheme(activeThemeId, mode)
    localStorage.setItem(MODE_STORAGE_KEY, mode)
  }, [activeThemeId, mode])

  const toggle = useCallback(() => {
    setMode((m) => (m === 'light' ? 'dark' : 'light'))
  }, [])

  const theme = getTheme(activeThemeId)

  return {
    mode,
    theme,
    isLight: mode === 'light',
    isDark: mode === 'dark',
    toggle,
  }
}
