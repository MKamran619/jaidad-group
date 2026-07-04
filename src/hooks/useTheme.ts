import { useCallback, useEffect, useState } from 'react'
import { THEMES, DEFAULT_THEME_ID, getTheme } from '@/lib/themes'

const STORAGE_KEY = 'selectedTheme'

function applyTheme(themeId: string) {
  const theme = getTheme(themeId)
  if (!theme) return
  const root = document.documentElement
  root.setAttribute('data-theme', theme.id)
  root.classList.toggle('dark', !theme.isLight)
  document.body.classList.remove('light-mode', 'dark-mode')
  document.body.classList.add(theme.isLight ? 'light-mode' : 'dark-mode')
}

export function useTheme() {
  const [themeId, setThemeId] = useState<string>(() => {
    if (typeof window === 'undefined') return DEFAULT_THEME_ID
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME_ID
  })

  useEffect(() => {
    applyTheme(themeId)
    localStorage.setItem(STORAGE_KEY, themeId)
  }, [themeId])

  const setTheme = useCallback((id: string) => {
    if (getTheme(id)) setThemeId(id)
  }, [])

  const theme = getTheme(themeId) ?? THEMES[0]

  return {
    theme,
    themeId,
    isDark: !theme.isLight,
    isLight: theme.isLight,
    setTheme,
    themes: THEMES,
  }
}
