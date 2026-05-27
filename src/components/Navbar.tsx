import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Globe, List, SignOut, User } from '@phosphor-icons/react'

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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-background/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-bold text-2xl text-foreground cursor-pointer hover:text-accent transition-colors"
            >
              Portfolio
            </motion.div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`text-sm font-medium transition-all relative ${
                  location.pathname === item.to ? 'text-accent' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.label}
                {location.pathname === item.to && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onLanguageToggle} className="gap-2">
              <Globe size={18} />
              <span className="font-mono text-xs">{language.toUpperCase()}</span>
            </Button>

            {isAdmin && (
              <Button variant="outline" size="sm" onClick={onLogout} className="gap-2">
                <SignOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            )}

            {!isAdmin && (
              <Link to="/admin">
                <Button variant="ghost" size="sm" className="gap-2">
                  <User size={18} />
                  <span className="hidden sm:inline">Admin</span>
                </Button>
              </Link>
            )}

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <List size={24} />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col gap-6 mt-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="text-left text-lg font-medium text-foreground hover:text-accent transition-colors"
                    >
                      {item.label}
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
