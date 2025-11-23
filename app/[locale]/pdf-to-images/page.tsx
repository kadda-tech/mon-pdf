"use client"

import {useTranslations} from 'next-intl'
import {usePathname} from 'next/navigation'
import Script from 'next/script'
import {SiteFooter} from "@/components/site-footer"
import dynamic from 'next/dynamic'
import {ImageIcon} from "lucide-react"
import {Card} from "@/components/ui/card"

// Lazy load the PDFToImagesTool to avoid SSR issues with pdf.js
const PDFToImagesTool = dynamic(() => import("@/components/pdf-to-images-tool").then(mod => ({ default: mod.PDFToImagesTool })), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-4 border-pink-200 dark:border-pink-800 border-t-pink-600 dark:border-t-pink-400 animate-spin" />
          <ImageIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-pink-600 dark:text-pink-400" />
        </div>
        <p className="text-sm text-muted-foreground">Loading PDF to Images Converter...</p>
      </div>
    </div>
  )
})

export default function PDFToImagesPage() {
  const t = useTranslations()
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
      "name": locale === 'fr' ? "PDF vers Images" : "PDF to Images",
      "item": `https://mon-pdf.fr/${locale}/${locale === 'fr' ? 'pdf-to-images' : 'pdf-to-images'}`
    }]
  }

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": locale === 'fr' ? "Comment convertir un PDF en images" : "How to Convert PDF to Images",
    "description": locale === 'fr'
      ? "Guide étape par étape pour convertir un fichier PDF en images PNG ou JPG"
      : "Step-by-step guide to convert a PDF file to PNG or JPG images",
    "step": [
      {
        "@type": "HowToStep",
        "name": locale === 'fr' ? "Télécharger le PDF" : "Upload PDF",
        "text": locale === 'fr' ? "Glissez-déposez ou cliquez pour télécharger votre fichier PDF à convertir" : "Drag and drop or click to upload your PDF file to convert"
      },
      {
        "@type": "HowToStep",
        "name": locale === 'fr' ? "Choisir le format" : "Choose format",
        "text": locale === 'fr' ? "Sélectionnez PNG ou JPG selon vos besoins" : "Select PNG or JPG according to your needs"
      },
      {
        "@type": "HowToStep",
        "name": locale === 'fr' ? "Télécharger les images" : "Download images",
        "text": locale === 'fr' ? "Cliquez sur le bouton télécharger et obtenez toutes vos images" : "Click the download button and get all your images"
      }
    ]
  }

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": locale === 'fr' ? "Convertir PDF en Images" : "Convert PDF to Images",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": locale === 'fr' ? [
      {
        "@type": "Question",
        "name": "Comment convertir un PDF en images ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Téléchargez votre PDF, choisissez le format (PNG ou JPG), et notre outil convertira chaque page en image haute qualité que vous pourrez télécharger."
        }
      },
      {
        "@type": "Question",
        "name": "Quel format d'image choisir ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "PNG pour la meilleure qualité et transparence, JPG pour des fichiers plus petits. PNG est idéal pour les documents avec texte, JPG pour les photos."
        }
      }
    ] : [
      {
        "@type": "Question",
        "name": "How to convert PDF to images?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Upload your PDF, choose the format (PNG or JPG), and our tool will convert each page to high-quality images you can download."
        }
      },
      {
        "@type": "Question",
        "name": "Which image format to choose?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "PNG for best quality and transparency, JPG for smaller files. PNG is ideal for documents with text, JPG for photos."
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
        <div className="absolute top-20 right-10 w-72 h-72 bg-pink-500/5 dark:bg-pink-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-rose-500/5 dark:bg-rose-500/10 rounded-full blur-3xl" />

        <main className="container mx-auto px-4 py-8 sm:py-12 flex-1 relative z-10">
          {/* Hero Section with Tool Icon */}
          <div className="max-w-4xl mx-auto mb-8 sm:mb-12">
            <div className="flex flex-col items-center text-center gap-6">
              {/* Animated Icon */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-rose-500 rounded-3xl blur-2xl opacity-30 animate-pulse" />
                <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-pink-500 to-rose-500 shadow-2xl">
                  <ImageIcon className="h-10 w-10 sm:h-12 sm:w-12 text-white" strokeWidth={2.5} />
                </div>
              </div>

              {/* Title */}
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                  {locale === 'fr'
                    ? 'Convertir PDF en Images'
                    : 'Convert PDF to Images'}
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground max-w-2xl">
                  {locale === 'fr'
                    ? 'Extraire toutes les pages PDF en images haute qualité. Choisissez PNG ou JPG en quelques secondes.'
                    : 'Extract all PDF pages to high-quality images. Choose PNG or JPG in seconds.'}
                </p>
              </div>
            </div>
          </div>

          {/* Main Tool Section */}
          <div className="max-w-5xl mx-auto mb-12">
              <div className="p-6 sm:p-8">
                <PDFToImagesTool />
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
                  title: locale === 'fr' ? 'Choisissez' : 'Choose',
                  description: locale === 'fr'
                    ? 'Sélectionnez le format PNG ou JPG selon vos besoins'
                    : 'Select PNG or JPG format according to your needs',
                  icon: '🖼️'
                },
                {
                  step: '3',
                  title: locale === 'fr' ? 'Téléchargez' : 'Download',
                  description: locale === 'fr'
                    ? 'Récupérez vos images converties instantanément'
                    : 'Get your converted images instantly',
                  icon: '⬇️'
                }
              ].map((item) => (
                <Card key={item.step} className="relative p-6 text-center group hover:shadow-lg transition-all duration-300 hover:border-pink-500/50">
                  <div className="absolute top-4 right-4 text-6xl font-bold text-muted-foreground/10 group-hover:text-pink-500/20 transition-colors">
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
