import { useState } from 'react'
import { pdf } from '@react-pdf/renderer'
import { toast } from 'sonner'
import { CircleNotch, DownloadSimple } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { loadResumeMarkdown, type ResumeLanguage } from '@/lib/resumeMarkdown'
import { OnePageResumePDF } from '@/components/resume/OnePageResumePDF'
import { DetailedResumePDF } from '@/components/resume/DetailedResumePDF'

// Both resumes come from public/resume/*.md (English) and *.de.md (German). Each
// version is tuned to come out at exactly 1 and 2 pages.
const RESUMES = {
  onePage: {
    file: 'resume-data',
    fileName: { en: 'MdAbdullahFaruque_Resume.pdf', de: 'MdAbdullahFaruque_Lebenslauf.pdf' },
    Document: OnePageResumePDF,
  },
  detailed: {
    file: 'resume-data-detailed',
    fileName: { en: 'MdAbdullahFaruque_Resume_Detailed.pdf', de: 'MdAbdullahFaruque_Lebenslauf_Ausfuehrlich.pdf' },
    Document: DetailedResumePDF,
  },
} as const

type ResumeKind = keyof typeof RESUMES

interface ResumeDownloadsProps {
  t: any
  language?: ResumeLanguage
}

/** The two resume download buttons; renders a fragment so it fits any button row. */
export function ResumeDownloads({ t, language = 'en' }: ResumeDownloadsProps) {
  const [busy, setBusy] = useState<ResumeKind | null>(null)

  const download = async (kind: ResumeKind) => {
    const { file, Document } = RESUMES[kind]
    const fileName = RESUMES[kind].fileName[language]
    setBusy(kind)
    try {
      const data = await loadResumeMarkdown(file, language)
      const blob = await pdf(<Document data={data} language={language} />).toBlob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      toast.success(t.labels.resumeDownloaded)
    } catch (error) {
      toast.error(t.labels.resumeDownloadFailed)
      console.error('Resume download error:', error)
    } finally {
      setBusy(null)
    }
  }

  const labels: Record<ResumeKind, string> = {
    onePage: t.labels.downloadResumeOnePage,
    detailed: t.labels.downloadResumeDetailed,
  }

  return (
    <>
      {(Object.keys(RESUMES) as ResumeKind[]).map((kind) => (
        <Button
          key={kind}
          size="lg"
          variant="outline"
          onClick={() => download(kind)}
          disabled={busy !== null}
          data-resume={kind}
          className="gap-2 font-semibold"
        >
          {busy === kind ? (
            <CircleNotch size={18} weight="bold" className="animate-spin" />
          ) : (
            <DownloadSimple size={18} weight="bold" />
          )}
          {busy === kind ? t.labels.preparingPdf : labels[kind]}
        </Button>
      ))}
    </>
  )
}
