import {SiteHeader} from "@/components/site-header"
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale} = await params
  const t = await getTranslations({ locale })

  // SEO-optimized titles with primary keywords front-loaded
  const title = locale === 'fr'
    ? 'Numéroter PDF en Ligne Gratuit - Ajouter Numéros de Page PDF | Mon PDF'
    : 'Number PDF Pages Online Free - Add Page Numbers to PDF | Mon PDF'

  // Compelling meta descriptions addressing user intent
  const description = locale === 'fr'
    ? 'Ajouter des numéros de page à vos PDF en ligne gratuitement. Numérotation personnalisée, position flexible. Sans inscription. 100% sécurisé et privé.'
    : 'Add page numbers to your PDFs online for free. Custom numbering, flexible position. No email required. 100% secure and private. Works on all devices.'

  return {
    title,
    description,
    keywords: locale === 'fr'
      ? 'numéroter pdf, ajouter numéros pages pdf, paginer pdf, numéros romains pdf, numérotation personnalisée pdf, outil pdf gratuit, numérotation en ligne, ajouter pagination pdf, numéros pages automatiques'
      : 'number pdf pages, add page numbers to pdf, pdf page numbering, roman numerals pdf, custom page numbering, free pdf tool, online page numbering, add pagination to pdf, automatic page numbers',
    authors: [{ name: t('header.title') }],
    creator: t('header.title'),
    publisher: t('header.title'),
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://mon-pdf.fr'),
    alternates: {
      canonical: locale === 'fr' ? '/fr/page-numbering' : '/en/page-numbering',
      languages: {
        'en': '/en/page-numbering',
        'fr': '/fr/page-numbering',
        'x-default': '/en/page-numbering',
      },
    },
    openGraph: {
      title,
      description,
      url: locale === 'fr' ? '/fr/page-numbering' : '/en/page-numbering',
      siteName: t('header.title'),
      locale: locale,
      type: 'website',
      images: [
        {
          url: '/og-image-page-numbering.png',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image-page-numbering.png'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export default function PageNumberingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <SiteHeader />
      {children}
    </>
  )
}
