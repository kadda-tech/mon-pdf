"use client"

import {useTranslations} from 'next-intl'
import {usePathname, useRouter} from 'next/navigation'
import Script from 'next/script'
import {SiteFooter} from "@/components/site-footer"
import dynamic from 'next/dynamic'
import {Package, Sparkles} from "lucide-react"
import {Card} from "@/components/ui/card"

// Lazy load the PDFCompressTool to avoid SSR issues with pdf.js
const PDFCompressTool = dynamic(() => import("@/components/pdf-compress-tool").then(mod => ({ default: mod.PDFCompressTool })), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-4 border-green-200 dark:border-green-800 border-t-green-600 dark:border-t-green-400 animate-spin" />
          <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-green-600 dark:text-green-400" />
        </div>
        <p className="text-sm text-muted-foreground">Loading PDF Compressor...</p>
      </div>
    </div>
  )
})

export default function CompressPDFPage() {
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
      "name": locale === 'fr' ? "Compresser PDF" : "Compress PDF",
      "item": `https://mon-pdf.fr/${locale}/compress-pdf`
    }]
  }

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": locale === 'fr' ? "Comment compresser un fichier PDF" : "How to Compress a PDF File",
    "description": locale === 'fr'
      ? "Guide étape par étape pour réduire la taille d'un fichier PDF"
      : "Step-by-step guide to reduce PDF file size",
    "step": [
      {
        "@type": "HowToStep",
        "name": locale === 'fr' ? "Télécharger le fichier PDF" : "Upload PDF file",
        "text": locale === 'fr'
          ? "Glissez-déposez ou cliquez pour télécharger votre fichier PDF à compresser"
          : "Drag and drop or click to upload your PDF file to compress"
      },
      {
        "@type": "HowToStep",
        "name": locale === 'fr' ? "Choisir le niveau de compression" : "Select compression level",
        "text": locale === 'fr'
          ? "Choisissez entre compression standard, forte ou maximale selon vos besoins"
          : "Choose between standard, high, or maximum compression based on your needs"
      },
      {
        "@type": "HowToStep",
        "name": locale === 'fr' ? "Compresser et télécharger" : "Compress and download",
        "text": locale === 'fr'
          ? "Cliquez sur compresser et téléchargez votre PDF optimisé"
          : "Click compress and download your optimized PDF"
      }
    ]
  }

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": locale === 'fr' ? "Compresser PDF en Ligne" : "Compress PDF Online",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "3142"
    }
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": locale === 'fr' ? [
      {
        "@type": "Question",
        "name": "Comment compresser un PDF sans perte de qualité ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Notre outil offre plusieurs niveaux de compression. Utilisez la compression standard pour une réduction modérée tout en maintenant une excellente qualité visuelle. Pour les documents avec beaucoup d'images, la compression forte peut réduire significativement la taille sans perte notable."
        }
      },
      {
        "@type": "Question",
        "name": "Quelle est la réduction de taille moyenne ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "La réduction dépend du contenu de votre PDF. Les fichiers avec beaucoup d'images peuvent être réduits de 50-80%, tandis que les PDF principalement textuels peuvent voir une réduction de 20-40%."
        }
      },
      {
        "@type": "Question",
        "name": "Mes fichiers sont-ils en sécurité ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Oui, tous les fichiers sont traités localement dans votre navigateur. Vos documents ne sont jamais téléchargés sur nos serveurs, garantissant une confidentialité totale."
        }
      }
    ] : [
      {
        "@type": "Question",
        "name": "How to compress PDF without losing quality?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our tool offers multiple compression levels. Use standard compression for moderate reduction while maintaining excellent visual quality. For documents with many images, high compression can significantly reduce size without noticeable loss."
        }
      },
      {
        "@type": "Question",
        "name": "What is the average size reduction?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The reduction depends on your PDF content. Files with many images can be reduced by 50-80%, while text-heavy PDFs may see 20-40% reduction."
        }
      },
      {
        "@type": "Question",
        "name": "Are my files secure?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, all files are processed locally in your browser. Your documents are never uploaded to our servers, ensuring complete privacy."
        }
      }
    ]
  }

  return (
    <>
      {/* Structured Data */}
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
        <div className="absolute top-20 right-10 w-72 h-72 bg-green-500/5 dark:bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl" />

        <main className="container mx-auto px-4 py-8 sm:py-12 flex-1 relative z-10">
          {/* Hero Section with Tool Icon */}
          <div className="max-w-4xl mx-auto mb-8 sm:mb-12">
            <div className="flex flex-col items-center text-center gap-6">
              {/* Animated Icon */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl blur-2xl opacity-30 animate-pulse" />
                <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-2xl">
                  <Package className="h-10 w-10 sm:h-12 sm:w-12 text-white" strokeWidth={2.5} />
                </div>
              </div>

              {/* Title */}
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {locale === 'fr'
                    ? 'Compresser un PDF en Ligne'
                    : 'Compress PDF Files Online'}
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground max-w-2xl">
                  {locale === 'fr'
                    ? 'Réduisez la taille de vos fichiers PDF sans perte de qualité. 100% gratuit, sécurisé et privé.'
                    : 'Reduce PDF file size without losing quality. 100% free, secure, and private.'}
                </p>
              </div>
            </div>
          </div>

          {/* Main Tool Section */}
          <div className="max-w-5xl mx-auto mb-12">
              <div className="p-6 sm:p-8">
                <PDFCompressTool />
              </div>
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
                  title: locale === 'fr' ? 'Compressez' : 'Compress',
                  description: locale === 'fr'
                    ? 'Choisissez le niveau de compression adapté à vos besoins'
                    : 'Choose the compression level that fits your needs',
                  icon: '📦'
                },
                {
                  step: '3',
                  title: locale === 'fr' ? 'Téléchargez' : 'Download',
                  description: locale === 'fr'
                    ? 'Récupérez votre PDF optimisé instantanément'
                    : 'Get your optimized PDF instantly',
                  icon: '⬇️'
                }
              ].map((item) => (
                <Card key={item.step} className="relative p-6 text-center group hover:shadow-lg transition-all duration-300 hover:border-green-500/50">
                  <div className="absolute top-4 right-4 text-6xl font-bold text-muted-foreground/10 group-hover:text-green-500/20 transition-colors">
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
