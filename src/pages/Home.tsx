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
  Sparkle,
  LinkedinLogo,
  GithubLogo,
  EnvelopeSimple,
  DownloadSimple,
  Star,
  Lightning,
  ChartLine
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

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95])

  return (
    <div className="min-h-screen" ref={containerRef}>
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-secondary/5 to-primary/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,oklch(0.72_0.18_210_/_0.15),transparent_40%),radial-gradient(circle_at_80%_70%,oklch(0.55_0.20_290_/_0.12),transparent_40%)]" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
        
        <motion.div 
          className="max-w-7xl mx-auto w-full relative z-10"
          style={{ opacity, scale }}
        >
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-accent/20 via-secondary/20 to-accent/20 text-primary border-2 border-accent/30 backdrop-blur-sm"
                >
                  <Sparkle size={24} weight="fill" className="text-accent animate-pulse" />
                  <span className="text-base font-semibold">{t.hero.greeting}</span>
                </motion.div>

                <h1 className="text-6xl lg:text-8xl font-black text-foreground leading-[0.95] tracking-tighter">
                  <span className="bg-gradient-to-br from-primary via-secondary to-accent bg-clip-text text-transparent">
                    {data.name}
                  </span>
                </h1>
                
                <h2 className="text-3xl lg:text-4xl font-bold text-primary/80">
                  {data.title}
                </h2>
                
                <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-2xl font-medium">
                  {data.tagline}
                </p>

                <div className="flex flex-wrap gap-3 pt-2">
                  <Badge variant="secondary" className="px-4 py-2 text-base font-medium">
                    <Lightning size={18} weight="fill" className="mr-2" />
                    6+ Years Experience
                  </Badge>
                  <Badge variant="secondary" className="px-4 py-2 text-base font-medium">
                    <ChartLine size={18} weight="fill" className="mr-2" />
                    Global Impact
                  </Badge>
                  <Badge variant="secondary" className="px-4 py-2 text-base font-medium">
                    <Star size={18} weight="fill" className="mr-2" />
                    Full Stack Expert
                  </Badge>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/projects')}
                  className="gap-2 text-lg h-14 px-8 shadow-xl shadow-accent/30 hover:shadow-2xl hover:shadow-accent/40 transition-all hover:scale-105 bg-gradient-to-r from-accent via-accent to-secondary hover:from-secondary hover:via-accent hover:to-accent"
                >
                  {t.hero.viewWork}
                  <ArrowRight size={24} weight="bold" />
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => navigate('/contact')}
                  className="gap-2 text-lg h-14 px-8 border-2 border-primary/30 hover:border-accent hover:bg-accent/10 hover:scale-105 transition-all"
                >
                  {t.hero.contactMe}
                </Button>
                
                <Button 
                  size="lg" 
                  variant="ghost"
                  onClick={onDownloadPDF}
                  className="gap-2 text-lg h-14 px-8 hover:bg-muted hover:scale-105 transition-all"
                >
                  <DownloadSimple size={24} weight="bold" />
                  {t.hero.downloadResume}
                </Button>
              </div>

              <div className="flex gap-4 pt-6">
                {data.contact.linkedin && (
                  <motion.a
                    href={data.contact.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-14 h-14 rounded-2xl bg-gradient-to-br from-muted to-muted/60 hover:from-accent hover:to-secondary text-foreground hover:text-accent-foreground flex items-center justify-center transition-all shadow-lg hover:shadow-xl"
                  >
                    <LinkedinLogo size={28} weight="fill" />
                  </motion.a>
                )}
                {data.contact.github && (
                  <motion.a
                    href={data.contact.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.15, rotate: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-14 h-14 rounded-2xl bg-gradient-to-br from-muted to-muted/60 hover:from-accent hover:to-secondary text-foreground hover:text-accent-foreground flex items-center justify-center transition-all shadow-lg hover:shadow-xl"
                  >
                    <GithubLogo size={28} weight="fill" />
                  </motion.a>
                )}
                {data.contact.email && (
                  <motion.a
                    href={`mailto:${data.contact.email}`}
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-14 h-14 rounded-2xl bg-gradient-to-br from-muted to-muted/60 hover:from-accent hover:to-secondary text-foreground hover:text-accent-foreground flex items-center justify-center transition-all shadow-lg hover:shadow-xl"
                  >
                    <EnvelopeSimple size={28} weight="fill" />
                  </motion.a>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex justify-center lg:justify-end relative"
            >
              <div className="relative group">
                <motion.div 
                  className="absolute -inset-8 bg-gradient-to-br from-accent via-secondary to-accent blur-3xl opacity-40 group-hover:opacity-60 rounded-full transition-opacity duration-500"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 90, 0],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/40 to-secondary/40 blur-2xl rounded-full animate-pulse" style={{ animationDuration: '3s' }} />
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Avatar className="w-80 h-80 lg:w-[28rem] lg:h-[28rem] border-8 border-card shadow-2xl relative ring-4 ring-accent/20 ring-offset-4 ring-offset-background">
                      <AvatarImage src={data.photoUrl} alt={data.name} className="object-cover" />
                      <AvatarFallback className="text-6xl font-black bg-gradient-to-br from-accent via-secondary to-primary text-accent-foreground">
                        {data.name.split(' ').map((n) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>

          {data.stats && data.stats.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-24"
            >
              {data.stats.map((stat, index) => (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.6 }}
                  whileHover={{ scale: 1.08, y: -8 }}
                >
                  <Card className="p-8 text-center hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-card via-card to-muted border-2 border-border hover:border-accent/50 group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/0 via-accent/0 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="text-5xl lg:text-6xl font-black text-transparent bg-gradient-to-br from-accent via-secondary to-primary bg-clip-text mb-3 relative z-10">{stat.value}</div>
                    <div className="text-sm lg:text-base text-muted-foreground font-semibold uppercase tracking-wider relative z-10">{stat.label}</div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </section>

      <section className="py-32 px-6 bg-gradient-to-b from-muted/30 via-background to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,oklch(0.72_0.18_210_/_0.08),transparent_50%)]" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-6xl font-black text-foreground mb-4">
              Explore My{' '}
              <span className="bg-gradient-to-r from-accent via-secondary to-accent bg-clip-text text-transparent">
                Expertise
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Dive into my professional journey, innovative projects, and technical skills
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid lg:grid-cols-3 gap-8"
          >
            <motion.div
              whileHover={{ y: -12, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-10 hover:shadow-2xl transition-all duration-300 cursor-pointer group border-2 border-border hover:border-accent/50 bg-gradient-to-br from-card via-card to-muted relative overflow-hidden" onClick={() => navigate('/experience')}>
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-accent/20 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <Briefcase size={56} weight="duotone" className="text-accent mb-6 group-hover:scale-110 transition-transform relative z-10" />
                <h3 className="text-3xl font-bold mb-4 relative z-10">{t.nav.experience}</h3>
                <p className="text-muted-foreground text-lg mb-6 relative z-10">
                  {data.experiences.length} positions across leading companies
                </p>
                <div className="flex items-center gap-2 text-accent font-bold text-lg relative z-10">
                  Explore <ArrowRight size={24} weight="bold" className="group-hover:translate-x-2 transition-transform" />
                </div>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ y: -12, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-10 hover:shadow-2xl transition-all duration-300 cursor-pointer group border-2 border-border hover:border-secondary/50 bg-gradient-to-br from-card via-card to-muted relative overflow-hidden" onClick={() => navigate('/projects')}>
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-secondary/20 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <Code size={56} weight="duotone" className="text-secondary mb-6 group-hover:scale-110 transition-transform relative z-10" />
                <h3 className="text-3xl font-bold mb-4 relative z-10">{t.nav.projects}</h3>
                <p className="text-muted-foreground text-lg mb-6 relative z-10">
                  {data.projects.length} projects built for global markets
                </p>
                <div className="flex items-center gap-2 text-secondary font-bold text-lg relative z-10">
                  View Work <ArrowRight size={24} weight="bold" className="group-hover:translate-x-2 transition-transform" />
                </div>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ y: -12, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-10 hover:shadow-2xl transition-all duration-300 cursor-pointer group border-2 border-border hover:border-accent/50 bg-gradient-to-br from-card via-card to-muted relative overflow-hidden" onClick={() => navigate('/skills')}>
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-accent/20 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <GraduationCap size={56} weight="duotone" className="text-accent mb-6 group-hover:scale-110 transition-transform relative z-10" />
                <h3 className="text-3xl font-bold mb-4 relative z-10">{t.nav.skills}</h3>
                <p className="text-muted-foreground text-lg mb-6 relative z-10">
                  Expertise in {Object.keys(data.skills).length} technology categories
                </p>
                <div className="flex items-center gap-2 text-accent font-bold text-lg relative z-10">
                  See Skills <ArrowRight size={24} weight="bold" className="group-hover:translate-x-2 transition-transform" />
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
