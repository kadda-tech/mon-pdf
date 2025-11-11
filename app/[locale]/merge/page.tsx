"use client"

import { useTranslations } from 'next-intl'
import { PDFMergeTool } from "@/components/pdf-merge-tool"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import { LanguageSwitcher } from "@/components/language-switcher"

export default function MergePDFPage() {
  const t = useTranslations()
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="h-10 w-10" />
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
          <PDFMergeTool />
        </div>

        {/* SEO Content */}
        <div className="max-w-4xl mx-auto mt-16 prose prose-slate dark:prose-invert">
          <h2>{t('tools.merge.title')} - {t('seo.merge.heading')}</h2>
          <p>{t('seo.merge.description1')}</p>

          <h3>{t('seo.merge.howToTitle')}</h3>
          <ol>
            <li>{t('seo.merge.step1')}</li>
            <li>{t('seo.merge.step2')}</li>
            <li>{t('seo.merge.step3')}</li>
          </ol>

          <h3>{t('seo.merge.featuresTitle')}</h3>
          <ul>
            <li>{t('seo.merge.feature1')}</li>
            <li>{t('seo.merge.feature2')}</li>
            <li>{t('seo.merge.feature3')}</li>
            <li>{t('seo.merge.feature4')}</li>
          </ul>

          <h3>{t('seo.merge.whyTitle')}</h3>
          <p>{t('seo.merge.whyDescription')}</p>
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
