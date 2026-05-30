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
  Image as ImageIcon,
  Trash,
  Plus
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

export function Home({ data, t, isAdmin, onUpdate }: HomeProps) {
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
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editedData, setEditedData] = useState<PortfolioData>(data)

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
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3])

  return (
    <div className="min-h-screen bg-background" ref={containerRef}>
      {isAdmin && (
        <div className="fixed bottom-6 right-6 z-50 no-print">
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2 shadow-lg" onClick={() => setEditedData(data)}>
                <PencilSimple size={20} weight="bold" />
                Edit Home Page
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Home Page Information</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                <div>
                  <Label>Profile Picture</Label>
                  <div className="flex items-center gap-6 mt-3">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={editedData.photoUrl} alt={editedData.name} className="object-cover" />
                      <AvatarFallback>{editedData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleProfileImageUpload}
                        className="mb-2"
                        id="profile-image-upload"
                      />
                      <p className="text-xs text-muted-foreground">Upload a new profile picture (PNG, JPG, or GIF)</p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-name">Full Name</Label>
                    <Input
                      id="edit-name"
                      value={editedData.name}
                      onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-title">Job Title</Label>
                    <Input
                      id="edit-title"
                      value={editedData.title}
                      onChange={(e) => setEditedData({ ...editedData, title: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="edit-tagline">Tagline</Label>
                  <Input
                    id="edit-tagline"
                    value={editedData.tagline}
                    onChange={(e) => setEditedData({ ...editedData, tagline: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="edit-summary">Professional Summary</Label>
                  <Textarea
                    id="edit-summary"
                    value={editedData.summary}
                    onChange={(e) => setEditedData({ ...editedData, summary: e.target.value })}
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="edit-aboutMe">About Me (Extended)</Label>
                  <Textarea
                    id="edit-aboutMe"
                    value={editedData.aboutMe}
                    onChange={(e) => setEditedData({ ...editedData, aboutMe: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-email">Email</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={editedData.contact.email}
                      onChange={(e) => setEditedData({
                        ...editedData,
                        contact: { ...editedData.contact, email: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-phone">Phone</Label>
                    <Input
                      id="edit-phone"
                      value={editedData.contact.phone}
                      onChange={(e) => setEditedData({
                        ...editedData,
                        contact: { ...editedData.contact, phone: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-location">Location</Label>
                    <Input
                      id="edit-location"
                      value={editedData.contact.location}
                      onChange={(e) => setEditedData({
                        ...editedData,
                        contact: { ...editedData.contact, location: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-linkedin">LinkedIn URL</Label>
                    <Input
                      id="edit-linkedin"
                      value={editedData.contact.linkedin}
                      onChange={(e) => setEditedData({
                        ...editedData,
                        contact: { ...editedData.contact, linkedin: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-github">GitHub URL</Label>
                    <Input
                      id="edit-github"
                      value={editedData.contact.github}
                      onChange={(e) => setEditedData({
                        ...editedData,
                        contact: { ...editedData.contact, github: e.target.value }
                      })}
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
                  <div className="space-y-4 max-h-64 overflow-y-auto">
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
                                  placeholder="e.g. Projects Completed"
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

      <section className="relative pt-24 pb-6 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        
        <motion.div 
          className="max-w-6xl mx-auto w-full relative z-10"
          style={{ opacity }}
        >
          <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                  {data.name}
                </h1>
                
                <h2 className="text-lg lg:text-xl font-semibold text-primary">
                  {data.title}
                </h2>
                
                <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl pt-1">
                  {data.tagline}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                {data.stats && data.stats.map((stat) => (
                  <div key={stat.id} className="bg-card border border-border rounded-lg p-3 text-center">
                    <div className="text-xl lg:text-2xl font-bold text-primary">{stat.value}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <Button 
                  onClick={() => navigate('/projects')}
                  className="gap-2"
                >
                  {t.hero.viewWork}
                  <ArrowRight size={18} weight="bold" />
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => navigate('/contact')}
                  className="gap-2"
                >
                  {t.hero.contactMe}
                </Button>
                
                <Button 
                  variant="ghost"
                  onClick={handleDownloadResume}
                  className="gap-2"
                >
                  <DownloadSimple size={18} weight="bold" />
                  {t.hero.downloadResume}
                </Button>
              </div>

              <div className="flex gap-2 pt-1">
                {data.contact.linkedin && (
                  <motion.a
                    href={data.contact.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-9 h-9 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground text-foreground flex items-center justify-center transition-colors"
                  >
                    <LinkedinLogo size={18} weight="fill" />
                  </motion.a>
                )}
                {data.contact.github && (
                  <motion.a
                    href={data.contact.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-9 h-9 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground text-foreground flex items-center justify-center transition-colors"
                  >
                    <GithubLogo size={18} weight="fill" />
                  </motion.a>
                )}
                {data.contact.email && (
                  <motion.a
                    href={`mailto:${data.contact.email}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-9 h-9 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground text-foreground flex items-center justify-center transition-colors"
                  >
                    <EnvelopeSimple size={18} weight="fill" />
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
              <Avatar className="w-40 h-40 lg:w-48 lg:h-48 border-4 border-card shadow-xl">
                <AvatarImage src={data.photoUrl} alt={data.name} className="object-contain" />
                <AvatarFallback className="text-3xl font-bold bg-muted text-foreground">
                  {data.name.split(' ').map((n) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <section className="py-6 px-6 bg-card border-y border-border">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold mb-4 text-foreground">{t.labels.aboutMe}</h2>
            <div className="grid md:grid-cols-[1.5fr_1fr] gap-6">
              <div className="space-y-3">
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {data.summary}
                </p>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <MapPin size={16} className="text-primary" weight="fill" />
                    <span className="text-foreground">{data.contact.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Envelope size={16} className="text-primary" weight="fill" />
                    <a href={`mailto:${data.contact.email}`} className="text-primary hover:underline">
                      {data.contact.email}
                    </a>
                  </div>
                  {data.contact.phone && (
                    <div className="flex items-center gap-2 text-xs">
                      <Phone size={16} className="text-primary" weight="fill" />
                      <span className="text-foreground">{data.contact.phone}</span>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-2 text-foreground uppercase tracking-wide">{t.labels.keyAchievements}</h3>
                <div className="space-y-1.5">
                  {data.highlights && data.highlights.slice(0, 5).map((highlight, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start gap-2"
                    >
                      <CheckCircle size={14} weight="fill" className="text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-muted-foreground leading-snug">{highlight}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>



      <section className="py-6 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-5">
              <h2 className="text-2xl font-bold mb-1 text-foreground">{t.labels.recentExperience || 'Recent Experience'}</h2>
              <p className="text-muted-foreground text-xs">{t.labels.experienceSubtitle || 'Key roles that shaped my professional journey'}</p>
            </div>
            
            <div className="space-y-4">
              {data.experiences.slice(0, 3).map((exp, index) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-4 hover:shadow-lg transition-all duration-300 hover:border-primary/30 border">
                    <div className="space-y-2.5">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
                        <div>
                          <h3 className="text-base font-bold text-foreground">{exp.title}</h3>
                          <div className="flex items-center gap-2 flex-wrap mt-0.5">
                            <p className="text-sm text-primary font-semibold">{exp.company}</p>
                            {exp.companyType && (
                              <>
                                <span className="text-muted-foreground text-xs">•</span>
                                <p className="text-xs text-muted-foreground italic">{exp.companyType}</p>
                              </>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground flex-wrap">
                            <div className="flex items-center gap-1">
                              <MapPin size={12} weight="fill" className="text-accent" />
                              {exp.location}
                            </div>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Briefcase size={12} weight="fill" className="text-accent" />
                              {exp.startDate} - {exp.endDate}
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-foreground/80 leading-relaxed text-xs">{exp.description}</p>

                      {exp.achievements && exp.achievements.length > 0 && (
                        <div>
                          <h4 className="text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wide">{t.labels.keyAchievements}:</h4>
                          <div className="space-y-1">
                            {exp.achievements.slice(0, 2).map((achievement, idx) => (
                              <div key={idx} className="flex items-start gap-1.5">
                                <CheckCircle size={12} weight="fill" className="text-accent mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-muted-foreground leading-snug">{achievement}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <h4 className="text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wide">{t.labels.technologies}:</h4>
                        <div className="flex flex-wrap gap-1">
                          {exp.technologies.slice(0, 10).map((tech) => (
                            <Badge key={tech} variant="secondary" className="text-xs font-medium px-1.5 py-0.5">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
            
            <div className="text-center mt-5">
              <Button size="sm" variant="outline" onClick={() => navigate('/experience')} className="gap-2">
                {t.labels.viewAllExperience || 'View All Experience'}
                <ArrowRight size={16} weight="bold" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-6 px-6 bg-card border-t border-border">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-4"
          >
            <h2 className="text-2xl font-bold mb-1 text-center text-foreground">{t.labels.exploreMore || 'Explore More'}</h2>
            <p className="text-muted-foreground text-xs text-center max-w-2xl mx-auto">
              {t.labels.exploreSubtitle || 'Dive deeper into my professional journey, projects, and technical expertise'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid md:grid-cols-3 gap-3"
          >
            <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
              <Card className="p-4 hover:shadow-lg transition-all cursor-pointer h-full border" onClick={() => navigate('/experience')}>
                <Briefcase size={28} weight="duotone" className="text-primary mb-2" />
                <h3 className="text-base font-semibold mb-1 text-foreground">{t.nav.experience}</h3>
                <p className="text-muted-foreground text-xs mb-2">
                  {data.experiences.length} {t.labels.positionsAcrossCompanies || 'positions across leading companies'}
                </p>
                <div className="flex items-center gap-1.5 text-primary text-xs font-medium">
                  {t.labels.explore || 'Explore'} <ArrowRight size={14} weight="bold" />
                </div>
              </Card>
            </motion.div>

            <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
              <Card className="p-4 hover:shadow-lg transition-all cursor-pointer h-full border" onClick={() => navigate('/projects')}>
                <Code size={28} weight="duotone" className="text-primary mb-2" />
                <h3 className="text-base font-semibold mb-1 text-foreground">{t.nav.projects}</h3>
                <p className="text-muted-foreground text-xs mb-2">
                  {data.projects.length} {t.labels.projectsForMarkets || 'projects for global markets'}
                </p>
                <div className="flex items-center gap-1.5 text-primary text-xs font-medium">
                  {t.labels.viewProjects || 'View Projects'} <ArrowRight size={14} weight="bold" />
                </div>
              </Card>
            </motion.div>

            <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
              <Card className="p-4 hover:shadow-lg transition-all cursor-pointer h-full border" onClick={() => navigate('/skills')}>
                <GraduationCap size={28} weight="duotone" className="text-primary mb-2" />
                <h3 className="text-base font-semibold mb-1 text-foreground">{t.nav.skills}</h3>
                <p className="text-muted-foreground text-xs mb-2">
                  {t.labels.expertiseInCategories || 'Expertise in'} {Object.keys(data.skills).length} {t.labels.technologyCategories || 'technology categories'}
                </p>
                <div className="flex items-center gap-1.5 text-primary text-xs font-medium">
                  {t.labels.seeSkills || 'See Skills'} <ArrowRight size={14} weight="bold" />
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
