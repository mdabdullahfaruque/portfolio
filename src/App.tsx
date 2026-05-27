import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useKV } from '@github/spark/hooks'
import { Toaster } from '@/components/ui/sonner'
import { Navbar } from '@/components/Navbar'
import { Home } from '@/pages/Home'
import { ExperiencePage } from '@/pages/ExperiencePage'
import { ProjectsPage } from '@/pages/ProjectsPage'
import { SkillsPage } from '@/pages/SkillsPage'
import { ContactPage } from '@/pages/ContactPage'
import { AdminLogin } from '@/pages/AdminLogin'
import { PortfolioData } from '@/lib/types'
import { translations } from '@/lib/translations'
import { initialPortfolioData } from '@/lib/initialData'
import { toast } from 'sonner'

type Language = 'en' | 'de'

function App() {
  const [language, setLanguage] = useKV<Language>('portfolio-language', 'en')
  const [portfolioData, setPortfolioData] = useKV<PortfolioData | null>('portfolio-data', null)
  const [isAdmin, setIsAdmin] = useState(false)

  const currentLanguage = language || 'en'
  const t = translations[currentLanguage]

  useEffect(() => {
    if (!portfolioData) {
      setPortfolioData(() => initialPortfolioData)
    }
  }, [portfolioData, setPortfolioData])

  useEffect(() => {
    const adminStatus = sessionStorage.getItem('admin-logged-in')
    if (adminStatus === 'true') {
      setIsAdmin(true)
    }
  }, [])

  const toggleLanguage = () => {
    setLanguage((current) => ((current || 'en') === 'en' ? 'de' : 'en'))
  }

  const handleLogin = (email: string, password: string) => {
    if (email === 'admin@abdullahfaruque.com' && password === 'Admin@123456') {
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

  const handleDownloadPDF = () => {
    window.print()
    toast.success(currentLanguage === 'en' ? 'Resume ready to print!' : 'Lebenslauf druckbereit!')
  }

  const handleDataUpdate = (updatedData: PortfolioData) => {
    setPortfolioData(() => updatedData)
  }

  if (!portfolioData) {
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
    <BrowserRouter>
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
              <Home
                data={portfolioData}
                t={t}
                onDownloadPDF={handleDownloadPDF}
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
              />
            }
          />
          <Route
            path="/skills"
            element={
              <SkillsPage
                data={portfolioData}
                t={t}
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
              isAdmin ? <Navigate to="/" replace /> : <AdminLogin onLogin={handleLogin} />
            }
          />
        </Routes>

        <Toaster />
      </div>
    </BrowserRouter>
  )
}

export default App
