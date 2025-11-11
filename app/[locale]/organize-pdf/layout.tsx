import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale })

  const title = `${t('tools.organizePdf.title')} - ${t('header.title')}`
  const description = t('seo.organizePdf.metaDescription')

  return {
    title,
    description,
    keywords: locale === 'fr'
      ? 'organiser pdf, réorganiser pages pdf, supprimer pages pdf, réarranger pdf, modifier ordre pages pdf, outil pdf gratuit'
      : 'organize pdf, reorder pdf pages, delete pdf pages, rearrange pdf, rearrange pages, pdf page order, free pdf tool',
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
      canonical: `/${locale}/organize-pdf`,
      languages: {
        'en': '/en/organize-pdf',
        'fr': '/fr/organize-pdf',
      },
    },
    openGraph: {
      title,
      description,
      url: `/${locale}/organize-pdf`,
      siteName: t('header.title'),
      locale: locale,
      type: 'website',
      images: [
        {
          url: '/og-image-organize.png',
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
      images: ['/og-image-organize.png'],
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

export default function OrganizePDFLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
