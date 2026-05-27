import { useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { 
  PencilSimple, 
  Plus, 
  X, 
  Code, 
  CloudArrowUp, 
  Database, 
  Flask, 
  Wrench, 
  Files,
  Robot
} from '@phosphor-icons/react'
import { PortfolioData, Skill } from '@/lib/types'
import { toast } from 'sonner'

interface SkillsPageProps {
  data: PortfolioData
  t: any
  isAdmin: boolean
  onUpdate: (data: PortfolioData) => void
}

interface SkillItemProps {
  skill: Skill
  index: number
}

const categoryIcons: Record<string, any> = {
  backend: Code,
  frontend: Code,
  cloud: CloudArrowUp,
  databases: Database,
  testing: Flask,
  tools: Wrench,
  cms: Files,
  ai: Robot
}

function getProficiencyLevel(proficiency: number): { label: string; variant: 'default' | 'secondary' | 'outline' } {
  if (proficiency >= 90) return { label: 'Expert', variant: 'default' }
  if (proficiency >= 80) return { label: 'Advanced', variant: 'default' }
  if (proficiency >= 70) return { label: 'Proficient', variant: 'secondary' }
  if (proficiency >= 60) return { label: 'Competent', variant: 'secondary' }
  return { label: 'Familiar', variant: 'outline' }
}

function SkillItem({ skill, index }: SkillItemProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  const profLevel = getProficiencyLevel(skill.proficiency || 50)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className="flex items-center justify-between gap-2 px-4 py-3 rounded-lg bg-card/50 hover:bg-card border border-border/50 hover:border-border transition-all duration-200"
    >
      <span className="text-base font-semibold text-foreground flex-shrink-0">{skill.name}</span>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Badge variant={profLevel.variant} className="text-[9px] font-medium uppercase tracking-wide opacity-70">
          {profLevel.label}
        </Badge>
        {skill.yearsOfExperience && skill.yearsOfExperience > 0 && (
          <Badge variant="outline" className="text-[10px] font-mono opacity-60">
            {skill.yearsOfExperience}yr{skill.yearsOfExperience > 1 ? 's' : ''}
          </Badge>
        )}
      </div>
    </motion.div>
  )
}

export function SkillsPage({ data, t, isAdmin, onUpdate }: SkillsPageProps) {
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [skills, setSkills] = useState<Skill[]>([])

  const handleEdit = (category: string) => {
    setEditingCategory(category)
    setSkills([...(data.skills[category as keyof typeof data.skills] || [])])
    setIsDialogOpen(true)
  }

  const handleAddSkill = () => {
    setSkills([...skills, { name: '', proficiency: 50, yearsOfExperience: 0 }])
  }

  const handleRemoveSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index))
  }

  const handleSkillChange = (index: number, field: keyof Skill, value: string | number) => {
    const updated = [...skills]
    if (field === 'name') {
      updated[index][field] = value as string
    } else if (field === 'proficiency') {
      const numValue = typeof value === 'string' ? parseInt(value) : value
      updated[index][field] = Math.min(100, Math.max(0, numValue))
    } else if (field === 'yearsOfExperience') {
      const numValue = typeof value === 'string' ? parseInt(value) : value
      updated[index][field] = Math.max(0, numValue)
    }
    setSkills(updated)
  }

  const handleSave = () => {
    if (!editingCategory) return

    const updated = { ...data }
    updated.skills = {
      ...updated.skills,
      [editingCategory]: skills.filter(s => s.name.trim() !== '')
    }
    
    onUpdate(updated)
    setIsDialogOpen(false)
    setEditingCategory(null)
    toast.success('Skills updated successfully')
  }

  const getTotalSkills = () => {
    return Object.values(data.skills).reduce((acc, skills) => acc + skills.length, 0)
  }

  const getAverageYears = () => {
    const allSkills = Object.values(data.skills).flat()
    const totalYears = allSkills.reduce((acc, skill) => acc + (skill.yearsOfExperience || 0), 0)
    return (totalYears / allSkills.length).toFixed(1)
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-10">
            <h1 className="text-4xl font-bold mb-3 text-foreground">{t.nav.skills}</h1>
            <p className="text-base text-muted-foreground mb-6 max-w-2xl">
              Technical expertise across multiple domains with hands-on experience.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="p-5 border">
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground mb-1">{getTotalSkills()}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">Technologies</div>
                </div>
              </Card>
              <Card className="p-5 border">
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground mb-1">{getAverageYears()}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">Avg. Years Exp.</div>
                </div>
              </Card>
              <Card className="p-5 border">
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground mb-1">{Object.keys(data.skills).length}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">Categories</div>
                </div>
              </Card>
            </div>
          </div>

          <div className="grid gap-6">
            {Object.entries(data.skills).map(([category, categorySkills], catIndex) => {
              const Icon = categoryIcons[category]
              
              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: catIndex * 0.1 }}
                >
                  <Card className="p-6 hover:shadow-md transition-all duration-300 relative group">
                    {isAdmin && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity gap-2"
                        onClick={() => handleEdit(category)}
                      >
                        <PencilSimple size={16} weight="bold" />
                        Edit
                      </Button>
                    )}
                    
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon size={20} weight="duotone" className="text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground">
                        {t.labels.skillCategories[category as keyof typeof t.labels.skillCategories]}
                      </h3>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {categorySkills.map((skill, index) => (
                        <SkillItem key={skill.name} skill={skill} index={index} />
                      ))}
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Edit {editingCategory && t.labels.skillCategories[editingCategory as keyof typeof t.labels.skillCategories]}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-4">
              {skills.map((skill, index) => (
                <div key={index} className="grid grid-cols-12 gap-3 items-end p-4 border rounded-lg bg-muted/30">
                  <div className="col-span-5">
                    <Label htmlFor={`skill-name-${index}`}>Skill Name</Label>
                    <Input
                      id={`skill-name-${index}`}
                      value={skill.name}
                      onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
                      placeholder="e.g., React"
                    />
                  </div>
                  <div className="col-span-3">
                    <Label htmlFor={`skill-prof-${index}`}>Proficiency %</Label>
                    <Input
                      id={`skill-prof-${index}`}
                      type="number"
                      min="0"
                      max="100"
                      value={skill.proficiency}
                      onChange={(e) => handleSkillChange(index, 'proficiency', e.target.value)}
                    />
                  </div>
                  <div className="col-span-3">
                    <Label htmlFor={`skill-years-${index}`}>Years</Label>
                    <Input
                      id={`skill-years-${index}`}
                      type="number"
                      min="0"
                      value={skill.yearsOfExperience || 0}
                      onChange={(e) => handleSkillChange(index, 'yearsOfExperience', e.target.value)}
                    />
                  </div>
                  <div className="col-span-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleRemoveSkill(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <X size={18} weight="bold" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={handleAddSkill}
            >
              <Plus size={16} weight="bold" />
              Add Skill
            </Button>

            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
