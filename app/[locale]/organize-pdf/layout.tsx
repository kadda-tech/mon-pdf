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
    ? 'Organiser PDF en Ligne Gratuit - Réorganiser Pages PDF | Mon PDF'
    : 'Organize PDF Online Free - Rearrange PDF Pages | Mon PDF'

  // Compelling meta descriptions addressing user intent
  const description = locale === 'fr'
    ? 'Organiser des pages PDF en ligne gratuitement. Réorganisez, supprimez, faites pivoter ou dupliquez des pages. Sans inscription. 100% sécurisé et privé.'
    : 'Organize PDF pages online for free. Rearrange, delete, rotate, or duplicate pages. No email required. 100% secure and private. Works on all devices.'

  return {
    title,
    description,
    keywords: locale === 'fr'
      ? 'organiser pdf, réorganiser pages pdf, supprimer pages pdf, réarranger pdf, modifier ordre pages pdf, outil pdf gratuit, pivoter pages pdf, dupliquer pages pdf, trier pages pdf, déplacer pages pdf'
      : 'organize pdf, reorder pdf pages, delete pdf pages, rearrange pdf, rearrange pages, pdf page order, free pdf tool, rotate pdf pages, duplicate pdf pages, sort pdf pages, move pdf pages',
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
      canonical: locale === 'fr' ? '/fr/organiser-pdf' : '/en/organize-pdf',
      languages: {
        'en': '/en/organize-pdf',
        'fr': '/fr/organiser-pdf',
        'x-default': '/en/organize-pdf',
      },
    },
    openGraph: {
      title,
      description,
      url: locale === 'fr' ? '/fr/organiser-pdf' : '/en/organize-pdf',
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
  return (
    <>
      <SiteHeader />
      {children}
    </>
  )
}
