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
    ? 'Diviser PDF en Ligne Gratuit - Séparer et Extraire Pages PDF | Mon PDF'
    : 'Split PDF Files Online Free - Separate and Extract PDF Pages | Mon PDF'

  // Compelling meta descriptions addressing user intent
  const description = locale === 'fr'
    ? 'Diviser des fichiers PDF en ligne gratuitement. Séparez un PDF en plusieurs fichiers ou extrayez des pages spécifiques. Sans inscription. 100% sécurisé et privé.'
    : 'Split PDF files online for free. Separate a PDF into multiple files or extract specific pages. No email required. 100% secure and private. Works on all devices.'

  return {
    title,
    description,
    keywords: locale === 'fr'
      ? 'diviser pdf, séparer pdf, fractionner pdf, extraire pages pdf, découper pdf, diviser pdf en ligne, diviser pdf gratuit, séparer pdf en plusieurs fichiers, extraction pages pdf, découper fichier pdf, outil division pdf, partitionner pdf, scinder pdf'
      : 'split pdf, divide pdf, separate pdf, extract pdf pages, split pdf online, split pdf free, separate pdf into multiple files, extract pages from pdf, divide pdf file, pdf splitter tool, pdf page extractor, break apart pdf, partition pdf',
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
      canonical: locale === 'fr' ? '/fr/split-pdf' : '/en/split-pdf',
      languages: {
        'en': '/en/split-pdf',
        'fr': '/fr/split-pdf',
        'x-default': '/en/split-pdf',
      },
    },
    openGraph: {
      title,
      description,
      url: locale === 'fr' ? '/fr/split-pdf' : '/en/split-pdf',
      siteName: t('header.title'),
      locale: locale,
      type: 'website',
      images: [
        {
          url: '/og-image-split.png',
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
      images: ['/og-image-split.png'],
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

export default function SplitLayout({
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
