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
    ? 'Convertir PDF en Images Gratuit - PDF vers PNG, JPG | Mon PDF'
    : 'Convert PDF to Images Free - PDF to PNG, JPG | Mon PDF'

  // Compelling meta descriptions addressing user intent
  const description = locale === 'fr'
    ? 'Convertir PDF en images (PNG, JPG, JPEG) en ligne gratuitement. Extraire toutes les pages en images haute qualité. Sans inscription. 100% sécurisé.'
    : 'Convert PDF to images (PNG, JPG, JPEG) online for free. Extract all pages to high-quality images. No email required. 100% secure and private.'

  return {
    title,
    description,
    keywords: locale === 'fr'
      ? 'pdf en images, convertir pdf en image, pdf vers png, pdf vers jpeg, pdf vers jpg, extraire images pdf, pdf en ligne, convertisseur pdf gratuit, pdf to image, transformer pdf en image'
      : 'pdf to images, convert pdf to image, pdf to png, pdf to jpeg, pdf to jpg, extract images from pdf, online pdf, free pdf converter, pdf to image converter, turn pdf into image',
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
      canonical: locale === 'fr' ? '/fr/pdf-to-images' : '/en/pdf-to-images',
      languages: {
        'en': '/en/pdf-to-images',
        'fr': '/fr/pdf-to-images',
        'x-default': '/en/pdf-to-images',
      },
    },
    openGraph: {
      title,
      description,
      url: locale === 'fr' ? '/fr/pdf-to-images' : '/en/pdf-to-images',
      siteName: t('header.title'),
      locale: locale,
      type: 'website',
      images: [
        {
          url: '/og-image-pdf-to-images.png',
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
      images: ['/og-image-pdf-to-images.png'],
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

export default function PDFToImagesLayout({
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
