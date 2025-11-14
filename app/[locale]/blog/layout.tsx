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
    ? 'Blog Mon PDF - Guides et Tutoriels pour Gérer vos PDF'
    : 'Mon PDF Blog - Guides and Tutorials for Managing Your PDFs'

  const description = locale === 'fr'
    ? 'Découvrez des guides complets, des tutoriels et des conseils pour gérer, fusionner, diviser et optimiser vos documents PDF gratuitement.'
    : 'Discover comprehensive guides, tutorials, and tips for managing, merging, splitting, and optimizing your PDF documents for free.'

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/${locale}/blog`,
      languages: Object.fromEntries(
        locales.map((l) => [l, `${baseUrl}/${l}/blog`])
      ),
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/blog`,
      siteName: 'Mon PDF',
      locale: locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}