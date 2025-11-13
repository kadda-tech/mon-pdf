"use client"

import { useTranslations } from 'next-intl'
import { PageNumberingTool } from "@/components/page-numbering-tool"
import { Button } from "@/components/ui/button"
import { useRouter, usePathname } from 'next/navigation'
import { LanguageSwitcher } from "@/components/language-switcher"
import { BookmarkButton } from "@/components/bookmark-button"
import Link from 'next/link'
import Script from 'next/script'
import {SiteFooter} from "@/components/site-footer";

export default function PageNumberingPage() {
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
      "name": locale === 'fr' ? "Numéroter PDF" : "Number PDF",
      "item": `https://mon-pdf.fr/${locale}/${locale === 'fr' ? 'page-numbering' : 'number-pdf'}`
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
                {locale === 'fr' ? 'Numéroter PDF' : 'Number PDF'}
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
                ? 'Numéroter un PDF en Ligne - Ajouter Numéros de Page Gratuitement'
                : 'Number PDF Pages Online - Add Page Numbers for Free'}
            </h1>
            <p className="text-center text-muted-foreground mb-8">
              {locale === 'fr'
                ? 'Ajoutez des numéros de page à vos PDF avec position et format personnalisés. 100% gratuit, sécurisé et privé.'
                : 'Add page numbers to your PDFs with custom position and format. 100% free, secure, and private.'}
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <PageNumberingTool />
          </div>

        {/* SEO Content */}
        <div className="max-w-4xl mx-auto mt-16 prose prose-slate dark:prose-invert">
          {locale === 'fr' ? (
            <>
              <h2>Numéroter un PDF en Ligne - Outil Gratuit et Sécurisé</h2>
              <p>
                Notre outil de numérotation PDF en ligne vous permet d'ajouter des numéros de page personnalisés à vos documents PDF.
                Choisissez la position, le format (chiffres arabes ou romains) et le style de vos numéros de page. Notre outil gratuit
                traite tous vos fichiers localement dans votre navigateur, garantissant une confidentialité totale.
              </p>

              <h3>Comment Numéroter un PDF en 3 Étapes Simples</h3>
              <ol>
                <li><strong>Téléchargez votre fichier PDF</strong> - Glissez-déposez ou cliquez pour sélectionner le PDF</li>
                <li><strong>Personnalisez la numérotation</strong> - Choisissez la position, le format et le style des numéros</li>
                <li><strong>Téléchargez le PDF numéroté</strong> - Obtenez votre PDF avec numéros de page professionnels</li>
              </ol>

              <h3>Options de Numérotation Personnalisables</h3>
              <ul>
                <li><strong>Position Flexible</strong> - Placez les numéros en haut ou en bas, alignés à gauche, centre ou droite</li>
                <li><strong>Formats Multiples</strong> - Chiffres arabes (1, 2, 3) ou romains (i, ii, iii / I, II, III)</li>
                <li><strong>Numérotation Personnalisée</strong> - Commencez à partir de n'importe quel numéro</li>
                <li><strong>Style Professionnel</strong> - Choisissez la police, la taille et la couleur</li>
                <li><strong>100% Gratuit</strong> - Aucun frais caché, aucune inscription requise</li>
                <li><strong>Totalement Sécurisé</strong> - Vos fichiers restent sur votre appareil</li>
              </ul>

              <h3>Cas d'Utilisation pour Numéroter des PDF</h3>
              <p>Notre outil de numérotation PDF est parfait pour :</p>
              <ul>
                <li><strong>Documents Académiques</strong> - Ajoutez des numéros de page à vos thèses, mémoires ou rapports</li>
                <li><strong>Livres et Manuels</strong> - Numérotez les pages avec chiffres romains pour les préfaces</li>
                <li><strong>Documents Professionnels</strong> - Ajoutez une pagination professionnelle à vos rapports</li>
                <li><strong>Présentations</strong> - Numérotez les diapositives PDF pour faciliter la référence</li>
                <li><strong>Documents Légaux</strong> - Ajoutez des numéros de page pour la documentation juridique</li>
                <li><strong>Portfolios</strong> - Organisez vos portfolios avec une numérotation claire</li>
              </ul>

              <h3>Formats de Numérotation Disponibles</h3>
              <ul>
                <li><strong>Chiffres Arabes</strong> - 1, 2, 3, 4... (format standard)</li>
                <li><strong>Chiffres Romains Minuscules</strong> - i, ii, iii, iv... (pour préfaces, introductions)</li>
                <li><strong>Chiffres Romains Majuscules</strong> - I, II, III, IV... (pour sections principales)</li>
                <li><strong>Format Personnalisé</strong> - Page 1, Page 2 ou 1/10, 2/10...</li>
              </ul>

              <h3>Conseils pour une Numérotation Efficace</h3>
              <ul>
                <li>Utilisez les chiffres romains pour les sections préliminaires (préface, table des matières)</li>
                <li>Positionnez les numéros de manière cohérente sur toutes les pages</li>
                <li>Choisissez une police et une taille lisibles mais discrètes</li>
                <li>Pour les documents professionnels, préférez le centrage en bas de page</li>
                <li>Vérifiez l'aperçu avant de télécharger pour vous assurer du bon positionnement</li>
              </ul>

              <h3>Foire Aux Questions (FAQ)</h3>

              <h4>Comment ajouter des numéros de page à un PDF ?</h4>
              <p>
                Téléchargez votre PDF, choisissez la position et le format des numéros (1, 2, 3 ou i, ii, iii), puis téléchargez
                le PDF numéroté. Notre outil ajoute automatiquement les numéros à toutes les pages selon vos préférences.
              </p>

              <h4>Puis-je utiliser des chiffres romains ?</h4>
              <p>
                Oui, notre outil prend en charge les chiffres arabes (1, 2, 3) et les chiffres romains minuscules (i, ii, iii)
                ou majuscules (I, II, III) pour la numérotation des pages. C'est idéal pour les documents académiques.
              </p>

              <h4>Puis-je choisir où placer les numéros ?</h4>
              <p>
                Oui, vous pouvez placer les numéros en haut ou en bas de la page, alignés à gauche, au centre ou à droite.
                Choisissez la position qui correspond le mieux à votre document.
              </p>

              <h4>Puis-je commencer la numérotation à partir d'un numéro spécifique ?</h4>
              <p>
                Oui, vous pouvez définir le numéro de départ. C'est utile si vous numérotez un chapitre spécifique
                ou si vous voulez continuer une numérotation existante.
              </p>

              <h4>Les numéros s'ajoutent-ils aux pages existantes ?</h4>
              <p>
                Oui, les numéros sont ajoutés par-dessus le contenu existant du PDF. Si votre document a déjà des numéros,
                vous devrez peut-être les supprimer d'abord en utilisant notre outil d'organisation PDF.
              </p>

              <h3>Outils PDF Connexes</h3>
              <p>Découvrez nos autres outils PDF gratuits :</p>
              <ul>
                <li><Link href={`/${locale}/merge-pdf`} className="text-primary hover:underline">Fusionner PDF</Link> - Combinez plusieurs fichiers PDF en un seul</li>
                <li><Link href={`/${locale}/split-pdf`} className="text-primary hover:underline">Diviser PDF</Link> - Séparez un PDF en plusieurs fichiers</li>
                <li><Link href={`/${locale}/organize-pdf`} className="text-primary hover:underline">Organiser PDF</Link> - Réorganisez, supprimez ou faites pivoter les pages</li>
                <li><Link href={`/${locale}/comprimer-pdf`} className="text-primary hover:underline">Comprimer PDF</Link> - Réduisez la taille de vos fichiers PDF</li>
              </ul>
            </>
          ) : (
            <>
              <h2>Number PDF Pages Online - Free and Secure Tool</h2>
              <p>
                Our online PDF page numbering tool allows you to add custom page numbers to your PDF documents.
                Choose the position, format (Arabic or Roman numerals), and style of your page numbers. Our free tool
                processes all your files locally in your browser, ensuring complete privacy.
              </p>

              <h3>How to Number PDF Pages in 3 Simple Steps</h3>
              <ol>
                <li><strong>Upload your PDF file</strong> - Drag and drop or click to select the PDF</li>
                <li><strong>Customize numbering</strong> - Choose position, format, and style of numbers</li>
                <li><strong>Download numbered PDF</strong> - Get your PDF with professional page numbers</li>
              </ol>

              <h3>Customizable Numbering Options</h3>
              <ul>
                <li><strong>Flexible Position</strong> - Place numbers at top or bottom, aligned left, center, or right</li>
                <li><strong>Multiple Formats</strong> - Arabic numerals (1, 2, 3) or Roman (i, ii, iii / I, II, III)</li>
                <li><strong>Custom Numbering</strong> - Start from any number you choose</li>
                <li><strong>Professional Style</strong> - Choose font, size, and color</li>
                <li><strong>100% Free</strong> - No hidden fees, no registration required</li>
                <li><strong>Completely Secure</strong> - Your files stay on your device</li>
              </ul>

              <h3>Use Cases for Numbering PDFs</h3>
              <p>Our PDF numbering tool is perfect for:</p>
              <ul>
                <li><strong>Academic Documents</strong> - Add page numbers to theses, dissertations, or reports</li>
                <li><strong>Books and Manuals</strong> - Number pages with Roman numerals for prefaces</li>
                <li><strong>Professional Documents</strong> - Add professional pagination to your reports</li>
                <li><strong>Presentations</strong> - Number PDF slides for easy reference</li>
                <li><strong>Legal Documents</strong> - Add page numbers for legal documentation</li>
                <li><strong>Portfolios</strong> - Organize your portfolios with clear numbering</li>
              </ul>

              <h3>Available Numbering Formats</h3>
              <ul>
                <li><strong>Arabic Numerals</strong> - 1, 2, 3, 4... (standard format)</li>
                <li><strong>Lowercase Roman</strong> - i, ii, iii, iv... (for prefaces, introductions)</li>
                <li><strong>Uppercase Roman</strong> - I, II, III, IV... (for main sections)</li>
                <li><strong>Custom Format</strong> - Page 1, Page 2 or 1/10, 2/10...</li>
              </ul>

              <h3>Tips for Effective Page Numbering</h3>
              <ul>
                <li>Use Roman numerals for preliminary sections (preface, table of contents)</li>
                <li>Position numbers consistently across all pages</li>
                <li>Choose a readable but discreet font and size</li>
                <li>For professional documents, prefer centered at bottom</li>
                <li>Check preview before downloading to ensure proper positioning</li>
              </ul>

              <h3>Frequently Asked Questions (FAQ)</h3>

              <h4>How do I add page numbers to a PDF?</h4>
              <p>
                Upload your PDF, choose the position and format of numbers (1, 2, 3 or i, ii, iii), then download
                the numbered PDF. Our tool automatically adds numbers to all pages according to your preferences.
              </p>

              <h4>Can I use Roman numerals?</h4>
              <p>
                Yes, our tool supports both Arabic numerals (1, 2, 3) and lowercase (i, ii, iii) or uppercase
                (I, II, III) Roman numerals for page numbering. This is ideal for academic documents.
              </p>

              <h4>Can I choose where to place the numbers?</h4>
              <p>
                Yes, you can place numbers at the top or bottom of the page, aligned left, center, or right.
                Choose the position that best fits your document.
              </p>

              <h4>Can I start numbering from a specific number?</h4>
              <p>
                Yes, you can set the starting number. This is useful if you're numbering a specific chapter
                or want to continue existing numbering.
              </p>

              <h4>Do numbers add to existing pages?</h4>
              <p>
                Yes, numbers are added on top of existing PDF content. If your document already has numbers,
                you may need to remove them first using our PDF organize tool.
              </p>

              <h3>Related PDF Tools</h3>
              <p>Explore our other free PDF tools:</p>
              <ul>
                <li><Link href={`/${locale}/merge-pdf`} className="text-primary hover:underline">Merge PDF</Link> - Combine multiple PDF files into one</li>
                <li><Link href={`/${locale}/split-pdf`} className="text-primary hover:underline">Split PDF</Link> - Separate a PDF into multiple files</li>
                <li><Link href={`/${locale}/organize-pdf`} className="text-primary hover:underline">Organize PDF</Link> - Rearrange, delete, or rotate pages</li>
                <li><Link href={`/${locale}/compress-pdf`} className="text-primary hover:underline">Compress PDF</Link> - Reduce the size of your PDF files</li>
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
