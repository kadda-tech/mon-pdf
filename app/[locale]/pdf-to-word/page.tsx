"use client"

import { useTranslations } from 'next-intl'
import { Button } from "@/components/ui/button"
import { useRouter, usePathname } from 'next/navigation'
import { LanguageSwitcher } from "@/components/language-switcher"
import { BookmarkButton } from "@/components/bookmark-button"
import Link from 'next/link'
import Script from 'next/script'
import {SiteFooter} from "@/components/site-footer"
import { Loader2 } from 'lucide-react'
import dynamic from 'next/dynamic'

// Lazy load the PDFToWordTool to avoid SSR issues with pdf.js
const PDFToWordTool = dynamic(() => import("@/components/pdf-to-word-tool").then(mod => ({ default: mod.PDFToWordTool })), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">Loading tool...</p>
      </div>
    </div>
  )
})

export default function PDFToWordPage() {
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
      "name": locale === 'fr' ? "PDF vers Word" : "PDF to Word",
      "item": `https://mon-pdf.fr/${locale}/${locale === 'fr' ? 'pdf-vers-word' : 'pdf-to-word'}`
    }]
  }

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": locale === 'fr' ? "Comment convertir un PDF en Word" : "How to Convert PDF to Word",
    "step": [
      {
        "@type": "HowToStep",
        "name": locale === 'fr' ? "Télécharger le PDF" : "Upload PDF",
        "text": locale === 'fr' ? "Téléchargez le fichier PDF à convertir" : "Upload the PDF file to convert"
      },
      {
        "@type": "HowToStep",
        "name": locale === 'fr' ? "Convertir" : "Convert",
        "text": locale === 'fr' ? "Cliquez sur convertir pour extraire le texte" : "Click convert to extract the text"
      },
      {
        "@type": "HowToStep",
        "name": locale === 'fr' ? "Télécharger Word" : "Download Word",
        "text": locale === 'fr' ? "Téléchargez le fichier DOCX" : "Download the DOCX file"
      }
    ]
  }

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": locale === 'fr' ? "Convertir PDF en Word" : "Convert PDF to Word",
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
        "name": "Comment convertir un PDF en Word ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Téléchargez votre PDF, cliquez sur 'Convertir en Word', et notre outil extraira le texte pour créer un document Word éditable que vous pourrez télécharger."
        }
      },
      {
        "@type": "Question",
        "name": "Le formatage est-il préservé ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Le texte et la structure de base sont préservés. Les mises en page complexes (tableaux, colonnes) peuvent nécessiter des ajustements manuels."
        }
      },
      {
        "@type": "Question",
        "name": "Puis-je éditer le document Word après conversion ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Oui, le fichier DOCX généré est entièrement éditable dans Microsoft Word, Google Docs, ou tout autre traitement de texte compatible."
        }
      }
    ] : [
      {
        "@type": "Question",
        "name": "How to convert PDF to Word?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Upload your PDF, click 'Convert to Word', and our tool will extract the text to create an editable Word document you can download."
        }
      },
      {
        "@type": "Question",
        "name": "Is formatting preserved?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Text and basic structure are preserved. Complex layouts (tables, columns) may require manual adjustments."
        }
      },
      {
        "@type": "Question",
        "name": "Can I edit the Word document after conversion?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, the generated DOCX file is fully editable in Microsoft Word, Google Docs, or any compatible word processor."
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
                {locale === 'fr' ? 'PDF vers Word' : 'PDF to Word'}
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
                ? 'Convertir PDF en Word - PDF vers DOCX Gratuit'
                : 'Convert PDF to Word - PDF to DOCX Free'}
            </h1>
            <p className="text-center text-muted-foreground mb-8">
              {locale === 'fr'
                ? 'Extraire texte de PDF en document Word éditable. Conversion rapide et gratuite.'
                : 'Extract text from PDF to editable Word document. Fast and free conversion.'}
            </p>
          </div>

          <PDFToWordTool />

        <div className="max-w-4xl mx-auto mt-16 prose prose-slate dark:prose-invert">
          {locale === 'fr' ? (
            <>
              <h2>Convertir PDF en Word - Outil Gratuit</h2>
              <p>
                Notre convertisseur PDF vers Word vous permet de transformer vos documents PDF en fichiers DOCX éditables.
                Extrayez le texte de vos PDF pour pouvoir les modifier dans Microsoft Word, Google Docs ou tout autre
                traitement de texte. Notre outil traite tout localement dans votre navigateur pour une confidentialité totale.
              </p>

              <h3>Comment Convertir un PDF en Word</h3>
              <ol>
                <li><strong>Téléchargez votre PDF</strong> - Sélectionnez le fichier à convertir</li>
                <li><strong>Lancez la conversion</strong> - Cliquez sur "Convertir en Word"</li>
                <li><strong>Téléchargez le DOCX</strong> - Obtenez votre document Word éditable</li>
              </ol>

              <h3>Avantages de Notre Convertisseur</h3>
              <ul>
                <li><strong>Texte Éditable</strong> - Modifiez le contenu extrait dans Word</li>
                <li><strong>Structure Préservée</strong> - Les paragraphes et sections sont maintenus</li>
                <li><strong>Format DOCX</strong> - Compatible avec tous les traitements de texte</li>
                <li><strong>100% Gratuit</strong> - Aucune limite, aucune inscription</li>
                <li><strong>Traitement Local</strong> - Vos fichiers restent privés</li>
                <li><strong>Rapide</strong> - Conversion en quelques secondes</li>
              </ul>

              <h3>Cas d'Utilisation</h3>
              <ul>
                <li><strong>Éditer des PDF</strong> - Convertir pour modifier le contenu</li>
                <li><strong>Extraire du Texte</strong> - Récupérer le texte de documents PDF</li>
                <li><strong>Réutiliser du Contenu</strong> - Adapter du contenu PDF pour d'autres usages</li>
                <li><strong>Corriger des Documents</strong> - Éditer et corriger des PDF</li>
                <li><strong>Reformater</strong> - Changer la mise en page dans Word</li>
                <li><strong>Traduction</strong> - Faciliter la traduction de documents</li>
              </ul>

              <h3>Formats Supportés</h3>
              <ul>
                <li><strong>Entrée</strong> - Fichiers PDF avec texte extractible</li>
                <li><strong>Sortie</strong> - Documents Word DOCX (Office 2007+)</li>
                <li><strong>Compatibilité</strong> - Microsoft Word, Google Docs, LibreOffice</li>
              </ul>

              <h3>Conseils pour Meilleurs Résultats</h3>
              <ul>
                <li><strong>PDF avec Texte</strong> - Fonctionne mieux avec des PDF contenant du texte sélectionnable</li>
                <li><strong>PDF Scannés</strong> - Utilisez d'abord notre outil OCR pour les PDF scannés</li>
                <li><strong>Mise en Page Simple</strong> - Les documents avec mise en page simple convertissent mieux</li>
                <li><strong>Révision Manuelle</strong> - Vérifiez le formatage après conversion</li>
                <li><strong>Tableaux Complexes</strong> - Peuvent nécessiter des ajustements manuels</li>
              </ul>

              <h3>Limitations et Notes</h3>
              <ul>
                <li><strong>Images</strong> - Les images sont automatiquement extraites et incluses dans la conversion</li>
                <li><strong>Tableaux</strong> - Détectés automatiquement et convertis avec structure préservée</li>
                <li><strong>Polices</strong> - Les polices originales sont préservées quand possible</li>
                <li><strong>Formatage</strong> - Les tailles de police, gras et styles sont conservés</li>
                <li><strong>Formulaires</strong> - Les champs de formulaire ne sont pas convertis</li>
              </ul>

              <h3>Foire Aux Questions</h3>

              <h4>Comment convertir un PDF en Word ?</h4>
              <p>
                Téléchargez votre fichier PDF, cliquez sur le bouton "Convertir en Word", et notre outil extraira
                automatiquement le texte pour créer un document Word éditable au format DOCX que vous pourrez télécharger
                et ouvrir dans n'importe quel traitement de texte.
              </p>

              <h4>Le formatage est-il préservé ?</h4>
              <p>
                Le texte et la structure de base (paragraphes, sections) sont préservés. Les titres sont détectés
                automatiquement. Cependant, les mises en page très complexes (tableaux élaborés, colonnes multiples)
                peuvent nécessiter des ajustements manuels après la conversion.
              </p>

              <h4>Puis-je éditer le document Word après conversion ?</h4>
              <p>
                Oui, absolument ! Le fichier DOCX généré est entièrement éditable dans Microsoft Word, Google Docs,
                LibreOffice Writer, ou tout autre traitement de texte compatible avec le format DOCX. Vous pouvez
                modifier le texte, changer le formatage, ajouter ou supprimer du contenu librement.
              </p>

              <h3>Outils Connexes</h3>
              <ul>
                <li><Link href={`/${locale}/ocr`} className="text-primary hover:underline">OCR PDF</Link> - Extraire texte de PDF scannés</li>
                <li><Link href={`/${locale}/merge-pdf`} className="text-primary hover:underline">Fusionner PDF</Link> - Combiner plusieurs PDF</li>
                <li><Link href={`/${locale}/split-pdf`} className="text-primary hover:underline">Diviser PDF</Link> - Séparer un PDF</li>
              </ul>
            </>
          ) : (
            <>
              <h2>Convert PDF to Word - Free Tool</h2>
              <p>
                Our PDF to Word converter allows you to transform your PDF documents into editable DOCX files.
                Extract text from your PDFs to edit them in Microsoft Word, Google Docs, or any other word processor.
                Our tool processes everything locally in your browser for complete privacy.
              </p>

              <h3>How to Convert PDF to Word</h3>
              <ol>
                <li><strong>Upload your PDF</strong> - Select the file to convert</li>
                <li><strong>Start conversion</strong> - Click "Convert to Word"</li>
                <li><strong>Download DOCX</strong> - Get your editable Word document</li>
              </ol>

              <h3>Benefits of Our Converter</h3>
              <ul>
                <li><strong>Editable Text</strong> - Modify the extracted content in Word</li>
                <li><strong>Preserved Structure</strong> - Paragraphs and sections are maintained</li>
                <li><strong>DOCX Format</strong> - Compatible with all word processors</li>
                <li><strong>100% Free</strong> - No limits, no registration</li>
                <li><strong>Local Processing</strong> - Your files stay private</li>
                <li><strong>Fast</strong> - Conversion in seconds</li>
              </ul>

              <h3>Use Cases</h3>
              <ul>
                <li><strong>Edit PDFs</strong> - Convert to modify content</li>
                <li><strong>Extract Text</strong> - Retrieve text from PDF documents</li>
                <li><strong>Reuse Content</strong> - Adapt PDF content for other uses</li>
                <li><strong>Correct Documents</strong> - Edit and correct PDFs</li>
                <li><strong>Reformat</strong> - Change layout in Word</li>
                <li><strong>Translation</strong> - Facilitate document translation</li>
              </ul>

              <h3>Supported Formats</h3>
              <ul>
                <li><strong>Input</strong> - PDF files with extractable text</li>
                <li><strong>Output</strong> - Word DOCX documents (Office 2007+)</li>
                <li><strong>Compatibility</strong> - Microsoft Word, Google Docs, LibreOffice</li>
              </ul>

              <h3>Tips for Best Results</h3>
              <ul>
                <li><strong>Text-based PDFs</strong> - Works best with PDFs containing selectable text</li>
                <li><strong>Scanned PDFs</strong> - Use our OCR tool first for scanned PDFs</li>
                <li><strong>Simple Layout</strong> - Documents with simple layout convert better</li>
                <li><strong>Manual Review</strong> - Check formatting after conversion</li>
                <li><strong>Complex Tables</strong> - May require manual adjustments</li>
              </ul>

              <h3>Limitations and Notes</h3>
              <ul>
                <li><strong>Images</strong> - Images are automatically extracted and included in conversion</li>
                <li><strong>Tables</strong> - Automatically detected and converted with preserved structure</li>
                <li><strong>Fonts</strong> - Original fonts are preserved when possible</li>
                <li><strong>Formatting</strong> - Font sizes, bold, and styles are retained</li>
                <li><strong>Forms</strong> - Form fields are not converted</li>
              </ul>

              <h3>Frequently Asked Questions</h3>

              <h4>How to convert PDF to Word?</h4>
              <p>
                Upload your PDF file, click the "Convert to Word" button, and our tool will automatically extract
                the text to create an editable Word document in DOCX format that you can download and open in
                any word processor.
              </p>

              <h4>Is formatting preserved?</h4>
              <p>
                Text and basic structure (paragraphs, sections) are preserved. Headings are automatically detected.
                However, very complex layouts (elaborate tables, multiple columns) may require manual adjustments
                after conversion.
              </p>

              <h4>Can I edit the Word document after conversion?</h4>
              <p>
                Yes, absolutely! The generated DOCX file is fully editable in Microsoft Word, Google Docs,
                LibreOffice Writer, or any other word processor compatible with the DOCX format. You can modify
                text, change formatting, and add or remove content freely.
              </p>

              <h3>Related Tools</h3>
              <ul>
                <li><Link href={`/${locale}/ocr`} className="text-primary hover:underline">OCR PDF</Link> - Extract text from scanned PDFs</li>
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
