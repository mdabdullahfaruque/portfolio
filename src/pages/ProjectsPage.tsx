import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ArrowRight, Plus, Trash, Pencil, Globe, RocketLaunch, MapPin, CheckCircle, TrendUp } from '@phosphor-icons/react'
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
  const [filter, setFilter] = useState<string>('all')

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

  const markets = ['all', ...Array.from(new Set(data.projects.map(p => p.market).filter(Boolean)))] as string[]
  const filteredProjects = filter === 'all' 
    ? data.projects 
    : data.projects.filter(p => p.market === filter)

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,oklch(0.38_0.10_250_/_0.08),transparent_50%),radial-gradient(circle_at_70%_60%,oklch(0.45_0.08_250_/_0.06),transparent_50%)]" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-12">
            <div className="flex items-start justify-between gap-6 mb-6">
              <div className="flex-1">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="inline-flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full mb-4"
                >
                  <RocketLaunch size={20} weight="fill" className="text-accent" />
                  <span className="text-sm font-semibold text-accent">Portfolio Showcase</span>
                </motion.div>
                
                <h1 className="text-4xl lg:text-6xl font-bold mb-4 text-foreground leading-tight">
                  My Projects & Products
                </h1>
                
                <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl leading-relaxed">
                  Building innovative SaaS solutions and enterprise applications for global markets. 
                  Each project represents a unique challenge and a step forward in digital transformation.
                </p>
                
                <div className="flex items-center gap-6 mt-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    <span className="text-sm text-muted-foreground">
                      <span className="font-bold text-foreground">{data.projects.length}</span> Total Projects
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendUp size={16} weight="bold" className="text-accent" />
                    <span className="text-sm text-muted-foreground">
                      <span className="font-bold text-foreground">{data.projects.filter(p => p.status?.toLowerCase() === 'live' || p.status?.toLowerCase() === 'active').length}</span> Live Products
                    </span>
                  </div>
                </div>
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
                  size="lg"
                  className="gap-2 shadow-lg no-print"
                >
                  <Plus size={20} weight="bold" />
                  Add Project
                </Button>
              )}
            </div>

            {markets.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {markets.map((market) => (
                  <Button
                    key={market}
                    variant={filter === market ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter(market)}
                    className="capitalize"
                  >
                    {market === 'all' ? 'All Markets' : market}
                  </Button>
                ))}
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="group relative h-full flex flex-col bg-card hover:shadow-2xl transition-all duration-500 border-2 border-border hover:border-accent/40 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-y-32 translate-x-32 group-hover:translate-y-0 group-hover:translate-x-0 transition-transform duration-700" />
                  
                  {isAdmin && (
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20 no-print">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setEditingProject(project)
                          setIsDialogOpen(true)
                        }}
                        className="shadow-lg h-8 w-8 p-0"
                      >
                        <Pencil size={14} weight="bold" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(project.id)}
                        className="shadow-lg h-8 w-8 p-0"
                      >
                        <Trash size={14} weight="bold" />
                      </Button>
                    </div>
                  )}

                  <div className="p-8 flex flex-col h-full relative z-10">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-accent transition-colors leading-tight">
                          {project.name}
                        </h3>
                        
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge 
                            variant={project.status === 'Active' ? 'default' : 'secondary'}
                            className="text-xs font-semibold"
                          >
                            {project.status === 'Active' && <CheckCircle size={12} weight="fill" className="mr-1" />}
                            {project.status}
                          </Badge>
                          
                          {project.market && (
                            <Badge variant="outline" className="text-xs font-medium gap-1">
                              <MapPin size={12} weight="fill" />
                              {project.market}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="text-foreground/80 leading-relaxed mb-6 flex-grow text-[15px]">
                      {project.description}
                    </p>

                    {project.features && project.features.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">Key Features:</h4>
                        <div className="space-y-2">
                          {project.features.slice(0, 3).map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <CheckCircle size={16} weight="fill" className="text-accent mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-muted-foreground">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {project.technologies && project.technologies.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Tech Stack</h4>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech) => (
                            <Badge 
                              key={tech} 
                              variant="secondary" 
                              className="text-xs font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {project.url && (
                      <Button 
                        asChild 
                        className="w-full mt-auto gap-2 h-11 shadow-md hover:shadow-lg transition-all group/btn" 
                        size="lg"
                      >
                        <a href={project.url} target="_blank" rel="noopener noreferrer">
                          <Globe size={18} weight="bold" />
                          <span>Visit Live Site</span>
                          <ArrowRight size={18} weight="bold" className="group-hover/btn:translate-x-1 transition-transform" />
                        </a>
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No projects found for this filter.</p>
            </div>
          )}
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

          <div>
            <label className="text-sm font-medium mb-2 block">Key Features (one per line)</label>
            <Textarea
              value={formData.features?.join('\n') || ''}
              onChange={(e) => setFormData({ ...formData, features: e.target.value.split('\n').filter(Boolean) })}
              rows={4}
              placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
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
