"use client"

import {useTranslations} from 'next-intl'
import {usePathname, useRouter} from 'next/navigation'
import Link from 'next/link'
import Script from 'next/script'
import {SiteFooter} from "@/components/site-footer"
import dynamic from 'next/dynamic'
import {Clock, SendToBack, Shield, Sparkles, Zap} from "lucide-react"
import {Card} from "@/components/ui/card"

// Lazy load the PDFOrganizeTool to avoid SSR issues with pdf.js
const PDFOrganizeTool = dynamic(() => import("@/components/pdf-organize-tool").then(mod => ({ default: mod.PDFOrganizeTool })), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-4 border-teal-200 dark:border-teal-800 border-t-teal-600 dark:border-t-teal-400 animate-spin" />
          <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-teal-600 dark:text-teal-400" />
        </div>
        <p className="text-sm text-muted-foreground">Loading PDF Organizer...</p>
      </div>
    </div>
  )
})

export default function OrganizePDFPage() {
  const t = useTranslations()
  const router = useRouter()
  const pathname = usePathname()
  const locale = pathname.split('/')[1] || 'en'

  // Structured Data for Schema Markup
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Mon PDF",
    "url": "https://mon-pdf.fr",
    "logo": "https://mon-pdf.fr/logo.png",
    "description": locale === 'fr'
      ? "Outils PDF en ligne gratuits et sécurisés"
      : "Free and secure online PDF tools"
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [{
      "@type": "ListItem",
      "position": 1,
      "name": locale === 'fr' ? "Accueil" : "Home",
      "item": `https://mon-pdf.fr/${locale}`
    },{
      "@type": "ListItem",
      "position": 2,
      "name": locale === 'fr' ? "Organiser PDF" : "Organize PDF",
      "item": `https://mon-pdf.fr/${locale}/${locale === 'fr' ? 'organiser-pdf' : 'organize-pdf'}`
    }]
  }

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": locale === 'fr' ? "Comment organiser les pages d'un PDF" : "How to Organize PDF Pages",
    "description": locale === 'fr'
      ? "Guide étape par étape pour réorganiser les pages d'un fichier PDF"
      : "Step-by-step guide to rearrange PDF pages",
    "step": [
      {
        "@type": "HowToStep",
        "name": locale === 'fr' ? "Télécharger le fichier PDF" : "Upload PDF file",
        "text": locale === 'fr'
          ? "Glissez-déposez ou cliquez pour télécharger votre fichier PDF à organiser"
          : "Drag and drop or click to upload your PDF file to organize"
      },
      {
        "@type": "HowToStep",
        "name": locale === 'fr' ? "Réorganiser les pages" : "Rearrange pages",
        "text": locale === 'fr'
          ? "Faites glisser les pages pour les réorganiser, supprimez ou faites pivoter les pages selon vos besoins"
          : "Drag pages to reorder, delete or rotate pages as needed"
      },
      {
        "@type": "HowToStep",
        "name": locale === 'fr' ? "Télécharger le PDF organisé" : "Download organized PDF",
        "text": locale === 'fr'
          ? "Cliquez sur télécharger pour obtenir votre PDF organisé"
          : "Click download to get your organized PDF"
      }
    ]
  }

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": locale === 'fr' ? "Organiser PDF en Ligne" : "Organize PDF Online",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.7",
      "reviewCount": "1654"
    }
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": locale === 'fr' ? [
      {
        "@type": "Question",
        "name": "Comment réorganiser les pages d'un PDF ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Téléchargez votre PDF, puis faites simplement glisser les pages dans l'ordre souhaité. Vous pouvez également supprimer, pivoter ou dupliquer des pages selon vos besoins."
        }
      },
      {
        "@type": "Question",
        "name": "Puis-je faire pivoter des pages individuelles ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Oui, notre outil vous permet de faire pivoter chaque page individuellement à 90°, 180° ou 270°, parfait pour corriger l'orientation des pages scannées."
        }
      },
      {
        "@type": "Question",
        "name": "Les modifications sont-elles permanentes ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Les modifications sont appliquées au fichier téléchargé. Votre PDF original reste intact jusqu'à ce que vous téléchargiez la version organisée."
        }
      }
    ] : [
      {
        "@type": "Question",
        "name": "How do I rearrange PDF pages?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Upload your PDF, then simply drag pages into your desired order. You can also delete, rotate, or duplicate pages as needed."
        }
      },
      {
        "@type": "Question",
        "name": "Can I rotate individual pages?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, our tool allows you to rotate each page individually by 90°, 180°, or 270°, perfect for fixing orientation of scanned pages."
        }
      },
      {
        "@type": "Question",
        "name": "Are the changes permanent?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Changes are applied to the downloaded file. Your original PDF remains intact until you download the organized version."
        }
      }
    ]
  }

  return (
    <>
      {/* Structured Data - loaded after LCP with strategy afterInteractive */}
      <Script id="organization-schema" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(organizationSchema)}
      </Script>
      <Script id="breadcrumb-schema" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(breadcrumbSchema)}
      </Script>
      <Script id="howto-schema" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(howToSchema)}
      </Script>
      <Script id="software-schema" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(softwareSchema)}
      </Script>
      <Script id="faq-schema" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(faqSchema)}
      </Script>

      <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-teal-500/5 dark:bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-3xl" />

        <main className="container mx-auto px-4 py-8 sm:py-12 flex-1 relative z-10">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link
                  href={`/${locale}/home`}
                  className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                >
                  {locale === 'fr' ? 'Accueil' : 'Home'}
                </Link>
              </li>
              <li className="text-muted-foreground">/</li>
              <li className="text-foreground font-medium flex items-center gap-2">
                <SendToBack className="h-4 w-4 text-teal-600" />
                {locale === 'fr' ? 'Organiser PDF' : 'Organize PDF'}
              </li>
            </ol>
          </nav>

          {/* Hero Section with Tool Icon */}
          <div className="max-w-4xl mx-auto mb-8 sm:mb-12">
            <div className="flex flex-col items-center text-center gap-6">
              {/* Animated Icon */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-3xl blur-2xl opacity-30 animate-pulse" />
                <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-teal-500 to-cyan-500 shadow-2xl">
                  <SendToBack className="h-10 w-10 sm:h-12 sm:w-12 text-white" strokeWidth={2.5} />
                </div>
              </div>

              {/* Title */}
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  {locale === 'fr'
                    ? 'Organiser un PDF en Ligne'
                    : 'Organize PDF Pages Online'}
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground max-w-2xl">
                  {locale === 'fr'
                    ? 'Réorganisez, supprimez, faites pivoter ou dupliquez des pages PDF. 100% gratuit, sécurisé et privé.'
                    : 'Rearrange, delete, rotate, or duplicate PDF pages. 100% free, secure, and private.'}
                </p>
              </div>

              {/* Feature Pills */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <div className="flex items-center gap-2 rounded-full bg-teal-500/10 border border-teal-500/20 px-4 py-2">
                  <Zap className="h-4 w-4 text-teal-600" />
                  <span className="text-sm font-medium text-teal-700 dark:text-teal-300">
                    {locale === 'fr' ? 'Ultra rapide' : 'Lightning Fast'}
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-green-500/10 border border-green-500/20 px-4 py-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">
                    {locale === 'fr' ? '100% Sécurisé' : '100% Secure'}
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 px-4 py-2">
                  <Clock className="h-4 w-4 text-cyan-600" />
                  <span className="text-sm font-medium text-cyan-700 dark:text-cyan-300">
                    {locale === 'fr' ? 'Gratuit' : 'Free'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Tool Section */}
          <div className="max-w-5xl mx-auto mb-12">
            <Card className="border-2 border-border/50 shadow-2xl shadow-teal-500/10 dark:shadow-teal-500/5 bg-gradient-to-br from-background to-muted/20">
              <div className="p-6 sm:p-8">
                <PDFOrganizeTool />
              </div>
            </Card>
          </div>

          {/* How It Works Section */}
          <div className="max-w-4xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
              {locale === 'fr' ? 'Comment ça marche' : 'How It Works'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  step: '1',
                  title: locale === 'fr' ? 'Téléchargez' : 'Upload',
                  description: locale === 'fr'
                    ? 'Glissez-déposez votre fichier PDF ou cliquez pour le sélectionner'
                    : 'Drag and drop your PDF file or click to select it',
                  icon: '📄'
                },
                {
                  step: '2',
                  title: locale === 'fr' ? 'Organisez' : 'Organize',
                  description: locale === 'fr'
                    ? 'Réorganisez, supprimez ou faites pivoter les pages selon vos besoins'
                    : 'Rearrange, delete, or rotate pages as needed',
                  icon: '🔄'
                },
                {
                  step: '3',
                  title: locale === 'fr' ? 'Téléchargez' : 'Download',
                  description: locale === 'fr'
                    ? 'Récupérez votre PDF organisé instantanément'
                    : 'Get your organized PDF instantly',
                  icon: '⬇️'
                }
              ].map((item) => (
                <Card key={item.step} className="relative p-6 text-center group hover:shadow-lg transition-all duration-300 hover:border-teal-500/50">
                  <div className="absolute top-4 right-4 text-6xl font-bold text-muted-foreground/10 group-hover:text-teal-500/20 transition-colors">
                    {item.step}
                  </div>
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </main>

        <SiteFooter locale={locale} />
      </div>
    </>
  )
}
