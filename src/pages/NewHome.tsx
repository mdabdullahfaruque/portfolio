import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
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
  Phone,
  PencilSimple,
  FloppyDisk,
  Trash,
  Plus,
  Sparkle,
  Lightning,
  Rocket,
  Star
} from '@phosphor-icons/react'
import { PortfolioData } from '@/lib/types'
import { toast } from 'sonner'
import resumePDF from '@/assets/documents/MdAbdullahFaruque_Resume.pdf'

interface HomeProps {
  data: PortfolioData
  t: any
  isAdmin?: boolean
  onUpdate?: (updatedData: PortfolioData) => void
}

export function NewHome({ data, t, isAdmin, onUpdate }: HomeProps) {
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editedData, setEditedData] = useState<PortfolioData>(data)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const handleDownloadResume = async () => {
    try {
      const response = await fetch(resumePDF)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'MdAbdullahFaruque_Resume.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      toast.success('Resume downloaded successfully!')
    } catch (error) {
      toast.error('Failed to download resume. Please try again.')
      console.error('Resume download error:', error)
    }
  }

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditedData({ ...editedData, photoUrl: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(editedData)
      toast.success('Home page updated successfully!')
      setEditDialogOpen(false)
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }

  const floatingAnimation = {
    y: [0, -20, 0],
    transition: {
      duration: 3,
      repeat: Infinity as number,
      ease: "easeInOut" as const
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5" ref={containerRef}>
      {isAdmin && (
        <div className="fixed bottom-6 right-6 z-50 no-print">
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2 shadow-2xl hover:scale-105 transition-transform" onClick={() => setEditedData(data)}>
                <PencilSimple size={20} weight="bold" />
                Edit Home
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl">Edit Home Page</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6 py-6">
                <div>
                  <Label className="text-base font-semibold">Profile Picture</Label>
                  <div className="flex items-center gap-6 mt-4">
                    <Avatar className="w-28 h-28 border-4 border-primary/20">
                      <AvatarImage src={editedData.photoUrl} alt={editedData.name} className="object-cover" />
                      <AvatarFallback className="text-2xl">{editedData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleProfileImageUpload}
                        className="mb-2"
                        id="profile-image-upload"
                      />
                      <p className="text-sm text-muted-foreground">Upload a professional headshot (PNG, JPG)</p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-name" className="text-sm font-medium">Full Name</Label>
                    <Input
                      id="edit-name"
                      value={editedData.name}
                      onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-title" className="text-sm font-medium">Job Title</Label>
                    <Input
                      id="edit-title"
                      value={editedData.title}
                      onChange={(e) => setEditedData({ ...editedData, title: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="edit-tagline" className="text-sm font-medium">Tagline</Label>
                  <Input
                    id="edit-tagline"
                    value={editedData.tagline}
                    onChange={(e) => setEditedData({ ...editedData, tagline: e.target.value })}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="edit-summary" className="text-sm font-medium">Professional Summary</Label>
                  <Textarea
                    id="edit-summary"
                    value={editedData.summary}
                    onChange={(e) => setEditedData({ ...editedData, summary: e.target.value })}
                    rows={5}
                    className="mt-1.5"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-email" className="text-sm font-medium">Email</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={editedData.contact.email}
                      onChange={(e) => setEditedData({
                        ...editedData,
                        contact: { ...editedData.contact, email: e.target.value }
                      })}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-phone" className="text-sm font-medium">Phone</Label>
                    <Input
                      id="edit-phone"
                      value={editedData.contact.phone}
                      onChange={(e) => setEditedData({
                        ...editedData,
                        contact: { ...editedData.contact, phone: e.target.value }
                      })}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-location" className="text-sm font-medium">Location</Label>
                    <Input
                      id="edit-location"
                      value={editedData.contact.location}
                      onChange={(e) => setEditedData({
                        ...editedData,
                        contact: { ...editedData.contact, location: e.target.value }
                      })}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-linkedin" className="text-sm font-medium">LinkedIn URL</Label>
                    <Input
                      id="edit-linkedin"
                      value={editedData.contact.linkedin}
                      onChange={(e) => setEditedData({
                        ...editedData,
                        contact: { ...editedData.contact, linkedin: e.target.value }
                      })}
                      className="mt-1.5"
                    />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-base font-semibold">Stats Section</Label>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const newStats = editedData.stats || []
                        setEditedData({
                          ...editedData,
                          stats: [
                            ...newStats,
                            {
                              id: Date.now().toString(),
                              label: 'New Stat',
                              value: '0',
                              icon: ''
                            }
                          ]
                        })
                      }}
                      className="gap-2"
                    >
                      <Plus size={16} weight="bold" />
                      Add Stat
                    </Button>
                  </div>
                  <div className="space-y-3 max-h-72 overflow-y-auto">
                    {editedData.stats && editedData.stats.map((stat, index) => (
                      <Card key={stat.id} className="p-4">
                        <div className="flex gap-3">
                          <div className="flex-1 space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label className="text-xs">Value</Label>
                                <Input
                                  value={stat.value}
                                  onChange={(e) => {
                                    const newStats = [...(editedData.stats || [])]
                                    newStats[index] = { ...stat, value: e.target.value }
                                    setEditedData({ ...editedData, stats: newStats })
                                  }}
                                  placeholder="e.g. 50+"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Label</Label>
                                <Input
                                  value={stat.label}
                                  onChange={(e) => {
                                    const newStats = [...(editedData.stats || [])]
                                    newStats[index] = { ...stat, label: e.target.value }
                                    setEditedData({ ...editedData, stats: newStats })
                                  }}
                                  placeholder="e.g. Projects"
                                />
                              </div>
                            </div>
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              const newStats = (editedData.stats || []).filter((_, i) => i !== index)
                              setEditedData({ ...editedData, stats: newStats })
                            }}
                          >
                            <Trash size={16} weight="bold" className="text-destructive" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} className="gap-2">
                  <FloppyDisk size={18} weight="bold" />
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}

      <section 
        className="relative min-h-[90vh] flex items-center justify-center pt-20 pb-16 px-6 overflow-hidden"
        onMouseMove={handleMouseMove}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full">
            <div 
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
              style={{
                transform: `translate(${mousePosition.x / 20}px, ${mousePosition.y / 20}px)`
              }}
            />
            <div 
              className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
              style={{
                transform: `translate(-${mousePosition.x / 30}px, -${mousePosition.y / 30}px)`
              }}
            />
            <div 
              className="absolute top-1/2 left-1/2 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
              style={{
                transform: `translate(-50%, -50%) translate(${mousePosition.x / 25}px, ${mousePosition.y / 25}px)`
              }}
            />
          </div>
          
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(var(--primary) / 0.05) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <motion.div 
          className="max-w-7xl mx-auto w-full relative z-10"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Badge variant="outline" className="mb-4 px-4 py-2 text-sm font-medium border-primary/30 bg-primary/5">
                    <Sparkle size={16} className="mr-2" weight="fill" />
                    {t.profile.title}
                  </Badge>
                </motion.div>

                <motion.h1 
                  className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {data.name}
                </motion.h1>
                
                <motion.p 
                  className="text-xl md:text-2xl text-muted-foreground leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {t.profile.tagline}
                </motion.p>

                <motion.p 
                  className="text-base text-muted-foreground/80 leading-relaxed max-w-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {data.summary}
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap gap-4"
              >
                <Button 
                  size="lg"
                  onClick={() => navigate('/projects')}
                  className="gap-2 group hover:scale-105 transition-transform shadow-lg"
                >
                  {t.hero.viewWork}
                  <ArrowRight size={20} weight="bold" className="group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/contact')}
                  className="gap-2 hover:scale-105 transition-transform"
                >
                  <EnvelopeSimple size={20} weight="bold" />
                  {t.hero.contactMe}
                </Button>
                
                <Button 
                  size="lg"
                  variant="ghost"
                  onClick={handleDownloadResume}
                  className="gap-2 hover:scale-105 transition-transform"
                >
                  <DownloadSimple size={20} weight="bold" />
                  Resume
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="flex items-center gap-3 pt-4"
              >
                {data.contact.linkedin && (
                  <motion.a
                    href={data.contact.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 hover:from-primary hover:to-primary/80 text-foreground hover:text-primary-foreground flex items-center justify-center transition-all shadow-md hover:shadow-xl"
                  >
                    <LinkedinLogo size={24} weight="fill" />
                  </motion.a>
                )}
                {data.contact.github && (
                  <motion.a
                    href={data.contact.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 hover:from-primary hover:to-primary/80 text-foreground hover:text-primary-foreground flex items-center justify-center transition-all shadow-md hover:shadow-xl"
                  >
                    <GithubLogo size={24} weight="fill" />
                  </motion.a>
                )}
                {data.contact.email && (
                  <motion.a
                    href={`mailto:${data.contact.email}`}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 hover:from-primary hover:to-primary/80 text-foreground hover:text-primary-foreground flex items-center justify-center transition-all shadow-md hover:shadow-xl"
                  >
                    <EnvelopeSimple size={24} weight="fill" />
                  </motion.a>
                )}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex justify-center lg:justify-end relative"
            >
              <div className="relative">
                <motion.div
                  animate={floatingAnimation}
                  className="relative z-10"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent rounded-3xl blur-2xl opacity-30" />
                    <Avatar className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 border-8 border-card shadow-2xl relative z-10 ring-4 ring-primary/20">
                      <AvatarImage src={data.photoUrl} alt={data.name} className="object-cover" />
                      <AvatarFallback className="text-6xl font-bold bg-gradient-to-br from-primary to-accent text-primary-foreground">
                        {data.name.split(' ').map((n) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </motion.div>
                
                <motion.div
                  className="absolute -top-8 -right-8 bg-gradient-to-br from-accent to-accent/80 text-accent-foreground px-6 py-4 rounded-2xl shadow-2xl"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="flex items-center gap-2">
                    <Star size={24} weight="fill" className="text-yellow-300" />
                    <div>
                      <p className="text-xs opacity-90">Available for</p>
                      <p className="font-bold">New Projects</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute -bottom-8 -left-8 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground px-6 py-4 rounded-2xl shadow-2xl"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 }}
                >
                  <div className="flex items-center gap-2">
                    <Lightning size={24} weight="fill" className="text-yellow-300" />
                    <div>
                      <p className="text-xs opacity-90">Response time</p>
                      <p className="font-bold">24 hours</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {data.stats && data.stats.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
            >
              {data.stats.map((stat, index) => (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 text-center hover:shadow-xl transition-all hover:border-primary/30"
                >
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-primary via-secondary to-accent bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    {stat.translationKey ? t.stats[stat.translationKey] : stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </section>

      <section className="py-20 px-6 bg-card/30 backdrop-blur-sm border-y border-border/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              {t.labels.recentExperience || 'Experience Highlights'}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t.labels.experienceSubtitle || 'Key roles that shaped my professional journey'}
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.experiences.slice(0, 3).map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <Card className="p-6 h-full hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/50 bg-card/50 backdrop-blur-sm">
                  <div className="space-y-4">
                    <div>
                      <Badge className="mb-3" variant="secondary">
                        {exp.startDate} - {exp.endDate}
                      </Badge>
                      <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {exp.title}
                      </h3>
                      <p className="text-base font-semibold text-primary">{exp.company}</p>
                      {exp.companyType && (
                        <p className="text-sm text-muted-foreground italic">{exp.companyType}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <MapPin size={14} weight="fill" className="text-accent" />
                        {exp.location}
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {exp.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.slice(0, 5).map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {exp.technologies.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{exp.technologies.length - 5}
                        </Badge>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button size="lg" variant="outline" onClick={() => navigate('/experience')} className="gap-2 group">
              View All Experience
              <ArrowRight size={18} weight="bold" className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t.labels.exploreMore || 'Explore More'}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t.labels.exploreSubtitle || 'Dive deeper into my work and expertise'}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group cursor-pointer"
              onClick={() => navigate('/projects')}
            >
              <Card className="p-8 h-full hover:shadow-2xl transition-all border-2 hover:border-accent/50 bg-gradient-to-br from-accent/5 to-transparent">
                <Code size={48} weight="duotone" className="text-accent mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-bold mb-3">{t.nav.projects}</h3>
                <p className="text-muted-foreground mb-4">
                  {data.projects.length} innovative projects across various domains
                </p>
                <div className="flex items-center gap-2 text-accent font-medium">
                  View Projects <ArrowRight size={18} weight="bold" className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group cursor-pointer"
              onClick={() => navigate('/skills')}
            >
              <Card className="p-8 h-full hover:shadow-2xl transition-all border-2 hover:border-secondary/50 bg-gradient-to-br from-secondary/5 to-transparent">
                <GraduationCap size={48} weight="duotone" className="text-secondary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-bold mb-3">{t.nav.skills}</h3>
                <p className="text-muted-foreground mb-4">
                  Expertise across {Object.keys(data.skills).length}+ technology categories
                </p>
                <div className="flex items-center gap-2 text-secondary font-medium">
                  See Skills <ArrowRight size={18} weight="bold" className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group cursor-pointer"
              onClick={() => navigate('/contact')}
            >
              <Card className="p-8 h-full hover:shadow-2xl transition-all border-2 hover:border-primary/50 bg-gradient-to-br from-primary/5 to-transparent">
                <Rocket size={48} weight="duotone" className="text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-bold mb-3">{t.nav.contact}</h3>
                <p className="text-muted-foreground mb-4">
                  Let's discuss your next project and bring ideas to life
                </p>
                <div className="flex items-center gap-2 text-primary font-medium">
                  Get in Touch <ArrowRight size={18} weight="bold" className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
