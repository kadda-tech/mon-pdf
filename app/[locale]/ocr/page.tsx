"use client"

import { useTranslations } from 'next-intl'
import { PDFOCRTool } from "@/components/ocr/pdf-ocr-tool"
import { Button } from "@/components/ui/button"
import { useRouter, usePathname } from 'next/navigation'
import { LanguageSwitcher } from "@/components/language-switcher"
import { BookmarkButton } from "@/components/bookmark-button"
import Link from 'next/link'
import Script from 'next/script'
import {SiteFooter} from "@/components/site-footer";

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
                OCR PDF
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
                ? 'OCR PDF Gratuit - Extraire Texte de PDF Scanné'
                : 'OCR PDF Free - Extract Text from Scanned PDF'}
            </h1>
            <p className="text-center text-muted-foreground mb-8">
              {locale === 'fr'
                ? 'Reconnaissance optique de caractères. Convertissez PDF scanné en texte modifiable. 100% gratuit.'
                : 'Optical character recognition. Convert scanned PDF to editable text. 100% free.'}
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <PDFOCRTool />
          </div>

        <div className="max-w-4xl mx-auto mt-16 prose prose-slate dark:prose-invert">
          {locale === 'fr' ? (
            <>
              <h2>OCR PDF en Ligne - Outil Gratuit</h2>
              <p>
                Notre outil OCR (Reconnaissance Optique de Caractères) vous permet d'extraire du texte de documents PDF scannés, d'images
                et de photos. Transformez vos documents numérisés en texte modifiable, copiable et recherchable. Notre technologie OCR
                avancée reconnaît le texte avec précision, détecte les tableaux et préserve la mise en page. Tout le traitement est effectué
                localement dans votre navigateur pour une confidentialité totale.
              </p>

              <h3>Comment Utiliser l'OCR sur un PDF</h3>
              <ol>
                <li><strong>Télécharger le PDF scanné</strong> - Sélectionnez votre document PDF ou image</li>
                <li><strong>Lancer l'analyse OCR</strong> - L'outil reconnaît automatiquement le texte</li>
                <li><strong>Copier ou télécharger</strong> - Récupérez le texte extrait et modifiable</li>
              </ol>

              <h3>Fonctionnalités OCR Avancées</h3>
              <ul>
                <li><strong>Reconnaissance Multi-Langues</strong> - Supporte français, anglais et nombreuses langues</li>
                <li><strong>Détection de Tableaux</strong> - Identifie et extrait les tableaux avec structure</li>
                <li><strong>Préservation de Mise en Page</strong> - Conserve l'organisation du document</li>
                <li><strong>Haute Précision</strong> - Technologie OCR de pointe pour résultats fiables</li>
                <li><strong>Texte Copiable</strong> - Copiez directement le texte extrait</li>
                <li><strong>Export Texte</strong> - Téléchargez le texte en format TXT</li>
              </ul>

              <h3>Cas d'Utilisation de l'OCR</h3>
              <ul>
                <li><strong>Documents Scannés</strong> - Convertir scans papier en texte modifiable</li>
                <li><strong>Factures et Reçus</strong> - Extraire données de factures scannées</li>
                <li><strong>Livres et Articles</strong> - Numériser pages de livres en texte</li>
                <li><strong>Formulaires</strong> - Extraire informations de formulaires remplis</li>
                <li><strong>Contrats</strong> - Rendre contrats scannés modifiables et recherchables</li>
                <li><strong>Notes Manuscrites</strong> - Convertir notes manuscrites lisibles en texte</li>
              </ul>

              <h3>Avantages de Notre OCR PDF</h3>
              <ul>
                <li><strong>100% Gratuit</strong> - Aucune limite d'utilisation, aucune inscription</li>
                <li><strong>Traitement Local</strong> - Vos documents restent privés, pas de serveur</li>
                <li><strong>Multi-Format</strong> - Fonctionne avec PDF, JPG, PNG et autres images</li>
                <li><strong>Rapide et Précis</strong> - Résultats en quelques secondes</li>
                <li><strong>Interface Simple</strong> - Facile à utiliser, pas de configuration</li>
                <li><strong>Multi-Pages</strong> - Traite plusieurs pages à la fois</li>
              </ul>

              <h3>Types de Documents Supportés</h3>
              <ul>
                <li><strong>PDF Scannés</strong> - Documents numérisés au format PDF</li>
                <li><strong>Photos de Documents</strong> - Images de documents prises au téléphone</li>
                <li><strong>Captures d'Écran</strong> - Screenshots contenant du texte</li>
                <li><strong>Images JPG/PNG</strong> - Tous formats d'image standard</li>
                <li><strong>Formulaires Scannés</strong> - Formulaires papier numérisés</li>
              </ul>

              <h3>Conseils pour Meilleure Reconnaissance OCR</h3>
              <ul>
                <li><strong>Qualité d'Image</strong> - Utilisez des scans haute résolution (300 DPI min.)</li>
                <li><strong>Bon Contraste</strong> - Texte noir sur fond blanc donne meilleurs résultats</li>
                <li><strong>Document Droit</strong> - Assurez-vous que le document est bien aligné</li>
                <li><strong>Netteté</strong> - Évitez les images floues ou mal focalisées</li>
                <li><strong>Éclairage Uniforme</strong> - Scannez sans ombres ni reflets</li>
              </ul>

              <h3>OCR vs Copier-Coller</h3>
              <ul>
                <li><strong>Documents Images</strong> - OCR fonctionne sur images, pas copier-coller</li>
                <li><strong>PDF Scannés</strong> - OCR nécessaire pour PDF sans couche texte</li>
                <li><strong>Photos</strong> - OCR extrait texte de photos de documents</li>
                <li><strong>Tableaux</strong> - OCR préserve structure des tableaux</li>
                <li><strong>Mise en Page</strong> - OCR maintient organisation du document</li>
              </ul>

              <h3>Foire Aux Questions</h3>

              <h4>Qu'est-ce que l'OCR PDF ?</h4>
              <p>
                L'OCR (Reconnaissance Optique de Caractères) est une technologie qui analyse les images de texte dans vos PDF
                et les convertit en texte réellement modifiable et copiable. Notre outil utilise l'intelligence artificielle
                pour reconnaître avec précision les caractères, même dans des documents complexes avec tableaux et mise en page spéciale.
              </p>

              <h4>L'OCR fonctionne-t-il sur tous les PDF ?</h4>
              <p>
                Notre OCR fonctionne sur les PDF scannés, images de documents, et photos de texte. La qualité du résultat
                dépend de la clarté du document original. Les documents nets, bien éclairés et avec un bon contraste donnent
                les meilleurs résultats. Les documents très flous ou de mauvaise qualité peuvent avoir une reconnaissance moins précise.
              </p>

              <h4>Puis-je détecter des tableaux avec l'OCR ?</h4>
              <p>
                Oui, notre outil OCR avancé peut détecter et extraire les tableaux des PDF scannés. Il analyse la structure
                du document pour identifier les lignes et colonnes, préservant l'organisation des données. Cela facilite
                l'utilisation des informations extraites dans Excel, Google Sheets ou d'autres applications.
              </p>

              <h3>Outils Connexes</h3>
              <ul>
                <li><Link href={`/${locale}/scanner-pdf`} className="text-primary hover:underline">Scanner PDF</Link> - Numériser documents en PDF</li>
                <li><Link href={`/${locale}/pdf-vers-images`} className="text-primary hover:underline">PDF vers Images</Link> - Convertir PDF en images</li>
                <li><Link href={`/${locale}/merge-pdf`} className="text-primary hover:underline">Fusionner PDF</Link> - Combiner plusieurs PDF</li>
              </ul>
            </>
          ) : (
            <>
              <h2>Online PDF OCR - Free Tool</h2>
              <p>
                Our OCR (Optical Character Recognition) tool allows you to extract text from scanned PDF documents, images,
                and photos. Transform your digitized documents into editable, copyable, and searchable text. Our advanced OCR
                technology recognizes text accurately, detects tables, and preserves layout. All processing is done locally
                in your browser for complete privacy.
              </p>

              <h3>How to Use OCR on PDF</h3>
              <ol>
                <li><strong>Upload scanned PDF</strong> - Select your PDF document or image</li>
                <li><strong>Start OCR analysis</strong> - Tool automatically recognizes text</li>
                <li><strong>Copy or download</strong> - Get extracted and editable text</li>
              </ol>

              <h3>Advanced OCR Features</h3>
              <ul>
                <li><strong>Multi-Language Recognition</strong> - Supports French, English and many languages</li>
                <li><strong>Table Detection</strong> - Identifies and extracts tables with structure</li>
                <li><strong>Layout Preservation</strong> - Maintains document organization</li>
                <li><strong>High Accuracy</strong> - State-of-the-art OCR technology for reliable results</li>
                <li><strong>Copyable Text</strong> - Directly copy extracted text</li>
                <li><strong>Text Export</strong> - Download text in TXT format</li>
              </ul>

              <h3>OCR Use Cases</h3>
              <ul>
                <li><strong>Scanned Documents</strong> - Convert paper scans to editable text</li>
                <li><strong>Invoices and Receipts</strong> - Extract data from scanned invoices</li>
                <li><strong>Books and Articles</strong> - Digitize book pages to text</li>
                <li><strong>Forms</strong> - Extract information from filled forms</li>
                <li><strong>Contracts</strong> - Make scanned contracts editable and searchable</li>
                <li><strong>Handwritten Notes</strong> - Convert readable handwritten notes to text</li>
              </ul>

              <h3>Benefits of Our PDF OCR</h3>
              <ul>
                <li><strong>100% Free</strong> - No usage limits, no registration</li>
                <li><strong>Local Processing</strong> - Your documents stay private, no server</li>
                <li><strong>Multi-Format</strong> - Works with PDF, JPG, PNG and other images</li>
                <li><strong>Fast and Accurate</strong> - Results in seconds</li>
                <li><strong>Simple Interface</strong> - Easy to use, no configuration</li>
                <li><strong>Multi-Page</strong> - Processes multiple pages at once</li>
              </ul>

              <h3>Supported Document Types</h3>
              <ul>
                <li><strong>Scanned PDFs</strong> - Digitized documents in PDF format</li>
                <li><strong>Document Photos</strong> - Images of documents taken by phone</li>
                <li><strong>Screenshots</strong> - Screenshots containing text</li>
                <li><strong>JPG/PNG Images</strong> - All standard image formats</li>
                <li><strong>Scanned Forms</strong> - Digitized paper forms</li>
              </ul>

              <h3>Tips for Better OCR Recognition</h3>
              <ul>
                <li><strong>Image Quality</strong> - Use high-resolution scans (300 DPI min.)</li>
                <li><strong>Good Contrast</strong> - Black text on white background gives best results</li>
                <li><strong>Straight Document</strong> - Ensure document is properly aligned</li>
                <li><strong>Sharpness</strong> - Avoid blurry or poorly focused images</li>
                <li><strong>Even Lighting</strong> - Scan without shadows or reflections</li>
              </ul>

              <h3>OCR vs Copy-Paste</h3>
              <ul>
                <li><strong>Image Documents</strong> - OCR works on images, not copy-paste</li>
                <li><strong>Scanned PDFs</strong> - OCR needed for PDFs without text layer</li>
                <li><strong>Photos</strong> - OCR extracts text from document photos</li>
                <li><strong>Tables</strong> - OCR preserves table structure</li>
                <li><strong>Layout</strong> - OCR maintains document organization</li>
              </ul>

              <h3>Frequently Asked Questions</h3>

              <h4>What is PDF OCR?</h4>
              <p>
                OCR (Optical Character Recognition) is a technology that analyzes text images in your PDFs and converts
                them into truly editable and copyable text. Our tool uses artificial intelligence to accurately recognize
                characters, even in complex documents with tables and special layouts.
              </p>

              <h4>Does OCR work on all PDFs?</h4>
              <p>
                Our OCR works on scanned PDFs, document images, and text photos. Result quality depends on the original
                document's clarity. Clear, well-lit documents with good contrast give the best results. Very blurry or
                poor quality documents may have less accurate recognition.
              </p>

              <h4>Can I detect tables with OCR?</h4>
              <p>
                Yes, our advanced OCR tool can detect and extract tables from scanned PDFs. It analyzes document structure
                to identify rows and columns, preserving data organization. This makes it easier to use extracted information
                in Excel, Google Sheets, or other applications.
              </p>

              <h3>Related Tools</h3>
              <ul>
                <li><Link href={`/${locale}/scan-pdf`} className="text-primary hover:underline">Scan PDF</Link> - Digitize documents to PDF</li>
                <li><Link href={`/${locale}/pdf-to-images`} className="text-primary hover:underline">PDF to Images</Link> - Convert PDF to images</li>
                <li><Link href={`/${locale}/merge-pdf`} className="text-primary hover:underline">Merge PDF</Link> - Combine multiple PDFs</li>
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
