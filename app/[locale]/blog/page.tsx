"use client"

import { useTranslations } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'
import { LanguageSwitcher } from "@/components/language-switcher"
import { BookmarkButton } from "@/components/bookmark-button"
import { SiteFooter } from "@/components/site-footer"

export default function BlogPage() {
  const t = useTranslations()
  const router = useRouter()
  const pathname = usePathname()
  const locale = pathname.split('/')[1] || 'en'

  const articles = [
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
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href={`/${locale}`}>
              <img
                src="/logo.png"
                alt={locale === 'fr'
                  ? 'Mon PDF - Outils PDF Gratuits en Ligne'
                  : 'Mon PDF - Free Online PDF Tools'
                }
                className="h-30 w-30"
                width="120"
                height="120"
              />
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <BookmarkButton />
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 flex-1">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
            <li>
              <Link href={`/${locale}`} className="hover:text-foreground">
                {locale === 'fr' ? 'Accueil' : 'Home'}
              </Link>
            </li>
            <li>/</li>
            <li className="text-foreground font-medium">
              Blog
            </li>
          </ol>
        </nav>

        <Button
          variant="ghost"
          onClick={() => router.push(`/${locale}`)}
          className="mb-6"
        >
          ← {t('common.backToTools')}
        </Button>

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