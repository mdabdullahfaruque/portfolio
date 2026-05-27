import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight, Plus, Trash, Pencil, Globe } from '@phosphor-icons/react'
import { PortfolioData } from '@/lib/types'

interface ProjectsPageProps {
  data: PortfolioData
  t: any
  isAdmin: boolean
}

export function ProjectsPage({ data, t, isAdmin }: ProjectsPageProps) {
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
              <Button className="gap-2">
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
                      <Button size="sm" variant="outline">
                        <Pencil size={16} />
                      </Button>
                      <Button size="sm" variant="destructive">
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
    </div>
  )
}
