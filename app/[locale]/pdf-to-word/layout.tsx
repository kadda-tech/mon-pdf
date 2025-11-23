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
    ? 'Convertir PDF en Word Gratuit - PDF vers DOCX | Mon PDF'
    : 'Convert PDF to Word Free - PDF to DOCX | Mon PDF'

  // Compelling meta descriptions addressing user intent
  const description = locale === 'fr'
    ? 'Convertir PDF en Word (DOCX) gratuitement en ligne. Extraire texte de PDF en document Word éditable. Sans inscription. 100% sécurisé et privé.'
    : 'Convert PDF to Word (DOCX) online for free. Extract text from PDF to editable Word document. No email required. 100% secure and private.'

  return {
    title,
    description,
    keywords: locale === 'fr'
      ? 'pdf en word, convertir pdf word, pdf vers docx, pdf to word gratuit, transformer pdf en word, convertisseur pdf word gratuit, pdf editable word, extraire texte pdf word'
      : 'pdf to word, convert pdf to word, pdf to docx, free pdf to word, turn pdf into word, free pdf to word converter, pdf editable word, extract text pdf word',
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
      canonical: locale === 'fr' ? '/fr/pdf-to-word' : '/en/pdf-to-word',
      languages: {
        'en': '/en/pdf-to-word',
        'fr': '/fr/pdf-to-word',
        'x-default': '/en/pdf-to-word',
      },
    },
    openGraph: {
      title,
      description,
      url: locale === 'fr' ? '/fr/pdf-to-word' : '/en/pdf-to-word',
      siteName: t('header.title'),
      locale: locale,
      type: 'website',
      images: [
        {
          url: '/og-image-pdf-to-word.png',
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
      images: ['/og-image-pdf-to-word.png'],
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

export default function PDFToWordLayout({
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
