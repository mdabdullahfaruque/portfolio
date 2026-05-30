import { motion, useInView, animate } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { 
  ArrowRight, 
  ArrowUpRight,
  Briefcase, 
  Code,
  LinkedinLogo,
  GithubLogo,
  EnvelopeSimple,
  DownloadSimple,
  CheckCircle,
  MapPin,
  Globe,
  PencilSimple,
  FloppyDisk,
  Trash,
  Plus,
  Buildings,
  CalendarBlank,
  Stack,
  ChartLineUp,
  Sparkle,
  Lightning,
  Trophy,
  Database,
  Cloud,
  Cpu,
  Wrench,
  Robot,
  FileCode,
  TestTube
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

function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const match = value.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/)
  const prefix = match ? match[1] : ''
  const target = match ? parseFloat(match[2]) : 0
  const suffix = match ? match[3] : ''
  const [display, setDisplay] = useState(match ? '0' : value)

  useEffect(() => {
    if (!inView || !match) return
    const controls = animate(0, target, {
      duration: 1.4,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(Math.round(v).toString()),
    })
    return () => controls.stop()
  }, [inView])

  return <span ref={ref}>{match ? `${prefix}${display}${suffix}` : value}</span>
}

const SKILL_CATEGORY_META: Record<string, { icon: any }> = {
  backend: { icon: Code },
  frontend: { icon: FileCode },
  cloud: { icon: Cloud },
  databases: { icon: Database },
  testing: { icon: TestTube },
  tools: { icon: Wrench },
  cms: { icon: Stack },
  ai: { icon: Robot },
}

function SkillBar({ name, proficiency, years, delay }: { name: string; proficiency: number; years?: number; delay: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  return (
    <div ref={ref}>
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <span className="text-sm font-medium text-foreground">{name}</span>
        {years ? (
          <span className="text-xs text-muted-foreground">{years}y</span>
        ) : null}
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
          initial={{ width: 0 }}
          animate={inView ? { width: `${proficiency}%` } : { width: 0 }}
          transition={{ duration: 0.9, delay, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

function SkillsShowcase({ skills, labels }: { skills: PortfolioData['skills']; labels: any }) {
  const categories = Object.entries(skills).filter(([, list]) => Array.isArray(list) && list.length > 0)
  const [active, setActive] = useState(categories[0]?.[0] ?? '')
  const activeSkills = (skills as Record<string, { name: string; proficiency: number; yearsOfExperience?: number }[]>)[active] ?? []

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      <div className="flex flex-wrap gap-2 lg:flex-col lg:gap-1.5">
        {categories.map(([key]) => {
          const Icon = SKILL_CATEGORY_META[key]?.icon ?? Stack
          const isActive = key === active
          return (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`group flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all ${
                isActive
                  ? 'border-primary/40 bg-primary/10 text-foreground shadow-sm'
                  : 'border-border bg-card/40 text-muted-foreground hover:border-primary/30 hover:text-foreground'
              }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                  isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground group-hover:text-primary'
                }`}
              >
                <Icon size={17} weight="duotone" />
              </span>
              <span className="leading-tight">{labels?.skillCategories?.[key] ?? key}</span>
            </button>
          )
        })}
      </div>

      <motion.div
        key={active}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid gap-x-10 gap-y-5 sm:grid-cols-2"
      >
        {activeSkills.map((skill, i) => (
          <SkillBar
            key={skill.name}
            name={skill.name}
            proficiency={skill.proficiency}
            years={skill.yearsOfExperience}
            delay={i * 0.05}
          />
        ))}
      </motion.div>
    </div>
  )
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
        const result = reader.result as string
        if (imageType === 'square') {
          setEditedData(prev => ({ ...prev, photoUrl: result }))
        } else {
          setEditedData(prev => ({ ...prev, photoUrlPortrait: result }))
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

  const isPortrait = data.photoFrameType === 'portrait' && !!data.photoUrlPortrait
  const activePhotoUrl = isPortrait ? data.photoUrlPortrait : data.photoUrl

  const recentExperience = data.experiences
  const featuredProjects = data.projects
    .filter((p) => (p.status || '').toLowerCase() === 'live')
    .slice(0, 2)
  const currentRole = data.experiences[0]
  const careerHighlights = data.highlights && data.highlights.length > 0 ? data.highlights.slice(0, 6) : []

  const allSkills = data.skills
    ? Array.from(new Set(Object.values(data.skills).flat().map((s) => s.name)))
    : []
  const heroTech = data.heroSkills && data.heroSkills.length > 0
    ? data.heroSkills
    : allSkills.slice(0, 7)
  const skillDomains = data.skills ? Object.keys(data.skills).length : 0

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
                      <Label className="text-sm font-medium text-muted-foreground">Circle Frame (Default)</Label>
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-32 h-32 rounded-full overflow-hidden bg-muted shadow-md flex items-center justify-center shrink-0">
                          {editedData.photoUrl ? (
                            <img src={editedData.photoUrl} alt={editedData.name} className="w-full h-full object-contain" />
                          ) : (
                            <span className="text-2xl font-bold text-muted-foreground">{editedData.name.split(' ').map(n => n[0]).join('')}</span>
                          )}
                        </div>
                        <div className="w-full">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleProfileImageUpload(e, 'square')}
                            className="text-xs"
                            id="profile-image-square"
                          />
                          <p className="text-xs text-muted-foreground mt-1">Best for square photos — displayed as circle</p>
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
                    <Label className="text-sm font-medium mb-3 block">Active Frame — Live Preview</Label>
                    <div className="flex gap-3 mb-4">
                      <Button
                        type="button"
                        size="sm"
                        variant={(!editedData.photoFrameType || editedData.photoFrameType === 'square') ? 'default' : 'outline'}
                        onClick={() => setEditedData(prev => ({ ...prev, photoFrameType: 'square' }))}
                        className="flex-1"
                      >
                        Circle Frame
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant={editedData.photoFrameType === 'portrait' ? 'default' : 'outline'}
                        onClick={() => setEditedData(prev => ({ ...prev, photoFrameType: 'portrait' }))}
                        className="flex-1"
                      >
                        Portrait Frame
                      </Button>
                    </div>
                    {/* Preview of the active photo that will appear on homepage */}
                    {(() => {
                      const previewIsPortrait = editedData.photoFrameType === 'portrait' && !!editedData.photoUrlPortrait
                      const previewUrl = previewIsPortrait ? editedData.photoUrlPortrait : editedData.photoUrl
                      return previewUrl ? (
                        <div className="flex justify-center">
                          {previewIsPortrait ? (
                            <div className="overflow-hidden rounded-xl shadow-md bg-muted" style={{ width: '90px', aspectRatio: '3/4' }}>
                              <img src={previewUrl} alt="Preview" className="h-full w-full object-cover object-top" />
                            </div>
                          ) : (
                            <div className="w-28 h-28 rounded-full overflow-hidden shadow-md bg-card">
                              <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                            </div>
                          )}
                        </div>
                      ) : null
                    })()}
                    <p className="text-xs text-muted-foreground mt-2">The photo shown above is what will appear on the homepage.</p>
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

                {/* ── Hero skill badges ── */}
                <div className="border-t pt-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <Label className="text-sm font-semibold">Hero Skill Badges</Label>
                      <p className="text-xs text-muted-foreground mt-0.5">These appear as tags below your title on the home page.</p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setEditedData(prev => ({ ...prev, heroSkills: [...(prev.heroSkills || []), ''] }))}
                      className="gap-1.5 shrink-0"
                    >
                      <Plus size={14} weight="bold" />
                      Add
                    </Button>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {(editedData.heroSkills || []).map((skill, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={skill}
                          onChange={(e) => {
                            const updated = [...(editedData.heroSkills || [])]
                            updated[index] = e.target.value
                            setEditedData(prev => ({ ...prev, heroSkills: updated }))
                          }}
                          placeholder="e.g. C#"
                          className="text-sm h-8"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 shrink-0"
                          onClick={() => {
                            const updated = (editedData.heroSkills || []).filter((_, i) => i !== index)
                            setEditedData(prev => ({ ...prev, heroSkills: updated }))
                          }}
                        >
                          <Trash size={14} weight="bold" className="text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
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
                  <div>
                    <Label htmlFor="edit-github" className="text-sm font-medium">GitHub URL</Label>
                    <Input
                      id="edit-github"
                      value={editedData.contact.github}
                      onChange={(e) => setEditedData({
                        ...editedData,
                        contact: { ...editedData.contact, github: e.target.value }
                      })}
                      className="mt-1.5"
                    />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-base font-semibold">Career Highlights</Label>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const newHighlights = editedData.highlights || []
                        setEditedData({ ...editedData, highlights: [...newHighlights, ''] })
                      }}
                      className="gap-2"
                    >
                      <Plus size={16} weight="bold" />
                      Add Highlight
                    </Button>
                  </div>
                  <div className="space-y-2 max-h-56 overflow-y-auto">
                    {(editedData.highlights || []).map((highlight, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={highlight}
                          onChange={(e) => {
                            const updated = [...(editedData.highlights || [])]
                            updated[index] = e.target.value
                            setEditedData({ ...editedData, highlights: updated })
                          }}
                          placeholder="e.g. Led migration of global platform..."
                          className="text-sm"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            const updated = (editedData.highlights || []).filter((_, i) => i !== index)
                            setEditedData({ ...editedData, highlights: updated })
                          }}
                        >
                          <Trash size={16} weight="bold" className="text-destructive" />
                        </Button>
                      </div>
                    ))}
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

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden border-b border-border/60 bg-background pt-28 pb-20 lg:pt-32 lg:pb-24">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
            maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent)',
          }}
        />
        <div className="pointer-events-none absolute -top-40 right-0 h-[420px] w-[420px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="pointer-events-none absolute top-24 -left-24 h-[360px] w-[360px] rounded-full bg-accent/10 blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="space-y-7"
            >
              {data.contact.location && (
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3.5 py-1.5 text-sm font-medium text-muted-foreground backdrop-blur">
                  <MapPin size={15} weight="fill" className="text-primary" />
                  {data.contact.location}
                </div>
              )}

              <div className="space-y-3">
                <p className="text-base font-medium text-muted-foreground">
                  {t.hero.greeting || 'Hello, I am'}
                </p>
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  {data.name}
                </h1>
                <h2 className="bg-gradient-to-r from-primary to-accent bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
                  {data.title}
                </h2>
              </div>

              <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
                {data.tagline}
              </p>

              {heroTech.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {heroTech.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md border border-border bg-card/50 px-2.5 py-1 text-xs font-medium text-foreground/80"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 pt-1">
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

              <div className="flex items-center gap-2.5 pt-1">
                {data.contact.linkedin && (
                  <a
                    href={data.contact.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-card/50 text-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary"
                  >
                    <LinkedinLogo size={22} weight="fill" />
                  </a>
                )}
                {data.contact.github && (
                  <a
                    href={data.contact.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-card/50 text-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary"
                  >
                    <GithubLogo size={22} weight="fill" />
                  </a>
                )}
                {data.contact.email && (
                  <a
                    href={`mailto:${data.contact.email}`}
                    aria-label="Email"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-card/50 text-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary"
                  >
                    <EnvelopeSimple size={22} weight="fill" />
                  </a>
                )}

              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
              className="relative mx-auto flex flex-col items-center gap-5 lg:ml-auto"
            >
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                className="relative"
              >
                <div className="w-[360px] h-[360px] rounded-full overflow-hidden shadow-2xl bg-card">
                  <img
                    src={activePhotoUrl}
                    alt={data.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              </motion.div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 py-2 text-sm font-semibold text-primary shadow-sm backdrop-blur-sm">
                <Trophy size={15} weight="fill" />
                {(data.stats?.find(s => s.translationKey === 'yearsExperience')?.value ?? '6+') + ' ' + (t.labels.yearsExperienceBadge || 'Years Experience')}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== SUMMARY + NAV CARDS ===== */}
      <section className="bg-background px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 max-w-3xl"
          >
            <div className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              <Sparkle size={15} weight="fill" />
              {t.labels.whatIDo || 'What I Do'}
            </div>
            <h2 className="mb-4 text-3xl font-bold text-foreground">
              {t.labels.summary || 'Professional Summary'}
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              {data.summary}
            </p>
          </motion.div>

          {data.stats && data.stats.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="flex flex-wrap gap-3"
            >
              {data.stats.map((stat) => (
                <div
                  key={stat.id}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm"
                >
                  <span className="text-base font-bold text-primary">
                    <CountUp value={stat.value} />
                  </span>
                  <span className="text-muted-foreground">
                    {stat.translationKey ? t.stats[stat.translationKey] : stat.label}
                  </span>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ===== RECENT EXPERIENCE ===== */}
      <section className="border-t border-border/60 bg-muted/20 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 flex items-end justify-between"
          >
            <div>
              <div className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                <Briefcase size={15} weight="fill" />
                {t.labels.recentExperience || 'Experience'}
              </div>
              <h2 className="text-3xl font-bold text-foreground">
                {t.labels.recentExperience || 'Recent Experience'}
              </h2>
            </div>
            <Button
              variant="ghost"
              className="group hidden gap-2 md:flex"
              onClick={() => navigate('/experience')}
            >
              {t.labels.viewAllExperience || 'View Full Details'}
              <ArrowRight size={16} weight="bold" className="transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>

          <div className="relative border-l-2 border-border/60 pl-8 space-y-0">
            {recentExperience.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(index * 0.06, 0.4) }}
                className="relative pb-8 last:pb-0"
              >
                <span className="absolute -left-[41px] top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-primary bg-background shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                </span>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-base font-bold text-foreground">{exp.title}</h3>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Buildings size={13} weight="fill" />
                        {exp.company}
                      </span>
                      {exp.location && (
                        <span className="flex items-center gap-1">
                          <span className="text-border/60">·</span>
                          <MapPin size={13} weight="fill" />
                          {exp.location}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 text-xs font-medium text-muted-foreground mt-0.5 sm:mt-0">
                    <CalendarBlank size={13} weight="fill" className="text-primary/60" />
                    <span>{exp.startDate} — {exp.endDate}</span>
                  </div>
                </div>
                {exp.description && (
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{exp.description}</p>
                )}
                {exp.technologies && exp.technologies.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {exp.technologies.slice(0, 6).map((tech) => (
                      <span
                        key={tech}
                        className="rounded border border-border bg-muted/60 px-2 py-0.5 text-xs font-medium text-foreground/70"
                      >
                        {tech}
                      </span>
                    ))}
                    {exp.technologies.length > 6 && (
                      <span className="rounded border border-border bg-muted/60 px-2 py-0.5 text-xs font-medium text-muted-foreground">
                        +{exp.technologies.length - 6}
                      </span>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SKILLS SHOWCASE ===== */}
      {skillDomains > 0 && (
        <section className="border-y border-border/60 bg-muted/20 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12 max-w-2xl"
            >
              <div className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                <Cpu size={15} weight="fill" />
                {t.labels.technologies || 'Technologies'}
              </div>
              <h2 className="mb-3 text-3xl font-bold text-foreground">
                {t.labels.techStackTitle || 'Technical Toolbox'}
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                {t.labels.techStackSubtitle || 'Technologies I use to design, build, and ship'}
              </p>
            </motion.div>

            <SkillsShowcase skills={data.skills} labels={t.labels} />
          </div>
        </section>
      )}

      {/* ===== CAREER HIGHLIGHTS ===== */}
      {careerHighlights.length > 0 && (
        <section className="bg-background px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12 max-w-2xl"
            >
              <div className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                <Trophy size={15} weight="fill" />
                {t.labels.careerHighlights || 'Career Highlights'}
              </div>
              <h2 className="mb-3 text-3xl font-bold text-foreground">
                {t.labels.careerHighlights || 'Career Highlights'}
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                {t.labels.careerHighlightsSubtitle || 'Measurable impact delivered across enterprise-scale systems'}
              </p>
            </motion.div>

            <div className="grid gap-4 md:grid-cols-2">
              {careerHighlights.map((highlight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06 }}
                >
                  <Card className="flex h-full items-start gap-4 border-2 p-5 transition-all hover:-translate-y-1 hover:border-primary/40">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Lightning size={18} weight="fill" />
                    </span>
                    <p className="text-sm leading-relaxed text-foreground/90">{highlight}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}



      {/* ===== FEATURED PROJECTS ===== */}
      {featuredProjects.length > 0 && (
        <section className="border-t border-border/60 bg-muted/30 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10 flex items-end justify-between"
            >
              <div>
                <h2 className="mb-2 text-3xl font-bold text-foreground">
                  {t.labels.featuredProjects || 'Featured Projects'}
                </h2>
                <p className="text-muted-foreground">
                  {t.labels.featuredProjectsSubtitle || 'Production platforms serving real users'}
                </p>
              </div>
              <Button
                variant="ghost"
                className="group hidden gap-2 md:flex"
                onClick={() => navigate('/projects')}
              >
                {t.labels.viewProjects || 'View All'}
                <ArrowRight size={16} weight="bold" className="transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2">
              {featuredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -6 }}
                >
                  <Card className="h-full border-2 p-6 transition-colors hover:border-primary/40">
                    <div className="space-y-4">
                      <div>
                        <div className="mb-2 flex items-start justify-between gap-3">
                          <h3 className="text-xl font-bold text-foreground">{project.name}</h3>
                          <Badge variant="outline" className="shrink-0 border-green-500/20 bg-green-500/10 text-green-700 dark:text-green-400">
                            <ChartLineUp size={12} weight="bold" className="mr-1" />
                            {t.labels.live || 'Live'}
                          </Badge>
                        </div>
                        <p className="text-sm leading-relaxed text-muted-foreground">
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
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                          >
                            {t.labels.visitWebsite || 'Visit Website'}
                            <ArrowUpRight size={15} weight="bold" />
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
              className="mt-8 text-center"
            >
              <Button
                variant="outline"
                className="group gap-2"
                onClick={() => navigate('/projects')}
              >
                {t.labels.viewProjects || 'View All Projects'}
                <ArrowRight size={16} weight="bold" className="transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </div>
        </section>
      )}

      {/* ===== CTA ===== */}
      <section className="border-t border-border/60 bg-background px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="relative overflow-hidden border-2 bg-card p-10 text-center md:p-14">
              <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
              <div className="relative">
                <h2 className="mb-4 text-3xl font-bold text-foreground">
                  {t.labels.letsBuild || "Let's build something great"}
                </h2>
                <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
                  {t.labels.availabilityNote || 'Open to discussing senior engineering roles and collaborations.'}
                </p>
                <div className="flex flex-wrap justify-center gap-3">
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
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
