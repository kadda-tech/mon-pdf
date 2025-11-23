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
    ? 'Scanner PDF en Ligne Gratuit - Numériser Document vers PDF | Mon PDF'
    : 'Scan PDF Online Free - Scan Document to PDF | Mon PDF'

  // Compelling meta descriptions addressing user intent
  const description = locale === 'fr'
    ? 'Scanner et numériser des documents en PDF gratuitement. Utilisez votre webcam ou mobile pour créer des PDF de qualité. Sans inscription. 100% sécurisé et privé.'
    : 'Scan and digitize documents to PDF for free. Use your webcam or mobile to create quality PDFs. No email required. 100% secure and private.'

  return {
    title,
    description,
    keywords: locale === 'fr'
      ? 'scanner pdf, numériser pdf, document vers pdf, scan pdf gratuit, scanner document pdf, numérisation pdf, webcam vers pdf, mobile scan pdf, créer pdf scan, scanner en ligne gratuit'
      : 'scan pdf, digitize pdf, document to pdf, scan pdf free, scan document to pdf, pdf scanning, webcam to pdf, mobile scan pdf, create pdf scan, free online scanner',
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
      canonical: locale === 'fr' ? '/fr/scan-pdf' : '/en/scan-pdf',
      languages: {
        'en': '/en/scan-pdf',
        'fr': '/fr/scan-pdf',
        'x-default': '/en/scan-pdf',
      },
    },
    openGraph: {
      title,
      description,
      url: locale === 'fr' ? '/fr/scan-pdf' : '/en/scan-pdf',
      siteName: t('header.title'),
      locale: locale,
      type: 'website',
      images: [
        {
          url: '/og-image-scan-pdf.png',
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
      images: ['/og-image-scan-pdf.png'],
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

export default function ScanPDFLayout({
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
