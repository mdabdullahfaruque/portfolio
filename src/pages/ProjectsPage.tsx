import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ArrowRight, Plus, Trash, Pencil, Globe } from '@phosphor-icons/react'
import { PortfolioData, Project } from '@/lib/types'
import { toast } from 'sonner'

interface ProjectsPageProps {
  data: PortfolioData
  t: any
  isAdmin: boolean
  onUpdate: (data: PortfolioData) => void
}

export function ProjectsPage({ data, t, isAdmin, onUpdate }: ProjectsPageProps) {
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleSave = (project: Project) => {
    const updated = { ...data }
    const index = updated.projects.findIndex(p => p.id === project.id)
    
    if (index >= 0) {
      updated.projects[index] = project
    } else {
      updated.projects.push({ ...project, id: Date.now().toString() })
    }
    
    onUpdate(updated)
    setIsDialogOpen(false)
    setEditingProject(null)
    toast.success('Project updated successfully')
  }

  const handleDelete = (id: string) => {
    const updated = { ...data }
    updated.projects = updated.projects.filter(p => p.id !== id)
    onUpdate(updated)
    toast.success('Project deleted')
  }
  return (
    <div className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-5xl font-bold mb-4">{t.nav.projects}</h1>
              <p className="text-xl text-muted-foreground">
                Showcasing {data.projects.length} impactful projects
              </p>
            </div>
            
            {isAdmin && (
              <Button
                onClick={() => {
                  setEditingProject({
                    id: '',
                    name: '',
                    url: '',
                    description: '',
                    status: 'Active',
                    technologies: [],
                    market: '',
                  })
                  setIsDialogOpen(true)
                }}
                className="gap-2"
              >
                <Plus size={20} weight="bold" />
                Add Project
              </Button>
            )}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-8 h-full flex flex-col hover:shadow-2xl transition-all duration-300 group relative">
                  {isAdmin && (
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingProject(project)
                          setIsDialogOpen(true)
                        }}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(project.id)}
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-4 mb-4">
                    <h3 className="text-2xl font-semibold group-hover:text-accent transition-colors">
                      {project.name}
                    </h3>
                    <Badge variant="outline" className="text-xs whitespace-nowrap">
                      {project.status}
                    </Badge>
                  </div>

                  {project.market && (
                    <p className="text-sm text-accent font-medium mb-3">
                      Market: {project.market}
                    </p>
                  )}

                  <p className="text-foreground/90 mb-4 flex-grow">{project.description}</p>

                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {project.url && (
                    <Button asChild className="w-full mt-auto gap-2">
                      <a href={project.url} target="_blank" rel="noopener noreferrer">
                        <Globe size={16} weight="bold" />
                        Visit Project
                        <ArrowRight size={16} weight="bold" />
                      </a>
                    </Button>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {isAdmin && editingProject && (
        <ProjectEditDialog
          project={editingProject}
          open={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false)
            setEditingProject(null)
          }}
          onSave={handleSave}
        />
      )}
    </div>
  )
}

function ProjectEditDialog({
  project,
  open,
  onClose,
  onSave,
}: {
  project: Project
  open: boolean
  onClose: () => void
  onSave: (project: Project) => void
}) {
  const [formData, setFormData] = useState(project)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{formData.id ? 'Edit Project' : 'Add Project'}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Project Name</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">URL</label>
            <Input
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://example.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Input
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                placeholder="Active, In Progress, etc."
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Market</label>
              <Input
                value={formData.market || ''}
                onChange={(e) => setFormData({ ...formData, market: e.target.value })}
                placeholder="Bangladesh, Malaysia, etc."
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Technologies (comma separated)</label>
            <Input
              value={formData.technologies?.join(', ') || ''}
              onChange={(e) => setFormData({ ...formData, technologies: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
              placeholder=".NET, React, AWS, etc."
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
