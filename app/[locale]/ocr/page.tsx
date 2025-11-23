"use client"

import {useTranslations} from 'next-intl'
import {PDFOCRTool} from "@/components/ocr/pdf-ocr-tool"
import {usePathname, useRouter} from 'next/navigation'
import Script from 'next/script'
import {SiteFooter} from "@/components/site-footer"
import {FileText} from "lucide-react"
import {Card} from "@/components/ui/card"

export default function OCRPage() {
  const t = useTranslations()
  const router = useRouter()
  const pathname = usePathname()
  const locale = pathname.split('/')[1] || 'en'

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Mon PDF",
    "url": "https://mon-pdf.fr",
    "logo": "https://mon-pdf.fr/logo.png"
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
      "name": "OCR PDF",
      "item": `https://mon-pdf.fr/${locale}/ocr`
    }]
  }

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": locale === 'fr' ? "Comment extraire du texte d'un PDF scanné avec OCR" : "How to Extract Text from Scanned PDF with OCR",
    "step": [
      {
        "@type": "HowToStep",
        "name": locale === 'fr' ? "Télécharger le PDF" : "Upload PDF",
        "text": locale === 'fr' ? "Téléchargez le fichier PDF scanné" : "Upload the scanned PDF file"
      },
      {
        "@type": "HowToStep",
        "name": locale === 'fr' ? "Lancer l'OCR" : "Start OCR",
        "text": locale === 'fr' ? "L'OCR analyse automatiquement le document" : "OCR automatically analyzes the document"
      },
      {
        "@type": "HowToStep",
        "name": locale === 'fr' ? "Copier le texte" : "Copy text",
        "text": locale === 'fr' ? "Copiez ou téléchargez le texte extrait" : "Copy or download the extracted text"
      }
    ]
  }

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": locale === 'fr' ? "OCR PDF en Ligne" : "Online PDF OCR",
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
        "name": "Qu'est-ce que l'OCR PDF ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "L'OCR (Reconnaissance Optique de Caractères) est une technologie qui extrait le texte des images et PDF scannés. Notre outil analyse votre PDF et convertit les images de texte en texte modifiable et copiable."
        }
      },
      {
        "@type": "Question",
        "name": "L'OCR fonctionne-t-il sur tous les PDF ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Notre OCR fonctionne sur les PDF scannés, images de documents, et photos de texte. La qualité du résultat dépend de la clarté du document original. Les documents nets et bien éclairés donnent les meilleurs résultats."
        }
      },
      {
        "@type": "Question",
        "name": "Puis-je détecter des tableaux avec l'OCR ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Oui, notre outil OCR peut détecter et extraire les tableaux des PDF. Il préserve la structure en colonnes et lignes pour faciliter l'utilisation des données dans Excel ou d'autres applications."
        }
      }
    ] : [
      {
        "@type": "Question",
        "name": "What is PDF OCR?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "OCR (Optical Character Recognition) is a technology that extracts text from images and scanned PDFs. Our tool analyzes your PDF and converts text images into editable and copyable text."
        }
      },
      {
        "@type": "Question",
        "name": "Does OCR work on all PDFs?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our OCR works on scanned PDFs, document images, and text photos. Result quality depends on the original document's clarity. Clear, well-lit documents give the best results."
        }
      },
      {
        "@type": "Question",
        "name": "Can I detect tables with OCR?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, our OCR tool can detect and extract tables from PDFs. It preserves column and row structure to make data easier to use in Excel or other applications."
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
        <div className="absolute top-20 right-10 w-72 h-72 bg-orange-500/5 dark:bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-amber-500/5 dark:bg-amber-500/10 rounded-full blur-3xl" />

        <main className="container mx-auto px-4 py-8 sm:py-12 flex-1 relative z-10">
          {/* Hero Section with Tool Icon */}
          <div className="max-w-4xl mx-auto mb-8 sm:mb-12">
            <div className="flex flex-col items-center text-center gap-6">
              {/* Animated Icon */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-amber-500 rounded-3xl blur-2xl opacity-30 animate-pulse" />
                <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-2xl">
                  <FileText className="h-10 w-10 sm:h-12 sm:w-12 text-white" strokeWidth={2.5} />
                </div>
              </div>

              {/* Title */}
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  {locale === 'fr'
                    ? 'OCR PDF Gratuit - Extraire Texte'
                    : 'OCR PDF Free - Extract Text'}
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground max-w-2xl">
                  {locale === 'fr'
                    ? 'Reconnaissance optique de caractères. Convertissez PDF scanné en texte modifiable en quelques secondes.'
                    : 'Optical character recognition. Convert scanned PDF to editable text in seconds.'}
                </p>
              </div>
            </div>
          </div>

          {/* Main Tool Section */}
          <div className="max-w-5xl mx-auto mb-12">
              <div className="p-6 sm:p-8">
                <PDFOCRTool />
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
                    ? 'Glissez-déposez votre PDF scanné ou image'
                    : 'Drag and drop your scanned PDF or image',
                  icon: '📄'
                },
                {
                  step: '2',
                  title: locale === 'fr' ? 'Analysez' : 'Analyze',
                  description: locale === 'fr'
                    ? 'L\'IA reconnaît automatiquement le texte'
                    : 'AI automatically recognizes the text',
                  icon: '🔍'
                },
                {
                  step: '3',
                  title: locale === 'fr' ? 'Copiez' : 'Copy',
                  description: locale === 'fr'
                    ? 'Récupérez votre texte modifiable instantanément'
                    : 'Get your editable text instantly',
                  icon: '📋'
                }
              ].map((item) => (
                <Card key={item.step} className="relative p-6 text-center group hover:shadow-lg transition-all duration-300 hover:border-orange-500/50">
                  <div className="absolute top-4 right-4 text-6xl font-bold text-muted-foreground/10 group-hover:text-orange-500/20 transition-colors">
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
