import { motion, useScroll, useTransform } from 'framer-motion'
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
  Rocket,
  Lightning,
  Gauge,
  Shield
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

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100])

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

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>, imageType: 'square' | 'portrait') => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (imageType === 'square') {
          setEditedData({ ...editedData, photoUrl: reader.result as string })
        } else {
          setEditedData({ ...editedData, photoUrlPortrait: reader.result as string })
        }
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
                  <Label className="text-base font-semibold mb-4 block">Profile Pictures</Label>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-muted-foreground">Square Frame (Default)</Label>
                      <div className="flex flex-col items-center gap-4">
                        <Avatar className="w-32 h-32 border-4 border-primary/20">
                          <AvatarImage src={editedData.photoUrl} alt={editedData.name} className="object-cover" />
                          <AvatarFallback className="text-2xl">{editedData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="w-full">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleProfileImageUpload(e, 'square')}
                            className="text-xs"
                            id="profile-image-square"
                          />
                          <p className="text-xs text-muted-foreground mt-1">Best for square/circular photos</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-muted-foreground">Portrait Frame</Label>
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-32 h-40 border-4 border-secondary/20 rounded-2xl overflow-hidden bg-muted flex items-center justify-center">
                          {editedData.photoUrlPortrait ? (
                            <img src={editedData.photoUrlPortrait} alt={editedData.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-xs text-muted-foreground text-center px-2">No portrait image</span>
                          )}
                        </div>
                        <div className="w-full">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleProfileImageUpload(e, 'portrait')}
                            className="text-xs"
                            id="profile-image-portrait"
                          />
                          <p className="text-xs text-muted-foreground mt-1">Best for vertical/full body photos</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <Label htmlFor="frame-type" className="text-sm font-medium mb-2 block">Active Frame</Label>
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        size="sm"
                        variant={(!editedData.photoFrameType || editedData.photoFrameType === 'square') ? 'default' : 'outline'}
                        onClick={() => setEditedData({ ...editedData, photoFrameType: 'square' })}
                        className="flex-1"
                      >
                        Square Frame
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant={editedData.photoFrameType === 'portrait' ? 'default' : 'outline'}
                        onClick={() => setEditedData({ ...editedData, photoFrameType: 'portrait' })}
                        className="flex-1"
                      >
                        Portrait Frame
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Choose which photo frame to display on the homepage</p>
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

      <section className="relative pt-20 pb-8 px-6 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, oklch(0.45 0.20 265 / 0.05) 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }} />
        </div>

        <motion.div 
          className="max-w-7xl mx-auto w-full relative z-10"
          style={{ y: heroY }}
        >
          <div className="grid lg:grid-cols-[1fr,380px] gap-8 items-start">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-4"
            >
              <div className="space-y-3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-2 flex-wrap"
                >
                  <Badge className="px-2.5 py-1 text-xs font-semibold bg-primary/15 text-primary border-primary/40 hover:bg-primary/20">
                    <MapPin size={12} weight="fill" className="mr-1" />
                    {data.contact.location}
                  </Badge>
                  <Badge className="px-2.5 py-1 text-xs font-semibold bg-accent/15 text-accent border-accent/40 hover:bg-accent/20">
                    <CheckCircle size={12} weight="fill" className="mr-1" />
                    {t.labels.availableForWork || 'Available for Work'}
                  </Badge>
                </motion.div>

                <motion.h1 
                  className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  {data.name}
                </motion.h1>
                
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"
                >
                  {data.title}
                </motion.h2>

                <motion.p 
                  className="text-base md:text-lg text-muted-foreground/90 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  {t.profile.tagline}
                </motion.p>

                <motion.p 
                  className="text-sm md:text-base text-muted-foreground leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {data.summary}
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="flex items-center gap-2.5 pt-1"
              >
                {data.contact.linkedin && (
                  <motion.a
                    href={data.contact.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 hover:from-primary hover:to-primary/80 text-foreground hover:text-primary-foreground flex items-center justify-center transition-all shadow-sm hover:shadow-lg"
                  >
                    <LinkedinLogo size={20} weight="fill" />
                  </motion.a>
                )}
                {data.contact.github && (
                  <motion.a
                    href={data.contact.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 hover:from-primary hover:to-primary/80 text-foreground hover:text-primary-foreground flex items-center justify-center transition-all shadow-sm hover:shadow-lg"
                  >
                    <GithubLogo size={20} weight="fill" />
                  </motion.a>
                )}
                {data.contact.email && (
                  <motion.a
                    href={`mailto:${data.contact.email}`}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 hover:from-primary hover:to-primary/80 text-foreground hover:text-primary-foreground flex items-center justify-center transition-all shadow-sm hover:shadow-lg"
                  >
                    <EnvelopeSimple size={20} weight="fill" />
                  </motion.a>
                )}
                <div className="h-5 w-px bg-border mx-0.5" />
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground"
                >
                  <Envelope size={14} weight="fill" />
                  <span className="font-medium">{data.contact.email}</span>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-2.5 pt-1"
              >
                <Button 
                  size="default"
                  onClick={() => navigate('/projects')}
                  className="gap-2 group hover:scale-105 transition-transform shadow-md"
                >
                  {t.hero.viewWork}
                  <ArrowRight size={18} weight="bold" className="group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <Button 
                  size="default"
                  variant="outline"
                  onClick={handleDownloadResume}
                  className="gap-2 hover:scale-105 transition-transform"
                >
                  <DownloadSimple size={18} weight="bold" />
                  {t.labels.downloadPDF}
                </Button>
                
                <Button 
                  size="default"
                  variant="ghost"
                  onClick={() => navigate('/contact')}
                  className="gap-2 hover:scale-105 transition-transform"
                >
                  <EnvelopeSimple size={18} weight="bold" />
                  {t.hero.contactMe}
                </Button>
              </motion.div>

              {data.stats && data.stats.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2"
                >
                  {data.stats.map((stat, index) => (
                    <motion.div
                      key={stat.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.05 }}
                      whileHover={{ y: -3, scale: 1.02 }}
                      className="bg-card/60 backdrop-blur-sm border border-border/60 rounded-lg p-3 hover:shadow-lg transition-all hover:border-primary/40"
                    >
                      <div className="text-2xl md:text-3xl font-bold bg-gradient-to-br from-primary via-secondary to-accent bg-clip-text text-transparent mb-0.5">
                        {stat.value}
                      </div>
                      <div className="text-xs text-muted-foreground font-medium">
                        {stat.translationKey ? t.stats[stat.translationKey] : stat.label}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex justify-center lg:justify-end"
            >
              <div className="relative">
                {(!data.photoFrameType || data.photoFrameType === 'square') ? (
                  <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 via-secondary/15 to-accent/20 rounded-3xl blur-2xl" />
                    <Avatar className="w-72 h-72 md:w-80 md:h-80 border-[6px] border-background shadow-2xl relative z-10 ring-2 ring-primary/30">
                      <AvatarImage src={data.photoUrl} alt={data.name} className="object-cover" />
                      <AvatarFallback className="text-5xl font-bold bg-gradient-to-br from-primary to-accent text-primary-foreground">
                        {data.name.split(' ').map((n) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 via-secondary/15 to-accent/20 rounded-3xl blur-2xl" />
                    <div className="w-72 h-[360px] md:w-80 md:h-[400px] border-[6px] border-background shadow-2xl relative z-10 ring-2 ring-primary/30 rounded-2xl overflow-hidden bg-muted">
                      {data.photoUrlPortrait ? (
                        <img src={data.photoUrlPortrait} alt={data.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-accent">
                          <span className="text-5xl font-bold text-primary-foreground">
                            {data.name.split(' ').map((n) => n[0]).join('')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <section className="py-8 px-6 bg-gradient-to-b from-transparent to-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-end justify-between mb-6"
          >
            <div>
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                {t.labels.recentExperience || 'Recent Experience'}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {t.labels.experienceSubtitle || 'Key roles that shaped my professional journey'}
              </p>
            </div>
            <Button size="sm" variant="ghost" onClick={() => navigate('/experience')} className="gap-1.5 group hidden md:flex">
              {t.labels.viewAll || 'View All'}
              <ArrowRight size={16} weight="bold" className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.experiences.slice(0, 3).map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4, scale: 1.01 }}
                className="group"
              >
                <Card className="p-4 h-full hover:shadow-lg transition-all duration-300 border hover:border-primary/50 bg-card/70 backdrop-blur-sm">
                  <div className="space-y-2.5">
                    <div>
                      <Badge className="mb-2 text-xs" variant="secondary">
                        {exp.startDate} - {exp.endDate}
                      </Badge>
                      <h3 className="text-base font-bold text-foreground mb-0.5 group-hover:text-primary transition-colors leading-tight">
                        {exp.title}
                      </h3>
                      <p className="text-sm font-semibold text-primary">{exp.company}</p>
                      {exp.companyType && (
                        <p className="text-xs text-muted-foreground italic leading-tight mt-0.5">{exp.companyType}</p>
                      )}
                      <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                        <MapPin size={12} weight="fill" className="text-accent" />
                        {exp.location}
                      </div>
                    </div>

                    {exp.achievements && exp.achievements.length > 0 && (
                      <ul className="space-y-1">
                        {exp.achievements.slice(0, 2).map((achievement, i) => (
                          <li key={i} className="text-xs text-muted-foreground leading-relaxed flex items-start gap-1.5">
                            <CheckCircle size={12} weight="fill" className="text-accent mt-0.5 flex-shrink-0" />
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="flex flex-wrap gap-1">
                      {exp.technologies.slice(0, 4).map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs py-0 px-1.5">
                          {tech}
                        </Badge>
                      ))}
                      {exp.technologies.length > 4 && (
                        <Badge variant="outline" className="text-xs py-0 px-1.5">
                          +{exp.technologies.length - 4}
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
            className="text-center mt-5 md:hidden"
          >
            <Button size="default" variant="outline" onClick={() => navigate('/experience')} className="gap-2 group">
              {t.labels.viewAllExperience || 'View All Experience'}
              <ArrowRight size={16} weight="bold" className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-1">
              {t.labels.exploreMore || 'Explore More'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t.labels.exploreSubtitle || 'Dive deeper into my work and expertise'}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              whileHover={{ y: -4, scale: 1.01 }}
              className="group cursor-pointer"
              onClick={() => navigate('/projects')}
            >
              <Card className="p-5 h-full hover:shadow-lg transition-all border hover:border-accent/50 bg-gradient-to-br from-accent/5 to-transparent">
                <Code size={36} weight="duotone" className="text-accent mb-2.5 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-bold mb-1.5">{t.nav.projects}</h3>
                <p className="text-sm text-muted-foreground mb-2.5 leading-relaxed">
                  {data.projects.length} innovative projects across various domains
                </p>
                <div className="flex items-center gap-1.5 text-accent font-medium text-sm">
                  View Projects <ArrowRight size={14} weight="bold" className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -4, scale: 1.01 }}
              className="group cursor-pointer"
              onClick={() => navigate('/skills')}
            >
              <Card className="p-5 h-full hover:shadow-lg transition-all border hover:border-secondary/50 bg-gradient-to-br from-secondary/5 to-transparent">
                <Gauge size={36} weight="duotone" className="text-secondary mb-2.5 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-bold mb-1.5">{t.nav.skills}</h3>
                <p className="text-sm text-muted-foreground mb-2.5 leading-relaxed">
                  Expertise across {data.skills ? Object.keys(data.skills).length : 0}+ technology categories
                </p>
                <div className="flex items-center gap-1.5 text-secondary font-medium text-sm">
                  See Skills <ArrowRight size={14} weight="bold" className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              whileHover={{ y: -4, scale: 1.01 }}
              className="group cursor-pointer"
              onClick={() => navigate('/contact')}
            >
              <Card className="p-5 h-full hover:shadow-lg transition-all border hover:border-primary/50 bg-gradient-to-br from-primary/5 to-transparent">
                <Rocket size={36} weight="duotone" className="text-primary mb-2.5 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-bold mb-1.5">{t.nav.contact}</h3>
                <p className="text-sm text-muted-foreground mb-2.5 leading-relaxed">
                  Let's discuss your next project and bring ideas to life
                </p>
                <div className="flex items-center gap-1.5 text-primary font-medium text-sm">
                  Get in Touch <ArrowRight size={14} weight="bold" className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-8 px-6 bg-gradient-to-b from-transparent to-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-6 md:p-8 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border border-primary/20">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-primary/10 flex-shrink-0">
                    <Lightning size={24} weight="duotone" className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base mb-1">Fast Delivery</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">Agile development with quick turnaround times</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-secondary/10 flex-shrink-0">
                    <Shield size={24} weight="duotone" className="text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base mb-1">Secure & Scalable</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">Enterprise-grade security and scalability</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-accent/10 flex-shrink-0">
                    <Sparkle size={24} weight="duotone" className="text-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base mb-1">Innovation Focused</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">Leveraging cutting-edge technologies</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
