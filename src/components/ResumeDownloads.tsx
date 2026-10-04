import { useState } from 'react'
import { toast } from 'sonner'
import { CircleNotch, DownloadSimple, FileText, Files } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { PortfolioData } from '@/lib/types'
import type { ResumeKind, ResumeLanguage } from '@/lib/resumeData'
import { generateResumePdf } from '@/lib/resumePdf'

const FILE_NAMES: Record<ResumeKind, Record<ResumeLanguage, string>> = {
  onePage: { en: 'MdAbdullahFaruque_Resume.pdf', de: 'MdAbdullahFaruque_Lebenslauf.pdf' },
  detailed: { en: 'MdAbdullahFaruque_Resume_Detailed.pdf', de: 'MdAbdullahFaruque_Lebenslauf_Ausfuehrlich.pdf' },
}

interface ResumeDownloadsProps {
  data: PortfolioData
  t: any
  language?: ResumeLanguage
}

/**
 * "Download Resume" button with a choice of one page or two pages. The PDF is
 * generated from the current portfolio data when clicked, so it always matches
 * what the site shows.
 */
export function ResumeDownloads({ data, t, language = 'en' }: ResumeDownloadsProps) {
  const [busy, setBusy] = useState(false)

  const download = async (kind: ResumeKind) => {
    setBusy(true)
    try {
      const { blob, photoFailed } = await generateResumePdf(kind, data, language, t)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = FILE_NAMES[kind][language]
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      if (photoFailed) toast.warning(t.labels.resumePhotoSkipped)
      toast.success(t.labels.resumeDownloaded)
    } catch (error) {
      toast.error(t.labels.resumeDownloadFailed)
      console.error('Resume download error:', error)
    } finally {
      setBusy(false)
    }
  }

  const options: { kind: ResumeKind; icon: typeof FileText; label: string; hint: string }[] = [
    { kind: 'onePage', icon: FileText, label: t.labels.downloadResumeOnePage, hint: t.labels.downloadResumeOnePageHint },
    { kind: 'detailed', icon: Files, label: t.labels.downloadResumeDetailed, hint: t.labels.downloadResumeDetailedHint },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="lg" variant="outline" disabled={busy} className="gap-2 font-semibold" data-resume-menu>
          {busy ? <CircleNotch size={18} weight="bold" className="animate-spin" /> : <DownloadSimple size={18} weight="bold" />}
          {busy ? t.labels.preparingPdf : t.labels.downloadPDF}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72">
        {options.map(({ kind, icon: Icon, label, hint }) => (
          <DropdownMenuItem
            key={kind}
            onSelect={() => download(kind)}
            data-resume={kind}
            className="flex cursor-pointer items-start gap-3 py-2.5"
          >
            <Icon size={20} className="mt-0.5 shrink-0 text-primary" />
            <span className="flex flex-col">
              <span className="font-semibold">{label}</span>
              <span className="text-xs text-muted-foreground">{hint}</span>
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
