import { motion, useScroll, useTransform } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, 
  Briefcase, 
  Code, 
  GraduationCap,
  LinkedinLogo,
  GithubLogo,
  EnvelopeSimple,
  DownloadSimple,
  CheckCircle,
  MapPin,
  Envelope,
  Phone
} from '@phosphor-icons/react'
import { PortfolioData } from '@/lib/types'

interface HomeProps {
  data: PortfolioData
  t: any
  onDownloadPDF: () => void
}

export function Home({ data, t, onDownloadPDF }: HomeProps) {
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3])

  return (
    <div className="min-h-screen bg-background" ref={containerRef}>
      <section className="min-h-screen flex items-center justify-center relative pt-24 pb-16 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-background" />
        
        <motion.div 
          className="max-w-6xl mx-auto w-full relative z-10"
          style={{ opacity }}
        >
          <div className="grid lg:grid-cols-[2fr_1fr] gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                  {data.name}
                </h1>
                
                <h2 className="text-2xl lg:text-3xl font-semibold text-primary">
                  {data.title}
                </h2>
                
                <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                  {data.tagline}
                </p>

                <div className="flex flex-wrap gap-3 pt-2">
                  {data.stats && data.stats.slice(0, 2).map((stat) => (
                    <Badge key={stat.id} variant="secondary" className="px-4 py-2 text-sm">
                      {stat.value} {stat.label}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/projects')}
                  className="gap-2"
                >
                  {t.hero.viewWork}
                  <ArrowRight size={20} weight="bold" />
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => navigate('/contact')}
                  className="gap-2"
                >
                  {t.hero.contactMe}
                </Button>
                
                <Button 
                  size="lg" 
                  variant="ghost"
                  onClick={onDownloadPDF}
                  className="gap-2"
                >
                  <DownloadSimple size={20} weight="bold" />
                  {t.hero.downloadResume}
                </Button>
              </div>

              <div className="flex gap-3 pt-4">
                {data.contact.linkedin && (
                  <motion.a
                    href={data.contact.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground text-foreground flex items-center justify-center transition-colors"
                  >
                    <LinkedinLogo size={20} weight="fill" />
                  </motion.a>
                )}
                {data.contact.github && (
                  <motion.a
                    href={data.contact.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground text-foreground flex items-center justify-center transition-colors"
                  >
                    <GithubLogo size={20} weight="fill" />
                  </motion.a>
                )}
                {data.contact.email && (
                  <motion.a
                    href={`mailto:${data.contact.email}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground text-foreground flex items-center justify-center transition-colors"
                  >
                    <EnvelopeSimple size={20} weight="fill" />
                  </motion.a>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center lg:justify-end"
            >
              <Avatar className="w-64 h-64 lg:w-80 lg:h-80 border-4 border-card shadow-xl">
                <AvatarImage src={data.photoUrl} alt={data.name} className="object-cover" />
                <AvatarFallback className="text-4xl font-bold bg-muted text-foreground">
                  {data.name.split(' ').map((n) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-6 text-foreground">About Me</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {data.summary}
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin size={18} className="text-primary" weight="fill" />
                    <span className="text-foreground">{data.contact.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Envelope size={18} className="text-primary" weight="fill" />
                    <a href={`mailto:${data.contact.email}`} className="text-primary hover:underline">
                      {data.contact.email}
                    </a>
                  </div>
                  {data.contact.phone && (
                    <div className="flex items-center gap-3 text-sm">
                      <Phone size={18} className="text-primary" weight="fill" />
                      <span className="text-foreground">{data.contact.phone}</span>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4 text-foreground">Key Highlights</h3>
                <div className="space-y-2">
                  {data.highlights && data.highlights.slice(0, 6).map((highlight, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-2"
                    >
                      <CheckCircle size={18} weight="fill" className="text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{highlight}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {data.stats && data.stats.length > 0 && (
        <section className="py-16 px-6 bg-background">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {data.stats.map((stat, index) => (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                    <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                    <div className="text-sm text-muted-foreground uppercase tracking-wide">{stat.label}</div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-8 text-center text-foreground">Recent Experience</h2>
            <div className="space-y-6">
              {data.experiences.slice(0, 3).map((exp, index) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-foreground">{exp.title}</h3>
                        <p className="text-primary font-medium">{exp.company}</p>
                      </div>
                      <Badge variant="secondary" className="mt-2 md:mt-0 w-fit">
                        {exp.startDate} - {exp.endDate}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{exp.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.slice(0, 5).map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {exp.technologies.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{exp.technologies.length - 5} more
                        </Badge>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button variant="outline" onClick={() => navigate('/experience')}>
                View All Experience <ArrowRight size={18} weight="bold" className="ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 text-foreground">Explore More</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Dive deeper into my professional journey, projects, and technical expertise
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid md:grid-cols-3 gap-6"
          >
            <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
              <Card className="p-8 hover:shadow-lg transition-all cursor-pointer h-full" onClick={() => navigate('/experience')}>
                <Briefcase size={40} weight="duotone" className="text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3 text-foreground">{t.nav.experience}</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {data.experiences.length} positions across leading companies
                </p>
                <div className="flex items-center gap-2 text-primary text-sm font-medium">
                  Explore <ArrowRight size={16} weight="bold" />
                </div>
              </Card>
            </motion.div>

            <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
              <Card className="p-8 hover:shadow-lg transition-all cursor-pointer h-full" onClick={() => navigate('/projects')}>
                <Code size={40} weight="duotone" className="text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3 text-foreground">{t.nav.projects}</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {data.projects.length} projects for global markets
                </p>
                <div className="flex items-center gap-2 text-primary text-sm font-medium">
                  View Projects <ArrowRight size={16} weight="bold" />
                </div>
              </Card>
            </motion.div>

            <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
              <Card className="p-8 hover:shadow-lg transition-all cursor-pointer h-full" onClick={() => navigate('/skills')}>
                <GraduationCap size={40} weight="duotone" className="text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3 text-foreground">{t.nav.skills}</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Expertise in {Object.keys(data.skills).length} technology categories
                </p>
                <div className="flex items-center gap-2 text-primary text-sm font-medium">
                  See Skills <ArrowRight size={16} weight="bold" />
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
