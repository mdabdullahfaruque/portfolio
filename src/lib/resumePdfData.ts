import { PortfolioData, Translations } from './types'
import type { ResumeData, ResumeSectionLabels } from '@/components/ResumePDF'

type Language = 'en' | 'de'

type TranslationStrings = Translations['en']

// PDF section headings are not part of the on-page UI, so they live here.
const sectionLabels: Record<Language, ResumeSectionLabels> = {
  en: {
    summary: 'SUMMARY',
    experience: 'EXPERIENCE',
    education: 'EDUCATION',
    skills: 'SKILLS',
    certifications: 'CERTIFICATIONS',
  },
  de: {
    summary: 'ZUSAMMENFASSUNG',
    experience: 'BERUFSERFAHRUNG',
    education: 'AUSBILDUNG',
    skills: 'KENNTNISSE',
    certifications: 'ZERTIFIZIERUNGEN',
  },
}

export function getResumeSectionLabels(language: Language): ResumeSectionLabels {
  return sectionLabels[language] ?? sectionLabels.en
}

/** Turn a LinkedIn URL into a clean display string (linkedin.com/in/...). */
function linkedinDisplay(url?: string): string | undefined {
  if (!url) return undefined
  return url.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '')
}

/** Build the period string, translating "Present" for the active language. */
function formatPeriod(startDate: string, endDate: string, present: string): string {
  const normalizedEnd = endDate?.trim().toLowerCase() === 'present' ? present : endDate
  return [startDate, normalizedEnd].filter(Boolean).join(' - ')
}

/**
 * Map the live portfolio data to the resume data shape consumed by ResumePDF.
 * Every admin edit to the portfolio is reflected here automatically because
 * the PDF is generated directly from this same data source.
 */
export function buildResumeData(
  data: PortfolioData,
  language: Language,
  t: TranslationStrings,
): ResumeData {
  const present = t.labels.present
  const categoryLabels = t.labels.skillCategories

  const skills: Record<string, string[]> = {}
  for (const key of Object.keys(data.skills) as Array<keyof PortfolioData['skills']>) {
    const list = data.skills[key]
    if (list && list.length > 0) {
      const label = categoryLabels[key] ?? key
      skills[label] = list.map((s) => s.name)
    }
  }

  return {
    name: data.name,
    title: data.title,
    photo: data.photoUrl,
    contact: {
      email: data.contact.email,
      linkedin: data.contact.linkedin,
      linkedin_display: linkedinDisplay(data.contact.linkedin),
      location: data.contact.location,
    },
    summary: {
      text: data.summary,
    },
    experience: data.experiences.map((exp) => ({
      title: exp.title,
      company: exp.company,
      location: exp.location,
      period: formatPeriod(exp.startDate, exp.endDate, present),
      description: exp.description,
      achievements: exp.achievements,
    })),
    education: data.education.map((edu) => ({
      degree: edu.degree,
      school: edu.institution,
      location: edu.location,
      period: formatPeriod(edu.startDate, edu.endDate, present),
    })),
    skills,
    certifications: data.certifications.map((cert) => ({
      title: cert.name,
      url: cert.credentialUrl,
      meta: `${cert.issuer} · ${cert.date}`,
    })),
  }
}
