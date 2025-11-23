"use client"

import {
  Combine,
  FileImage,
  FileText,
  FileType,
  Hash,
  ImageIcon,
  Package,
  Scan,
  Scissors,
  SendToBack,
  Sparkles
} from "lucide-react"
import {useTranslations} from 'next-intl'
import {usePathname} from 'next/navigation'
import {ColorfulToolCard} from "@/components/colorful-tool-card"
import {SiteFooter} from "@/components/site-footer"
import Image from "next/image";

export default function Home() {
  const t = useTranslations()
  const pathname = usePathname()
  const locale = pathname.split('/')[1] || 'en'

  const tools = [
    {
      id: "split",
      path: "split-pdf",
      icon: Scissors,
      title: t('tools.split.title'),
      description: t('tools.split.description'),
      color: "purple" as const,
      isBeta: false,
    },
    {
      id: "merge",
      path: "merge-pdf",
      icon: Combine,
      title: t('tools.merge.title'),
      description: t('tools.merge.description'),
      color: "blue" as const,
      isBeta: false,
    },
    {
      id: "organize-pdf",
      path: "organize-pdf",
      icon: SendToBack,
      title: t('tools.organizePdf.title'),
      description: t('tools.organizePdf.description'),
      color: "teal" as const,
      isBeta: false,
    },
    {
      id: "compress-pdf",
      path: "compress-pdf",
      icon: Package,
      title: t('tools.compressPdf.title'),
      description: t('tools.compressPdf.description'),
      color: "green" as const,
      isBeta: false,
    },
    {
      id: "image-to-pdf",
      path: "image-to-pdf",
      icon: FileImage,
      title: t('tools.imageToPdf.title'),
      description: t('tools.imageToPdf.description'),
      color: "orange" as const,
      isBeta: false,
    },
    {
      id: "pdf-to-images",
      path: "pdf-to-images",
      icon: ImageIcon,
      title: t('tools.pdfToImages.title'),
      description: t('tools.pdfToImages.description'),
      color: "pink" as const,
      isBeta: false,
    },
    {
      id: "page-numbering",
      path: "page-numbering",
      icon: Hash,
      title: t('tools.pageNumbering.title'),
      description: t('tools.pageNumbering.description'),
      color: "blue" as const,
      isBeta: false,
    },
    {
      id: "scan-pdf",
      path: "scan-pdf",
      icon: Scan,
      title: t('tools.scanPdf.title'),
      description: t('tools.scanPdf.description'),
      color: "teal" as const,
      isBeta: false,
    },
    {
      id: "pdf-to-word",
      path: "pdf-to-word",
      icon: FileType,
      title: t('tools.pdfToWord.title'),
      description: t('tools.pdfToWord.description'),
      color: "purple" as const,
      isBeta: false,
    },
    {
      id: "ocr",
      path: "ocr",
      icon: FileText,
      title: t('tools.ocr.title'),
      description: t('tools.ocr.description'),
      color: "orange" as const,
      isBeta: true,
    },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col pt-10">
      <main className="container mx-auto flex-1">
        {/* Hero Section */}
        <div className="flex flex-col items-center gap-10 text-center mb-12 sm:mb-16 mx-auto">
          <Image
              src="/logo.png"
              alt={locale === 'fr'
                  ? 'Mon PDF - Outils PDF Gratuits en Ligne'
                  : 'Mon PDF - Free Online PDF Tools'
              }
              priority
              width={350}
              height={100}
          />
          <div className="flex flex-col">
            <h1 className="text-2xl sm:text-5xl lg:text-4xl font-bold mb-4 sm:mb-6 text-balance leading-tight">
              {t('home.title')}
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground text-balance mx-auto leading-relaxed">
              {t('home.subtitle')}
            </p>
          </div>

          {/* Privacy badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
            <div className="flex items-center gap-2 rounded-full bg-card border border-border px-4 py-2 shadow-sm">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-xs sm:text-sm font-medium">
                {locale === 'fr' ? 'Pas de téléchargement' : 'No Upload'}
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-card border border-border px-4 py-2 shadow-sm">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              <span className="text-xs sm:text-sm font-medium">
                {locale === 'fr' ? '100% Privé' : '100% Private'}
              </span>
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto mb-16 px-4">
          {tools.map((tool) => (
            <ColorfulToolCard
              key={tool.id}
              icon={tool.icon}
              title={tool.title}
              description={tool.description}
              href={`/${locale}/${tool.path}`}
              color={tool.color}
              isBeta={tool.isBeta}
            />
          ))}
        </div>

        {/* Features section */}
        <div className="mt-16 sm:mt-24 max-w-4xl mx-auto pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10">
                <Sparkles className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {locale === 'fr' ? 'Ultra Rapide' : 'Lightning Fast'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {locale === 'fr'
                  ? 'Traitez vos PDF instantanément avec notre moteur basé navigateur'
                  : 'Process PDFs instantly with our browser-based engine'}
              </p>
            </div>
            <div className="text-center">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10">
                <Sparkles className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {locale === 'fr' ? 'Totalement Privé' : 'Fully Private'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {locale === 'fr'
                  ? 'Vos fichiers ne quittent jamais votre appareil, jamais'
                  : 'Your files never leave your device, ever'}
              </p>
            </div>
            <div className="text-center">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500/10">
                <Sparkles className="h-7 w-7 text-teal-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {locale === 'fr' ? 'Sans Limites' : 'No Limits'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {locale === 'fr'
                  ? 'Utilisez tous les outils de manière illimitée, complètement gratuit'
                  : 'Use all tools unlimited times, completely free'}
              </p>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter locale={locale} />
    </div>
  )
}
