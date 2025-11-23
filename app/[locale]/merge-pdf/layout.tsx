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
    ? 'Fusionner PDF en Ligne Gratuit - Combiner Plusieurs PDF | Mon PDF'
    : 'Merge PDF Files Online Free - Combine Multiple PDFs | Mon PDF'

  // Compelling meta descriptions addressing user intent
  const description = locale === 'fr'
    ? 'Fusionner des fichiers PDF en ligne gratuitement. Combinez plusieurs PDF en un seul document en quelques secondes. Sans inscription. 100% sécurisé et privé.'
    : 'Merge PDF files online for free. Combine multiple PDFs into one document in seconds. No email required. 100% secure and private. Works on all devices.'

  return {
    title,
    description,
    keywords: locale === 'fr'
      ? 'fusionner pdf, combiner pdf, joindre pdf, fusionner plusieurs pdf, fusion de pdf, fusionner fichiers pdf, combiner fichiers pdf, outil fusion pdf, fusionner pdf en ligne, fusionner pdf gratuit, joindre pdf ensemble, fusionner documents pdf, regrouper pdf, assembler pdf'
      : 'merge pdf, combine pdf, join pdf, merge pdf files, pdf merger, combine pdf files, join pdf files, merge multiple pdfs, pdf combiner, merge pdf online, merge pdf free, pdf merging tool, concatenate pdf, unite pdf files, join pdfs together',
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
      canonical: locale === 'fr' ? '/fr/merge-pdf' : '/en/merge-pdf',
      languages: {
        'en': '/en/merge-pdf',
        'fr': '/fr/merge-pdf',
        'x-default': '/en/merge-pdf',
      },
    },
    openGraph: {
      title,
      description,
      url: locale === 'fr' ? '/fr/merge-pdf' : '/en/merge-pdf',
      siteName: t('header.title'),
      locale: locale,
      type: 'website',
      images: [
        {
          url: '/og-image-merge.png',
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
      images: ['/og-image-merge.png'],
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

import {SiteHeader} from "@/components/site-header"

export default function MergeLayout({
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
