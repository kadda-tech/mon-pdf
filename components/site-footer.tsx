import Link from 'next/link'
import { useTranslations } from 'next-intl'

interface SiteFooterProps {
  locale: string
}

export function SiteFooter({ locale }: SiteFooterProps) {
  const t = useTranslations()

  return (
    <footer className="bg-black mt-24 border-t border-yellow-500/20">
      <div className="container mx-auto px-4 py-12">
        {/* Sitemap */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* PDF Tools Column 1 */}
          <div>
            <h3 className="text-yellow-400 font-semibold mb-4 text-lg">
              {locale === 'fr' ? 'Outils PDF' : 'PDF Tools'}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/${locale}/split-pdf`}
                  className="text-yellow-500 hover:text-yellow-300 transition-colors text-sm"
                >
                  {t('tools.split.title')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/merge-pdf`}
                  className="text-yellow-500 hover:text-yellow-300 transition-colors text-sm"
                >
                  {t('tools.merge.title')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/organize-pdf`}
                  className="text-yellow-500 hover:text-yellow-300 transition-colors text-sm"
                >
                  {t('tools.organizePdf.title')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/compress-pdf`}
                  className="text-yellow-500 hover:text-yellow-300 transition-colors text-sm"
                >
                  {t('tools.compressPdf.title')}
                </Link>
              </li>
            </ul>
          </div>

          {/* PDF Tools Column 2 */}
          <div>
            <h3 className="text-yellow-400 font-semibold mb-4 text-lg">
              {locale === 'fr' ? 'Conversion' : 'Conversion'}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/${locale}/image-to-pdf`}
                  className="text-yellow-500 hover:text-yellow-300 transition-colors text-sm"
                >
                  {t('tools.imageToPdf.title')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/pdf-to-images`}
                  className="text-yellow-500 hover:text-yellow-300 transition-colors text-sm"
                >
                  {t('tools.pdfToImages.title')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/pdf-to-word`}
                  className="text-yellow-500 hover:text-yellow-300 transition-colors text-sm"
                >
                  {t('tools.pdfToWord.title')}
                </Link>
              </li>
            </ul>
          </div>

          {/* PDF Tools Column 3 */}
          <div>
            <h3 className="text-yellow-400 font-semibold mb-4 text-lg">
              {locale === 'fr' ? 'Outils Avancés' : 'Advanced Tools'}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/${locale}/page-numbering`}
                  className="text-yellow-500 hover:text-yellow-300 transition-colors text-sm"
                >
                  {t('tools.pageNumbering.title')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/scan-pdf`}
                  className="text-yellow-500 hover:text-yellow-300 transition-colors text-sm"
                >
                  {t('tools.scanPdf.title')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/ocr`}
                  className="text-yellow-500 hover:text-yellow-300 transition-colors text-sm"
                >
                  {t('tools.ocr.title')}
                </Link>
              </li>
            </ul>
          </div>

          {/* About Column */}
          <div>
            <h3 className="text-yellow-400 font-semibold mb-4 text-lg">Mon PDF</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {locale === 'fr'
                ? 'Outils PDF gratuits en ligne. 100% sécurisé, traitement côté client.'
                : 'Free online PDF tools. 100% secure, client-side processing.'}
            </p>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="border-t border-yellow-500/20 pt-6">
          <p className="text-center text-xs text-gray-400 leading-relaxed">
            {t('common.privacyNote')}
          </p>
        </div>
      </div>
    </footer>
  )
}
