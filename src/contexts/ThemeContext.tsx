import { createContext, useContext, useEffect, ReactNode } from 'react'
import { useKV } from '@github/spark/hooks'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useKV<Theme>('portfolio-theme', 'light')

  const currentTheme = theme || 'light'

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(currentTheme)
  }, [currentTheme])

  const toggleTheme = () => {
    setTheme((currentTheme) => ((currentTheme || 'light') === 'light' ? 'dark' : 'light'))
  }

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, setTheme, toggleTheme }}>
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
