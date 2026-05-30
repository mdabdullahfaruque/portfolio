import { useState, useEffect } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { Toaster } from '@/components/ui/sonner'
import { Navbar } from '@/components/Navbar'
import { NewHome } from '@/pages/NewHome'
import { ExperiencePage } from '@/pages/ExperiencePage'
import { ProjectsPage } from '@/pages/ProjectsPage'
import { SkillsPage } from '@/pages/SkillsPage'
import { ContactPage } from '@/pages/ContactPage'
import { AdminLogin } from '@/pages/AdminLogin'
import { AdminDashboard } from '@/pages/AdminDashboard'
import { PortfolioData } from '@/lib/types'
import { translations } from '@/lib/translations'
import { initialPortfolioData } from '@/lib/initialData'
import { initializeAdminCredentials, validateAdminLogin } from '@/lib/auth'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { toast } from 'sonner'

type Language = 'en' | 'de'

function App() {
  const [language, setLanguage] = useLocalStorage<Language>('portfolio-language', 'en')
  const [portfolioData, setPortfolioData] = useLocalStorage<PortfolioData | null>('portfolio-data', null)
  const [adminPasswordHash, setAdminPasswordHash] = useLocalStorage<string>('admin-password-hash', '')
  const [isAdmin, setIsAdmin] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  const currentLanguage = language || 'en'
  const t = translations[currentLanguage]

  useEffect(() => {
    async function initialize() {
      if (!portfolioData) {
        setPortfolioData(() => initialPortfolioData)
      }
      
      if (!adminPasswordHash) {
        const credentials = await initializeAdminCredentials()
        setAdminPasswordHash(() => credentials.passwordHash)
      }
      
      setIsInitialized(true)
    }
    
    initialize()
  }, [])

  useEffect(() => {
    const adminStatus = sessionStorage.getItem('admin-logged-in')
    if (adminStatus === 'true') {
      setIsAdmin(true)
    }
  }, [])

  const toggleLanguage = () => {
    setLanguage((current) => ((current || 'en') === 'en' ? 'de' : 'en'))
  }

  const handleLogin = async (email: string, password: string) => {
    if (!adminPasswordHash) {
      return false
    }
    
    const isValid = await validateAdminLogin(email, password, adminPasswordHash)
    if (isValid) {
      setIsAdmin(true)
      sessionStorage.setItem('admin-logged-in', 'true')
      return true
    }
    return false
  }

  const handleLogout = () => {
    setIsAdmin(false)
    sessionStorage.removeItem('admin-logged-in')
    toast.success('Logged out successfully')
  }

  const handleDataUpdate = (updatedData: PortfolioData) => {
    setPortfolioData(() => updatedData)
  }

  if (!portfolioData || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
          <h2 className="text-2xl font-semibold text-foreground">Loading Portfolio...</h2>
        </div>
      </div>
    )
  }

  return (
    <ThemeProvider>
      <HashRouter>
        <div className="min-h-screen bg-background">
          <Navbar
            language={currentLanguage}
            onLanguageToggle={toggleLanguage}
            t={t}
            isAdmin={isAdmin}
            onLogout={handleLogout}
          />

          <Routes>
            <Route
              path="/"
              element={
                <NewHome
                  data={portfolioData}
                  t={t}
                  isAdmin={isAdmin}
                  onUpdate={handleDataUpdate}
                />
              }
            />
            <Route
              path="/experience"
              element={
                <ExperiencePage
                  data={portfolioData}
                  t={t}
                  isAdmin={isAdmin}
                  onUpdate={handleDataUpdate}
                />
              }
            />
            <Route
              path="/projects"
              element={
                <ProjectsPage
                  data={portfolioData}
                  t={t}
                  isAdmin={isAdmin}
                  onUpdate={handleDataUpdate}
                />
              }
            />
            <Route
              path="/skills"
              element={
                <SkillsPage
                  data={portfolioData}
                  t={t}
                  isAdmin={isAdmin}
                  onUpdate={handleDataUpdate}
                />
              }
            />
            <Route
              path="/contact"
              element={
                <ContactPage
                  data={portfolioData}
                  t={t}
                />
              }
            />
            <Route
              path="/admin"
              element={
                isAdmin ? (
                  <AdminDashboard
                    data={portfolioData}
                    onUpdate={handleDataUpdate}
                    onLogout={handleLogout}
                  />
                ) : (
                  <AdminLogin onLogin={handleLogin} />
                )
              }
            />
          </Routes>

          <Toaster />
        </div>
      </HashRouter>
    </ThemeProvider>
  )
}

export default App
