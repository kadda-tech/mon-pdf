import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale })

  const title = `${t('tools.split.title')} - ${t('header.title')}`
  const description = t('seo.split.metaDescription')

  return {
    title,
    description,
    keywords: locale === 'fr'
      ? 'fractionner pdf, diviser pdf, extraire pages pdf, séparer pdf, découper pdf, pdf en ligne, outil pdf gratuit'
      : 'split pdf, divide pdf, extract pdf pages, separate pdf, cut pdf, online pdf, free pdf tool',
    authors: [{ name: t('header.title') }],
    creator: t('header.title'),
    publisher: t('header.title'),
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://monpdf.com'),
    alternates: {
      canonical: `/${locale}/split`,
      languages: {
        'en': '/en/split',
        'fr': '/fr/split',
      },
    },
    openGraph: {
      title,
      description,
      url: `/${locale}/split`,
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
  return children
}
