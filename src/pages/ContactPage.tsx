import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { EnvelopeSimple, Phone, MapPin, LinkedinLogo, GithubLogo } from '@phosphor-icons/react'
import { PortfolioData } from '@/lib/types'

interface ContactPageProps {
  data: PortfolioData
  t: any
}

export function ContactPage({ data, t }: ContactPageProps) {
  return (
    <div className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold mb-6">{t.labels.contactPageTitle}</h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            {t.labels.contactPageDescription}
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {data.contact.email && (
              <Card className="p-8 hover:shadow-xl transition-all">
                <EnvelopeSimple size={40} weight="duotone" className="text-accent mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-2">{t.labels.email}</p>
                <a
                  href={`mailto:${data.contact.email}`}
                  className="text-foreground hover:text-accent transition-colors font-medium break-all"
                >
                  {data.contact.email}
                </a>
              </Card>
            )}

            {data.contact.phone && (
              <Card className="p-8 hover:shadow-xl transition-all">
                <Phone size={40} weight="duotone" className="text-accent mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-2">{t.labels.phone}</p>
                <a
                  href={`tel:${data.contact.phone}`}
                  className="text-foreground hover:text-accent transition-colors font-medium"
                >
                  {data.contact.phone}
                </a>
              </Card>
            )}

            {data.contact.location && (
              <Card className="p-8 hover:shadow-xl transition-all">
                <MapPin size={40} weight="duotone" className="text-accent mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-2">{t.labels.location}</p>
                <p className="text-foreground font-medium">{data.contact.location}</p>
              </Card>
            )}
          </div>

          <div className="flex justify-center gap-4">
            {data.contact.linkedin && (
              <a
                href={data.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 rounded-full bg-muted hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-all hover:scale-110"
              >
                <LinkedinLogo size={28} weight="fill" />
              </a>
            )}
            {data.contact.github && (
              <a
                href={data.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 rounded-full bg-muted hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-all hover:scale-110"
              >
                <GithubLogo size={28} weight="fill" />
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
