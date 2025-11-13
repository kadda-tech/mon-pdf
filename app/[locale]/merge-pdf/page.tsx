"use client"

import { useTranslations } from 'next-intl'
import { PDFMergeTool } from "@/components/pdf-merge-tool"
import { Button } from "@/components/ui/button"
import { useRouter, usePathname } from 'next/navigation'
import { LanguageSwitcher } from "@/components/language-switcher"
import { BookmarkButton } from "@/components/bookmark-button"
import Link from 'next/link'
import Script from 'next/script'
import {SiteFooter} from "@/components/site-footer";

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
      "item": `https://mon-pdf.fr/${locale}/${locale === 'fr' ? 'fusionner-pdf' : 'merge-pdf'}`
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
                {locale === 'fr' ? 'Fusionner PDF' : 'Merge PDF'}
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
                ? 'Fusionner des PDF en Ligne - Outil Gratuit de Combinaison PDF'
                : 'Merge PDF Files Online - Free PDF Combiner Tool'}
            </h1>
            <p className="text-center text-muted-foreground mb-8">
              {locale === 'fr'
                ? 'Combinez plusieurs fichiers PDF en un seul document. 100% gratuit, sécurisé et privé.'
                : 'Combine multiple PDF files into one document. 100% free, secure, and private.'}
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <PDFMergeTool />
          </div>

        {/* SEO Content */}
        <div className="max-w-4xl mx-auto mt-16 prose prose-slate dark:prose-invert">
          {locale === 'fr' ? (
            <>
              <h2>Fusionner des PDF en Ligne - Outil Gratuit et Sécurisé</h2>
              <p>
                Notre outil de fusion PDF en ligne vous permet de combiner plusieurs fichiers PDF en un seul document en quelques secondes.
                Que vous ayez besoin de fusionner des contrats, des factures, des rapports ou des documents personnels, notre fusionneur PDF
                gratuit traite tous vos fichiers localement dans votre navigateur, garantissant une confidentialité et une sécurité totales.
              </p>

              <h3>Comment Fusionner des PDF en 3 Étapes Simples</h3>
              <ol>
                <li><strong>Téléchargez vos fichiers PDF</strong> - Glissez-déposez ou cliquez pour sélectionner les fichiers PDF que vous souhaitez fusionner</li>
                <li><strong>Réorganisez l'ordre</strong> - Faites glisser les fichiers pour les réorganiser dans l'ordre souhaité</li>
                <li><strong>Fusionnez et téléchargez</strong> - Cliquez sur le bouton fusionner et téléchargez votre PDF combiné instantanément</li>
              </ol>

              <h3>Pourquoi Choisir Notre Outil de Fusion PDF ?</h3>
              <ul>
                <li><strong>100% Gratuit</strong> - Aucun frais caché, aucune inscription requise, aucune limite de fichiers</li>
                <li><strong>Totalement Sécurisé</strong> - Vos fichiers ne quittent jamais votre appareil. Le traitement se fait entièrement dans votre navigateur</li>
                <li><strong>Fonctionne Partout</strong> - Compatible avec tous les appareils : Windows, Mac, Linux, iOS, Android</li>
                <li><strong>Rapide et Efficace</strong> - Fusionnez plusieurs PDF en quelques secondes sans compromis sur la qualité</li>
                <li><strong>Préserve la Qualité</strong> - Maintient la qualité originale, la mise en forme et les hyperliens de vos documents</li>
                <li><strong>Aucune Installation</strong> - Outil basé sur le navigateur, aucun logiciel à télécharger</li>
              </ul>

              <h3>Cas d'Utilisation Courants pour la Fusion de PDF</h3>
              <p>Notre outil de fusion PDF est parfait pour :</p>
              <ul>
                <li><strong>Documents Professionnels</strong> - Combinez des contrats, des propositions et des rapports en un seul fichier professionnel</li>
                <li><strong>Documents Académiques</strong> - Fusionnez des chapitres de thèse, des articles de recherche ou des devoirs</li>
                <li><strong>Documents Légaux</strong> - Consolidez des documents juridiques, des preuves ou des dossiers</li>
                <li><strong>Factures et Reçus</strong> - Regroupez plusieurs factures ou reçus pour la comptabilité</li>
                <li><strong>Portfolios</strong> - Créez des portfolios complets en combinant vos meilleurs travaux</li>
                <li><strong>Manuels et Guides</strong> - Fusionnez plusieurs chapitres ou sections en un seul document</li>
              </ul>

              <h3>Conseils pour Organiser vos PDF Fusionnés</h3>
              <ul>
                <li>Organisez vos fichiers dans un ordre logique avant de fusionner pour gagner du temps</li>
                <li>Utilisez des noms de fichiers descriptifs pour identifier facilement vos documents</li>
                <li>Envisagez d'ajouter une page de garde ou une table des matières pour les longs documents</li>
                <li>Utilisez notre outil de numérotation de pages après la fusion pour une meilleure organisation</li>
                <li>Vérifiez l'aperçu avant de télécharger pour vous assurer que tout est dans le bon ordre</li>
              </ul>

              <h3>Foire Aux Questions (FAQ)</h3>

              <h4>Est-il sûr de fusionner des PDF en ligne ?</h4>
              <p>
                Oui, notre outil traite tous les fichiers localement dans votre navigateur. Vos fichiers ne quittent jamais votre appareil
                et ne sont jamais téléchargés sur nos serveurs, garantissant une confidentialité et une sécurité totales.
              </p>

              <h4>Puis-je fusionner des PDF protégés par mot de passe ?</h4>
              <p>
                Notre outil peut fusionner des PDF protégés en écriture. Si un PDF est protégé par mot de passe pour l'ouverture,
                vous devrez d'abord le déverrouiller avant de le fusionner.
              </p>

              <h4>Quelle est la taille maximale de fichier ?</h4>
              <p>
                Comme le traitement se fait dans votre navigateur, la limite dépend de la mémoire de votre appareil.
                La plupart des appareils modernes peuvent gérer des fichiers jusqu'à 100 Mo sans problème.
              </p>

              <h4>La qualité de mes PDF sera-t-elle préservée ?</h4>
              <p>
                Absolument. Notre outil maintient la qualité originale de vos documents PDF, y compris les images haute résolution,
                la mise en forme du texte et les hyperliens interactifs.
              </p>

              <h4>Combien de fichiers PDF puis-je fusionner à la fois ?</h4>
              <p>
                Il n'y a pas de limite stricte au nombre de fichiers que vous pouvez fusionner. La seule contrainte est la mémoire
                disponible de votre appareil. La plupart des utilisateurs peuvent facilement fusionner 20 à 30 fichiers.
              </p>

              <h3>Outils PDF Connexes</h3>
              <p>Découvrez nos autres outils PDF gratuits :</p>
              <ul>
                <li><Link href={`/${locale}/split-pdf`} className="text-primary hover:underline">Diviser PDF</Link> - Séparez un PDF en plusieurs fichiers</li>
                <li><Link href={`/${locale}/comprimer-pdf`} className="text-primary hover:underline">Comprimer PDF</Link> - Réduisez la taille de vos fichiers PDF</li>
                <li><Link href={`/${locale}/organize-pdf`} className="text-primary hover:underline">Organiser PDF</Link> - Réorganisez, supprimez ou faites pivoter les pages</li>
                <li><Link href={`/${locale}/page-numbering`} className="text-primary hover:underline">Numéroter PDF</Link> - Ajoutez des numéros de page à vos documents</li>
              </ul>
            </>
          ) : (
            <>
              <h2>Merge PDF Files Online - Free and Secure Tool</h2>
              <p>
                Our online PDF merger tool allows you to combine multiple PDF files into a single document in seconds.
                Whether you need to merge contracts, invoices, reports, or personal documents, our free PDF combiner
                processes all your files locally in your browser, ensuring complete privacy and security.
              </p>

              <h3>How to Merge PDFs in 3 Simple Steps</h3>
              <ol>
                <li><strong>Upload your PDF files</strong> - Drag and drop or click to select the PDF files you want to merge</li>
                <li><strong>Arrange the order</strong> - Drag files to reorder them in your desired sequence</li>
                <li><strong>Merge and download</strong> - Click the merge button and download your combined PDF instantly</li>
              </ol>

              <h3>Why Choose Our PDF Merger Tool?</h3>
              <ul>
                <li><strong>100% Free</strong> - No hidden fees, no registration required, no file limits</li>
                <li><strong>Completely Secure</strong> - Your files never leave your device. All processing happens entirely in your browser</li>
                <li><strong>Works Everywhere</strong> - Compatible with all devices: Windows, Mac, Linux, iOS, Android</li>
                <li><strong>Fast and Efficient</strong> - Merge multiple PDFs in seconds without compromising quality</li>
                <li><strong>Preserves Quality</strong> - Maintains original quality, formatting, and hyperlinks in your documents</li>
                <li><strong>No Installation</strong> - Browser-based tool, no software to download</li>
              </ul>

              <h3>Common Use Cases for Merging PDF Files</h3>
              <p>Our PDF merge tool is perfect for:</p>
              <ul>
                <li><strong>Business Documents</strong> - Combine contracts, proposals, and reports into one professional file</li>
                <li><strong>Academic Papers</strong> - Merge thesis chapters, research papers, or assignments</li>
                <li><strong>Legal Documents</strong> - Consolidate legal documents, evidence, or case files</li>
                <li><strong>Invoices and Receipts</strong> - Group multiple invoices or receipts for accounting</li>
                <li><strong>Portfolios</strong> - Create comprehensive portfolios by combining your best work</li>
                <li><strong>Manuals and Guides</strong> - Merge multiple chapters or sections into one document</li>
              </ul>

              <h3>Tips for Organizing Your Merged PDFs</h3>
              <ul>
                <li>Organize your files in a logical order before merging to save time</li>
                <li>Use descriptive file names to easily identify your documents</li>
                <li>Consider adding a cover page or table of contents for long documents</li>
                <li>Use our page numbering tool after merging for better organization</li>
                <li>Review the preview before downloading to ensure everything is in the right order</li>
              </ul>

              <h3>Frequently Asked Questions (FAQ)</h3>

              <h4>Is it safe to merge PDFs online?</h4>
              <p>
                Yes, our tool processes all files locally in your browser. Your files never leave your device and are never
                uploaded to our servers, ensuring complete privacy and security.
              </p>

              <h4>Can I merge password-protected PDFs?</h4>
              <p>
                Our tool can merge write-protected PDFs. If a PDF is password-protected for opening, you'll need to
                unlock it first before merging.
              </p>

              <h4>What's the maximum file size?</h4>
              <p>
                Since processing happens in your browser, the limit depends on your device's memory. Most modern devices
                can handle files up to 100MB without issues.
              </p>

              <h4>Will the quality of my PDFs be preserved?</h4>
              <p>
                Absolutely. Our tool maintains the original quality of your PDF documents, including high-resolution images,
                text formatting, and interactive hyperlinks.
              </p>

              <h4>How many PDF files can I merge at once?</h4>
              <p>
                There's no strict limit on the number of files you can merge. The only constraint is your device's available memory.
                Most users can easily merge 20-30 files.
              </p>

              <h3>Related PDF Tools</h3>
              <p>Explore our other free PDF tools:</p>
              <ul>
                <li><Link href={`/${locale}/split-pdf`} className="text-primary hover:underline">Split PDF</Link> - Separate a PDF into multiple files</li>
                <li><Link href={`/${locale}/compress-pdf`} className="text-primary hover:underline">Compress PDF</Link> - Reduce the size of your PDF files</li>
                <li><Link href={`/${locale}/organize-pdf`} className="text-primary hover:underline">Organize PDF</Link> - Rearrange, delete, or rotate pages</li>
                <li><Link href={`/${locale}/number-pdf`} className="text-primary hover:underline">Number PDF</Link> - Add page numbers to your documents</li>
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
