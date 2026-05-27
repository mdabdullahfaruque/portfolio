import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Buildings, Check, Plus, Trash, Pencil } from '@phosphor-icons/react'
import { PortfolioData, Experience } from '@/lib/types'
import { toast } from 'sonner'

interface ExperiencePageProps {
  data: PortfolioData
  t: any
  isAdmin: boolean
  onUpdate: (data: PortfolioData) => void
}

export function ExperiencePage({ data, t, isAdmin, onUpdate }: ExperiencePageProps) {
  const [editingExp, setEditingExp] = useState<Experience | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleSave = (exp: Experience) => {
    const updated = { ...data }
    const index = updated.experiences.findIndex(e => e.id === exp.id)
    
    if (index >= 0) {
      updated.experiences[index] = exp
    } else {
      updated.experiences.push({ ...exp, id: Date.now().toString() })
    }
    
    onUpdate(updated)
    setIsDialogOpen(false)
    setEditingExp(null)
    toast.success('Experience updated successfully')
  }

  const handleDelete = (id: string) => {
    const updated = { ...data }
    updated.experiences = updated.experiences.filter(e => e.id !== id)
    onUpdate(updated)
    toast.success('Experience deleted')
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-5xl font-bold mb-4">{t.nav.experience}</h1>
              <p className="text-xl text-muted-foreground">
                Professional journey spanning {data.experiences.length} roles
              </p>
            </div>
            
            {isAdmin && (
              <Button
                onClick={() => {
                  setEditingExp({
                    id: '',
                    title: '',
                    company: '',
                    location: '',
                    startDate: '',
                    endDate: '',
                    description: '',
                    achievements: [],
                    technologies: [],
                  })
                  setIsDialogOpen(true)
                }}
                className="gap-2"
              >
                <Plus size={20} weight="bold" />
                Add Experience
              </Button>
            )}
          </div>

          <div className="space-y-8">
            {data.experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-8 hover:shadow-2xl transition-all duration-300 border-l-4 border-l-accent relative group">
                  {isAdmin && (
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingExp(exp)
                          setIsDialogOpen(true)
                        }}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(exp.id)}
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  )}

                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-2xl font-semibold mb-2">{exp.title}</h3>
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

      {isAdmin && editingExp && (
        <ExperienceEditDialog
          experience={editingExp}
          open={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false)
            setEditingExp(null)
          }}
          onSave={handleSave}
        />
      )}
    </div>
  )
}

function ExperienceEditDialog({
  experience,
  open,
  onClose,
  onSave,
}: {
  experience: Experience
  open: boolean
  onClose: () => void
  onSave: (exp: Experience) => void
}) {
  const [formData, setFormData] = useState(experience)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{formData.id ? 'Edit Experience' : 'Add Experience'}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Company</label>
              <Input
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Location</label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Company Type</label>
              <Input
                value={formData.companyType || ''}
                onChange={(e) => setFormData({ ...formData, companyType: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Start Date</label>
              <Input
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">End Date</label>
              <Input
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Achievements (one per line)</label>
            <Textarea
              value={formData.achievements.join('\n')}
              onChange={(e) => setFormData({ ...formData, achievements: e.target.value.split('\n').filter(Boolean) })}
              rows={5}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Technologies (comma separated)</label>
            <Input
              value={formData.technologies.join(', ')}
              onChange={(e) => setFormData({ ...formData, technologies: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={() => onSave(formData)}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
