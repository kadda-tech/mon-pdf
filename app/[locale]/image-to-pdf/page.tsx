"use client"

import { useTranslations } from 'next-intl'
import { ImageToPDFTool } from "@/components/image-to-pdf-tool"
import { Button } from "@/components/ui/button"
import { useRouter, usePathname } from 'next/navigation'
import { LanguageSwitcher } from "@/components/language-switcher"
import { BookmarkButton } from "@/components/bookmark-button"
import Link from 'next/link'
import Script from 'next/script'
import {SiteFooter} from "@/components/site-footer";

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
      "item": `https://mon-pdf.fr/${locale}/${locale === 'fr' ? 'image-vers-pdf' : 'image-to-pdf'}`
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
                {locale === 'fr' ? 'Image vers PDF' : 'Image to PDF'}
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
                ? 'Convertir Images en PDF - JPG, PNG vers PDF Gratuit'
                : 'Convert Images to PDF - JPG, PNG to PDF Free'}
            </h1>
            <p className="text-center text-muted-foreground mb-8">
              {locale === 'fr'
                ? 'Combinez plusieurs images en un seul PDF. Conversion rapide et gratuite. 100% sécurisé.'
                : 'Combine multiple images into a single PDF. Fast and free conversion. 100% secure.'}
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <ImageToPDFTool />
          </div>

        <div className="max-w-4xl mx-auto mt-16 prose prose-slate dark:prose-invert">
          {locale === 'fr' ? (
            <>
              <h2>Convertir Images en PDF - Outil Gratuit</h2>
              <p>
                Notre convertisseur d'images en PDF vous permet de transformer vos photos et images (JPG, PNG, JPEG, etc.) en documents PDF professionnels.
                Que vous ayez besoin de combiner plusieurs photos en un seul fichier, de créer un album photo PDF, ou de convertir des captures d'écran
                en documents partageables, notre outil gratuit traite tout localement dans votre navigateur pour une confidentialité totale.
              </p>

              <h3>Comment Convertir des Images en PDF</h3>
              <ol>
                <li><strong>Téléchargez vos images</strong> - Sélectionnez une ou plusieurs images à convertir</li>
                <li><strong>Organisez l'ordre</strong> - Réorganisez les images selon vos besoins</li>
                <li><strong>Téléchargez le PDF</strong> - Obtenez votre document PDF combiné</li>
              </ol>

              <h3>Formats d'Image Supportés</h3>
              <ul>
                <li><strong>JPG/JPEG</strong> - Format le plus courant pour les photos</li>
                <li><strong>PNG</strong> - Idéal pour les captures d'écran et images avec transparence</li>
                <li><strong>GIF</strong> - Images animées et simples</li>
                <li><strong>BMP</strong> - Format Windows standard</li>
                <li><strong>TIFF</strong> - Format haute qualité pour documents scannés</li>
                <li><strong>WEBP</strong> - Format web moderne et compressé</li>
              </ul>

              <h3>Cas d'Utilisation</h3>
              <ul>
                <li><strong>Albums Photo</strong> - Créez des albums photo PDF à partager avec la famille</li>
                <li><strong>Documents Scannés</strong> - Combinez plusieurs pages scannées en un seul PDF</li>
                <li><strong>Présentations</strong> - Convertissez des images de diapositives en document PDF</li>
                <li><strong>Portfolios</strong> - Créez des portfolios professionnels en PDF</li>
                <li><strong>Factures et Reçus</strong> - Combinez des photos de factures en documents PDF</li>
                <li><strong>Catalogues</strong> - Créez des catalogues produits à partir d'images</li>
              </ul>

              <h3>Avantages de Notre Outil</h3>
              <ul>
                <li><strong>Qualité Préservée</strong> - Les images conservent leur qualité d'origine</li>
                <li><strong>Ordre Personnalisable</strong> - Réorganisez les images par glisser-déposer</li>
                <li><strong>Plusieurs Images</strong> - Combinez autant d'images que vous voulez</li>
                <li><strong>Tous Formats</strong> - Supporte JPG, PNG, GIF, BMP, TIFF, WEBP et plus</li>
                <li><strong>100% Gratuit</strong> - Aucune limite, aucune inscription requise</li>
                <li><strong>Traitement Local</strong> - Vos images ne quittent jamais votre navigateur</li>
              </ul>

              <h3>Conseils pour la Conversion</h3>
              <ul>
                <li><strong>Qualité d'Image</strong> - Utilisez des images haute résolution pour un meilleur résultat</li>
                <li><strong>Orientation Uniforme</strong> - Assurez-vous que toutes les images ont la même orientation</li>
                <li><strong>Taille Cohérente</strong> - Des images de taille similaire donnent un PDF plus professionnel</li>
                <li><strong>Compression</strong> - Compressez vos images avant si le PDF final est trop volumineux</li>
                <li><strong>Ordre Logique</strong> - Organisez vos images dans un ordre qui a du sens</li>
              </ul>

              <h3>Foire Aux Questions</h3>

              <h4>Comment convertir des images en PDF ?</h4>
              <p>
                Téléchargez vos images (JPG, PNG, etc.), organisez-les dans l'ordre souhaité avec notre interface
                glisser-déposer intuitive, et notre outil les combinera automatiquement en un seul fichier PDF
                que vous pourrez télécharger immédiatement.
              </p>

              <h4>Puis-je convertir plusieurs images en un seul PDF ?</h4>
              <p>
                Oui, absolument ! Vous pouvez télécharger autant d'images que vous le souhaitez et les combiner
                en un seul document PDF. Organisez-les simplement dans l'ordre désiré avant la conversion.
                Il n'y a aucune limite au nombre d'images.
              </p>

              <h4>Quels formats d'image sont supportés ?</h4>
              <p>
                Notre outil supporte tous les formats d'image courants : JPG, JPEG, PNG, GIF, BMP, TIFF, WEBP
                et plus encore. La qualité de l'image est préservée lors de la conversion en PDF, garantissant
                un résultat professionnel.
              </p>

              <h3>Outils Connexes</h3>
              <ul>
                <li><Link href={`/${locale}/pdf-vers-images`} className="text-primary hover:underline">PDF vers Images</Link> - Convertir PDF en images</li>
                <li><Link href={`/${locale}/merge-pdf`} className="text-primary hover:underline">Fusionner PDF</Link> - Combiner plusieurs PDF</li>
                <li><Link href={`/${locale}/compresser-pdf`} className="text-primary hover:underline">Compresser PDF</Link> - Réduire la taille du PDF</li>
              </ul>
            </>
          ) : (
            <>
              <h2>Convert Images to PDF - Free Tool</h2>
              <p>
                Our image to PDF converter allows you to transform your photos and images (JPG, PNG, JPEG, etc.) into professional PDF documents.
                Whether you need to combine multiple photos into a single file, create a photo album PDF, or convert screenshots
                into shareable documents, our free tool processes everything locally in your browser for complete privacy.
              </p>

              <h3>How to Convert Images to PDF</h3>
              <ol>
                <li><strong>Upload your images</strong> - Select one or multiple images to convert</li>
                <li><strong>Arrange the order</strong> - Reorganize images as needed</li>
                <li><strong>Download the PDF</strong> - Get your combined PDF document</li>
              </ol>

              <h3>Supported Image Formats</h3>
              <ul>
                <li><strong>JPG/JPEG</strong> - Most common format for photos</li>
                <li><strong>PNG</strong> - Ideal for screenshots and images with transparency</li>
                <li><strong>GIF</strong> - Animated and simple images</li>
                <li><strong>BMP</strong> - Standard Windows format</li>
                <li><strong>TIFF</strong> - High-quality format for scanned documents</li>
                <li><strong>WEBP</strong> - Modern compressed web format</li>
              </ul>

              <h3>Use Cases</h3>
              <ul>
                <li><strong>Photo Albums</strong> - Create PDF photo albums to share with family</li>
                <li><strong>Scanned Documents</strong> - Combine multiple scanned pages into one PDF</li>
                <li><strong>Presentations</strong> - Convert slide images into PDF documents</li>
                <li><strong>Portfolios</strong> - Create professional portfolios in PDF format</li>
                <li><strong>Invoices and Receipts</strong> - Combine invoice photos into PDF documents</li>
                <li><strong>Catalogs</strong> - Create product catalogs from images</li>
              </ul>

              <h3>Benefits of Our Tool</h3>
              <ul>
                <li><strong>Quality Preserved</strong> - Images maintain their original quality</li>
                <li><strong>Customizable Order</strong> - Reorganize images by drag and drop</li>
                <li><strong>Multiple Images</strong> - Combine as many images as you want</li>
                <li><strong>All Formats</strong> - Supports JPG, PNG, GIF, BMP, TIFF, WEBP and more</li>
                <li><strong>100% Free</strong> - No limits, no registration required</li>
                <li><strong>Local Processing</strong> - Your images never leave your browser</li>
              </ul>

              <h3>Conversion Tips</h3>
              <ul>
                <li><strong>Image Quality</strong> - Use high-resolution images for better results</li>
                <li><strong>Uniform Orientation</strong> - Ensure all images have the same orientation</li>
                <li><strong>Consistent Size</strong> - Similar-sized images create a more professional PDF</li>
                <li><strong>Compression</strong> - Compress your images beforehand if the final PDF is too large</li>
                <li><strong>Logical Order</strong> - Arrange your images in a meaningful sequence</li>
              </ul>

              <h3>Frequently Asked Questions</h3>

              <h4>How to convert images to PDF?</h4>
              <p>
                Upload your images (JPG, PNG, etc.), arrange them in the desired order with our intuitive
                drag-and-drop interface, and our tool will automatically combine them into a single PDF file
                you can download immediately.
              </p>

              <h4>Can I convert multiple images to one PDF?</h4>
              <p>
                Yes, absolutely! You can upload as many images as you want and combine them into a single
                PDF document. Simply arrange them in the desired order before conversion. There is no limit
                to the number of images.
              </p>

              <h4>What image formats are supported?</h4>
              <p>
                Our tool supports all common image formats: JPG, JPEG, PNG, GIF, BMP, TIFF, WEBP and more.
                Image quality is preserved during PDF conversion, ensuring professional results.
              </p>

              <h3>Related Tools</h3>
              <ul>
                <li><Link href={`/${locale}/pdf-to-images`} className="text-primary hover:underline">PDF to Images</Link> - Convert PDF to images</li>
                <li><Link href={`/${locale}/merge-pdf`} className="text-primary hover:underline">Merge PDF</Link> - Combine multiple PDFs</li>
                <li><Link href={`/${locale}/compress-pdf`} className="text-primary hover:underline">Compress PDF</Link> - Reduce PDF file size</li>
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
