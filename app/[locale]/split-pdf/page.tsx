"use client"

import {useTranslations} from 'next-intl'
import {usePathname} from 'next/navigation'
import Link from 'next/link'
import Script from 'next/script'
import {SiteFooter} from "@/components/site-footer"
import dynamic from 'next/dynamic'
import {Scissors, Sparkles, Zap, Shield, Clock} from "lucide-react"
import {Card} from "@/components/ui/card"

// Lazy load the PDFSplitTool to avoid SSR issues with pdf.js
const PDFSplitTool = dynamic(() => import("@/components/pdf-split-tool").then(mod => ({ default: mod.PDFSplitTool })), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-4 border-purple-200 dark:border-purple-800 border-t-purple-600 dark:border-t-purple-400 animate-spin" />
          <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-purple-600 dark:text-purple-400" />
        </div>
        <p className="text-sm text-muted-foreground">Loading PDF Splitter...</p>
      </div>
    </div>
  )
})

export default function SplitPDFPage() {
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
      "name": locale === 'fr' ? "Diviser PDF" : "Split PDF",
      "item": `https://mon-pdf.fr/${locale}/split-pdf`
    }]
  }

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": locale === 'fr' ? "Comment diviser un fichier PDF" : "How to Split a PDF File",
    "description": locale === 'fr'
      ? "Guide étape par étape pour diviser un fichier PDF en plusieurs documents"
      : "Step-by-step guide to split a PDF file into multiple documents",
    "step": [
      {
        "@type": "HowToStep",
        "name": locale === 'fr' ? "Télécharger le fichier PDF" : "Upload PDF file",
        "text": locale === 'fr'
          ? "Glissez-déposez ou cliquez pour télécharger votre fichier PDF à diviser"
          : "Drag and drop or click to upload your PDF file to split"
      },
      {
        "@type": "HowToStep",
        "name": locale === 'fr' ? "Choisir les pages" : "Select pages",
        "text": locale === 'fr'
          ? "Sélectionnez les pages que vous souhaitez extraire ou séparer"
          : "Select the pages you want to extract or separate"
      },
      {
        "@type": "HowToStep",
        "name": locale === 'fr' ? "Diviser et télécharger" : "Split and download",
        "text": locale === 'fr'
          ? "Cliquez sur le bouton diviser et téléchargez vos fichiers PDF séparés"
          : "Click the split button and download your separated PDF files"
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

      <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-pink-500/5 dark:bg-pink-500/10 rounded-full blur-3xl" />

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
                <Scissors className="h-4 w-4 text-purple-600" />
                {locale === 'fr' ? 'Diviser PDF' : 'Split PDF'}
              </li>
            </ol>
          </nav>

          {/* Hero Section with Tool Icon */}
          <div className="max-w-4xl mx-auto mb-8 sm:mb-12">
            <div className="flex flex-col items-center text-center gap-6">
              {/* Animated Icon */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-30 animate-pulse" />
                <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-2xl">
                  <Scissors className="h-10 w-10 sm:h-12 sm:w-12 text-white" strokeWidth={2.5} />
                </div>
              </div>

              {/* Title */}
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {locale === 'fr'
                    ? 'Diviser un PDF en Ligne'
                    : 'Split PDF Files Online'}
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground max-w-2xl">
                  {locale === 'fr'
                    ? 'Séparez vos PDF en quelques secondes. Extrayez des pages spécifiques ou divisez votre document en plusieurs fichiers.'
                    : 'Separate your PDFs in seconds. Extract specific pages or split your document into multiple files.'}
                </p>
              </div>

              {/* Feature Pills */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <div className="flex items-center gap-2 rounded-full bg-purple-500/10 border border-purple-500/20 px-4 py-2">
                  <Zap className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
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
            <Card className="border-2 border-border/50 shadow-2xl shadow-purple-500/10 dark:shadow-purple-500/5 bg-gradient-to-br from-background to-muted/20">
              <div className="p-6 sm:p-8">
                <PDFSplitTool />
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
                  title: locale === 'fr' ? 'Sélectionnez' : 'Select',
                  description: locale === 'fr'
                    ? 'Choisissez les pages que vous souhaitez extraire'
                    : 'Choose the pages you want to extract',
                  icon: '✂️'
                },
                {
                  step: '3',
                  title: locale === 'fr' ? 'Téléchargez' : 'Download',
                  description: locale === 'fr'
                    ? 'Récupérez votre PDF divisé instantanément'
                    : 'Get your split PDF instantly',
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
