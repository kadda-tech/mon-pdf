import {SiteHeader} from "@/components/site-header"
import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale })

  // SEO-optimized titles with primary keywords front-loaded
  const title = locale === 'fr'
    ? 'Compresser PDF en Ligne Gratuit - Réduire Taille PDF | Mon PDF'
    : 'Compress PDF Online Free - Reduce PDF File Size | Mon PDF'

  // Compelling meta descriptions addressing user intent
  const description = locale === 'fr'
    ? 'Compresser des fichiers PDF en ligne gratuitement. Réduisez la taille de vos PDF sans perte de qualité. Sans inscription. 100% sécurisé et privé.'
    : 'Compress PDF files online for free. Reduce PDF file size without losing quality. No email required. 100% secure and private. Works on all devices.'

  const keywords =
    locale === 'fr'
      ? 'compresser pdf, réduire taille pdf, optimiser pdf, compresseur pdf gratuit, réduire pdf en ligne, compression pdf, optimisation pdf, pdf plus léger, réduire fichier pdf, diminuer taille pdf, compresser pdf sans perte qualité, réduire poids pdf'
      : 'compress pdf, reduce pdf size, optimize pdf, free pdf compressor, reduce pdf online, pdf compression, pdf optimization, smaller pdf, shrink pdf file, decrease pdf size, compress pdf without losing quality, reduce pdf file size'

  return {
    title,
    description,
    keywords,
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
      canonical: locale === 'fr' ? '/fr/compress-pdf' : '/en/compress-pdf',
      languages: {
        'en': '/en/compress-pdf',
        'fr': '/fr/compress-pdf',
        'x-default': '/en/compress-pdf',
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      locale: locale,
      url: locale === 'fr' ? '/fr/compress-pdf' : '/en/compress-pdf',
      siteName: t('header.title'),
      images: [
        {
          url: '/og-image-compress.png',
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
      images: ['/og-image-compress.png'],
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

export default function CompressPDFLayout({
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
