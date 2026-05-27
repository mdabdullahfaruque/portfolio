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
        ? 'bg-background/90 backdrop-blur-xl shadow-2xl border-b border-border/50' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          <Link to="/">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="font-black text-2xl lg:text-3xl cursor-pointer transition-all"
            >
              <span className="bg-gradient-to-r from-accent via-secondary to-accent bg-clip-text text-transparent">
                Portfolio
              </span>
            </motion.div>
          </Link>

          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 lg:px-5 py-2 rounded-xl text-sm lg:text-base font-semibold transition-all relative ${
                    location.pathname === item.to 
                      ? 'text-accent-foreground bg-gradient-to-br from-accent to-secondary shadow-lg' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {item.label}
                </motion.div>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onLanguageToggle} 
              className="gap-2 hover:bg-accent/10 hover:text-accent rounded-xl"
            >
              <Globe size={20} weight="bold" />
              <span className="font-mono text-sm font-bold">{language.toUpperCase()}</span>
            </Button>

            {isAdmin && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onLogout} 
                className="gap-2 border-2 hover:border-destructive hover:text-destructive rounded-xl"
              >
                <SignOut size={20} weight="bold" />
                <span className="hidden sm:inline font-semibold">Logout</span>
              </Button>
            )}

            {!isAdmin && (
              <Link to="/admin">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-2 hover:bg-accent/10 hover:text-accent rounded-xl"
                >
                  <User size={20} weight="bold" />
                  <span className="hidden sm:inline font-semibold">Admin</span>
                </Button>
              </Link>
            )}

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden rounded-xl">
                  <List size={24} weight="bold" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-80">
                <div className="flex flex-col gap-4 mt-12">
                  {navItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                    >
                      <motion.div
                        whileHover={{ x: 8 }}
                        whileTap={{ scale: 0.95 }}
                        className={`text-left p-4 rounded-xl text-lg font-bold transition-all ${
                          location.pathname === item.to
                            ? 'text-accent-foreground bg-gradient-to-r from-accent to-secondary'
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
