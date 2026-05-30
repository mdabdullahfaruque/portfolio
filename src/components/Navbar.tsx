import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Globe, List, SignOut, User, Moon, Sun } from '@phosphor-icons/react'
import { useTheme } from '@/contexts/ThemeContext'

interface NavbarProps {
  language: string
  onLanguageToggle: () => void
  t: any
  isAdmin: boolean
  onLogout: () => void
}

export function Navbar({ language, onLanguageToggle, t, isAdmin, onLogout }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { to: '/', label: t.nav.home },
    { to: '/experience', label: t.nav.experience },
    { to: '/projects', label: t.nav.projects },
    { to: '/skills', label: t.nav.skills },
    { to: '/contact', label: t.nav.contact },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
      isScrolled 
        ? 'bg-card/95 backdrop-blur-md shadow-sm border-b border-border/50' 
        : 'bg-card/70 backdrop-blur-sm'
    }`}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/">
            <div className="font-semibold text-lg text-foreground hover:text-primary transition-colors">
              Portfolio
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
              >
                <div
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.to 
                      ? 'text-primary bg-primary/10' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  {item.label}
                </div>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleTheme} 
              className="gap-1.5 h-9 w-9 p-0"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon size={18} weight="fill" /> : <Sun size={18} weight="fill" />}
            </Button>

            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onLanguageToggle} 
              className="gap-1.5 h-9"
            >
              <Globe size={16} />
              <span className="text-xs font-medium uppercase">{language}</span>
            </Button>

            {isAdmin && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onLogout} 
                className="gap-1.5 h-9"
              >
                <SignOut size={16} />
                <span className="hidden sm:inline text-xs">Logout</span>
              </Button>
            )}

            {!isAdmin && (
              <Link to="/admin">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-1.5 h-9"
                >
                  <User size={16} />
                  <span className="hidden sm:inline text-xs">Admin</span>
                </Button>
              </Link>
            )}

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden h-9 w-9 p-0">
                  <List size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-72">
                <div className="flex flex-col gap-2 mt-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                    >
                      <div
                        className={`text-left px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                          location.pathname === item.to
                            ? 'text-primary bg-primary/10'
                            : 'text-foreground hover:bg-muted/50'
                        }`}
                      >
                        {item.label}
                      </div>
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
