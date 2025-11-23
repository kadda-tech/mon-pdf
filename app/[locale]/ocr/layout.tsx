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
    ? 'OCR PDF Gratuit - Extraire Texte de PDF Scanné | Mon PDF'
    : 'OCR PDF Free - Extract Text from Scanned PDF | Mon PDF'

  // Compelling meta descriptions addressing user intent
  const description = locale === 'fr'
    ? 'OCR PDF gratuit en ligne. Extraire texte de PDF scanné, reconnaître caractères, détecter tableaux. Sans inscription. 100% sécurisé et privé.'
    : 'Free online PDF OCR. Extract text from scanned PDF, recognize characters, detect tables. No email required. 100% secure and private.'

  return {
    title,
    description,
    keywords: locale === 'fr'
      ? 'ocr pdf, reconnaissance optique caractères, extraire texte pdf, pdf scanné en texte, ocr en ligne, détecter tableaux pdf, extraction données pdf, ocr gratuit, convertir pdf image en texte, reconnaissance texte pdf'
      : 'pdf ocr, optical character recognition, extract text from pdf, scanned pdf to text, online ocr, detect tables pdf, pdf data extraction, free ocr, convert pdf image to text, pdf text recognition',
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
      canonical: `/${locale}/ocr`,
      languages: {
        'en': '/en/ocr',
        'fr': '/fr/ocr',
        'x-default': '/en/ocr',
      },
    },
    openGraph: {
      title,
      description,
      url: `/${locale}/ocr`,
      siteName: t('header.title'),
      locale: locale,
      type: 'website',
      images: [
        {
          url: '/og-image-ocr.png',
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
      images: ['/og-image-ocr.png'],
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

export default function OCRLayout({
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
