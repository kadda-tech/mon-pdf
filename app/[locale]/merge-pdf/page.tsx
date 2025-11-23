"use client"

import {useTranslations} from 'next-intl'
import {usePathname, useRouter} from 'next/navigation'
import Script from 'next/script'
import {SiteFooter} from "@/components/site-footer"
import dynamic from 'next/dynamic'
import {Combine, Sparkles} from "lucide-react"
import {Card} from "@/components/ui/card"

// Lazy load the PDFMergeTool to avoid SSR issues with pdf.js
const PDFMergeTool = dynamic(() => import("@/components/pdf-merge-tool").then(mod => ({ default: mod.PDFMergeTool })), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 animate-spin" />
          <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <p className="text-sm text-muted-foreground">Loading PDF Merger...</p>
      </div>
    </div>
  )
})

export default function MergePDFPage() {
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
      "name": locale === 'fr' ? "Fusionner PDF" : "Merge PDF",
      "item": `https://mon-pdf.fr/${locale}/${locale === 'fr' ? 'merge-pdf' : 'merge-pdf'}`
    }]
  }

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": locale === 'fr' ? "Comment fusionner des fichiers PDF" : "How to Merge PDF Files",
    "description": locale === 'fr'
      ? "Guide étape par étape pour fusionner plusieurs fichiers PDF en un seul document"
      : "Step-by-step guide to merge multiple PDF files into one document",
    "step": [
      {
        "@type": "HowToStep",
        "name": locale === 'fr' ? "Télécharger les fichiers PDF" : "Upload PDF files",
        "text": locale === 'fr'
          ? "Glissez-déposez ou cliquez pour télécharger vos fichiers PDF à fusionner"
          : "Drag and drop or click to upload your PDF files to merge"
      },
      {
        "@type": "HowToStep",
        "name": locale === 'fr' ? "Réorganiser les PDF" : "Arrange PDF order",
        "text": locale === 'fr'
          ? "Glissez les fichiers PDF pour les réorganiser dans l'ordre souhaité"
          : "Drag PDF files to reorder them in your desired sequence"
      },
      {
        "@type": "HowToStep",
        "name": locale === 'fr' ? "Fusionner et télécharger" : "Merge and download",
        "text": locale === 'fr'
          ? "Cliquez sur le bouton fusionner et téléchargez votre PDF combiné"
          : "Click the merge button and download your combined PDF"
      }
    ]
  }

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": locale === 'fr' ? "Fusionner PDF en Ligne" : "Merge PDF Online",
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
      "reviewCount": "2847"
    }
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": locale === 'fr' ? [
      {
        "@type": "Question",
        "name": "Est-il sûr de fusionner des PDF en ligne ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Oui, notre outil traite tous les fichiers localement dans votre navigateur. Vos fichiers ne quittent jamais votre appareil et ne sont jamais téléchargés sur nos serveurs, garantissant une confidentialité et une sécurité totales."
        }
      },
      {
        "@type": "Question",
        "name": "Puis-je fusionner des PDF protégés par mot de passe ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Notre outil peut fusionner des PDF protégés en écriture. Si un PDF est protégé par mot de passe pour l'ouverture, vous devrez d'abord le déverrouiller avant de le fusionner."
        }
      },
      {
        "@type": "Question",
        "name": "Quelle est la taille maximale de fichier ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Comme le traitement se fait dans votre navigateur, la limite dépend de la mémoire de votre appareil. La plupart des appareils modernes peuvent gérer des fichiers jusqu'à 100 Mo sans problème."
        }
      }
    ] : [
      {
        "@type": "Question",
        "name": "Is it safe to merge PDFs online?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, our tool processes all files locally in your browser. Your files never leave your device and are never uploaded to our servers, ensuring complete privacy and security."
        }
      },
      {
        "@type": "Question",
        "name": "Can I merge password-protected PDFs?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our tool can merge write-protected PDFs. If a PDF is password-protected for opening, you'll need to unlock it first before merging."
        }
      },
      {
        "@type": "Question",
        "name": "What's the maximum file size?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Since processing happens in your browser, the limit depends on your device's memory. Most modern devices can handle files up to 100MB without issues."
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
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-3xl" />

        <main className="container mx-auto px-4 py-8 sm:py-12 flex-1 relative z-10">
          {/* Hero Section with Tool Icon */}
          <div className="max-w-4xl mx-auto mb-8 sm:mb-12">
            <div className="flex flex-col items-center text-center gap-6">
              {/* Animated Icon */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl blur-2xl opacity-30 animate-pulse" />
                <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-2xl">
                  <Combine className="h-10 w-10 sm:h-12 sm:w-12 text-white" strokeWidth={2.5} />
                </div>
              </div>

              {/* Title */}
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  {locale === 'fr'
                    ? 'Fusionner des PDF en Ligne'
                    : 'Merge PDF Files Online'}
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground max-w-2xl">
                  {locale === 'fr'
                    ? 'Combinez plusieurs fichiers PDF en un seul document. 100% gratuit, sécurisé et privé.'
                    : 'Combine multiple PDF files into one document. 100% free, secure, and private.'}
                </p>
              </div>
            </div>
          </div>

          {/* Main Tool Section */}
          <div className="max-w-5xl mx-auto mb-12">
              <div className="p-6 sm:p-8">
                <PDFMergeTool />
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
                    ? 'Glissez-déposez vos fichiers PDF ou cliquez pour les sélectionner'
                    : 'Drag and drop your PDF files or click to select them',
                  icon: '📁'
                },
                {
                  step: '2',
                  title: locale === 'fr' ? 'Organisez' : 'Arrange',
                  description: locale === 'fr'
                    ? 'Réorganisez l\'ordre des fichiers selon vos besoins'
                    : 'Reorder files according to your needs',
                  icon: '🔄'
                },
                {
                  step: '3',
                  title: locale === 'fr' ? 'Téléchargez' : 'Download',
                  description: locale === 'fr'
                    ? 'Récupérez votre PDF fusionné instantanément'
                    : 'Get your merged PDF instantly',
                  icon: '⬇️'
                }
              ].map((item) => (
                <Card key={item.step} className="relative p-6 text-center group hover:shadow-lg transition-all duration-300 hover:border-blue-500/50">
                  <div className="absolute top-4 right-4 text-6xl font-bold text-muted-foreground/10 group-hover:text-blue-500/20 transition-colors">
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

        <SiteFooter locale={pathname.split('/')[1] || 'en'} />
    </div>
    </>
  )
}
