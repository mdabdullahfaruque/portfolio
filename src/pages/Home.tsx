import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { 
  ArrowRight, 
  Briefcase, 
  Code, 
  GraduationCap,
  Sparkle,
  LinkedinLogo,
  GithubLogo,
  EnvelopeSimple,
  DownloadSimple
} from '@phosphor-icons/react'
import { PortfolioData } from '@/lib/types'

interface HomeProps {
  data: PortfolioData
  t: any
  onDownloadPDF: () => void
}

export function Home({ data, t, onDownloadPDF }: HomeProps) {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen">
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20 px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,oklch(0.65_0.15_245_/_0.15),transparent_50%),radial-gradient(circle_at_70%_50%,oklch(0.60_0.18_255_/_0.1),transparent_50%)]" />
        
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent border border-accent/20"
                >
                  <Sparkle size={20} weight="fill" />
                  <span className="text-sm font-medium">{t.hero.greeting}</span>
                </motion.div>

                <h1 className="text-5xl lg:text-7xl font-bold text-foreground leading-[1.1] tracking-tight">
                  {data.name}
                </h1>
                
                <h2 className="text-2xl lg:text-3xl font-semibold text-muted-foreground">
                  {data.title}
                </h2>
                
                <p className="text-lg lg:text-xl text-foreground/80 leading-relaxed max-w-xl">
                  {data.tagline}
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/projects')}
                  className="gap-2 shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30 transition-all"
                >
                  {t.hero.viewWork}
                  <ArrowRight size={20} weight="bold" />
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => navigate('/contact')}
                  className="gap-2 border-2"
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

              <div className="flex gap-4 pt-4">
                {data.contact.linkedin && (
                  <a
                    href={data.contact.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-muted hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-all hover:scale-110"
                  >
                    <LinkedinLogo size={24} weight="fill" />
                  </a>
                )}
                {data.contact.github && (
                  <a
                    href={data.contact.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-muted hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-all hover:scale-110"
                  >
                    <GithubLogo size={24} weight="fill" />
                  </a>
                )}
                {data.contact.email && (
                  <a
                    href={`mailto:${data.contact.email}`}
                    className="w-12 h-12 rounded-full bg-muted hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-all hover:scale-110"
                  >
                    <EnvelopeSimple size={24} weight="fill" />
                  </a>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex justify-center lg:justify-end"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/30 to-accent/10 blur-3xl rounded-full" />
                <Avatar className="w-80 h-80 lg:w-96 lg:h-96 border-4 border-accent/20 shadow-2xl relative">
                  <AvatarImage src={data.photoUrl} alt={data.name} className="object-cover" />
                  <AvatarFallback className="text-5xl font-bold bg-gradient-to-br from-accent to-accent/80 text-accent-foreground">
                    {data.name.split(' ').map((n) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </div>
            </motion.div>
          </div>

          {data.stats && data.stats.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-20"
            >
              {data.stats.map((stat, index) => (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <Card className="p-6 text-center hover:shadow-xl hover:scale-105 transition-all duration-300 bg-card/50 backdrop-blur-sm border-2">
                    <div className="text-4xl font-bold text-accent mb-2">{stat.value}</div>
                    <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <section className="py-24 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid lg:grid-cols-3 gap-8"
          >
            <Card className="p-8 hover:shadow-xl transition-all duration-300 cursor-pointer group" onClick={() => navigate('/experience')}>
              <Briefcase size={40} weight="duotone" className="text-accent mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-semibold mb-3">{t.nav.experience}</h3>
              <p className="text-muted-foreground mb-4">
                {data.experiences.length} positions across leading companies
              </p>
              <div className="flex items-center gap-2 text-accent font-medium">
                Explore <ArrowRight size={20} weight="bold" className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-all duration-300 cursor-pointer group" onClick={() => navigate('/projects')}>
              <Code size={40} weight="duotone" className="text-accent mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-semibold mb-3">{t.nav.projects}</h3>
              <p className="text-muted-foreground mb-4">
                {data.projects.length} projects built for global markets
              </p>
              <div className="flex items-center gap-2 text-accent font-medium">
                View Work <ArrowRight size={20} weight="bold" className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-all duration-300 cursor-pointer group" onClick={() => navigate('/skills')}>
              <GraduationCap size={40} weight="duotone" className="text-accent mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-semibold mb-3">{t.nav.skills}</h3>
              <p className="text-muted-foreground mb-4">
                Expertise in {Object.keys(data.skills).length} technology categories
              </p>
              <div className="flex items-center gap-2 text-accent font-medium">
                See Skills <ArrowRight size={20} weight="bold" className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
