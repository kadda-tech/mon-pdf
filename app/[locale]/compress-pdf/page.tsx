"use client"

import { useTranslations } from 'next-intl'
import { PDFCompressTool } from "@/components/pdf-compress-tool"
import { Button } from "@/components/ui/button"
import { useRouter, usePathname } from 'next/navigation'
import { LanguageSwitcher } from "@/components/language-switcher"
import { BookmarkButton } from "@/components/bookmark-button"
import Link from 'next/link'
import Script from 'next/script'
import {SiteFooter} from "@/components/site-footer";

export default function CompressPDFPage() {
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
      "name": locale === 'fr' ? "Compresser PDF" : "Compress PDF",
      "item": `https://mon-pdf.fr/${locale}/${locale === 'fr' ? 'compresser-pdf' : 'compress-pdf'}`
    }]
  }

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": locale === 'fr' ? "Comment compresser un fichier PDF" : "How to Compress a PDF File",
    "description": locale === 'fr'
      ? "Guide étape par étape pour réduire la taille d'un fichier PDF"
      : "Step-by-step guide to reduce PDF file size",
    "step": [
      {
        "@type": "HowToStep",
        "name": locale === 'fr' ? "Télécharger le fichier PDF" : "Upload PDF file",
        "text": locale === 'fr'
          ? "Glissez-déposez ou cliquez pour télécharger votre fichier PDF à compresser"
          : "Drag and drop or click to upload your PDF file to compress"
      },
      {
        "@type": "HowToStep",
        "name": locale === 'fr' ? "Choisir le niveau de compression" : "Select compression level",
        "text": locale === 'fr'
          ? "Choisissez entre compression standard, forte ou maximale selon vos besoins"
          : "Choose between standard, high, or maximum compression based on your needs"
      },
      {
        "@type": "HowToStep",
        "name": locale === 'fr' ? "Compresser et télécharger" : "Compress and download",
        "text": locale === 'fr'
          ? "Cliquez sur compresser et téléchargez votre PDF optimisé"
          : "Click compress and download your optimized PDF"
      }
    ]
  }

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": locale === 'fr' ? "Compresser PDF en Ligne" : "Compress PDF Online",
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
      "reviewCount": "3142"
    }
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": locale === 'fr' ? [
      {
        "@type": "Question",
        "name": "Comment compresser un PDF sans perte de qualité ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Notre outil offre plusieurs niveaux de compression. Utilisez la compression standard pour une réduction modérée tout en maintenant une excellente qualité visuelle. Pour les documents avec beaucoup d'images, la compression forte peut réduire significativement la taille sans perte notable."
        }
      },
      {
        "@type": "Question",
        "name": "Quelle est la réduction de taille moyenne ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "La réduction dépend du contenu de votre PDF. Les fichiers avec beaucoup d'images peuvent être réduits de 50-80%, tandis que les PDF principalement textuels peuvent voir une réduction de 20-40%."
        }
      },
      {
        "@type": "Question",
        "name": "Mes fichiers sont-ils en sécurité ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Oui, tous les fichiers sont traités localement dans votre navigateur. Vos documents ne sont jamais téléchargés sur nos serveurs, garantissant une confidentialité totale."
        }
      }
    ] : [
      {
        "@type": "Question",
        "name": "How to compress PDF without losing quality?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our tool offers multiple compression levels. Use standard compression for moderate reduction while maintaining excellent visual quality. For documents with many images, high compression can significantly reduce size without noticeable loss."
        }
      },
      {
        "@type": "Question",
        "name": "What is the average size reduction?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The reduction depends on your PDF content. Files with many images can be reduced by 50-80%, while text-heavy PDFs may see 20-40% reduction."
        }
      },
      {
        "@type": "Question",
        "name": "Are my files secure?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, all files are processed locally in your browser. Your documents are never uploaded to our servers, ensuring complete privacy."
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
                {locale === 'fr' ? 'Compresser PDF' : 'Compress PDF'}
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
                ? 'Compresser un PDF en Ligne - Réduire la Taille PDF Gratuitement'
                : 'Compress PDF Online - Reduce PDF File Size for Free'}
            </h1>
            <p className="text-center text-muted-foreground mb-8">
              {locale === 'fr'
                ? 'Réduisez la taille de vos fichiers PDF sans perte de qualité. 100% gratuit, sécurisé et privé.'
                : 'Reduce PDF file size without losing quality. 100% free, secure, and private.'}
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <PDFCompressTool />
          </div>

        {/* SEO Content */}
        <div className="max-w-4xl mx-auto mt-16 prose prose-slate dark:prose-invert">
          {locale === 'fr' ? (
            <>
              <h2>Compresser un PDF en Ligne - Outil Gratuit et Sécurisé</h2>
              <p>
                Notre compresseur PDF en ligne vous permet de réduire la taille de vos fichiers PDF sans compromettre la qualité.
                Que vous ayez besoin de compresser des documents pour l'envoi par email, le stockage dans le cloud ou le partage en ligne,
                notre outil gratuit optimise vos PDF en quelques secondes. Tous les fichiers sont traités localement dans votre navigateur,
                garantissant une confidentialité et une sécurité totales.
              </p>

              <h3>Comment Compresser un PDF en 3 Étapes Simples</h3>
              <ol>
                <li><strong>Téléchargez votre fichier PDF</strong> - Glissez-déposez ou cliquez pour sélectionner le PDF à compresser</li>
                <li><strong>Choisissez le niveau de compression</strong> - Sélectionnez entre compression standard, forte ou maximale selon vos besoins</li>
                <li><strong>Compressez et téléchargez</strong> - Cliquez sur compresser et téléchargez votre PDF optimisé instantanément</li>
              </ol>

              <h3>Pourquoi Compresser vos Fichiers PDF ?</h3>
              <ul>
                <li><strong>Envoi par Email Facilité</strong> - Les PDF compressés sont plus faciles à envoyer par email sans dépasser les limites de taille</li>
                <li><strong>Économie d'Espace de Stockage</strong> - Réduisez l'espace utilisé sur votre disque dur ou dans le cloud</li>
                <li><strong>Chargement Plus Rapide</strong> - Les fichiers plus petits se chargent plus rapidement en ligne</li>
                <li><strong>Partage Simplifié</strong> - Partagez des documents volumineux plus facilement via des plateformes en ligne</li>
                <li><strong>Bande Passante Réduite</strong> - Économisez de la bande passante lors du téléchargement ou du partage</li>
              </ul>

              <h3>Niveaux de Compression PDF</h3>
              <p>Notre outil offre plusieurs niveaux de compression pour répondre à vos besoins spécifiques :</p>
              <ul>
                <li><strong>Compression Standard</strong> - Réduit la taille de 30-50% tout en maintenant une excellente qualité visuelle. Idéal pour la plupart des usages</li>
                <li><strong>Compression Forte</strong> - Réduit la taille de 50-70% avec une légère perte de qualité. Parfait pour les documents à usage web</li>
                <li><strong>Compression Maximale</strong> - Réduit la taille de 70-90% pour les fichiers les plus petits possibles. Recommandé pour les documents textuels</li>
              </ul>

              <h3>Cas d'Utilisation de la Compression PDF</h3>
              <p>Compressez vos PDF dans ces situations :</p>
              <ul>
                <li><strong>Envoi par Email</strong> - Respectez les limites de taille des pièces jointes (généralement 25 Mo)</li>
                <li><strong>Sites Web</strong> - Accélérez le chargement des PDF sur votre site web</li>
                <li><strong>Stockage Cloud</strong> - Économisez de l'espace sur Google Drive, Dropbox ou OneDrive</li>
                <li><strong>Archives</strong> - Réduisez l'espace nécessaire pour archiver des documents</li>
                <li><strong>Formulaires en Ligne</strong> - Respectez les limites de téléchargement des formulaires web</li>
                <li><strong>Présentations</strong> - Réduisez la taille de présentations PDF avec beaucoup d'images</li>
              </ul>

              <h3>Conseils pour Optimiser la Compression PDF</h3>
              <ul>
                <li>Pour les documents principalement textuels, utilisez la compression maximale sans perte de lisibilité</li>
                <li>Pour les PDF avec images importantes, préférez la compression standard ou forte</li>
                <li>Testez différents niveaux de compression pour trouver le meilleur équilibre taille/qualité</li>
                <li>Compressez avant de fusionner plusieurs PDF pour obtenir le fichier final le plus petit</li>
                <li>Pour les documents scannés, envisagez d'utiliser l'OCR avant la compression</li>
              </ul>

              <h3>Foire Aux Questions (FAQ)</h3>

              <h4>Comment compresser un PDF sans perte de qualité ?</h4>
              <p>
                Notre outil offre plusieurs niveaux de compression. Utilisez la compression standard pour une réduction modérée
                tout en maintenant une excellente qualité visuelle. Pour les documents avec beaucoup d'images, la compression forte
                peut réduire significativement la taille sans perte notable.
              </p>

              <h4>Quelle est la réduction de taille moyenne ?</h4>
              <p>
                La réduction dépend du contenu de votre PDF. Les fichiers avec beaucoup d'images peuvent être réduits de 50-80%,
                tandis que les PDF principalement textuels peuvent voir une réduction de 20-40%. Les documents déjà optimisés
                peuvent avoir une réduction plus limitée.
              </p>

              <h4>Mes fichiers sont-ils en sécurité ?</h4>
              <p>
                Oui, tous les fichiers sont traités localement dans votre navigateur. Vos documents ne sont jamais téléchargés
                sur nos serveurs, garantissant une confidentialité totale. Les fichiers sont automatiquement supprimés de votre
                navigateur une fois que vous fermez la page.
              </p>

              <h4>Puis-je compresser plusieurs PDF à la fois ?</h4>
              <p>
                Actuellement, notre outil compresse un fichier à la fois pour garantir la meilleure qualité et performance.
                Vous pouvez compresser plusieurs fichiers en les traitant successivement.
              </p>

              <h4>La compression affecte-t-elle les liens et les formulaires ?</h4>
              <p>
                Non, la compression optimise uniquement les images et les éléments graphiques. Les liens hypertextes,
                les formulaires interactifs et les signets sont préservés intacts.
              </p>

              <h3>Outils PDF Connexes</h3>
              <p>Découvrez nos autres outils PDF gratuits :</p>
              <ul>
                <li><Link href={`/${locale}/merge-pdf`} className="text-primary hover:underline">Fusionner PDF</Link> - Combinez plusieurs fichiers PDF en un seul</li>
                <li><Link href={`/${locale}/split-pdf`} className="text-primary hover:underline">Diviser PDF</Link> - Séparez un PDF en plusieurs fichiers</li>
                <li><Link href={`/${locale}/organize-pdf`} className="text-primary hover:underline">Organiser PDF</Link> - Réorganisez, supprimez ou faites pivoter les pages</li>
                <li><Link href={`/${locale}/page-numbering`} className="text-primary hover:underline">Numéroter PDF</Link> - Ajoutez des numéros de page à vos documents</li>
              </ul>
            </>
          ) : (
            <>
              <h2>Compress PDF Online - Free and Secure Tool</h2>
              <p>
                Our online PDF compressor allows you to reduce PDF file size without compromising quality.
                Whether you need to compress documents for email sending, cloud storage, or online sharing,
                our free tool optimizes your PDFs in seconds. All files are processed locally in your browser,
                ensuring complete privacy and security.
              </p>

              <h3>How to Compress a PDF in 3 Simple Steps</h3>
              <ol>
                <li><strong>Upload your PDF file</strong> - Drag and drop or click to select the PDF to compress</li>
                <li><strong>Choose compression level</strong> - Select between standard, high, or maximum compression based on your needs</li>
                <li><strong>Compress and download</strong> - Click compress and download your optimized PDF instantly</li>
              </ol>

              <h3>Why Compress Your PDF Files?</h3>
              <ul>
                <li><strong>Easier Email Sending</strong> - Compressed PDFs are easier to email without exceeding size limits</li>
                <li><strong>Storage Space Savings</strong> - Reduce space used on your hard drive or in the cloud</li>
                <li><strong>Faster Loading</strong> - Smaller files load faster online</li>
                <li><strong>Simplified Sharing</strong> - Share large documents more easily via online platforms</li>
                <li><strong>Reduced Bandwidth</strong> - Save bandwidth when uploading or sharing</li>
              </ul>

              <h3>PDF Compression Levels</h3>
              <p>Our tool offers multiple compression levels to meet your specific needs:</p>
              <ul>
                <li><strong>Standard Compression</strong> - Reduces size by 30-50% while maintaining excellent visual quality. Ideal for most uses</li>
                <li><strong>High Compression</strong> - Reduces size by 50-70% with slight quality loss. Perfect for web documents</li>
                <li><strong>Maximum Compression</strong> - Reduces size by 70-90% for the smallest possible files. Recommended for text documents</li>
              </ul>

              <h3>PDF Compression Use Cases</h3>
              <p>Compress your PDFs in these situations:</p>
              <ul>
                <li><strong>Email Sending</strong> - Meet attachment size limits (typically 25 MB)</li>
                <li><strong>Websites</strong> - Speed up PDF loading on your website</li>
                <li><strong>Cloud Storage</strong> - Save space on Google Drive, Dropbox, or OneDrive</li>
                <li><strong>Archives</strong> - Reduce space needed to archive documents</li>
                <li><strong>Online Forms</strong> - Meet upload limits for web forms</li>
                <li><strong>Presentations</strong> - Reduce size of PDF presentations with many images</li>
              </ul>

              <h3>Tips for Optimizing PDF Compression</h3>
              <ul>
                <li>For primarily text documents, use maximum compression without losing readability</li>
                <li>For PDFs with important images, prefer standard or high compression</li>
                <li>Test different compression levels to find the best size/quality balance</li>
                <li>Compress before merging multiple PDFs to get the smallest final file</li>
                <li>For scanned documents, consider using OCR before compression</li>
              </ul>

              <h3>Frequently Asked Questions (FAQ)</h3>

              <h4>How to compress PDF without losing quality?</h4>
              <p>
                Our tool offers multiple compression levels. Use standard compression for moderate reduction
                while maintaining excellent visual quality. For documents with many images, high compression
                can significantly reduce size without noticeable loss.
              </p>

              <h4>What is the average size reduction?</h4>
              <p>
                The reduction depends on your PDF content. Files with many images can be reduced by 50-80%,
                while text-heavy PDFs may see 20-40% reduction. Already optimized documents may have more
                limited reduction.
              </p>

              <h4>Are my files secure?</h4>
              <p>
                Yes, all files are processed locally in your browser. Your documents are never uploaded
                to our servers, ensuring complete privacy. Files are automatically removed from your
                browser once you close the page.
              </p>

              <h4>Can I compress multiple PDFs at once?</h4>
              <p>
                Currently, our tool compresses one file at a time to ensure the best quality and performance.
                You can compress multiple files by processing them successively.
              </p>

              <h4>Does compression affect links and forms?</h4>
              <p>
                No, compression only optimizes images and graphics. Hyperlinks, interactive forms,
                and bookmarks are preserved intact.
              </p>

              <h3>Related PDF Tools</h3>
              <p>Explore our other free PDF tools:</p>
              <ul>
                <li><Link href={`/${locale}/merge-pdf`} className="text-primary hover:underline">Merge PDF</Link> - Combine multiple PDF files into one</li>
                <li><Link href={`/${locale}/split-pdf`} className="text-primary hover:underline">Split PDF</Link> - Separate a PDF into multiple files</li>
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
