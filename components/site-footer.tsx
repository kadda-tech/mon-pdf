import Link from 'next/link'
import {useTranslations} from 'next-intl'
import {Lock, Shield, Zap} from 'lucide-react'
import Image from "next/image";

interface SiteFooterProps {
  locale: string
}

export function SiteFooter({ locale }: SiteFooterProps) {
  const t = useTranslations()

  const toolsColumn1 = [
    { href: `/${locale}/split-pdf`, label: t('tools.split.title') },
    { href: `/${locale}/merge-pdf`, label: t('tools.merge.title') },
    { href: `/${locale}/organize-pdf`, label: t('tools.organizePdf.title') },
    { href: `/${locale}/compress-pdf`, label: t('tools.compressPdf.title') },
  ]

  const toolsColumn2 = [
    { href: `/${locale}/image-to-pdf`, label: t('tools.imageToPdf.title') },
    { href: `/${locale}/pdf-to-images`, label: t('tools.pdfToImages.title') },
    { href: `/${locale}/pdf-to-word`, label: t('tools.pdfToWord.title') },
  ]

  const toolsColumn3 = [
    { href: `/${locale}/page-numbering`, label: t('tools.pageNumbering.title') },
    { href: `/${locale}/scan-pdf`, label: t('tools.scanPdf.title') },
    { href: `/${locale}/ocr`, label: t('tools.ocr.title') },
  ]

  return (
    <footer className="border-t border-border/40 bg-muted/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand Column */}
          <div className="space-y-4">
            <div>
              <Image
                  src="/logo.png"
                  alt={locale === 'fr'
                      ? 'Mon PDF - Outils PDF Gratuits en Ligne'
                      : 'Mon PDF - Free Online PDF Tools'
                  }
                  priority
                  width={150}
                  height={100}
              />
              <p className="text-sm text-muted-foreground leading-relaxed">
                {locale === 'fr'
                  ? 'Outils PDF gratuits et sécurisés. Traitement 100% local, vos fichiers restent privés.'
                  : 'Free and secure PDF tools. 100% local processing, your files stay private.'}
              </p>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-col gap-2 pt-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="h-3.5 w-3.5 text-green-600" />
                <span>{locale === 'fr' ? '100% Sécurisé' : '100% Secure'}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Lock className="h-3.5 w-3.5 text-blue-600" />
                <span>{locale === 'fr' ? 'Confidentialité totale' : 'Complete Privacy'}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Zap className="h-3.5 w-3.5 text-purple-600" />
                <span>{locale === 'fr' ? 'Gratuit pour toujours' : 'Free Forever'}</span>
              </div>
            </div>
          </div>

          {/* Tools Column 1 */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-foreground">
              {locale === 'fr' ? 'Outils PDF' : 'PDF Tools'}
            </h4>
            <ul className="space-y-2.5">
              {toolsColumn1.map((tool) => (
                <li key={tool.href}>
                  <Link
                    href={tool.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center group"
                  >
                    <span className="group-hover:translate-x-0.5 transition-transform">
                      {tool.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools Column 2 */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-foreground">
              {locale === 'fr' ? 'Conversion' : 'Conversion'}
            </h4>
            <ul className="space-y-2.5">
              {toolsColumn2.map((tool) => (
                <li key={tool.href}>
                  <Link
                    href={tool.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center group"
                  >
                    <span className="group-hover:translate-x-0.5 transition-transform">
                      {tool.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools Column 3 */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-foreground">
              {locale === 'fr' ? 'Avancé' : 'Advanced'}
            </h4>
            <ul className="space-y-2.5">
              {toolsColumn3.map((tool) => (
                <li key={tool.href}>
                  <Link
                    href={tool.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center group"
                  >
                    <span className="group-hover:translate-x-0.5 transition-transform">
                      {tool.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/40 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Mon PDF. {locale === 'fr' ? 'Tous droits réservés.' : 'All rights reserved.'}
            </p>

            {/* Links */}
            <div className="flex items-center gap-6">
              <Link
                href={`/${locale}/blog`}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Blog
              </Link>
            </div>
          </div>

          {/* Privacy Badge */}
          <div className="mt-6 pt-6 border-t border-border/20">
            <div className="flex items-start gap-3 max-w-3xl mx-auto">
              <Lock className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground leading-relaxed text-center">
                {t('common.privacyNote')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
