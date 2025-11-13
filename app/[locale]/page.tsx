"use client"

import {Scissors, Combine, FileImage, GripVertical, FileDown, Package, SendToBack, FileText, ImageIcon, Hash} from "lucide-react"
import { useTranslations } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { PDFToolCard } from "@/components/pdf-tool-card"
import { LanguageSwitcher } from "@/components/language-switcher"
import { BookmarkButton } from "@/components/bookmark-button"

export default function Home() {
  const t = useTranslations()
  const router = useRouter()
  const pathname = usePathname()

  const handleToolSelect = (toolPath: string) => {
    router.push(`${pathname}/${toolPath}`)
  }

  const tools = [
    {
      id: "split",
      path: "split",
      icon: Scissors,
      title: t('tools.split.title'),
      description: t('tools.split.description'),
      isBeta: false,
    },
    {
      id: "merge",
      path: "merge",
      icon: Combine,
      title: t('tools.merge.title'),
      description: t('tools.merge.description'),
      isBeta: false,
    },
    {
      id: "organize-pdf",
      path: "organize-pdf",
      icon: SendToBack,
      title: t('tools.organizePdf.title'),
      description: t('tools.organizePdf.description'),
      isBeta: false,
    },
    {
      id: "compress-pdf",
      path: "compress-pdf",
      icon: Package,
      title: t('tools.compressPdf.title'),
      description: t('tools.compressPdf.description'),
      isBeta: false,
    },
    {
      id: "image-to-pdf",
      path: "image-to-pdf",
      icon: FileImage,
      title: t('tools.imageToPdf.title'),
      description: t('tools.imageToPdf.description'),
      isBeta: false,
    },
    {
      id: "pdf-to-images",
      path: "pdf-to-images",
      icon: ImageIcon,
      title: t('tools.pdfToImages.title'),
      description: t('tools.pdfToImages.description'),
      isBeta: false,
    },
    {
      id: "page-numbering",
      path: "page-numbering",
      icon: Hash,
      title: t('tools.pageNumbering.title'),
      description: t('tools.pageNumbering.description'),
      isBeta: false,
    },
    {
      id: "ocr",
      path: "ocr",
      icon: FileText,
      title: t('tools.ocr.title'),
      description: t('tools.ocr.description'),
      isBeta: true,
    },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="h-30 w-30" />
          </div>
          <div className="flex items-center gap-3">
            <BookmarkButton />
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 grow-1">
        <div>
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-2 text-balance">{t('home.title')}</h2>
            <p className="text-muted-foreground text-balance">
              {t('home.subtitle')}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {tools.map((tool) => (
              <PDFToolCard
                key={tool.id}
                icon={tool.icon}
                title={tool.title}
                description={tool.description}
                onClick={() => handleToolSelect(tool.path)}
                active={false}
                isBeta={tool.isBeta}
              />
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-border mt-24 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>{t('common.privacyNote')}</p>
        </div>
      </footer>
    </div>
  )
}
