import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Pencil, Plus, X } from '@phosphor-icons/react'
import { PortfolioData } from '@/lib/types'
import { toast } from 'sonner'

interface SkillsPageProps {
  data: PortfolioData
  t: any
  isAdmin: boolean
  onUpdate: (data: PortfolioData) => void
}

export function SkillsPage({ data, t, isAdmin, onUpdate }: SkillsPageProps) {
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [skills, setSkills] = useState<string[]>([])

  const handleEdit = (category: string) => {
    setEditingCategory(category)
    setSkills([...(data.skills[category as keyof typeof data.skills] || [])])
    setIsDialogOpen(true)
  }

  const handleAddSkill = () => {
    setSkills([...skills, ''])
  }

  const handleRemoveSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index))
  }

  const handleSkillChange = (index: number, value: string) => {
    const updated = [...skills]
    updated[index] = value
    setSkills(updated)
  }

  const handleSave = () => {
    if (!editingCategory) return

    const updated = { ...data }
    updated.skills = {
      ...updated.skills,
      [editingCategory]: skills.filter(s => s.trim() !== '')
    }
    
    onUpdate(updated)
    setIsDialogOpen(false)
    setEditingCategory(null)
    toast.success('Skills updated successfully')
  }
  return (
    <div className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-12">
            <h1 className="text-5xl font-bold mb-4">{t.nav.skills}</h1>
            <p className="text-xl text-muted-foreground">
              Technical expertise across {Object.keys(data.skills).length} categories
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(data.skills).map(([category, skills], index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-xl transition-all h-full relative group">
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
                  
                  <h3 className="text-lg font-semibold mb-4">
                    {t.labels.skillCategories[category as keyof typeof t.labels.skillCategories]}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <Badge
                        key={skill}
                        className="bg-accent/10 text-accent hover:bg-accent/20 hover:scale-105 transition-all cursor-default"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Edit {editingCategory && t.labels.skillCategories[editingCategory as keyof typeof t.labels.skillCategories]}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-3">
              {skills.map((skill, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={skill}
                    onChange={(e) => handleSkillChange(index, e.target.value)}
                    placeholder="Skill name"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveSkill(index)}
                  >
                    <X size={16} />
                  </Button>
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

            <div className="flex gap-3 justify-end pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
