"use client"

import {useTranslations} from 'next-intl'
import {ImageToPDFTool} from "@/components/image-to-pdf-tool"
import {usePathname, useRouter} from 'next/navigation'
import Script from 'next/script'
import {SiteFooter} from "@/components/site-footer"
import {FileImage} from "lucide-react"
import {Card} from "@/components/ui/card"

export default function ImageToPDFPage() {
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
      "name": locale === 'fr' ? "Image vers PDF" : "Image to PDF",
      "item": `https://mon-pdf.fr/${locale}/image-to-pdf`
    }]
  }

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": locale === 'fr' ? "Comment convertir des images en PDF" : "How to Convert Images to PDF",
    "step": [
      {
        "@type": "HowToStep",
        "name": locale === 'fr' ? "Télécharger les images" : "Upload images",
        "text": locale === 'fr' ? "Téléchargez les fichiers images à convertir en PDF" : "Upload the image files to convert to PDF"
      },
      {
        "@type": "HowToStep",
        "name": locale === 'fr' ? "Organiser les images" : "Arrange images",
        "text": locale === 'fr' ? "Réorganisez l'ordre des images si nécessaire" : "Rearrange the image order if needed"
      },
      {
        "@type": "HowToStep",
        "name": locale === 'fr' ? "Télécharger le PDF" : "Download PDF",
        "text": locale === 'fr' ? "Téléchargez votre PDF créé" : "Download your created PDF"
      }
    ]
  }

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": locale === 'fr' ? "Convertir Images en PDF" : "Convert Images to PDF",
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
        "name": "Comment convertir des images en PDF ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Téléchargez vos images (JPG, PNG, etc.), organisez-les dans l'ordre souhaité, et notre outil les combinera en un seul fichier PDF que vous pourrez télécharger."
        }
      },
      {
        "@type": "Question",
        "name": "Puis-je convertir plusieurs images en un seul PDF ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Oui, vous pouvez télécharger autant d'images que vous le souhaitez et les combiner en un seul document PDF. Organisez-les simplement dans l'ordre désiré avant la conversion."
        }
      },
      {
        "@type": "Question",
        "name": "Quels formats d'image sont supportés ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Notre outil supporte tous les formats d'image courants : JPG, JPEG, PNG, GIF, BMP, TIFF, WEBP et plus encore. La qualité de l'image est préservée lors de la conversion."
        }
      }
    ] : [
      {
        "@type": "Question",
        "name": "How to convert images to PDF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Upload your images (JPG, PNG, etc.), arrange them in the desired order, and our tool will combine them into a single PDF file you can download."
        }
      },
      {
        "@type": "Question",
        "name": "Can I convert multiple images to one PDF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, you can upload as many images as you want and combine them into a single PDF document. Simply arrange them in the desired order before conversion."
        }
      },
      {
        "@type": "Question",
        "name": "What image formats are supported?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our tool supports all common image formats: JPG, JPEG, PNG, GIF, BMP, TIFF, WEBP and more. Image quality is preserved during conversion."
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
        <div className="absolute top-20 right-10 w-72 h-72 bg-orange-500/5 dark:bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-yellow-500/5 dark:bg-yellow-500/10 rounded-full blur-3xl" />

        <main className="container mx-auto px-4 py-8 sm:py-12 flex-1 relative z-10">
          {/* Hero Section with Tool Icon */}
          <div className="max-w-4xl mx-auto mb-8 sm:mb-12">
            <div className="flex flex-col items-center text-center gap-6">
              {/* Animated Icon */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-3xl blur-2xl opacity-30 animate-pulse" />
                <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-500 to-yellow-500 shadow-2xl">
                  <FileImage className="h-10 w-10 sm:h-12 sm:w-12 text-white" strokeWidth={2.5} />
                </div>
              </div>

              {/* Title */}
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                  {locale === 'fr'
                    ? 'Convertir Images en PDF'
                    : 'Convert Images to PDF'}
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground max-w-2xl">
                  {locale === 'fr'
                    ? 'Combinez plusieurs images en un seul PDF. Conversion rapide et gratuite. 100% sécurisé.'
                    : 'Combine multiple images into a single PDF. Fast and free conversion. 100% secure.'}
                </p>
              </div>
            </div>
          </div>

          {/* Main Tool Section */}
          <div className="max-w-5xl mx-auto mb-12">
              <div className="p-6 sm:p-8">
                <ImageToPDFTool />
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
                    ? 'Sélectionnez une ou plusieurs images à convertir'
                    : 'Select one or multiple images to convert',
                  icon: '🖼️'
                },
                {
                  step: '2',
                  title: locale === 'fr' ? 'Organisez' : 'Arrange',
                  description: locale === 'fr'
                    ? 'Réorganisez les images selon vos besoins'
                    : 'Rearrange images as needed',
                  icon: '🔄'
                },
                {
                  step: '3',
                  title: locale === 'fr' ? 'Téléchargez' : 'Download',
                  description: locale === 'fr'
                    ? 'Obtenez votre document PDF combiné'
                    : 'Get your combined PDF document',
                  icon: '⬇️'
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
