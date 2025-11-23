import {SiteHeader} from "@/components/site-header"
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale })

  // SEO-optimized titles with primary keywords front-loaded
  const title = locale === 'fr'
    ? 'Convertir Images en PDF Gratuit - JPG, PNG vers PDF | Mon PDF'
    : 'Convert Images to PDF Free - JPG, PNG to PDF | Mon PDF'

  // Compelling meta descriptions addressing user intent
  const description = locale === 'fr'
    ? 'Convertir images en PDF (JPG, PNG, JPEG) en ligne gratuitement. Combinez plusieurs images en un seul PDF. Sans inscription. 100% sécurisé et privé.'
    : 'Convert images to PDF (JPG, PNG, JPEG) online for free. Combine multiple images into a single PDF. No email required. 100% secure and private.'

  return {
    title,
    description,
    keywords: locale === 'fr'
      ? 'image vers pdf, jpg en pdf, png en pdf, convertir image pdf, photo en pdf, jpeg vers pdf, images en pdf, combiner images pdf, convertisseur image pdf gratuit, transformer image en pdf, plusieurs images en pdf'
      : 'image to pdf, jpg to pdf, png to pdf, convert image to pdf, photo to pdf, jpeg to pdf, images to pdf, combine images to pdf, free image to pdf converter, turn image into pdf, multiple images to pdf',
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
      canonical: locale === 'fr' ? '/fr/image-to-pdf' : '/en/image-to-pdf',
      languages: {
        'en': '/en/image-to-pdf',
        'fr': '/fr/image-to-pdf',
        'x-default': '/en/image-to-pdf',
      },
    },
    openGraph: {
      title,
      description,
      url: locale === 'fr' ? '/fr/image-to-pdf' : '/en/image-to-pdf',
      siteName: t('header.title'),
      locale: locale,
      type: 'website',
      images: [
        {
          url: '/og-image-image-to-pdf.png',
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
      images: ['/og-image-image-to-pdf.png'],
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

export default function ImageToPDFLayout({
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
