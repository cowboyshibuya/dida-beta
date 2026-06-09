import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

export type Mode = 'light' | 'dark'
export type Density = 'comfortable' | 'compact'
export type BodyFont = 'sans' | 'serif'

type ThemeState = {
  mode: Mode
  density: Density
  font: BodyFont
}

type ThemeContextValue = ThemeState & {
  setMode: (m: Mode) => void
  toggleMode: () => void
  setDensity: (d: Density) => void
  setFont: (f: BodyFont) => void
}

const STORAGE_KEY = 'dida.theme'
const DEFAULTS: ThemeState = {
  mode: 'light',
  density: 'comfortable',
  font: 'sans',
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function read(): ThemeState {
  if (typeof localStorage === 'undefined') return DEFAULTS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULTS
    return { ...DEFAULTS, ...JSON.parse(raw) }
  } catch {
    return DEFAULTS
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ThemeState>(DEFAULTS)

  // hydrate from localStorage on the client (avoids SSR mismatch)
  useEffect(() => {
    setState(read())
  }, [])

  useEffect(() => {
    if (typeof localStorage === 'undefined') return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const value = useMemo<ThemeContextValue>(
    () => ({
      ...state,
      setMode: (mode) => setState((s) => ({ ...s, mode })),
      toggleMode: () =>
        setState((s) => ({ ...s, mode: s.mode === 'dark' ? 'light' : 'dark' })),
      setDensity: (density) => setState((s) => ({ ...s, density })),
      setFont: (font) => setState((s) => ({ ...s, font })),
    }),
    [state],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}

/** Computes the class list for the root `.app` element. */
export function appClassName(state: ThemeState, extra?: string) {
  return [
    'app',
    state.mode === 'dark' ? 'dark' : '',
    state.density === 'compact' ? 'compact' : '',
    state.font === 'serif' ? 'serifbody' : '',
    extra ?? '',
  ]
    .filter(Boolean)
    .join(' ')
}
