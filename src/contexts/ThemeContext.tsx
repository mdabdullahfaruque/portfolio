import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useLocalStorage } from '@/hooks/use-local-storage'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useLocalStorage<Theme>('portfolio-theme', 'light')

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme || 'light')
  }, [theme])

  const toggleTheme = () => {
    setTheme((prevTheme) => ((prevTheme || 'light') === 'light' ? 'dark' : 'light'))
  }

  return (
    <ThemeContext.Provider value={{ theme: theme || 'light', setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
