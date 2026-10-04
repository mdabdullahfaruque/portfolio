import type { PortfolioData } from './types'

// Both resume PDFs are built from the live portfolio data at download time, so
// every saved edit (text, skills, projects, photo) is in the next download.

export type ResumeLanguage = 'en' | 'de'
export type ResumeKind = 'onePage' | 'detailed'

export interface ResumeJob {
  title: string
  company: string
  location: string
  period: string
  description: string
  achievements: string[]
  technologies: string
}

export interface ResumeEducation {
  degree: string
  school: string
  location: string
  period: string
  details: string[]
}

export interface ResumeProject {
  name: string
  organization: string
  period: string
  description: string
  link: string
  linkDisplay: string
  highlights: string[]
  technologies: string
}

export interface ResumeData {
  name: string
  title: string
  photo: string
  contact: Record<string, string>
  summary: { text: string; highlights: string[] }
  experience: ResumeJob[]
  education: ResumeEducation[]
  skills: Record<string, string[]>
  keyAchievements: { title: string; items: string[] }[]
  languages: { language: string; proficiency: string }[]
  certifications: { title: string; url: string; meta: string }[]
  projects: ResumeProject[]
}

/** How much content to include. Fitting tightens these step by step. */
export interface ResumeContentLimits {
  /** Bullets for the two most recent roles. */
  recentBullets: number
  /** Bullets for older roles. */
  olderBullets: number
  /** Bullets per project (detailed resume only). */
  projectBullets: number
  /** Skills per category, highest proficiency first. */
  skillsPerCategory: number
}

export const DEFAULT_RESUME_SETTINGS = { photoOnePage: true, photoDetailed: false }

/** "https://www.linkedin.com/in/x/" -> "linkedin.com/in/x" */
const displayUrl = (url?: string) =>
  (url || '').replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '')

export function buildResumeData(
  data: PortfolioData,
  kind: ResumeKind,
  t: any,
  limits: ResumeContentLimits,
): ResumeData {
  const settings = { ...DEFAULT_RESUME_SETTINGS, ...data.resume }
  const showPhoto = kind === 'onePage' ? settings.photoOnePage : settings.photoDetailed
  const present: string = t.labels.present
  const period = (start?: string, end?: string) => {
    const finish = end?.trim().toLowerCase() === 'present' ? present : end
    return [start, finish].filter(Boolean).join(' - ')
  }

  // Same skill in two categories (e.g. GitHub Copilot under Tools and AI) is listed once.
  const seen = new Set<string>()
  const skills: Record<string, string[]> = {}
  for (const [key, list] of Object.entries(data.skills)) {
    const top = [...(list || [])]
      .filter((s) => !seen.has(s.name.toLowerCase()))
      .sort((a, b) => (b.proficiency || 0) - (a.proficiency || 0))
      .slice(0, limits.skillsPerCategory)
    const names = (list || []).filter((s) => top.includes(s)).map((s) => s.name)
    names.forEach((n) => seen.add(n.toLowerCase()))
    if (names.length > 0) skills[t.labels.skillCategories?.[key] ?? key] = names
  }

  return {
    name: data.name,
    title: data.title,
    photo: showPhoto ? data.photoUrl || '' : '',
    contact: {
      email: data.contact.email,
      phone: data.contact.phone,
      location: data.contact.location,
      linkedin: data.contact.linkedin,
      linkedin_display: displayUrl(data.contact.linkedin),
      github: data.contact.github,
      github_display: displayUrl(data.contact.github),
    },
    summary: { text: data.summary, highlights: [] },
    keyAchievements: [{ title: '', items: data.highlights || [] }],
    experience: data.experiences.map((exp, index) => ({
      title: exp.title,
      company: exp.company,
      location: exp.location,
      period: period(exp.startDate, exp.endDate),
      description: exp.description,
      achievements: exp.achievements.slice(0, index < 2 ? limits.recentBullets : limits.olderBullets),
      technologies: (exp.technologies || []).join(', '),
    })),
    education: data.education.map((edu) => ({
      degree: edu.degree,
      school: edu.institution,
      location: edu.location,
      period: period(edu.startDate, edu.endDate),
      details: [],
    })),
    skills,
    certifications: data.certifications.map((cert) => ({
      title: cert.name,
      url: cert.credentialUrl || '',
      meta: [cert.issuer, cert.date].filter(Boolean).join(' · '),
    })),
    languages: data.languages.map((lang) => ({ language: lang.name, proficiency: lang.proficiency })),
    projects: data.projects.map((project) => ({
      name: project.name,
      organization: project.organization || '',
      period: project.period || '',
      description: project.description,
      link: project.url,
      linkDisplay: displayUrl(project.url),
      highlights: (project.features || []).slice(0, limits.projectBullets),
      technologies: (project.technologies || []).join(', '),
    })),
  }
}

const SCALED_KEYS = new Set([
  'fontSize', 'gap', 'padding', 'paddingTop', 'paddingBottom', 'paddingHorizontal', 'paddingVertical',
  'margin', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight', 'marginHorizontal', 'marginVertical',
])

/** Scale font sizes and spacing of a react-pdf style sheet (line heights are ratios and stay). */
export function scaleStyles<T extends Record<string, Record<string, unknown>>>(styles: T, scale: number): T {
  if (scale === 1) return styles
  const out: Record<string, Record<string, unknown>> = {}
  for (const [name, style] of Object.entries(styles)) {
    out[name] = Object.fromEntries(
      Object.entries(style).map(([key, value]) =>
        [key, typeof value === 'number' && SCALED_KEYS.has(key) ? Math.round(value * scale * 100) / 100 : value],
      ),
    )
  }
  return out as T
}
