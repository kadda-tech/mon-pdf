// app/sitemap.ts
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mon-pdf.fr'
  const locales = ['en', 'fr'] as const
  const tools = [
    'split-pdf',
    'merge-pdf',
    'organize-pdf',
    'compress-pdf',
    'image-to-pdf',
    'ocr',
    'pdf-to-images',
    'page-numbering',
    'scan-pdf',
  ]

  const blogArticles = [
    'how-to-convert-pdf-to-word',
    'how-to-scan-documents-to-pdf',
    'how-to-split-pdf-online-free',
    'how-to-merge-pdf-online-free',
  ]

  const routes: MetadataRoute.Sitemap = []

  // Homepage for each locale
  locales.forEach((locale) => {
    routes.push({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),   // could be refined to actual content mod-date
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: {
        languages: locales.reduce((acc, l) => {
          if (l !== locale) acc[l] = `${baseUrl}/${l}`
          return acc
        }, {} as Record<string, string>)
      }
    })
  })

  // Tool pages for each locale
  locales.forEach((locale) => {
    tools.forEach((tool) => {
      routes.push({
        url: `${baseUrl}/${locale}/${tool}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',  // tools change less often than homepage
        priority: 0.8,
        alternates: {
          languages: locales.reduce((acc, l) => {
            if (l !== locale) acc[l] = `${baseUrl}/${l}/${tool}`
            return acc
          }, {} as Record<string, string>)
        }
      })
    })
  })

  // Blog pages for each locale
  locales.forEach((locale) => {
    // Blog index page
    routes.push({
      url: `${baseUrl}/${locale}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
      alternates: {
        languages: locales.reduce((acc, l) => {
          if (l !== locale) acc[l] = `${baseUrl}/${l}/blog`
          return acc
        }, {} as Record<string, string>)
      }
    })

    // Blog articles
    blogArticles.forEach((article) => {
      routes.push({
        url: `${baseUrl}/${locale}/blog/${article}`,
        lastModified: new Date('2025-11-14'),
        changeFrequency: 'monthly',
        priority: 0.9,  // High priority for SEO-optimized content
        alternates: {
          languages: locales.reduce((acc, l) => {
            if (l !== locale) acc[l] = `${baseUrl}/${l}/blog/${article}`
            return acc
          }, {} as Record<string, string>)
        }
      })
    })
  })

  return routes
}
