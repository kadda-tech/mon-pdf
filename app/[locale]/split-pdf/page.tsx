"use client"

import { useTranslations } from 'next-intl'
import { PDFSplitTool } from "@/components/pdf-split-tool"
import { Button } from "@/components/ui/button"
import { useRouter, usePathname } from 'next/navigation'
import { LanguageSwitcher } from "@/components/language-switcher"
import { BookmarkButton } from "@/components/bookmark-button"
import Link from 'next/link'
import Script from 'next/script'
import {SiteFooter} from "@/components/site-footer";

export default function SplitPDFPage() {
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
      "name": locale === 'fr' ? "Diviser PDF" : "Split PDF",
      "item": `https://mon-pdf.fr/${locale}/${locale === 'fr' ? 'diviser-pdf' : 'split-pdf'}`
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

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": locale === 'fr' ? "Diviser PDF en Ligne" : "Split PDF Online",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.7",
      "reviewCount": "1923"
    }
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": locale === 'fr' ? [
      {
        "@type": "Question",
        "name": "Comment diviser un PDF en plusieurs fichiers ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Téléchargez votre PDF, sélectionnez les pages que vous souhaitez extraire, puis cliquez sur diviser. Notre outil créera automatiquement des fichiers PDF séparés pour chaque sélection."
        }
      },
      {
        "@type": "Question",
        "name": "Puis-je diviser un PDF protégé par mot de passe ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Si le PDF est protégé par mot de passe pour l'ouverture, vous devrez d'abord le déverrouiller. Les PDF protégés en écriture peuvent généralement être divisés sans problème."
        }
      },
      {
        "@type": "Question",
        "name": "Y a-t-il une limite au nombre de pages ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Non, vous pouvez diviser des PDF de n'importe quelle taille. La seule limite est la mémoire de votre appareil. Notre outil traite tout localement dans votre navigateur."
        }
      }
    ] : [
      {
        "@type": "Question",
        "name": "How do I split a PDF into multiple files?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Upload your PDF, select the pages you want to extract, then click split. Our tool will automatically create separate PDF files for each selection."
        }
      },
      {
        "@type": "Question",
        "name": "Can I split a password-protected PDF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "If the PDF is password-protected for opening, you'll need to unlock it first. Write-protected PDFs can usually be split without issues."
        }
      },
      {
        "@type": "Question",
        "name": "Is there a limit on the number of pages?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No, you can split PDFs of any size. The only limit is your device's memory. Our tool processes everything locally in your browser."
        }
      }
    ]
  }

  return (
    <>
      {/* Structured Data */}
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
                    ? 'Mon PDF - Outils PDF Gratuits en Ligne - Fusionner, Diviser, Comprimer PDF'
                    : 'Mon PDF - Free Online PDF Tools - Merge, Split, Compress PDF'
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
          {/* Breadcrumbs for SEO */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
              <li>
                <Link href={`/${locale}`} className="hover:text-foreground">
                  {locale === 'fr' ? 'Accueil' : 'Home'}
                </Link>
              </li>
              <li>/</li>
              <li className="text-foreground font-medium">
                {locale === 'fr' ? 'Diviser PDF' : 'Split PDF'}
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

          {/* H1 with primary keyword */}
          <div className="max-w-3xl mx-auto mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-3">
              {locale === 'fr'
                ? 'Diviser un PDF en Ligne - Outil Gratuit de Séparation PDF'
                : 'Split PDF Files Online - Free PDF Separator Tool'}
            </h1>
            <p className="text-center text-muted-foreground mb-8">
              {locale === 'fr'
                ? 'Séparez un PDF en plusieurs fichiers ou extrayez des pages spécifiques. 100% gratuit, sécurisé et privé.'
                : 'Separate a PDF into multiple files or extract specific pages. 100% free, secure, and private.'}
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <PDFSplitTool />
          </div>

        {/* SEO Content */}
        <div className="max-w-4xl mx-auto mt-16 prose prose-slate dark:prose-invert">
          {locale === 'fr' ? (
            <>
              <h2>Diviser un PDF en Ligne - Outil Gratuit et Sécurisé</h2>
              <p>
                Notre outil de division PDF en ligne vous permet de séparer un fichier PDF en plusieurs documents ou d'extraire des pages spécifiques en quelques secondes.
                Que vous ayez besoin de diviser un rapport volumineux, d'extraire des chapitres d'un manuel ou de séparer des documents scannés, notre diviseur PDF
                gratuit traite tous vos fichiers localement dans votre navigateur, garantissant une confidentialité et une sécurité totales.
              </p>

              <h3>Comment Diviser un PDF en 3 Étapes Simples</h3>
              <ol>
                <li><strong>Téléchargez votre fichier PDF</strong> - Glissez-déposez ou cliquez pour sélectionner le fichier PDF que vous souhaitez diviser</li>
                <li><strong>Sélectionnez les pages</strong> - Choisissez les pages que vous souhaitez extraire ou définissez les plages de division</li>
                <li><strong>Divisez et téléchargez</strong> - Cliquez sur le bouton diviser et téléchargez vos fichiers PDF séparés instantanément</li>
              </ol>

              <h3>Pourquoi Choisir Notre Outil de Division PDF ?</h3>
              <ul>
                <li><strong>100% Gratuit</strong> - Aucun frais caché, aucune inscription requise, aucune limite de fichiers</li>
                <li><strong>Totalement Sécurisé</strong> - Vos fichiers ne quittent jamais votre appareil. Le traitement se fait entièrement dans votre navigateur</li>
                <li><strong>Extraction Flexible</strong> - Extrayez des pages individuelles, des plages de pages ou divisez par intervalles</li>
                <li><strong>Rapide et Efficace</strong> - Divisez des PDF volumineux en quelques secondes sans compromis sur la qualité</li>
                <li><strong>Préserve la Qualité</strong> - Maintient la qualité originale, la mise en forme et les hyperliens de vos documents</li>
                <li><strong>Fonctionne Partout</strong> - Compatible avec tous les appareils : Windows, Mac, Linux, iOS, Android</li>
              </ul>

              <h3>Cas d'Utilisation Courants pour la Division de PDF</h3>
              <p>Notre outil de division PDF est parfait pour :</p>
              <ul>
                <li><strong>Documents Volumineux</strong> - Divisez de gros rapports ou manuels en chapitres ou sections plus petits</li>
                <li><strong>Documents Scannés</strong> - Séparez plusieurs documents scannés en un seul fichier PDF</li>
                <li><strong>Extraction de Pages</strong> - Extrayez des pages spécifiques d'un contrat ou d'un document pour les partager</li>
                <li><strong>Documents Académiques</strong> - Divisez des thèses ou des mémoires en chapitres individuels</li>
                <li><strong>Factures et Relevés</strong> - Séparez des relevés bancaires ou des factures multi-mois en documents individuels</li>
                <li><strong>Présentations</strong> - Extrayez des diapositives spécifiques d'une présentation PDF</li>
              </ul>

              <h3>Méthodes de Division PDF</h3>
              <p>Notre outil offre plusieurs façons de diviser vos PDF :</p>
              <ul>
                <li><strong>Extraire des Pages</strong> - Sélectionnez des pages spécifiques à extraire dans un nouveau PDF</li>
                <li><strong>Division par Plage</strong> - Définissez des plages de pages pour créer plusieurs documents</li>
                <li><strong>Division en Pages Uniques</strong> - Divisez chaque page en un fichier PDF séparé</li>
                <li><strong>Suppression de Pages</strong> - Créez un nouveau PDF en supprimant les pages indésirables</li>
              </ul>

              <h3>Conseils pour Diviser Efficacement vos PDF</h3>
              <ul>
                <li>Prévisualisez votre PDF avant de le diviser pour identifier les bonnes pages</li>
                <li>Utilisez des noms de fichiers descriptifs pour vos documents divisés</li>
                <li>Pour les documents volumineux, envisagez de diviser par chapitres ou sections logiques</li>
                <li>Vérifiez que les signets et la table des matières sont préservés après la division</li>
                <li>Combinez avec notre <Link href={`/${locale}/merge-pdf`} className="text-primary hover:underline">outil de fusion PDF</Link> pour réorganiser les pages si nécessaire</li>
              </ul>

              <h3>Foire Aux Questions (FAQ)</h3>

              <h4>Comment diviser un PDF en plusieurs fichiers ?</h4>
              <p>
                Téléchargez votre PDF, sélectionnez les pages que vous souhaitez extraire, puis cliquez sur diviser. Notre outil créera
                automatiquement des fichiers PDF séparés pour chaque sélection que vous pourrez télécharger individuellement.
              </p>

              <h4>Puis-je diviser un PDF protégé par mot de passe ?</h4>
              <p>
                Si le PDF est protégé par mot de passe pour l'ouverture, vous devrez d'abord le déverrouiller. Les PDF protégés en écriture
                peuvent généralement être divisés sans problème.
              </p>

              <h4>Y a-t-il une limite au nombre de pages ?</h4>
              <p>
                Non, vous pouvez diviser des PDF de n'importe quelle taille. La seule limite est la mémoire de votre appareil.
                Notre outil traite tout localement dans votre navigateur, donc les appareils modernes peuvent facilement gérer des documents de centaines de pages.
              </p>

              <h4>La qualité de mes PDF sera-t-elle préservée après la division ?</h4>
              <p>
                Absolument. Notre outil maintient la qualité originale de vos documents PDF, y compris les images haute résolution,
                la mise en forme du texte, les hyperliens interactifs et les formulaires.
              </p>

              <h4>Puis-je extraire uniquement certaines pages d'un PDF ?</h4>
              <p>
                Oui, notre outil vous permet d'extraire des pages spécifiques en sélectionnant exactement les pages que vous souhaitez
                conserver. Vous pouvez sélectionner des pages individuelles ou des plages de pages.
              </p>

              <h3>Outils PDF Connexes</h3>
              <p>Découvrez nos autres outils PDF gratuits :</p>
              <ul>
                <li><Link href={`/${locale}/merge-pdf`} className="text-primary hover:underline">Fusionner PDF</Link> - Combinez plusieurs fichiers PDF en un seul</li>
                <li><Link href={`/${locale}/comprimer-pdf`} className="text-primary hover:underline">Comprimer PDF</Link> - Réduisez la taille de vos fichiers PDF</li>
                <li><Link href={`/${locale}/organize-pdf`} className="text-primary hover:underline">Organiser PDF</Link> - Réorganisez, supprimez ou faites pivoter les pages</li>
                <li><Link href={`/${locale}/page-numbering`} className="text-primary hover:underline">Numéroter PDF</Link> - Ajoutez des numéros de page à vos documents</li>
              </ul>

            </>
          ) : (
            <>
              <h2>Split PDF Files Online - Free and Secure Tool</h2>
              <p>
                Our online PDF splitter tool allows you to separate a PDF file into multiple documents or extract specific pages in seconds.
                Whether you need to split a large report, extract chapters from a manual, or separate scanned documents, our free PDF divider
                processes all your files locally in your browser, ensuring complete privacy and security.
              </p>

              <h3>How to Split a PDF in 3 Simple Steps</h3>
              <ol>
                <li><strong>Upload your PDF file</strong> - Drag and drop or click to select the PDF file you want to split</li>
                <li><strong>Select pages</strong> - Choose the pages you want to extract or define split ranges</li>
                <li><strong>Split and download</strong> - Click the split button and download your separated PDF files instantly</li>
              </ol>

              <h3>Why Choose Our PDF Splitter Tool?</h3>
              <ul>
                <li><strong>100% Free</strong> - No hidden fees, no registration required, no file limits</li>
                <li><strong>Completely Secure</strong> - Your files never leave your device. All processing happens entirely in your browser</li>
                <li><strong>Flexible Extraction</strong> - Extract individual pages, page ranges, or split by intervals</li>
                <li><strong>Fast and Efficient</strong> - Split large PDFs in seconds without compromising quality</li>
                <li><strong>Preserves Quality</strong> - Maintains original quality, formatting, and hyperlinks in your documents</li>
                <li><strong>Works Everywhere</strong> - Compatible with all devices: Windows, Mac, Linux, iOS, Android</li>
              </ul>

              <h3>Common Use Cases for Splitting PDF Files</h3>
              <p>Our PDF split tool is perfect for:</p>
              <ul>
                <li><strong>Large Documents</strong> - Split large reports or manuals into smaller chapters or sections</li>
                <li><strong>Scanned Documents</strong> - Separate multiple scanned documents into individual PDF files</li>
                <li><strong>Page Extraction</strong> - Extract specific pages from a contract or document to share</li>
                <li><strong>Academic Papers</strong> - Divide theses or dissertations into individual chapters</li>
                <li><strong>Invoices and Statements</strong> - Separate multi-month bank statements or invoices into individual documents</li>
                <li><strong>Presentations</strong> - Extract specific slides from a PDF presentation</li>
              </ul>

              <h3>PDF Splitting Methods</h3>
              <p>Our tool offers several ways to split your PDFs:</p>
              <ul>
                <li><strong>Extract Pages</strong> - Select specific pages to extract into a new PDF</li>
                <li><strong>Split by Range</strong> - Define page ranges to create multiple documents</li>
                <li><strong>Split into Single Pages</strong> - Separate each page into its own PDF file</li>
                <li><strong>Remove Pages</strong> - Create a new PDF by removing unwanted pages</li>
              </ul>

              <h3>Tips for Splitting PDFs Effectively</h3>
              <ul>
                <li>Preview your PDF before splitting to identify the correct pages</li>
                <li>Use descriptive file names for your split documents</li>
                <li>For large documents, consider splitting by chapters or logical sections</li>
                <li>Verify that bookmarks and table of contents are preserved after splitting</li>
                <li>Combine with our <Link href={`/${locale}/merge-pdf`} className="text-primary hover:underline">merge PDF tool</Link> to rearrange pages if needed</li>
              </ul>

              <h3>Frequently Asked Questions (FAQ)</h3>

              <h4>How do I split a PDF into multiple files?</h4>
              <p>
                Upload your PDF, select the pages you want to extract, then click split. Our tool will automatically create
                separate PDF files for each selection that you can download individually.
              </p>

              <h4>Can I split a password-protected PDF?</h4>
              <p>
                If the PDF is password-protected for opening, you'll need to unlock it first. Write-protected PDFs can
                usually be split without issues.
              </p>

              <h4>Is there a limit on the number of pages?</h4>
              <p>
                No, you can split PDFs of any size. The only limit is your device's memory. Our tool processes everything
                locally in your browser, so modern devices can easily handle documents with hundreds of pages.
              </p>

              <h4>Will the quality of my PDFs be preserved after splitting?</h4>
              <p>
                Absolutely. Our tool maintains the original quality of your PDF documents, including high-resolution images,
                text formatting, interactive hyperlinks, and forms.
              </p>

              <h4>Can I extract only certain pages from a PDF?</h4>
              <p>
                Yes, our tool allows you to extract specific pages by selecting exactly which pages you want to keep.
                You can select individual pages or page ranges.
              </p>

              <h3>Related PDF Tools</h3>
              <p>Explore our other free PDF tools:</p>
              <ul>
                <li><Link href={`/${locale}/merge-pdf`} className="text-primary hover:underline">Merge PDF</Link> - Combine multiple PDF files into one</li>
                <li><Link href={`/${locale}/compress-pdf`} className="text-primary hover:underline">Compress PDF</Link> - Reduce the size of your PDF files</li>
                <li><Link href={`/${locale}/organize-pdf`} className="text-primary hover:underline">Organize PDF</Link> - Rearrange, delete, or rotate pages</li>
                <li><Link href={`/${locale}/page-numbering`} className="text-primary hover:underline">Number PDF</Link> - Add page numbers to your documents</li>
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
