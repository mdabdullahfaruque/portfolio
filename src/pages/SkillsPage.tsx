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

interface SkillBarProps {
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

const categoryColors: Record<string, string> = {
  backend: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
  frontend: 'from-purple-500/20 to-purple-600/20 border-purple-500/30',
  cloud: 'from-cyan-500/20 to-cyan-600/20 border-cyan-500/30',
  databases: 'from-green-500/20 to-green-600/20 border-green-500/30',
  testing: 'from-orange-500/20 to-orange-600/20 border-orange-500/30',
  tools: 'from-pink-500/20 to-pink-600/20 border-pink-500/30',
  cms: 'from-indigo-500/20 to-indigo-600/20 border-indigo-500/30',
  ai: 'from-violet-500/20 to-violet-600/20 border-violet-500/30'
}

function SkillBar({ skill, index }: SkillBarProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })

  const getProficiencyLabel = (proficiency: number) => {
    if (proficiency >= 90) return { label: 'Expert', color: 'text-green-600 bg-green-50' }
    if (proficiency >= 75) return { label: 'Advanced', color: 'text-blue-600 bg-blue-50' }
    if (proficiency >= 60) return { label: 'Intermediate', color: 'text-yellow-600 bg-yellow-50' }
    return { label: 'Beginner', color: 'text-gray-600 bg-gray-50' }
  }

  const proficiencyInfo = getProficiencyLabel(skill.proficiency)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="space-y-2"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">{skill.name}</span>
          <Badge variant="secondary" className={`text-xs px-2 py-0.5 ${proficiencyInfo.color}`}>
            {proficiencyInfo.label}
          </Badge>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {skill.yearsOfExperience && skill.yearsOfExperience > 0 && (
            <span className="font-mono bg-muted px-2 py-1 rounded">
              {skill.yearsOfExperience}yr{skill.yearsOfExperience > 1 ? 's' : ''}
            </span>
          )}
          <span className="font-mono font-semibold">
            {skill.proficiency}%
          </span>
        </div>
      </div>
      <div className="h-2.5 bg-muted rounded-full overflow-hidden shadow-inner">
        <motion.div
          className="h-full bg-gradient-to-r from-primary via-secondary to-accent rounded-full relative overflow-hidden"
          initial={{ width: 0 }}
          animate={isInView ? { width: `${skill.proficiency}%` } : { width: 0 }}
          transition={{ duration: 1.2, delay: index * 0.05 + 0.2, ease: [0.4, 0, 0.2, 1] }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            initial={{ x: '-100%' }}
            animate={{ x: '200%' }}
            transition={{ duration: 2, delay: index * 0.05 + 0.4, ease: 'easeInOut' }}
          />
        </motion.div>
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

  const getExpertSkillsCount = () => {
    const allSkills = Object.values(data.skills).flat()
    return allSkills.filter(skill => skill.proficiency >= 90).length
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-12">
            <h1 className="text-5xl font-bold mb-4 text-foreground">{t.nav.skills}</h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-3xl">
              A comprehensive overview of my technical expertise, demonstrating proficiency across multiple domains with years of hands-on experience.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">{getTotalSkills()}</div>
                  <div className="text-sm text-muted-foreground uppercase tracking-wide">Total Technologies</div>
                </div>
              </Card>
              <Card className="p-6 bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
                <div className="text-center">
                  <div className="text-4xl font-bold text-secondary mb-2">{getExpertSkillsCount()}</div>
                  <div className="text-sm text-muted-foreground uppercase tracking-wide">Expert Level Skills</div>
                </div>
              </Card>
              <Card className="p-6 bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
                <div className="text-center">
                  <div className="text-4xl font-bold text-accent mb-2">{getAverageYears()}</div>
                  <div className="text-sm text-muted-foreground uppercase tracking-wide">Avg. Years Experience</div>
                </div>
              </Card>
            </div>
          </div>

          <div className="grid gap-8">
            {Object.entries(data.skills).map(([category, categorySkills], catIndex) => {
              const Icon = categoryIcons[category]
              const colorClass = categoryColors[category]
              
              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: catIndex * 0.1 }}
                >
                  <Card className={`p-8 hover:shadow-xl transition-all duration-300 relative group bg-gradient-to-br ${colorClass} border-2`}>
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
                    
                    <div className="flex items-center gap-4 mb-8 pb-4 border-b border-border/50">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Icon size={28} weight="duotone" className="text-primary" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-foreground">
                          {t.labels.skillCategories[category as keyof typeof t.labels.skillCategories]}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {categorySkills.length} skill{categorySkills.length !== 1 ? 's' : ''} in this category
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      {categorySkills.map((skill, index) => (
                        <SkillBar key={skill.name} skill={skill} index={index} />
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
