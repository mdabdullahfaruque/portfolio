import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PortfolioData } from '@/lib/types'

interface SkillsPageProps {
  data: PortfolioData
  t: any
}

export function SkillsPage({ data, t }: SkillsPageProps) {
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
                <Card className="p-6 hover:shadow-xl transition-all h-full">
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
    </div>
  )
}
