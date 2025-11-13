"use client"

import { useTranslations } from 'next-intl'
import { PDFToImagesTool } from "@/components/pdf-to-images-tool"
import { Button } from "@/components/ui/button"
import { useRouter, usePathname } from 'next/navigation'
import { LanguageSwitcher } from "@/components/language-switcher"
import { BookmarkButton } from "@/components/bookmark-button"
import Link from 'next/link'
import Script from 'next/script'
import {SiteFooter} from "@/components/site-footer";

export default function PDFToImagesPage() {
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
      "name": locale === 'fr' ? "PDF vers Images" : "PDF to Images",
      "item": `https://mon-pdf.fr/${locale}/${locale === 'fr' ? 'pdf-vers-images' : 'pdf-to-images'}`
    }]
  }

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": locale === 'fr' ? "Comment convertir un PDF en images" : "How to Convert PDF to Images",
    "step": [
      {
        "@type": "HowToStep",
        "name": locale === 'fr' ? "Télécharger le PDF" : "Upload PDF",
        "text": locale === 'fr' ? "Téléchargez le fichier PDF à convertir" : "Upload the PDF file to convert"
      },
      {
        "@type": "HowToStep",
        "name": locale === 'fr' ? "Choisir le format" : "Choose format",
        "text": locale === 'fr' ? "Sélectionnez PNG ou JPG" : "Select PNG or JPG"
      },
      {
        "@type": "HowToStep",
        "name": locale === 'fr' ? "Télécharger les images" : "Download images",
        "text": locale === 'fr' ? "Téléchargez toutes les images" : "Download all images"
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
      <Script id="organization-schema" type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </Script>
      <Script id="breadcrumb-schema" type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </Script>
      <Script id="howto-schema" type="application/ld+json">
        {JSON.stringify(howToSchema)}
      </Script>
      <Script id="software-schema" type="application/ld+json">
        {JSON.stringify(softwareSchema)}
      </Script>
      <Script id="faq-schema" type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </Script>

      <div className="min-h-screen bg-background flex flex-col">
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href={`/${locale}`}>
                <img
                  src="/logo.png"
                  alt={locale === 'fr'
                    ? 'Mon PDF - Outils PDF Gratuits en Ligne'
                    : 'Mon PDF - Free Online PDF Tools'
                  }
                  className="h-30 w-30"
                  width="120"
                  height="120"
                />
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <BookmarkButton />
              <LanguageSwitcher />
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12 flex-1">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
              <li>
                <Link href={`/${locale}`} className="hover:text-foreground">
                  {locale === 'fr' ? 'Accueil' : 'Home'}
                </Link>
              </li>
              <li>/</li>
              <li className="text-foreground font-medium">
                {locale === 'fr' ? 'PDF vers Images' : 'PDF to Images'}
              </li>
            </ol>
          </nav>

          <Button
            variant="ghost"
            onClick={() => router.push(`/${locale}`)}
            className="mb-6"
          >
            ← {t('common.backToTools')}
          </Button>

          <div className="max-w-3xl mx-auto mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-3">
              {locale === 'fr'
                ? 'Convertir PDF en Images - PNG, JPG Gratuit'
                : 'Convert PDF to Images - PNG, JPG Free'}
            </h1>
            <p className="text-center text-muted-foreground mb-8">
              {locale === 'fr'
                ? 'Extraire toutes les pages PDF en images haute qualité. 100% gratuit et sécurisé.'
                : 'Extract all PDF pages to high-quality images. 100% free and secure.'}
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <PDFToImagesTool />
          </div>

        <div className="max-w-4xl mx-auto mt-16 prose prose-slate dark:prose-invert">
          {locale === 'fr' ? (
            <>
              <h2>Convertir PDF en Images - Outil Gratuit</h2>
              <p>
                Notre convertisseur PDF vers images vous permet de transformer chaque page de votre PDF en images PNG ou JPG haute qualité.
                Que vous ayez besoin d'extraire des pages pour des présentations, des sites web ou des réseaux sociaux, notre outil gratuit
                traite tout localement dans votre navigateur pour une confidentialité totale.
              </p>

              <h3>Comment Convertir un PDF en Images</h3>
              <ol>
                <li><strong>Téléchargez votre PDF</strong> - Sélectionnez le fichier à convertir</li>
                <li><strong>Choisissez le format</strong> - PNG pour la qualité, JPG pour la taille</li>
                <li><strong>Téléchargez les images</strong> - Obtenez toutes vos pages en images</li>
              </ol>

              <h3>Formats d'Image Disponibles</h3>
              <ul>
                <li><strong>PNG</strong> - Qualité maximale, idéal pour les documents et textes</li>
                <li><strong>JPG</strong> - Fichiers plus petits, parfait pour les photos</li>
                <li><strong>Haute Résolution</strong> - Images nettes et professionnelles</li>
                <li><strong>100% Gratuit</strong> - Aucune limite, aucune inscription</li>
              </ul>

              <h3>Cas d'Utilisation</h3>
              <ul>
                <li><strong>Réseaux Sociaux</strong> - Partagez des pages PDF sous forme d'images</li>
                <li><strong>Sites Web</strong> - Intégrez des pages PDF comme images</li>
                <li><strong>Présentations</strong> - Utilisez des pages PDF dans vos slides</li>
                <li><strong>Emails</strong> - Envoyez des extraits PDF en images</li>
              </ul>

              <h3>Foire Aux Questions</h3>

              <h4>Comment convertir un PDF en images ?</h4>
              <p>
                Téléchargez votre PDF, choisissez le format (PNG ou JPG), et notre outil convertira automatiquement
                chaque page en image haute qualité que vous pourrez télécharger individuellement ou en lot.
              </p>

              <h4>Quel format d'image choisir ?</h4>
              <p>
                PNG offre la meilleure qualité et supporte la transparence, idéal pour les documents avec du texte.
                JPG produit des fichiers plus petits, parfait pour les photos et images complexes.
              </p>

              <h3>Outils Connexes</h3>
              <ul>
                <li><Link href={`/${locale}/image-vers-pdf`} className="text-primary hover:underline">Images vers PDF</Link> - Convertir images en PDF</li>
                <li><Link href={`/${locale}/merge-pdf`} className="text-primary hover:underline">Fusionner PDF</Link> - Combiner plusieurs PDF</li>
                <li><Link href={`/${locale}/split-pdf`} className="text-primary hover:underline">Diviser PDF</Link> - Séparer un PDF</li>
              </ul>
            </>
          ) : (
            <>
              <h2>Convert PDF to Images - Free Tool</h2>
              <p>
                Our PDF to images converter allows you to transform each page of your PDF into high-quality PNG or JPG images.
                Whether you need to extract pages for presentations, websites, or social media, our free tool processes
                everything locally in your browser for complete privacy.
              </p>

              <h3>How to Convert PDF to Images</h3>
              <ol>
                <li><strong>Upload your PDF</strong> - Select the file to convert</li>
                <li><strong>Choose format</strong> - PNG for quality, JPG for size</li>
                <li><strong>Download images</strong> - Get all your pages as images</li>
              </ol>

              <h3>Available Image Formats</h3>
              <ul>
                <li><strong>PNG</strong> - Maximum quality, ideal for documents and text</li>
                <li><strong>JPG</strong> - Smaller files, perfect for photos</li>
                <li><strong>High Resolution</strong> - Sharp and professional images</li>
                <li><strong>100% Free</strong> - No limits, no registration</li>
              </ul>

              <h3>Use Cases</h3>
              <ul>
                <li><strong>Social Media</strong> - Share PDF pages as images</li>
                <li><strong>Websites</strong> - Integrate PDF pages as images</li>
                <li><strong>Presentations</strong> - Use PDF pages in your slides</li>
                <li><strong>Emails</strong> - Send PDF excerpts as images</li>
              </ul>

              <h3>Frequently Asked Questions</h3>

              <h4>How to convert PDF to images?</h4>
              <p>
                Upload your PDF, choose the format (PNG or JPG), and our tool will automatically convert
                each page to high-quality images you can download individually or in batch.
              </p>

              <h4>Which image format to choose?</h4>
              <p>
                PNG offers the best quality and supports transparency, ideal for documents with text.
                JPG produces smaller files, perfect for photos and complex images.
              </p>

              <h3>Related Tools</h3>
              <ul>
                <li><Link href={`/${locale}/image-to-pdf`} className="text-primary hover:underline">Images to PDF</Link> - Convert images to PDF</li>
                <li><Link href={`/${locale}/merge-pdf`} className="text-primary hover:underline">Merge PDF</Link> - Combine multiple PDFs</li>
                <li><Link href={`/${locale}/split-pdf`} className="text-primary hover:underline">Split PDF</Link> - Separate a PDF</li>
              </ul>
            </>
          )}
        </div>
      </main>

        <SiteFooter locale={pathname.split('/')[1] || 'en'} />
    </div>
    </>
  )
}
