import { pdf } from '@react-pdf/renderer'
import type { PortfolioData } from './types'
import { localizeData } from './contentDe'
import { buildResumeData, type ResumeContentLimits, type ResumeKind, type ResumeLanguage } from './resumeData'
import { OnePageResumePDF } from '@/components/resume/OnePageResumePDF'
import { DetailedResumePDF } from '@/components/resume/DetailedResumePDF'

interface FitStep extends ResumeContentLimits {
  scale: number
}

const ALL = Number.POSITIVE_INFINITY

// Tried in order until the PDF has the target page count: first the full content
// at full size, then slightly smaller type, then fewer bullets on older roles.
// Recent roles keep the most detail throughout.
const FIT_STEPS: Record<ResumeKind, FitStep[]> = {
  onePage: [
    { scale: 1, recentBullets: 4, olderBullets: 3, projectBullets: 0, skillsPerCategory: 8 },
    { scale: 0.96, recentBullets: 4, olderBullets: 3, projectBullets: 0, skillsPerCategory: 8 },
    { scale: 0.96, recentBullets: 4, olderBullets: 2, projectBullets: 0, skillsPerCategory: 7 },
    { scale: 0.92, recentBullets: 4, olderBullets: 2, projectBullets: 0, skillsPerCategory: 7 },
    { scale: 0.92, recentBullets: 3, olderBullets: 2, projectBullets: 0, skillsPerCategory: 6 },
    { scale: 0.9, recentBullets: 3, olderBullets: 1, projectBullets: 0, skillsPerCategory: 6 },
    { scale: 0.88, recentBullets: 3, olderBullets: 1, projectBullets: 0, skillsPerCategory: 5 },
    { scale: 0.86, recentBullets: 2, olderBullets: 1, projectBullets: 0, skillsPerCategory: 5 },
  ],
  detailed: [
    { scale: 1, recentBullets: ALL, olderBullets: ALL, projectBullets: 4, skillsPerCategory: ALL },
    { scale: 0.97, recentBullets: ALL, olderBullets: ALL, projectBullets: 4, skillsPerCategory: ALL },
    { scale: 0.97, recentBullets: ALL, olderBullets: 3, projectBullets: 3, skillsPerCategory: ALL },
    { scale: 0.94, recentBullets: ALL, olderBullets: 3, projectBullets: 3, skillsPerCategory: ALL },
    { scale: 0.94, recentBullets: 5, olderBullets: 2, projectBullets: 2, skillsPerCategory: 10 },
    { scale: 0.91, recentBullets: 5, olderBullets: 2, projectBullets: 2, skillsPerCategory: 10 },
    { scale: 0.88, recentBullets: 4, olderBullets: 2, projectBullets: 2, skillsPerCategory: 8 },
    { scale: 0.86, recentBullets: 4, olderBullets: 1, projectBullets: 1, skillsPerCategory: 8 },
  ],
}

export const RESUME_PAGES: Record<ResumeKind, number> = { onePage: 1, detailed: 2 }

/** Number of pages in a PDF produced by react-pdf (one "/Type /Page" object per page). */
async function countPages(blob: Blob): Promise<number> {
  const text = new TextDecoder('latin1').decode(await blob.arrayBuffer())
  return (text.match(/\/Type\s*\/Page[^s]/g) || []).length
}

async function render(kind: ResumeKind, data: PortfolioData, language: ResumeLanguage, t: any, step: FitStep, withPhoto: boolean) {
  const resume = buildResumeData(data, kind, t, step)
  if (!withPhoto) resume.photo = ''
  const Layout = kind === 'onePage' ? OnePageResumePDF : DetailedResumePDF
  return pdf(<Layout data={resume} language={language} scale={step.scale} />).toBlob()
}

// After a fitting step is found, content is added back one unit at a time in this
// order while the page count still holds, so the pages end up full rather than cut short.
const REFILL_ORDER: Record<ResumeKind, Array<keyof FitStep>> = {
  onePage: ['recentBullets', 'olderBullets', 'skillsPerCategory', 'scale'],
  detailed: ['olderBullets', 'projectBullets', 'recentBullets', 'skillsPerCategory', 'scale'],
}

/** Largest useful value per setting, so refilling stops once all content is in. */
function contentCaps(data: PortfolioData): FitStep {
  const most = (lists: unknown[][]) => Math.max(0, ...lists.map((l) => l.length))
  return {
    scale: 1,
    recentBullets: most(data.experiences.slice(0, 2).map((e) => e.achievements)),
    olderBullets: most(data.experiences.slice(2).map((e) => e.achievements)),
    projectBullets: most(data.projects.map((p) => p.features || [])),
    skillsPerCategory: most(Object.values(data.skills)),
  }
}

/**
 * Generate the resume from the current portfolio data, fitted to exactly one page
 * (onePage) or at most two pages (detailed).
 */
export async function generateResumePdf(
  kind: ResumeKind,
  data: PortfolioData,
  language: ResumeLanguage,
  t: any,
): Promise<{ blob: Blob; photoFailed: boolean }> {
  // German downloads use the German content, whatever the page shows.
  data = localizeData(data, language)
  let withPhoto = true
  let photoFailed = false

  const attempt = async (step: FitStep) => {
    let blob: Blob
    try {
      blob = await render(kind, data, language, t, step, withPhoto)
    } catch (error) {
      // An uploaded photo react-pdf cannot read (e.g. WebP) must not block the download.
      if (!withPhoto) throw error
      console.error('Resume photo could not be embedded:', error)
      withPhoto = false
      photoFailed = true
      blob = await render(kind, data, language, t, step, withPhoto)
    }
    return { blob, fits: (await countPages(blob)) <= RESUME_PAGES[kind] }
  }

  // 1. First step of the ladder that fits.
  const steps = FIT_STEPS[kind]
  let best = steps[steps.length - 1]
  let bestBlob: Blob | null = null
  for (const step of steps) {
    const result = await attempt(step)
    bestBlob = result.blob
    best = step
    if (result.fits) break
  }

  // 2. Add content back while it still fits.
  if (best !== steps[0]) {
    const caps = contentCaps(data)
    let improved = true
    while (improved) {
      improved = false
      for (const key of REFILL_ORDER[kind]) {
        const current = best[key]
        const next = key === 'scale' ? Math.min(1, Math.round((current + 0.02) * 100) / 100) : current + 1
        if (current >= caps[key] || next === current) continue
        const candidate = { ...best, [key]: next }
        const result = await attempt(candidate)
        if (result.fits) {
          best = candidate
          bestBlob = result.blob
          improved = true
        }
      }
    }
  }

  return { blob: bestBlob as Blob, photoFailed }
}
