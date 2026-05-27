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
      isScrolled 
        ? 'bg-background/95 backdrop-blur-md shadow-sm border-b border-border' 
        : 'bg-background/80 backdrop-blur-sm'
    }`}>
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="font-bold text-xl lg:text-2xl cursor-pointer text-foreground"
            >
              Portfolio
            </motion.div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    location.pathname === item.to 
                      ? 'text-primary-foreground bg-primary' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {item.label}
                </motion.div>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onLanguageToggle} 
              className="gap-2"
            >
              <Globe size={18} />
              <span className="text-xs font-medium">{language.toUpperCase()}</span>
            </Button>

            {isAdmin && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onLogout} 
                className="gap-2"
              >
                <SignOut size={18} />
                <span className="hidden sm:inline text-xs">Logout</span>
              </Button>
            )}

            {!isAdmin && (
              <Link to="/admin">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-2"
                >
                  <User size={18} />
                  <span className="hidden sm:inline text-xs">Admin</span>
                </Button>
              </Link>
            )}

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <List size={24} />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-80">
                <div className="flex flex-col gap-3 mt-12">
                  {navItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                    >
                      <motion.div
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        className={`text-left p-3 rounded-md text-base font-medium transition-all ${
                          location.pathname === item.to
                            ? 'text-primary-foreground bg-primary'
                            : 'text-foreground hover:bg-muted'
                        }`}
                      >
                        {item.label}
                      </motion.div>
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
