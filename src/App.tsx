import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import {
  EnvelopeSimple,
  LinkedinLogo,
  MapPin,
  Phone,
  GithubLogo,
  DownloadSimple,
  Globe,
  Check,
  Buildings,
  GraduationCap,
  Certificate,
  Code,
  Briefcase,
  Star,
  ArrowRight,
  List,
  Gear,
  CaretDown,
  Stack,
  Sparkle,
} from '@phosphor-icons/react'
import { PortfolioData } from '@/lib/types'
import { translations } from '@/lib/translations'
import { initialPortfolioData } from '@/lib/initialData'
import { toast } from 'sonner'

type Language = 'en' | 'de'

function App() {
  const [language, setLanguage] = useKV<Language>('portfolio-language', 'en')
  const [portfolioData, setPortfolioData] = useKV<PortfolioData | null>('portfolio-data', null)
  const [activeSection, setActiveSection] = useState('home')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isAdminOpen, setIsAdminOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

  const currentLanguage = language || 'en'
  const t = translations[currentLanguage]

  useEffect(() => {
    if (!portfolioData) {
      setPortfolioData(() => initialPortfolioData)
    }
  }, [portfolioData, setPortfolioData])

  useEffect(() => {
    window.spark.user().then(setUser)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
      
      const sections = ['home', 'about', 'experience', 'projects', 'skills', 'education', 'certifications', 'contact']
      const scrollPosition = window.scrollY + 150

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.scrollY - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
    }
  }

  const toggleLanguage = () => {
    setLanguage((current) => ((current || 'en') === 'en' ? 'de' : 'en'))
  }

  const handleDownloadPDF = () => {
    window.print()
    toast.success(currentLanguage === 'en' ? 'Resume ready to print!' : 'Lebenslauf druckbereit!')
  }

  if (!portfolioData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Sparkle size={48} weight="duotone" className="mx-auto text-accent mb-4" />
            <h2 className="text-2xl font-semibold text-foreground">Loading Portfolio...</h2>
            <p className="text-muted-foreground">Please wait while we prepare your experience.</p>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-bold text-xl text-foreground cursor-pointer"
              onClick={() => scrollToSection('home')}
            >
              {portfolioData.name.split(' ')[0]}
            </motion.div>

            <div className="hidden md:flex items-center gap-8">
              {[
                { id: 'home', label: t.nav.home },
                { id: 'about', label: t.nav.about },
                { id: 'experience', label: t.nav.experience },
                { id: 'projects', label: t.nav.projects },
                { id: 'skills', label: t.nav.skills },
                { id: 'contact', label: t.nav.contact },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-sm font-medium transition-all relative ${
                    activeSection === item.id ? 'text-accent' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <motion.div
                      layoutId="activeSection"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={toggleLanguage} className="gap-2">
                <Globe size={18} />
                <span className="font-mono text-xs">{currentLanguage.toUpperCase()}</span>
              </Button>

              {user?.isOwner && (
                <Button variant="outline" size="sm" onClick={() => setIsAdminOpen(true)} className="gap-2">
                  <Gear size={18} />
                  <span className="hidden sm:inline">{t.labels.adminPanel}</span>
                </Button>
              )}

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden">
                    <List size={24} />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <div className="flex flex-col gap-6 mt-8">
                    {[
                      { id: 'home', label: t.nav.home },
                      { id: 'about', label: t.nav.about },
                      { id: 'experience', label: t.nav.experience },
                      { id: 'projects', label: t.nav.projects },
                      { id: 'skills', label: t.nav.skills },
                      { id: 'contact', label: t.nav.contact },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className="text-left text-lg font-medium text-foreground hover:text-accent transition-colors"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/10" />
          <div className="max-w-6xl mx-auto px-6 py-20 relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-accent font-medium"
                  >
                    {t.hero.greeting}
                  </motion.p>
                  <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
                    {portfolioData.name}
                  </h1>
                  <h2 className="text-2xl md:text-3xl font-semibold text-muted-foreground">
                    {portfolioData.title}
                  </h2>
                  <p className="text-lg text-muted-foreground pt-4">
                    {portfolioData.tagline}
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 pt-4">
                  <Button onClick={() => scrollToSection('projects')} size="lg" className="gap-2">
                    {t.hero.viewWork}
                    <ArrowRight size={18} weight="bold" />
                  </Button>
                  <Button onClick={() => scrollToSection('contact')} variant="outline" size="lg" className="gap-2">
                    {t.hero.contactMe}
                  </Button>
                  <Button onClick={handleDownloadPDF} variant="ghost" size="lg" className="gap-2">
                    <DownloadSimple size={18} weight="bold" />
                    {t.hero.downloadResume}
                  </Button>
                </div>

                <div className="flex gap-4 pt-4">
                  {portfolioData.contact.linkedin && (
                    <a
                      href={portfolioData.contact.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-accent transition-colors"
                    >
                      <LinkedinLogo size={24} weight="fill" />
                    </a>
                  )}
                  {portfolioData.contact.github && (
                    <a
                      href={portfolioData.contact.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-accent transition-colors"
                    >
                      <GithubLogo size={24} weight="fill" />
                    </a>
                  )}
                  {portfolioData.contact.email && (
                    <a
                      href={`mailto:${portfolioData.contact.email}`}
                      className="text-muted-foreground hover:text-accent transition-colors"
                    >
                      <EnvelopeSimple size={24} weight="fill" />
                    </a>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex justify-center"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full" />
                  <Avatar className="w-64 h-64 md:w-80 md:h-80 border-8 border-accent/20 relative">
                    <AvatarImage src={portfolioData.photoUrl} alt={portfolioData.name} />
                    <AvatarFallback className="text-4xl font-bold bg-accent text-accent-foreground">
                      {portfolioData.name.split(' ').map((n) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </motion.div>
            </div>

            {portfolioData.stats && portfolioData.stats.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
              >
                {portfolioData.stats.map((stat) => (
                  <Card key={stat.id} className="p-6 text-center hover:shadow-lg transition-shadow">
                    <div className="text-3xl font-bold text-accent mb-2">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </Card>
                ))}
              </motion.div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
            onClick={() => scrollToSection('about')}
          >
            <CaretDown size={32} weight="bold" className="text-accent animate-bounce" />
          </motion.div>
        </section>

        <section id="about" className="py-24 bg-muted/30">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-foreground mb-4">{t.nav.about}</h2>
              <div className="w-20 h-1 bg-accent mb-12" />

              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold text-foreground mb-4">{t.labels.summary}</h3>
                  <p className="text-foreground/90 leading-relaxed">{portfolioData.summary}</p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold text-foreground mb-4">{t.labels.aboutMe}</h3>
                  <p className="text-foreground/90 leading-relaxed">{portfolioData.aboutMe}</p>

                  <div className="pt-6 space-y-3">
                    {portfolioData.contact.location && (
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <MapPin size={20} weight="duotone" className="text-accent" />
                        {portfolioData.contact.location}
                      </div>
                    )}
                    {portfolioData.contact.email && (
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <EnvelopeSimple size={20} weight="duotone" className="text-accent" />
                        {portfolioData.contact.email}
                      </div>
                    )}
                    {portfolioData.contact.phone && (
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Phone size={20} weight="duotone" className="text-accent" />
                        {portfolioData.contact.phone}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="experience" className="py-24">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Briefcase size={40} weight="duotone" className="text-accent" />
                <h2 className="text-4xl font-bold text-foreground">{t.nav.experience}</h2>
              </div>
              <div className="w-20 h-1 bg-accent mb-12" />

              <div className="space-y-8">
                {portfolioData.experiences.map((exp, index) => (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="p-8 hover:shadow-2xl transition-all duration-300 border-l-4 border-l-accent">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-2xl font-semibold text-foreground mb-2">{exp.title}</h3>
                          <div className="flex items-center gap-2 text-accent font-semibold text-lg mb-1">
                            <Buildings size={20} weight="duotone" />
                            {exp.company}
                          </div>
                          <p className="text-sm text-muted-foreground">{exp.location}</p>
                          {exp.companyType && (
                            <Badge variant="secondary" className="mt-2">
                              {exp.companyType}
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm font-mono text-muted-foreground bg-muted px-4 py-2 rounded-md whitespace-nowrap">
                          {exp.startDate} - {exp.endDate === 'Present' ? t.labels.present : exp.endDate}
                        </div>
                      </div>

                      {exp.description && (
                        <p className="text-foreground/80 mb-4 italic">{exp.description}</p>
                      )}

                      {exp.achievements && exp.achievements.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
                            {t.labels.keyAchievements}
                          </h4>
                          <ul className="space-y-3">
                            {exp.achievements.map((achievement, i) => (
                              <li key={i} className="flex items-start gap-3">
                                <Check size={20} weight="bold" className="text-accent mt-0.5 flex-shrink-0" />
                                <span className="text-foreground/90">{achievement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {exp.technologies && exp.technologies.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                            {t.labels.technologies}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {exp.technologies.map((tech) => (
                              <Badge key={tech} className="bg-accent/10 text-accent hover:bg-accent/20 border-accent/30">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section id="projects" className="py-24 bg-muted/30">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Code size={40} weight="duotone" className="text-accent" />
                <h2 className="text-4xl font-bold text-foreground">{t.nav.projects}</h2>
              </div>
              <div className="w-20 h-1 bg-accent mb-12" />

              <div className="grid md:grid-cols-2 gap-8">
                {portfolioData.projects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="p-8 h-full flex flex-col hover:shadow-2xl transition-all duration-300 group">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <h3 className="text-2xl font-semibold text-foreground group-hover:text-accent transition-colors">
                          {project.name}
                        </h3>
                        <Badge variant="outline" className="text-xs whitespace-nowrap">
                          {project.status}
                        </Badge>
                      </div>

                      {project.market && (
                        <div className="text-sm text-accent font-medium mb-3">
                          <MapPin size={16} weight="duotone" className="inline mr-1" />
                          {project.market}
                        </div>
                      )}

                      <p className="text-foreground/90 mb-4 flex-grow">{project.description}</p>

                      {project.features && project.features.length > 0 && (
                        <ul className="space-y-2 mb-6">
                          {project.features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <Check size={16} weight="bold" className="text-accent mt-0.5 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.technologies.map((tech) => (
                            <Badge key={tech} variant="secondary" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {project.url && (
                        <Button asChild className="w-full mt-auto gap-2">
                          <a href={project.url} target="_blank" rel="noopener noreferrer">
                            {t.labels.viewProject}
                            <ArrowRight size={16} weight="bold" />
                          </a>
                        </Button>
                      )}
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section id="skills" className="py-24">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Stack size={40} weight="duotone" className="text-accent" />
                <h2 className="text-4xl font-bold text-foreground">{t.nav.skills}</h2>
              </div>
              <div className="w-20 h-1 bg-accent mb-12" />

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(portfolioData.skills).map(([category, skills], index) => (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Card className="p-6 hover:shadow-lg transition-shadow h-full">
                      <h3 className="text-lg font-semibold text-foreground mb-4">
                        {t.labels.skillCategories[category as keyof typeof t.labels.skillCategories]}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill) => (
                          <Badge
                            key={skill}
                            className="bg-accent/10 text-accent hover:bg-accent/20 hover:scale-105 transition-all cursor-default"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section id="education" className="py-24 bg-muted/30">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <GraduationCap size={40} weight="duotone" className="text-accent" />
                <h2 className="text-4xl font-bold text-foreground">{t.nav.education}</h2>
              </div>
              <div className="w-20 h-1 bg-accent mb-12" />

              <div className="space-y-6">
                {portfolioData.education.map((edu, index) => (
                  <motion.div
                    key={edu.id}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="p-8 hover:shadow-lg transition-shadow">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-3">
                        <div>
                          <h3 className="text-xl font-semibold text-foreground mb-2">{edu.degree}</h3>
                          <p className="text-accent font-semibold">{edu.institution}</p>
                          <p className="text-sm text-muted-foreground mt-1">{edu.location}</p>
                        </div>
                        <div className="text-sm font-mono text-muted-foreground bg-muted px-4 py-2 rounded-md whitespace-nowrap">
                          {edu.startDate} - {edu.endDate}
                        </div>
                      </div>
                      {edu.description && <p className="text-foreground/90">{edu.description}</p>}
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section id="certifications" className="py-24">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Certificate size={40} weight="duotone" className="text-accent" />
                <h2 className="text-4xl font-bold text-foreground">{t.nav.certifications}</h2>
              </div>
              <div className="w-20 h-1 bg-accent mb-12" />

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolioData.certifications.map((cert, index) => (
                  <motion.div
                    key={cert.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="p-6 hover:shadow-lg transition-shadow h-full flex flex-col">
                      <Star size={24} weight="duotone" className="text-accent mb-3" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">{cert.name}</h3>
                      <p className="text-accent font-medium mb-2">{cert.issuer}</p>
                      <p className="text-sm font-mono text-muted-foreground mb-4">{cert.date}</p>
                      {cert.credentialUrl && (
                        <Button variant="link" size="sm" asChild className="p-0 h-auto mt-auto text-left justify-start">
                          <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer">
                            {t.labels.viewCredential} →
                          </a>
                        </Button>
                      )}
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {portfolioData.languages && portfolioData.languages.length > 0 && (
          <section className="py-12 bg-muted/30">
            <div className="max-w-6xl mx-auto px-6">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <Card className="p-8">
                  <h3 className="text-2xl font-semibold text-foreground mb-6">{t.labels.languages}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {portfolioData.languages.map((lang) => (
                      <div key={lang.name}>
                        <p className="font-semibold text-foreground">{lang.name}</p>
                        <p className="text-sm text-muted-foreground">{lang.proficiency}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            </div>
          </section>
        )}

        <section id="contact" className="py-24">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h2 className="text-4xl font-bold text-foreground mb-4">{t.labels.getInTouch}</h2>
              <div className="w-20 h-1 bg-accent mx-auto mb-8" />
              <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
                {currentLanguage === 'en' 
                  ? "I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision." 
                  : "Ich bin immer offen für Gespräche über neue Projekte, kreative Ideen oder Möglichkeiten, Teil Ihrer Vision zu werden."}
              </p>

              <div className="flex flex-wrap justify-center gap-6 mb-12">
                {portfolioData.contact.email && (
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <EnvelopeSimple size={32} weight="duotone" className="text-accent mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground mb-1">Email</p>
                    <a
                      href={`mailto:${portfolioData.contact.email}`}
                      className="text-foreground hover:text-accent transition-colors font-medium"
                    >
                      {portfolioData.contact.email}
                    </a>
                  </Card>
                )}

                {portfolioData.contact.phone && (
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <Phone size={32} weight="duotone" className="text-accent mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground mb-1">Phone</p>
                    <a
                      href={`tel:${portfolioData.contact.phone}`}
                      className="text-foreground hover:text-accent transition-colors font-medium"
                    >
                      {portfolioData.contact.phone}
                    </a>
                  </Card>
                )}

                {portfolioData.contact.location && (
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <MapPin size={32} weight="duotone" className="text-accent mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground mb-1">Location</p>
                    <p className="text-foreground font-medium">{portfolioData.contact.location}</p>
                  </Card>
                )}
              </div>

              <Button size="lg" onClick={handleDownloadPDF} className="gap-2">
                <DownloadSimple size={20} weight="bold" />
                {t.hero.downloadResume}
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} {portfolioData.name}. All rights reserved.
            </p>
            <div className="flex gap-4">
              {portfolioData.contact.linkedin && (
                <a
                  href={portfolioData.contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  <LinkedinLogo size={20} weight="fill" />
                </a>
              )}
              {portfolioData.contact.github && (
                <a
                  href={portfolioData.contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  <GithubLogo size={20} weight="fill" />
                </a>
              )}
            </div>
          </div>
        </div>
      </footer>

      <Dialog open={isAdminOpen} onOpenChange={setIsAdminOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t.labels.adminPanel}</DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <p className="text-muted-foreground mb-4">
              {currentLanguage === 'en'
                ? 'Admin panel for editing portfolio data is coming soon. All data is currently stored in KV and can be updated programmatically.'
                : 'Das Admin-Panel zur Bearbeitung von Portfolio-Daten wird bald verfügbar sein. Alle Daten werden derzeit in KV gespeichert und können programmgesteuert aktualisiert werden.'}
            </p>
            <Button
              onClick={() => {
                setPortfolioData(() => initialPortfolioData)
                toast.success('Portfolio data reset to default')
                setIsAdminOpen(false)
              }}
              variant="outline"
            >
              Reset to Default Data
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default App
