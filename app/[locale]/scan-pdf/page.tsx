"use client"

import {useTranslations} from 'next-intl'
import {PDFScannerToolClient} from "@/components/pdf-scanner-tool-client"
import {usePathname, useRouter} from 'next/navigation'
import Link from 'next/link'
import Script from 'next/script'
import {SiteFooter} from "@/components/site-footer"
import {Clock, Scan, Shield, Zap} from "lucide-react"
import {Card} from "@/components/ui/card"

export default function ScanPDFPage() {
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
      "name": locale === 'fr' ? "Scanner PDF" : "Scan PDF",
      "item": `https://mon-pdf.fr/${locale}/${locale === 'fr' ? 'scan-pdf' : 'scan-pdf'}`
    }]
  }

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": locale === 'fr' ? "Comment scanner un document en PDF" : "How to Scan a Document to PDF",
    "step": [
      {
        "@type": "HowToStep",
        "name": locale === 'fr' ? "Activer la caméra" : "Enable camera",
        "text": locale === 'fr' ? "Autorisez l'accès à votre webcam ou caméra mobile" : "Allow access to your webcam or mobile camera"
      },
      {
        "@type": "HowToStep",
        "name": locale === 'fr' ? "Scanner le document" : "Scan document",
        "text": locale === 'fr' ? "Capturez des photos de votre document" : "Capture photos of your document"
      },
      {
        "@type": "HowToStep",
        "name": locale === 'fr' ? "Télécharger le PDF" : "Download PDF",
        "text": locale === 'fr' ? "Téléchargez le PDF généré" : "Download the generated PDF"
      }
    ]
  }

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": locale === 'fr' ? "Scanner PDF en Ligne" : "Scan PDF Online",
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
        "name": "Comment scanner un document en PDF ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Autorisez l'accès à votre caméra, capturez des photos de votre document, et notre outil les convertira automatiquement en un PDF de qualité que vous pourrez télécharger."
        }
      },
      {
        "@type": "Question",
        "name": "Puis-je scanner avec mon téléphone ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Oui, notre scanner fonctionne parfaitement sur mobile. Utilisez la caméra de votre téléphone pour scanner des documents et créer des PDF directement depuis votre navigateur."
        }
      },
      {
        "@type": "Question",
        "name": "Le scanner est-il sécurisé ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Oui, tout le traitement est effectué localement dans votre navigateur. Vos documents scannés ne sont jamais envoyés à un serveur, garantissant une confidentialité totale."
        }
      }
    ] : [
      {
        "@type": "Question",
        "name": "How to scan a document to PDF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Allow camera access, capture photos of your document, and our tool will automatically convert them into a quality PDF you can download."
        }
      },
      {
        "@type": "Question",
        "name": "Can I scan with my phone?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, our scanner works perfectly on mobile. Use your phone's camera to scan documents and create PDFs directly from your browser."
        }
      },
      {
        "@type": "Question",
        "name": "Is the scanner secure?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, all processing is done locally in your browser. Your scanned documents are never sent to a server, ensuring complete privacy."
        }
      }
    ]
  }

  return (
    <>
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
                <Scan className="h-4 w-4 text-teal-600" />
                {locale === 'fr' ? 'Scanner PDF' : 'Scan PDF'}
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
                  <Scan className="h-10 w-10 sm:h-12 sm:w-12 text-white" strokeWidth={2.5} />
                </div>
              </div>

              {/* Title */}
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  {locale === 'fr'
                    ? 'Scanner PDF en Ligne - Numériser Document vers PDF Gratuit'
                    : 'Scan PDF Online - Digitize Document to PDF Free'}
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground max-w-2xl">
                  {locale === 'fr'
                    ? 'Utilisez votre caméra pour scanner des documents en PDF. Rapide, gratuit et sécurisé.'
                    : 'Use your camera to scan documents to PDF. Fast, free and secure.'}
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
                <div className="flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-500/20 px-4 py-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
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
                <PDFScannerToolClient />
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
                  title: locale === 'fr' ? 'Activez la caméra' : 'Enable Camera',
                  description: locale === 'fr'
                    ? 'Autorisez l\'accès à votre webcam ou caméra mobile'
                    : 'Allow access to your webcam or mobile camera',
                  icon: '📷'
                },
                {
                  step: '2',
                  title: locale === 'fr' ? 'Scannez' : 'Scan',
                  description: locale === 'fr'
                    ? 'Capturez des photos claires de votre document'
                    : 'Capture clear photos of your document',
                  icon: '📄'
                },
                {
                  step: '3',
                  title: locale === 'fr' ? 'Téléchargez' : 'Download',
                  description: locale === 'fr'
                    ? 'Récupérez votre PDF scanné instantanément'
                    : 'Get your scanned PDF instantly',
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
