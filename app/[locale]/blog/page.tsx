"use client"

import {useTranslations} from 'next-intl'
import {usePathname, useRouter} from 'next/navigation'
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import Link from 'next/link'
import {SiteFooter} from "@/components/site-footer"

export default function BlogPage() {
  const t = useTranslations()
  const router = useRouter()
  const pathname = usePathname()
  const locale = pathname.split('/')[1] || 'en'

  const articles = [
    {
      slug: 'how-to-convert-pdf-to-word',
      title: locale === 'fr'
        ? 'Comment Convertir un PDF en Word Gratuitement : Guide Complet 2025'
        : 'How to Convert PDF to Word Free: Complete Guide 2025',
      description: locale === 'fr'
        ? 'Découvrez comment convertir vos fichiers PDF en documents Word (DOCX) éditables en ligne gratuitement. Guide étape par étape avec les meilleures pratiques.'
        : 'Learn how to convert your PDF files to editable Word (DOCX) documents online for free. Step-by-step guide with best practices.',
      date: locale === 'fr' ? '20 Novembre 2025' : 'November 20, 2025',
      readTime: locale === 'fr' ? '6 min de lecture' : '6 min read',
      category: locale === 'fr' ? 'Tutoriels' : 'Tutorials',
      image: '/blog/pdf-to-word.png'
    },
    {
      slug: 'how-to-scan-documents-to-pdf',
      title: locale === 'fr'
        ? 'Comment Scanner des Documents en PDF : Guide Complet 2025'
        : 'How to Scan Documents to PDF: Complete Guide 2025',
      description: locale === 'fr'
        ? 'Découvrez comment scanner vos documents en PDF directement depuis votre smartphone ou ordinateur. Guide complet avec astuces et meilleures pratiques.'
        : 'Learn how to scan your documents to PDF directly from your smartphone or computer. Complete guide with tips and best practices.',
      date: locale === 'fr' ? '17 Novembre 2025' : 'November 17, 2025',
      readTime: locale === 'fr' ? '6 min de lecture' : '6 min read',
      category: locale === 'fr' ? 'Tutoriels' : 'Tutorials',
      image: '/blog/scan-pdf.png'
    },
    {
      slug: 'how-to-split-pdf-online-free',
      title: locale === 'fr'
        ? 'Comment Diviser un PDF en Ligne Gratuitement : Guide Complet 2025'
        : 'How to Split PDF Online Free: Complete Guide 2025',
      description: locale === 'fr'
        ? 'Découvrez comment diviser un fichier PDF en plusieurs documents ou extraire des pages spécifiques en ligne gratuitement. Guide étape par étape avec les meilleures pratiques.'
        : 'Learn how to split a PDF file into multiple documents or extract specific pages online for free. Step-by-step guide with best practices.',
      date: locale === 'fr' ? '19 Novembre 2025' : 'November 19, 2025',
      readTime: locale === 'fr' ? '5 min de lecture' : '5 min read',
      category: locale === 'fr' ? 'Tutoriels' : 'Tutorials',
      image: '/blog/split-pdf-online.png'
    },
    {
      slug: 'how-to-merge-pdf-online-free',
      title: locale === 'fr'
        ? 'Comment Fusionner des PDF en Ligne Gratuitement : Guide Complet 2025'
        : 'How to Merge PDF Online Free: Complete Guide 2025',
      description: locale === 'fr'
        ? 'Découvrez comment fusionner des fichiers PDF en ligne gratuitement et en toute sécurité. Guide étape par étape avec les meilleures pratiques pour combiner vos documents PDF.'
        : 'Learn how to merge PDF files online for free and securely. Step-by-step guide with best practices for combining your PDF documents.',
      date: locale === 'fr' ? '14 Novembre 2025' : 'November 14, 2025',
      readTime: locale === 'fr' ? '5 min de lecture' : '5 min read',
      category: locale === 'fr' ? 'Tutoriels' : 'Tutorials',
      image: '/blog/merge-pdf-online.png'
    }
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="container mx-auto px-4 py-12 flex-1">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
            <li>
              <Link href={`/${locale}/home`} className="hover:text-foreground">
                {locale === 'fr' ? 'Accueil' : 'Home'}
              </Link>
            </li>
            <li>/</li>
            <li className="text-foreground font-medium">
              Blog
            </li>
          </ol>
        </nav>


        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            {locale === 'fr' ? 'Blog Mon PDF' : 'Mon PDF Blog'}
          </h1>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            {locale === 'fr'
              ? 'Guides, tutoriels et conseils pour gérer vos documents PDF'
              : 'Guides, tutorials, and tips for managing your PDF documents'}
          </p>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
            {articles.map((article) => (
              <Card key={article.slug} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                      {article.category}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {article.readTime}
                    </span>
                  </div>
                  <CardTitle className="text-2xl hover:text-primary transition-colors">
                    <Link href={`/${locale}/blog/${article.slug}`}>
                      {article.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="text-base">
                    {article.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <time className="text-sm text-muted-foreground" dateTime={new Date(article.date).toISOString()}>
                    {article.date}
                  </time>
                </CardContent>
                <CardFooter>
                  <Link href={`/${locale}/blog/${article.slug}`} className="w-full">
                    <Button className="w-full cursor-pointer">
                      {locale === 'fr' ? 'Lire l\'article' : 'Read Article'}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <SiteFooter locale={locale} />
    </div>
  )
}