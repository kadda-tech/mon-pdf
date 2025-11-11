import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://monpdf.com'
  const locales = ['en', 'fr']
  const tools = ['split', 'merge', 'image-to-pdf']

  const routes: MetadataRoute.Sitemap = []

  // Add homepage for each locale
  locales.forEach((locale) => {
    routes.push({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    })
  })

  // Add tool pages for each locale
  locales.forEach((locale) => {
    tools.forEach((tool) => {
      routes.push({
        url: `${baseUrl}/${locale}/${tool}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      })
    })
  })

  return routes
}
