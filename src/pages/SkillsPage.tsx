import { useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Pencil, Plus, X } from '@phosphor-icons/react'
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

function SkillBar({ skill, index }: SkillBarProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="space-y-2"
    >
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-foreground">{skill.name}</span>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {skill.yearsOfExperience && (
            <span className="font-mono bg-muted px-2 py-1 rounded">
              {skill.yearsOfExperience}yr{skill.yearsOfExperience > 1 ? 's' : ''}
            </span>
          )}
          <span className="font-mono bg-primary/10 text-primary px-2 py-1 rounded font-semibold">
            {skill.proficiency}%
          </span>
        </div>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary via-secondary to-accent rounded-full"
          initial={{ width: 0 }}
          animate={isInView ? { width: `${skill.proficiency}%` } : { width: 0 }}
          transition={{ duration: 1, delay: index * 0.05 + 0.2, ease: 'easeOut' }}
        />
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

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-3 text-foreground">{t.nav.skills}</h1>
            <p className="text-lg text-muted-foreground">
              Technical expertise across {Object.keys(data.skills).length} specialized categories
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {Object.entries(data.skills).map(([category, categorySkills], catIndex) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: catIndex * 0.1 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow relative group">
                  {isAdmin && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleEdit(category)}
                    >
                      <Pencil size={16} />
                    </Button>
                  )}
                  
                  <h3 className="text-lg font-semibold mb-6 text-foreground border-b pb-3">
                    {t.labels.skillCategories[category as keyof typeof t.labels.skillCategories]}
                  </h3>
                  
                  <div className="space-y-4">
                    {categorySkills.map((skill, index) => (
                      <SkillBar key={skill.name} skill={skill} index={index} />
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
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
                <div key={index} className="grid grid-cols-12 gap-3 items-end p-4 border rounded-lg">
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
                    >
                      <X size={16} />
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
