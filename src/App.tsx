import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
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
} from '@phosphor-icons/react'
import { ResumeData } from '@/lib/types'
import { translations } from '@/lib/translations'
import { toast } from 'sonner'

type Language = 'en' | 'de'

function App() {
  const [language, setLanguage] = useKV<Language>('resume-language', 'en')
  const [resumeData, setResumeData] = useKV<ResumeData | null>('resume-data', null)
  const [activeSection, setActiveSection] = useState('about')

  const currentLanguage = language || 'en'
  const t = translations[currentLanguage]

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['about', 'experience', 'education', 'skills', 'projects', 'certifications']
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
      const offset = 100
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

  if (!resumeData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Loading Resume...</h2>
          <p className="text-muted-foreground">Please wait while we load your professional profile.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="hidden md:flex items-center gap-6">
            {[
              { id: 'about', label: t.nav.about },
              { id: 'experience', label: t.nav.experience },
              { id: 'education', label: t.nav.education },
              { id: 'skills', label: t.nav.skills },
              { id: 'projects', label: t.nav.projects },
              { id: 'certifications', label: t.nav.certifications },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-sm font-medium transition-colors ${
                  activeSection === item.id ? 'text-accent' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={toggleLanguage} className="gap-2">
              <Globe size={18} />
              <span className="font-mono text-xs">{currentLanguage.toUpperCase()}</span>
            </Button>
            <Button onClick={handleDownloadPDF} className="gap-2">
              <DownloadSimple size={18} weight="bold" />
              <span className="hidden sm:inline">{t.labels.downloadPDF}</span>
            </Button>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-6">
          <motion.section
            id="about"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-24"
          >
            <Card className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <motion.div
                  initial={{ scale: 1.02, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-accent/20">
                    <AvatarImage src={resumeData.photoUrl} alt={resumeData.name} />
                    <AvatarFallback className="text-2xl font-bold bg-accent text-accent-foreground">
                      {resumeData.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>

                <div className="flex-1 space-y-4">
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2 tracking-tight">
                      {resumeData.name}
                    </h1>
                    <p className="text-xl text-muted-foreground font-medium">{resumeData.title}</p>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm">
                    {resumeData.contact.email && (
                      <a
                        href={`mailto:${resumeData.contact.email}`}
                        className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors"
                      >
                        <EnvelopeSimple size={18} />
                        {resumeData.contact.email}
                      </a>
                    )}
                    {resumeData.contact.phone && (
                      <a
                        href={`tel:${resumeData.contact.phone}`}
                        className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors"
                      >
                        <Phone size={18} />
                        {resumeData.contact.phone}
                      </a>
                    )}
                    {resumeData.contact.location && (
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <MapPin size={18} />
                        {resumeData.contact.location}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {resumeData.contact.linkedin && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={resumeData.contact.linkedin} target="_blank" rel="noopener noreferrer" className="gap-2">
                          <LinkedinLogo size={18} weight="bold" />
                          LinkedIn
                        </a>
                      </Button>
                    )}
                    {resumeData.contact.github && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={resumeData.contact.github} target="_blank" rel="noopener noreferrer" className="gap-2">
                          <GithubLogo size={18} weight="bold" />
                          GitHub
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <Separator className="my-8" />

              <div className="space-y-3">
                <h2 className="text-2xl font-semibold text-foreground">{t.labels.summary}</h2>
                <p className="text-base text-foreground/90 leading-relaxed">{resumeData.summary}</p>
              </div>
            </Card>
          </motion.section>

          <motion.section
            id="experience"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-24"
          >
            <div className="flex items-center gap-3 mb-8">
              <Briefcase size={32} weight="duotone" className="text-accent" />
              <h2 className="text-3xl font-bold text-foreground">{t.nav.experience}</h2>
            </div>

            <div className="space-y-6">
              {resumeData.experiences.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="p-6 md:p-8 hover:shadow-lg transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-4">
                      <div>
                        <h3 className="text-2xl font-semibold text-foreground mb-1">{exp.title}</h3>
                        <div className="flex items-center gap-2 text-accent font-medium">
                          <Buildings size={18} weight="duotone" />
                          {exp.company}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{exp.location}</p>
                      </div>
                      <div className="text-sm font-mono text-muted-foreground whitespace-nowrap">
                        {exp.startDate} - {exp.endDate === 'Present' ? t.labels.present : exp.endDate}
                      </div>
                    </div>

                    {exp.description && <p className="text-foreground/90 mb-4 italic">{exp.description}</p>}

                    {exp.achievements && exp.achievements.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-foreground mb-3">{t.labels.keyAchievements}</h4>
                        <ul className="space-y-2">
                          {exp.achievements.map((achievement, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <Check size={18} weight="bold" className="text-accent mt-0.5 flex-shrink-0" />
                              <span className="text-foreground/90 text-sm">{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {exp.technologies && exp.technologies.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-2">{t.labels.technologies}</p>
                        <div className="flex flex-wrap gap-2">
                          {exp.technologies.map((tech) => (
                            <Badge key={tech} variant="secondary" className="text-xs">
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
          </motion.section>

          <motion.section
            id="education"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-24"
          >
            <div className="flex items-center gap-3 mb-8">
              <GraduationCap size={32} weight="duotone" className="text-accent" />
              <h2 className="text-3xl font-bold text-foreground">{t.nav.education}</h2>
            </div>

            <div className="space-y-6">
              {resumeData.education.map((edu, index) => (
                <motion.div
                  key={edu.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-foreground mb-1">{edu.degree}</h3>
                        <p className="text-accent font-medium">{edu.institution}</p>
                        <p className="text-sm text-muted-foreground mt-1">{edu.location}</p>
                      </div>
                      <div className="text-sm font-mono text-muted-foreground whitespace-nowrap">
                        {edu.startDate} - {edu.endDate}
                      </div>
                    </div>
                    {edu.description && <p className="text-foreground/90 text-sm">{edu.description}</p>}
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          <motion.section
            id="skills"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-24"
          >
            <div className="flex items-center gap-3 mb-8">
              <Code size={32} weight="duotone" className="text-accent" />
              <h2 className="text-3xl font-bold text-foreground">{t.nav.skills}</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(resumeData.skills).map(([category, skills]) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                >
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      {t.labels.skillCategories[category as keyof typeof t.labels.skillCategories]}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <Badge key={skill} className="bg-accent/10 text-accent hover:bg-accent/20 border-accent/20">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          <motion.section
            id="projects"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-24"
          >
            <div className="flex items-center gap-3 mb-8">
              <Code size={32} weight="duotone" className="text-accent" />
              <h2 className="text-3xl font-bold text-foreground">{t.nav.projects}</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {resumeData.projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="p-6 h-full flex flex-col hover:shadow-lg transition-shadow">
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <h3 className="text-xl font-semibold text-foreground">{project.name}</h3>
                        {project.status && (
                          <Badge variant="outline" className="text-xs">
                            {project.status}
                          </Badge>
                        )}
                      </div>
                      <p className="text-foreground/90 text-sm mb-4">{project.description}</p>
                      {project.features && project.features.length > 0 && (
                        <ul className="space-y-1 mb-4">
                          {project.features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <Check size={16} weight="bold" className="text-accent mt-0.5 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    {project.url && (
                      <Button variant="outline" size="sm" asChild className="w-full mt-4">
                        <a href={project.url} target="_blank" rel="noopener noreferrer">
                          Visit Website
                        </a>
                      </Button>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          <motion.section
            id="certifications"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-24"
          >
            <div className="flex items-center gap-3 mb-8">
              <Certificate size={32} weight="duotone" className="text-accent" />
              <h2 className="text-3xl font-bold text-foreground">{t.nav.certifications}</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {resumeData.certifications.map((cert, index) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-2">{cert.name}</h3>
                    <p className="text-accent font-medium mb-1">{cert.issuer}</p>
                    <p className="text-sm font-mono text-muted-foreground mb-3">{cert.date}</p>
                    {cert.credentialUrl && (
                      <Button variant="link" size="sm" asChild className="p-0 h-auto">
                        <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer">
                          View Credential →
                        </a>
                      </Button>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {resumeData.languages && resumeData.languages.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-16"
            >
              <Card className="p-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">{t.labels.languages}</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {resumeData.languages.map((lang) => (
                    <div key={lang.name}>
                      <p className="font-semibold text-foreground">{lang.name}</p>
                      <p className="text-sm text-muted-foreground">{lang.proficiency}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.section>
          )}
        </div>
      </main>

      <footer className="border-t border-border py-8">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {resumeData.name}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
