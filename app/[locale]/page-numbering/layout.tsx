import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale })

  const title = `${t('tools.pageNumbering.title')} - ${t('header.title')}`
  const description = t('seo.pageNumbering.metaDescription')

  return {
    title,
    description,
    keywords: locale === 'fr'
      ? 'numérotation pdf, ajouter numéros pages pdf, paginer pdf, numéros romains pdf, numérotation personnalisée pdf, outil pdf gratuit, numérotation en ligne'
      : 'pdf page numbers, add page numbers to pdf, number pdf pages, roman numerals pdf, custom page numbering, free pdf tool, online page numbering',
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
      canonical: `/${locale}/page-numbering`,
      languages: {
        'en': '/en/page-numbering',
        'fr': '/fr/page-numbering',
      },
    },
    openGraph: {
      title,
      description,
      url: `/${locale}/page-numbering`,
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
  return children
}
