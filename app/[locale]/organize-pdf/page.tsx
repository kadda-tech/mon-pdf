"use client"

import { useTranslations } from 'next-intl'
import { PDFOrganizeTool } from "@/components/pdf-organize-tool"
import { Button } from "@/components/ui/button"
import { useRouter, usePathname } from 'next/navigation'
import { LanguageSwitcher } from "@/components/language-switcher"
import { BookmarkButton } from "@/components/bookmark-button"
import Link from 'next/link'
import Script from 'next/script'
import {SiteFooter} from "@/components/site-footer";

export default function OrganizePDFPage() {
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
      "name": locale === 'fr' ? "Organiser PDF" : "Organize PDF",
      "item": `https://mon-pdf.fr/${locale}/${locale === 'fr' ? 'organiser-pdf' : 'organize-pdf'}`
    }]
  }

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": locale === 'fr' ? "Comment organiser les pages d'un PDF" : "How to Organize PDF Pages",
    "description": locale === 'fr'
      ? "Guide étape par étape pour réorganiser les pages d'un fichier PDF"
      : "Step-by-step guide to rearrange PDF pages",
    "step": [
      {
        "@type": "HowToStep",
        "name": locale === 'fr' ? "Télécharger le fichier PDF" : "Upload PDF file",
        "text": locale === 'fr'
          ? "Glissez-déposez ou cliquez pour télécharger votre fichier PDF à organiser"
          : "Drag and drop or click to upload your PDF file to organize"
      },
      {
        "@type": "HowToStep",
        "name": locale === 'fr' ? "Réorganiser les pages" : "Rearrange pages",
        "text": locale === 'fr'
          ? "Faites glisser les pages pour les réorganiser, supprimez ou faites pivoter les pages selon vos besoins"
          : "Drag pages to reorder, delete or rotate pages as needed"
      },
      {
        "@type": "HowToStep",
        "name": locale === 'fr' ? "Télécharger le PDF organisé" : "Download organized PDF",
        "text": locale === 'fr'
          ? "Cliquez sur télécharger pour obtenir votre PDF organisé"
          : "Click download to get your organized PDF"
      }
    ]
  }

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": locale === 'fr' ? "Organiser PDF en Ligne" : "Organize PDF Online",
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
      "reviewCount": "1654"
    }
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": locale === 'fr' ? [
      {
        "@type": "Question",
        "name": "Comment réorganiser les pages d'un PDF ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Téléchargez votre PDF, puis faites simplement glisser les pages dans l'ordre souhaité. Vous pouvez également supprimer, pivoter ou dupliquer des pages selon vos besoins."
        }
      },
      {
        "@type": "Question",
        "name": "Puis-je faire pivoter des pages individuelles ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Oui, notre outil vous permet de faire pivoter chaque page individuellement à 90°, 180° ou 270°, parfait pour corriger l'orientation des pages scannées."
        }
      },
      {
        "@type": "Question",
        "name": "Les modifications sont-elles permanentes ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Les modifications sont appliquées au fichier téléchargé. Votre PDF original reste intact jusqu'à ce que vous téléchargiez la version organisée."
        }
      }
    ] : [
      {
        "@type": "Question",
        "name": "How do I rearrange PDF pages?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Upload your PDF, then simply drag pages into your desired order. You can also delete, rotate, or duplicate pages as needed."
        }
      },
      {
        "@type": "Question",
        "name": "Can I rotate individual pages?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, our tool allows you to rotate each page individually by 90°, 180°, or 270°, perfect for fixing orientation of scanned pages."
        }
      },
      {
        "@type": "Question",
        "name": "Are the changes permanent?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Changes are applied to the downloaded file. Your original PDF remains intact until you download the organized version."
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
                {locale === 'fr' ? 'Organiser PDF' : 'Organize PDF'}
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
                ? 'Organiser un PDF en Ligne - Réorganiser Pages PDF Gratuitement'
                : 'Organize PDF Online - Rearrange PDF Pages for Free'}
            </h1>
            <p className="text-center text-muted-foreground mb-8">
              {locale === 'fr'
                ? 'Réorganisez, supprimez, faites pivoter ou dupliquez des pages PDF. 100% gratuit, sécurisé et privé.'
                : 'Rearrange, delete, rotate, or duplicate PDF pages. 100% free, secure, and private.'}
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <PDFOrganizeTool />
          </div>

        {/* SEO Content */}
        <div className="max-w-4xl mx-auto mt-16 prose prose-slate dark:prose-invert">
          {locale === 'fr' ? (
            <>
              <h2>Organiser un PDF en Ligne - Outil Gratuit et Sécurisé</h2>
              <p>
                Notre outil d'organisation PDF en ligne vous permet de réorganiser, supprimer, faire pivoter ou dupliquer des pages PDF en quelques clics.
                Que vous ayez besoin de corriger l'ordre des pages, de supprimer des pages inutiles ou de faire pivoter des pages mal orientées,
                notre outil gratuit traite tous vos fichiers localement dans votre navigateur, garantissant une confidentialité totale.
              </p>

              <h3>Comment Organiser un PDF en 3 Étapes Simples</h3>
              <ol>
                <li><strong>Téléchargez votre fichier PDF</strong> - Glissez-déposez ou cliquez pour sélectionner le PDF à organiser</li>
                <li><strong>Réorganisez les pages</strong> - Faites glisser les pages pour les réorganiser, supprimez ou faites pivoter les pages</li>
                <li><strong>Téléchargez le PDF organisé</strong> - Cliquez sur télécharger pour obtenir votre PDF réorganisé</li>
              </ol>

              <h3>Fonctionnalités d'Organisation PDF</h3>
              <ul>
                <li><strong>Réorganiser les Pages</strong> - Glissez-déposez les pages dans l'ordre souhaité par simple glissement</li>
                <li><strong>Supprimer des Pages</strong> - Supprimez les pages inutiles ou indésirables en un clic</li>
                <li><strong>Faire Pivoter les Pages</strong> - Corrigez l'orientation des pages à 90°, 180° ou 270°</li>
                <li><strong>Dupliquer des Pages</strong> - Créez des copies de pages spécifiques</li>
                <li><strong>100% Gratuit</strong> - Aucun frais caché, aucune inscription requise</li>
                <li><strong>Totalement Sécurisé</strong> - Vos fichiers restent sur votre appareil, traitement local uniquement</li>
              </ul>

              <h3>Cas d'Utilisation pour Organiser des PDF</h3>
              <p>Notre outil d'organisation PDF est parfait pour :</p>
              <ul>
                <li><strong>Corriger l'Ordre des Pages</strong> - Réorganisez les pages qui ont été scannées ou fusionnées dans le mauvais ordre</li>
                <li><strong>Pages Scannées</strong> - Faites pivoter les pages scannées dans la mauvaise orientation</li>
                <li><strong>Supprimer Pages Vierges</strong> - Éliminez les pages blanches ou inutiles d'un document</li>
                <li><strong>Créer des Présentations</strong> - Réorganisez les diapositives pour une meilleure présentation</li>
                <li><strong>Préparer des Documents</strong> - Organisez les pages avant de fusionner ou de partager</li>
                <li><strong>Formulaires et Contrats</strong> - Réorganisez les sections de documents légaux ou de formulaires</li>
              </ul>

              <h3>Conseils pour Organiser Efficacement vos PDF</h3>
              <ul>
                <li>Prévisualisez toutes les pages avant de réorganiser pour identifier les changements nécessaires</li>
                <li>Utilisez la fonction de rotation pour corriger les pages scannées mal orientées</li>
                <li>Supprimez les pages vierges pour réduire la taille du fichier final</li>
                <li>Dupliquez les pages qui doivent apparaître plusieurs fois dans le document</li>
                <li>Organisez avant de fusionner plusieurs PDF pour un meilleur flux de document</li>
              </ul>

              <h3>Foire Aux Questions (FAQ)</h3>

              <h4>Comment réorganiser les pages d'un PDF ?</h4>
              <p>
                Téléchargez votre PDF, puis faites simplement glisser les pages dans l'ordre souhaité. Vous pouvez également
                supprimer, pivoter ou dupliquer des pages selon vos besoins. Toutes les modifications se font en temps réel
                dans l'aperçu.
              </p>

              <h4>Puis-je faire pivoter des pages individuelles ?</h4>
              <p>
                Oui, notre outil vous permet de faire pivoter chaque page individuellement à 90°, 180° ou 270°. C'est parfait
                pour corriger l'orientation des pages scannées ou des images insérées dans le mauvais sens.
              </p>

              <h4>Les modifications sont-elles permanentes ?</h4>
              <p>
                Les modifications sont appliquées au fichier téléchargé. Votre PDF original reste intact sur votre appareil
                jusqu'à ce que vous téléchargiez la version organisée. Vous pouvez toujours recommencer si nécessaire.
              </p>

              <h4>Puis-je supprimer plusieurs pages à la fois ?</h4>
              <p>
                Oui, vous pouvez sélectionner et supprimer plusieurs pages simultanément. Cela facilite le nettoyage
                des documents avec de nombreuses pages inutiles.
              </p>

              <h4>Y a-t-il une limite au nombre de pages ?</h4>
              <p>
                Non, vous pouvez organiser des PDF de n'importe quelle taille. La seule limite est la mémoire de votre appareil.
                Notre outil gère efficacement les documents avec des centaines de pages.
              </p>

              <h3>Outils PDF Connexes</h3>
              <p>Découvrez nos autres outils PDF gratuits :</p>
              <ul>
                <li><Link href={`/${locale}/merge-pdf`} className="text-primary hover:underline">Fusionner PDF</Link> - Combinez plusieurs fichiers PDF en un seul</li>
                <li><Link href={`/${locale}/split-pdf`} className="text-primary hover:underline">Diviser PDF</Link> - Séparez un PDF en plusieurs fichiers</li>
                <li><Link href={`/${locale}/comprimer-pdf`} className="text-primary hover:underline">Comprimer PDF</Link> - Réduisez la taille de vos fichiers PDF</li>
                <li><Link href={`/${locale}/page-numbering`} className="text-primary hover:underline">Numéroter PDF</Link> - Ajoutez des numéros de page à vos documents</li>
              </ul>
            </>
          ) : (
            <>
              <h2>Organize PDF Online - Free and Secure Tool</h2>
              <p>
                Our online PDF organizer tool allows you to rearrange, delete, rotate, or duplicate PDF pages in just a few clicks.
                Whether you need to fix page order, remove unnecessary pages, or rotate misaligned pages,
                our free tool processes all your files locally in your browser, ensuring complete privacy.
              </p>

              <h3>How to Organize a PDF in 3 Simple Steps</h3>
              <ol>
                <li><strong>Upload your PDF file</strong> - Drag and drop or click to select the PDF to organize</li>
                <li><strong>Rearrange pages</strong> - Drag pages to reorder, delete or rotate pages as needed</li>
                <li><strong>Download organized PDF</strong> - Click download to get your reorganized PDF</li>
              </ol>

              <h3>PDF Organization Features</h3>
              <ul>
                <li><strong>Rearrange Pages</strong> - Drag and drop pages into your desired order with simple dragging</li>
                <li><strong>Delete Pages</strong> - Remove unnecessary or unwanted pages with one click</li>
                <li><strong>Rotate Pages</strong> - Fix page orientation by 90°, 180°, or 270°</li>
                <li><strong>Duplicate Pages</strong> - Create copies of specific pages</li>
                <li><strong>100% Free</strong> - No hidden fees, no registration required</li>
                <li><strong>Completely Secure</strong> - Your files stay on your device, local processing only</li>
              </ul>

              <h3>Use Cases for Organizing PDFs</h3>
              <p>Our PDF organization tool is perfect for:</p>
              <ul>
                <li><strong>Fix Page Order</strong> - Rearrange pages that were scanned or merged in the wrong order</li>
                <li><strong>Scanned Pages</strong> - Rotate pages scanned in the wrong orientation</li>
                <li><strong>Remove Blank Pages</strong> - Eliminate blank or unnecessary pages from a document</li>
                <li><strong>Create Presentations</strong> - Rearrange slides for better presentation flow</li>
                <li><strong>Prepare Documents</strong> - Organize pages before merging or sharing</li>
                <li><strong>Forms and Contracts</strong> - Rearrange sections of legal documents or forms</li>
              </ul>

              <h3>Tips for Organizing PDFs Effectively</h3>
              <ul>
                <li>Preview all pages before rearranging to identify necessary changes</li>
                <li>Use the rotate function to fix misaligned scanned pages</li>
                <li>Delete blank pages to reduce final file size</li>
                <li>Duplicate pages that need to appear multiple times in the document</li>
                <li>Organize before merging multiple PDFs for better document flow</li>
              </ul>

              <h3>Frequently Asked Questions (FAQ)</h3>

              <h4>How do I rearrange PDF pages?</h4>
              <p>
                Upload your PDF, then simply drag pages into your desired order. You can also delete, rotate, or duplicate
                pages as needed. All changes happen in real-time in the preview.
              </p>

              <h4>Can I rotate individual pages?</h4>
              <p>
                Yes, our tool allows you to rotate each page individually by 90°, 180°, or 270°. This is perfect for
                fixing orientation of scanned pages or images inserted in the wrong direction.
              </p>

              <h4>Are the changes permanent?</h4>
              <p>
                Changes are applied to the downloaded file. Your original PDF remains intact on your device until you
                download the organized version. You can always start over if needed.
              </p>

              <h4>Can I delete multiple pages at once?</h4>
              <p>
                Yes, you can select and delete multiple pages simultaneously. This makes it easy to clean up
                documents with many unnecessary pages.
              </p>

              <h4>Is there a limit on the number of pages?</h4>
              <p>
                No, you can organize PDFs of any size. The only limit is your device's memory. Our tool efficiently
                handles documents with hundreds of pages.
              </p>

              <h3>Related PDF Tools</h3>
              <p>Explore our other free PDF tools:</p>
              <ul>
                <li><Link href={`/${locale}/merge-pdf`} className="text-primary hover:underline">Merge PDF</Link> - Combine multiple PDF files into one</li>
                <li><Link href={`/${locale}/split-pdf`} className="text-primary hover:underline">Split PDF</Link> - Separate a PDF into multiple files</li>
                <li><Link href={`/${locale}/compress-pdf`} className="text-primary hover:underline">Compress PDF</Link> - Reduce the size of your PDF files</li>
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
