"use client"

import { useTranslations } from 'next-intl'
import { PDFSplitTool } from "@/components/pdf-split-tool"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import { LanguageSwitcher } from "@/components/language-switcher"
import { BookmarkButton } from "@/components/bookmark-button"

export default function SplitPDFPage() {
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
          <div className="flex items-center gap-3">
            <BookmarkButton />
            <LanguageSwitcher />
          </div>
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
          <PDFSplitTool />
        </div>

        {/* SEO Content */}
        <div className="max-w-4xl mx-auto mt-16 prose prose-slate dark:prose-invert">
          <h2>{t('tools.split.title')} - {t('seo.split.heading')}</h2>
          <p>{t('seo.split.description1')}</p>

          <h3>{t('seo.split.howToTitle')}</h3>
          <ol>
            <li>{t('seo.split.step1')}</li>
            <li>{t('seo.split.step2')}</li>
            <li>{t('seo.split.step3')}</li>
          </ol>

          <h3>{t('seo.split.featuresTitle')}</h3>
          <ul>
            <li>{t('seo.split.feature1')}</li>
            <li>{t('seo.split.feature2')}</li>
            <li>{t('seo.split.feature3')}</li>
            <li>{t('seo.split.feature4')}</li>
          </ul>

          <h3>{t('seo.split.whyTitle')}</h3>
          <p>{t('seo.split.whyDescription')}</p>
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
