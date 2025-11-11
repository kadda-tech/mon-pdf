import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale })

  const title = `${t('tools.merge.title')} - ${t('header.title')}`
  const description = t('seo.merge.metaDescription')

  return {
    title,
    description,
    keywords: locale === 'fr'
      ? 'fusionner pdf, combiner pdf, joindre pdf, regrouper pdf, assembler pdf, pdf en ligne, outil pdf gratuit'
      : 'merge pdf, combine pdf, join pdf, unite pdf, concatenate pdf, online pdf, free pdf tool',
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
      canonical: `/${locale}/merge`,
      languages: {
        'en': '/en/merge',
        'fr': '/fr/merge',
      },
    },
    openGraph: {
      title,
      description,
      url: `/${locale}/merge`,
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

export default function MergeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
