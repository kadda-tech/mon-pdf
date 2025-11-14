import type { Metadata } from "next"
import { locales } from "@/i18n"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const baseUrl = "https://mon-pdf.fr"

  const title = locale === 'fr'
    ? 'Comment Fusionner des PDF en Ligne Gratuitement : Guide Complet 2025 | Mon PDF'
    : 'How to Merge PDF Online Free: Complete Guide 2025 | Mon PDF'

  const description = locale === 'fr'
    ? 'Découvrez comment fusionner des fichiers PDF en ligne gratuitement et en toute sécurité. Guide étape par étape avec les meilleures pratiques pour combiner vos documents PDF sans logiciel.'
    : 'Learn how to merge PDF files online for free and securely. Step-by-step guide with best practices for combining your PDF documents without software.'

  const keywords = locale === 'fr'
    ? 'fusionner pdf, merger pdf, combiner pdf, fusionner pdf gratuit, fusionner pdf en ligne, outil fusion pdf, combiner plusieurs pdf, assembler pdf, fusion pdf gratuite, fusionneur pdf'
    : 'merge pdf, merge pdf online, merge pdf free, combine pdf, pdf merger, online pdf merge, free pdf combiner, merge multiple pdfs, pdf merge tool, combine pdf files'

  return {
    title,
    description,
    keywords,
    authors: [{ name: 'Mon PDF' }],
    alternates: {
      canonical: `${baseUrl}/${locale}/blog/how-to-merge-pdf-online-free`,
      languages: Object.fromEntries(
        locales.map((l) => [l, `${baseUrl}/${l}/blog/how-to-merge-pdf-online-free`])
      ),
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/blog/how-to-merge-pdf-online-free`,
      siteName: 'Mon PDF',
      locale: locale,
      type: 'article',
      publishedTime: '2025-11-14T00:00:00Z',
      modifiedTime: '2025-11-14T00:00:00Z',
      authors: ['Mon PDF'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
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

export default async function ArticleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}