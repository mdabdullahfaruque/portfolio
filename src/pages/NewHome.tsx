import { motion } from 'framer-motion'
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
  Buildings,
  CalendarBlank,
  Stack,
  ChartLineUp
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
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editedData, setEditedData] = useState<PortfolioData>(data)

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

  const activePhotoUrl = data.photoFrameType === 'portrait' && data.photoUrlPortrait 
    ? data.photoUrlPortrait 
    : data.photoUrl

  const recentExperience = data.experiences.slice(0, 3)
  const featuredProjects = data.projects.filter(p => p.status === 'live').slice(0, 2)

  return (
    <div className="min-h-screen bg-background">
      {isAdmin && (
        <div className="fixed bottom-6 right-6 z-50 no-print">
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2 shadow-2xl" onClick={() => setEditedData(data)}>
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

      <section className="relative bg-gradient-to-b from-background via-muted/20 to-background">
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `repeating-linear-gradient(0deg, currentColor 0px, currentColor 1px, transparent 1px, transparent 2px),
                           repeating-linear-gradient(90deg, currentColor 0px, currentColor 1px, transparent 1px, transparent 2px)`,
          backgroundSize: '24px 24px'
        }} />
        
        <div className="max-w-6xl mx-auto px-6 py-16 relative z-10">
          <div className="grid lg:grid-cols-[1fr,300px] gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted border text-sm font-medium">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  {t.labels.availableForWork || 'Available for Work'}
                </div>
                
                <h1 className="text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
                  {data.name}
                </h1>
                
                <h2 className="text-2xl lg:text-3xl font-semibold text-foreground/70">
                  {data.title}
                </h2>

                <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                  {data.tagline}
                </p>
              </div>

              <div className="flex items-center gap-4 pt-2">
                {data.contact.linkedin && (
                  <a
                    href={data.contact.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-foreground transition-colors"
                  >
                    <LinkedinLogo size={22} weight="fill" />
                  </a>
                )}
                {data.contact.github && (
                  <a
                    href={data.contact.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-foreground transition-colors"
                  >
                    <GithubLogo size={22} weight="fill" />
                  </a>
                )}
                {data.contact.email && (
                  <a
                    href={`mailto:${data.contact.email}`}
                    className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-foreground transition-colors"
                  >
                    <EnvelopeSimple size={22} weight="fill" />
                  </a>
                )}
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Button 
                  size="lg"
                  onClick={() => navigate('/contact')}
                  className="gap-2 font-semibold"
                >
                  {t.hero.contactMe}
                  <ArrowRight size={18} weight="bold" />
                </Button>
                
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={handleDownloadResume}
                  className="gap-2 font-semibold"
                >
                  <DownloadSimple size={18} weight="bold" />
                  {t.labels.downloadPDF}
                </Button>
              </div>

              {data.stats && data.stats.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                  {data.stats.map((stat) => (
                    <div key={stat.id} className="space-y-1">
                      <div className="text-3xl font-bold text-foreground">
                        {stat.value}
                      </div>
                      <div className="text-sm text-muted-foreground font-medium">
                        {stat.translationKey ? t.stats[stat.translationKey] : stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex justify-center lg:justify-end"
            >
              <div className="relative">
                {data.photoFrameType === 'portrait' && data.photoUrlPortrait ? (
                  <div className="w-[280px] h-[350px] rounded-2xl overflow-hidden border-2 border-border shadow-2xl bg-muted">
                    <img 
                      src={activePhotoUrl} 
                      alt={data.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-[280px] h-[280px] rounded-2xl overflow-hidden border-2 border-border shadow-2xl bg-muted">
                    <img 
                      src={activePhotoUrl} 
                      alt={data.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 border-t bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <h2 className="text-3xl font-bold text-foreground mb-2">
              {t.labels.professionalSummary || 'Professional Summary'}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {data.summary}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6 h-full border-2 hover:border-foreground/20 transition-colors">
                <Briefcase size={32} weight="duotone" className="text-foreground mb-4" />
                <h3 className="text-xl font-bold mb-2">{t.nav.experience}</h3>
                <p className="text-muted-foreground mb-4">
                  {data.experiences.length} positions spanning 6+ years in software development
                </p>
                <Button 
                  variant="ghost" 
                  className="gap-2 px-0 hover:bg-transparent group"
                  onClick={() => navigate('/experience')}
                >
                  View Experience
                  <ArrowRight size={16} weight="bold" className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 h-full border-2 hover:border-foreground/20 transition-colors">
                <Code size={32} weight="duotone" className="text-foreground mb-4" />
                <h3 className="text-xl font-bold mb-2">{t.nav.projects}</h3>
                <p className="text-muted-foreground mb-4">
                  {data.projects.length} projects including {featuredProjects.length} live products
                </p>
                <Button 
                  variant="ghost" 
                  className="gap-2 px-0 hover:bg-transparent group"
                  onClick={() => navigate('/projects')}
                >
                  View Projects
                  <ArrowRight size={16} weight="bold" className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6 h-full border-2 hover:border-foreground/20 transition-colors">
                <Stack size={32} weight="duotone" className="text-foreground mb-4" />
                <h3 className="text-xl font-bold mb-2">{t.nav.skills}</h3>
                <p className="text-muted-foreground mb-4">
                  Expertise in {data.skills ? Object.keys(data.skills).length : 0}+ technology domains
                </p>
                <Button 
                  variant="ghost" 
                  className="gap-2 px-0 hover:bg-transparent group"
                  onClick={() => navigate('/skills')}
                >
                  View Skills
                  <ArrowRight size={16} weight="bold" className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  {t.labels.recentExperience || 'Recent Experience'}
                </h2>
                <p className="text-muted-foreground">
                  Latest positions in my professional journey
                </p>
              </div>
              <Button 
                variant="ghost" 
                className="gap-2 hidden md:flex group"
                onClick={() => navigate('/experience')}
              >
                {t.labels.viewAll || 'View All'}
                <ArrowRight size={16} weight="bold" className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </motion.div>

          <div className="space-y-6">
            {recentExperience.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 border-2 hover:border-foreground/20 transition-colors">
                  <div className="grid md:grid-cols-[200px,1fr] gap-6">
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarBlank size={16} weight="fill" />
                        <span>{exp.startDate} - {exp.endDate}</span>
                      </div>
                      <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin size={16} weight="fill" />
                        <span>{exp.location}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h3 className="text-xl font-bold text-foreground mb-1">
                          {exp.title}
                        </h3>
                        <div className="flex items-center gap-2 text-foreground/70">
                          <Buildings size={18} weight="fill" />
                          <span className="font-semibold">{exp.company}</span>
                        </div>
                        {exp.companyType && (
                          <p className="text-sm text-muted-foreground italic mt-1">{exp.companyType}</p>
                        )}
                      </div>

                      {exp.achievements && exp.achievements.length > 0 && (
                        <ul className="space-y-2">
                          {exp.achievements.slice(0, 3).map((achievement, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <CheckCircle size={16} weight="fill" className="text-foreground/40 mt-0.5 flex-shrink-0" />
                              <span>{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      <div className="flex flex-wrap gap-2 pt-2">
                        {exp.technologies.slice(0, 6).map((tech) => (
                          <Badge key={tech} variant="outline" className="text-xs font-medium">
                            {tech}
                          </Badge>
                        ))}
                        {exp.technologies.length > 6 && (
                          <Badge variant="outline" className="text-xs font-medium">
                            +{exp.technologies.length - 6} more
                          </Badge>
                        )}
                      </div>
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
            className="text-center mt-8"
          >
            <Button 
              variant="outline" 
              className="gap-2 group"
              onClick={() => navigate('/experience')}
            >
              {t.labels.viewAllExperience || 'View All Experience'}
              <ArrowRight size={16} weight="bold" className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </section>

      {featuredProjects.length > 0 && (
        <section className="py-16 px-6 bg-muted/30 border-t">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <div className="flex items-end justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-2">
                    {t.labels.featuredProjects || 'Featured Projects'}
                  </h2>
                  <p className="text-muted-foreground">
                    Live products making an impact
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  className="gap-2 hidden md:flex group"
                  onClick={() => navigate('/projects')}
                >
                  {t.labels.viewAll || 'View All'}
                  <ArrowRight size={16} weight="bold" className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {featuredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 h-full border-2 hover:border-foreground/20 transition-colors">
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-xl font-bold text-foreground">
                            {project.name}
                          </h3>
                          <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">
                            <ChartLineUp size={12} weight="bold" className="mr-1" />
                            Live
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {project.description}
                        </p>
                      </div>

                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech) => (
                            <Badge key={tech} variant="secondary" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {project.url && (
                        <div className="pt-2">
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
                          >
                            Visit Website
                            <ArrowRight size={14} weight="bold" />
                          </a>
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-8"
            >
              <Button 
                variant="outline" 
                className="gap-2 group"
                onClick={() => navigate('/projects')}
              >
                {t.labels.viewAllProjects || 'View All Projects'}
                <ArrowRight size={16} weight="bold" className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </div>
        </section>
      )}

      <section className="py-16 px-6 bg-foreground/[0.02] border-t">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="p-8 md:p-12 border-2 text-center bg-card">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                {t.hero.letsWorkTogether || "Let's Work Together"}
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                {t.hero.ctaDescription || 'Ready to bring your next project to life? Get in touch and let\'s discuss how I can help.'}
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button 
                  size="lg"
                  onClick={() => navigate('/contact')}
                  className="gap-2 font-semibold"
                >
                  {t.hero.contactMe}
                  <ArrowRight size={18} weight="bold" />
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={handleDownloadResume}
                  className="gap-2 font-semibold"
                >
                  <DownloadSimple size={18} weight="bold" />
                  {t.labels.downloadPDF}
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
