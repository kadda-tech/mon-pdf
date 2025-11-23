"use client"

import {useTranslations} from 'next-intl'
import {usePathname} from 'next/navigation'
import Script from 'next/script'
import {SiteFooter} from "@/components/site-footer"
import dynamic from 'next/dynamic'
import {FileType} from "lucide-react"
import {Card} from "@/components/ui/card"

// Lazy load the PDFToWordTool to avoid SSR issues with pdf.js
const PDFToWordTool = dynamic(() => import("@/components/pdf-to-word-tool").then(mod => ({ default: mod.PDFToWordTool })), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-4 border-purple-200 dark:border-purple-800 border-t-purple-600 dark:border-t-purple-400 animate-spin" />
          <FileType className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-purple-600 dark:text-purple-400" />
        </div>
        <p className="text-sm text-muted-foreground">Loading PDF to Word Converter...</p>
      </div>
    </div>
  )
})

export default function PDFToWordPage() {
  const t = useTranslations()
  const pathname = usePathname()
  const locale = pathname.split('/')[1] || 'en'

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
      "name": locale === 'fr' ? "PDF vers Word" : "PDF to Word",
      "item": `https://mon-pdf.fr/${locale}/${locale === 'fr' ? 'pdf-to-word' : 'pdf-to-word'}`
    }]
  }

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": locale === 'fr' ? "Comment convertir un PDF en Word" : "How to Convert PDF to Word",
    "description": locale === 'fr'
      ? "Guide étape par étape pour convertir un fichier PDF en document Word"
      : "Step-by-step guide to convert a PDF file to Word document",
    "step": [
      {
        "@type": "HowToStep",
        "name": locale === 'fr' ? "Télécharger le PDF" : "Upload PDF",
        "text": locale === 'fr' ? "Téléchargez le fichier PDF à convertir" : "Upload the PDF file to convert"
      },
      {
        "@type": "HowToStep",
        "name": locale === 'fr' ? "Convertir" : "Convert",
        "text": locale === 'fr' ? "Cliquez sur convertir pour extraire le texte" : "Click convert to extract the text"
      },
      {
        "@type": "HowToStep",
        "name": locale === 'fr' ? "Télécharger Word" : "Download Word",
        "text": locale === 'fr' ? "Téléchargez le fichier DOCX" : "Download the DOCX file"
      }
    ]
  }

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": locale === 'fr' ? "Convertir PDF en Word" : "Convert PDF to Word",
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
        "name": "Comment convertir un PDF en Word ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Téléchargez votre PDF, cliquez sur 'Convertir en Word', et notre outil extraira le texte pour créer un document Word éditable que vous pourrez télécharger."
        }
      },
      {
        "@type": "Question",
        "name": "Le formatage est-il préservé ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Le texte et la structure de base sont préservés. Les mises en page complexes (tableaux, colonnes) peuvent nécessiter des ajustements manuels."
        }
      },
      {
        "@type": "Question",
        "name": "Puis-je éditer le document Word après conversion ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Oui, le fichier DOCX généré est entièrement éditable dans Microsoft Word, Google Docs, ou tout autre traitement de texte compatible."
        }
      }
    ] : [
      {
        "@type": "Question",
        "name": "How to convert PDF to Word?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Upload your PDF, click 'Convert to Word', and our tool will extract the text to create an editable Word document you can download."
        }
      },
      {
        "@type": "Question",
        "name": "Is formatting preserved?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Text and basic structure are preserved. Complex layouts (tables, columns) may require manual adjustments."
        }
      },
      {
        "@type": "Question",
        "name": "Can I edit the Word document after conversion?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, the generated DOCX file is fully editable in Microsoft Word, Google Docs, or any compatible word processor."
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
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-violet-500/5 dark:bg-violet-500/10 rounded-full blur-3xl" />

        <main className="container mx-auto px-4 py-8 sm:py-12 flex-1 relative z-10">
          {/* Hero Section with Tool Icon */}
          <div className="max-w-4xl mx-auto mb-8 sm:mb-12">
            <div className="flex flex-col items-center text-center gap-6">
              {/* Animated Icon */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-violet-500 rounded-3xl blur-2xl opacity-30 animate-pulse" />
                <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-purple-500 to-violet-500 shadow-2xl">
                  <FileType className="h-10 w-10 sm:h-12 sm:w-12 text-white" strokeWidth={2.5} />
                </div>
              </div>

              {/* Title */}
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                  {locale === 'fr'
                    ? 'Convertir PDF en Word'
                    : 'Convert PDF to Word'}
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground max-w-2xl">
                  {locale === 'fr'
                    ? 'Transformez vos PDF en documents Word éditables en quelques secondes. Extraction de texte rapide et gratuite.'
                    : 'Transform your PDFs into editable Word documents in seconds. Fast and free text extraction.'}
                </p>
              </div>
            </div>
          </div>

          {/* Main Tool Section */}
          <div className="max-w-5xl mx-auto mb-12">
              <div className="p-6 sm:p-8">
                <PDFToWordTool />
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
                  title: locale === 'fr' ? 'Convertissez' : 'Convert',
                  description: locale === 'fr'
                    ? 'Cliquez sur convertir pour extraire le texte et créer le document Word'
                    : 'Click convert to extract text and create the Word document',
                  icon: '⚡'
                },
                {
                  step: '3',
                  title: locale === 'fr' ? 'Téléchargez' : 'Download',
                  description: locale === 'fr'
                    ? 'Récupérez votre document Word éditable instantanément'
                    : 'Get your editable Word document instantly',
                  icon: '⬇️'
                }
              ].map((item) => (
                <Card key={item.step} className="relative p-6 text-center group hover:shadow-lg transition-all duration-300 hover:border-purple-500/50">
                  <div className="absolute top-4 right-4 text-6xl font-bold text-muted-foreground/10 group-hover:text-purple-500/20 transition-colors">
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
