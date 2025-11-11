import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale })

  const title = `${t('tools.imageToPdf.title')} - ${t('header.title')}`
  const description = t('seo.imageToPdf.metaDescription')

  return {
    title,
    description,
    keywords: locale === 'fr'
      ? 'image vers pdf, jpg en pdf, png en pdf, convertir image pdf, photo en pdf, jpeg vers pdf, converter image, outil pdf gratuit'
      : 'image to pdf, jpg to pdf, png to pdf, convert image to pdf, photo to pdf, jpeg to pdf, image converter, free pdf tool',
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
      canonical: `/${locale}/image-to-pdf`,
      languages: {
        'en': '/en/image-to-pdf',
        'fr': '/fr/image-to-pdf',
      },
    },
    openGraph: {
      title,
      description,
      url: `/${locale}/image-to-pdf`,
      siteName: t('header.title'),
      locale: locale,
      type: 'website',
      images: [
        {
          url: '/og-image-convert.png',
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
      images: ['/og-image-convert.png'],
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
  return children
}
