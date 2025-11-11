"use client"

import { useTranslations } from 'next-intl'
import { ImageToPDFTool } from "@/components/image-to-pdf-tool"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import { LanguageSwitcher } from "@/components/language-switcher"

export default function ImageToPDFPage() {
  const t = useTranslations()
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="h-10 w-10" />
            <h1 className="text-2xl font-bold">{t('header.title')}</h1>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 flex-1">
        <Button
          variant="ghost"
          onClick={() => router.push('/')}
          className="mb-6"
        >
          ← {t('common.backToTools')}
        </Button>

        <div className="max-w-3xl mx-auto">
          <ImageToPDFTool />
        </div>

        {/* SEO Content */}
        <div className="max-w-4xl mx-auto mt-16 prose prose-slate dark:prose-invert">
          <h2>{t('tools.imageToPdf.title')} - {t('seo.imageToPdf.heading')}</h2>
          <p>{t('seo.imageToPdf.description1')}</p>

          <h3>{t('seo.imageToPdf.howToTitle')}</h3>
          <ol>
            <li>{t('seo.imageToPdf.step1')}</li>
            <li>{t('seo.imageToPdf.step2')}</li>
            <li>{t('seo.imageToPdf.step3')}</li>
          </ol>

          <h3>{t('seo.imageToPdf.featuresTitle')}</h3>
          <ul>
            <li>{t('seo.imageToPdf.feature1')}</li>
            <li>{t('seo.imageToPdf.feature2')}</li>
            <li>{t('seo.imageToPdf.feature3')}</li>
            <li>{t('seo.imageToPdf.feature4')}</li>
          </ul>

          <h3>{t('seo.imageToPdf.whyTitle')}</h3>
          <p>{t('seo.imageToPdf.whyDescription')}</p>
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
