"use client"

import {useTranslations} from 'next-intl'
import {usePathname} from 'next/navigation'
import Script from 'next/script'
import {SiteFooter} from "@/components/site-footer"
import {PageNumberingTool} from "@/components/page-numbering-tool"
import {Hash} from "lucide-react"
import {Card} from "@/components/ui/card"

export default function PageNumberingPage() {
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
      "name": locale === 'fr' ? "Numéroter PDF" : "Number PDF",
      "item": `https://mon-pdf.fr/${locale}/${locale === 'fr' ? 'page-numbering' : 'page-numbering'}`
    }]
  }

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": locale === 'fr' ? "Comment ajouter des numéros de page à un PDF" : "How to Add Page Numbers to PDF",
    "description": locale === 'fr'
      ? "Guide étape par étape pour numéroter les pages d'un fichier PDF"
      : "Step-by-step guide to add page numbers to PDF",
    "step": [
      {
        "@type": "HowToStep",
        "name": locale === 'fr' ? "Télécharger le fichier PDF" : "Upload PDF file",
        "text": locale === 'fr'
          ? "Glissez-déposez ou cliquez pour télécharger votre fichier PDF"
          : "Drag and drop or click to upload your PDF file"
      },
      {
        "@type": "HowToStep",
        "name": locale === 'fr' ? "Personnaliser la numérotation" : "Customize numbering",
        "text": locale === 'fr'
          ? "Choisissez la position, le format et le style des numéros de page"
          : "Choose position, format, and style of page numbers"
      },
      {
        "@type": "HowToStep",
        "name": locale === 'fr' ? "Télécharger le PDF numéroté" : "Download numbered PDF",
        "text": locale === 'fr'
          ? "Cliquez sur télécharger pour obtenir votre PDF avec numéros de page"
          : "Click download to get your PDF with page numbers"
      }
    ]
  }

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": locale === 'fr' ? "Numéroter PDF en Ligne" : "Number PDF Online",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.6",
      "reviewCount": "1289"
    }
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": locale === 'fr' ? [
      {
        "@type": "Question",
        "name": "Comment ajouter des numéros de page à un PDF ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Téléchargez votre PDF, choisissez la position et le format des numéros (1, 2, 3 ou i, ii, iii), puis téléchargez le PDF numéroté. Notre outil ajoute automatiquement les numéros à toutes les pages."
        }
      },
      {
        "@type": "Question",
        "name": "Puis-je utiliser des chiffres romains ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Oui, notre outil prend en charge les chiffres arabes (1, 2, 3) et les chiffres romains (i, ii, iii ou I, II, III) pour la numérotation des pages."
        }
      },
      {
        "@type": "Question",
        "name": "Puis-je choisir où placer les numéros ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Oui, vous pouvez placer les numéros en haut ou en bas de la page, alignés à gauche, au centre ou à droite."
        }
      }
    ] : [
      {
        "@type": "Question",
        "name": "How do I add page numbers to a PDF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Upload your PDF, choose the position and format of numbers (1, 2, 3 or i, ii, iii), then download the numbered PDF. Our tool automatically adds numbers to all pages."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use Roman numerals?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, our tool supports both Arabic numerals (1, 2, 3) and Roman numerals (i, ii, iii or I, II, III) for page numbering."
        }
      },
      {
        "@type": "Question",
        "name": "Can I choose where to place the numbers?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, you can place numbers at the top or bottom of the page, aligned left, center, or right."
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
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl" />

        <main className="container mx-auto px-4 py-8 sm:py-12 flex-1 relative z-10">
          {/* Hero Section with Tool Icon */}
          <div className="max-w-4xl mx-auto mb-8 sm:mb-12">
            <div className="flex flex-col items-center text-center gap-6">
              {/* Animated Icon */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-3xl blur-2xl opacity-30 animate-pulse" />
                <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-500 shadow-2xl">
                  <Hash className="h-10 w-10 sm:h-12 sm:w-12 text-white" strokeWidth={2.5} />
                </div>
              </div>

              {/* Title */}
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {locale === 'fr'
                    ? 'Numéroter un PDF en Ligne'
                    : 'Number PDF Pages Online'}
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground max-w-2xl">
                  {locale === 'fr'
                    ? 'Ajoutez des numéros de page à vos PDF avec position et format personnalisés. 100% gratuit, sécurisé et privé.'
                    : 'Add page numbers to your PDFs with custom position and format. 100% free, secure, and private.'}
                </p>
              </div>

            </div>
          </div>

          {/* Main Tool Section */}
          <div className="max-w-5xl mx-auto mb-12">
              <div className="p-6 sm:p-8">
                <PageNumberingTool />
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
                  title: locale === 'fr' ? 'Personnalisez' : 'Customize',
                  description: locale === 'fr'
                    ? 'Choisissez la position, le format et le style des numéros'
                    : 'Choose position, format, and style of numbers',
                  icon: '⚙️'
                },
                {
                  step: '3',
                  title: locale === 'fr' ? 'Téléchargez' : 'Download',
                  description: locale === 'fr'
                    ? 'Récupérez votre PDF numéroté instantanément'
                    : 'Get your numbered PDF instantly',
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

        <SiteFooter locale={locale} />
      </div>
    </>
  )
}
