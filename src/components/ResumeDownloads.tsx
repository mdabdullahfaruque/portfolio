import { useState } from 'react'
import { pdf } from '@react-pdf/renderer'
import { toast } from 'sonner'
import { CircleNotch, DownloadSimple } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { loadResumeMarkdown } from '@/lib/resumeMarkdown'
import { OnePageResumePDF } from '@/components/resume/OnePageResumePDF'
import { DetailedResumePDF } from '@/components/resume/DetailedResumePDF'

// Both resumes come from public/resume/*.md, the same files (and layouts) as the
// ResumeBuilder repo, so the downloads stay exactly 1 and 2 pages.
const RESUMES = {
  onePage: {
    file: 'resume-data.md',
    fileName: 'MdAbdullahFaruque_Resume.pdf',
    Document: OnePageResumePDF,
  },
  detailed: {
    file: 'resume-data-detailed.md',
    fileName: 'MdAbdullahFaruque_Resume_Detailed.pdf',
    Document: DetailedResumePDF,
  },
} as const

type ResumeKind = keyof typeof RESUMES

interface ResumeDownloadsProps {
  t: any
}

/** The two resume download buttons; renders a fragment so it fits any button row. */
export function ResumeDownloads({ t }: ResumeDownloadsProps) {
  const [busy, setBusy] = useState<ResumeKind | null>(null)

  const download = async (kind: ResumeKind) => {
    const { file, fileName, Document } = RESUMES[kind]
    setBusy(kind)
    try {
      const data = await loadResumeMarkdown(file)
      const blob = await pdf(<Document data={data} />).toBlob()
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
