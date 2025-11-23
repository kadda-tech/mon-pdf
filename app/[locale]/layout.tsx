// app/[locale]/layout.tsx
import type React from "react"
import type {Metadata} from "next"
import {Geist, Geist_Mono} from "next/font/google"
import Script from "next/script"
import {Analytics} from "@vercel/analytics/next"
import {NextIntlClientProvider} from "next-intl"
import {getMessages, getTranslations} from "next-intl/server"
import {Toaster} from "sonner"
import StoreProvider from "@/components/providers/store-provider"
import {notFound} from "next/navigation"
import {locales} from "@/i18n"
import "../globals.css"
import {SpeedInsights} from "@vercel/speed-insights/next"

const geist = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale })

  const baseUrl = "https://mon-pdf.fr"
  const title = locale === 'fr'
    ? 'Mon PDF - Outils PDF Gratuits en Ligne | Fusionner, Diviser, Compresser PDF'
    : 'Mon PDF - Free Online PDF Tools | Merge, Split, Compress PDF'

  const description = locale === 'fr'
    ? 'Outils PDF en ligne 100% gratuits et sécurisés. Fusionner, diviser, compresser, convertir PDF. Sans inscription. Traitement local dans votre navigateur.'
    : 'Free and secure online PDF tools. Merge, split, compress, convert PDFs. No registration. Local processing in your browser for privacy.'

  return {
    title,
    description,
    keywords: locale === 'fr'
      ? 'pdf gratuit, fusionner pdf, diviser pdf, compresser pdf, convertir pdf, outils pdf en ligne, modifier pdf, organiser pdf'
      : 'free pdf, merge pdf, split pdf, compress pdf, convert pdf, online pdf tools, edit pdf, organize pdf',
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'en': '/en',
        'fr': '/fr',
        'x-default': '/en',
      },
    },
    openGraph: {
      title,
      description,
      url: `/${locale}`,
      siteName: 'Mon PDF',
      locale: locale,
      type: 'website',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.png'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export default async function LocaleLayout({
                                             children,
                                             params
                                           }: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params

  if (!locales.includes(locale as any)) {
    notFound()
  }

  const messages = await getMessages()

  const baseUrl = "https://mon-pdf.fr"
  const canonicalUrl = `${baseUrl}/${locale}`

  return (
      <html lang={locale}>
      <head>
        {/* Canonical tags and meta descriptions are handled by child layout metadata */}
        {/* Only keep alternate language links here for the homepage */}

        {/* Google Tag Manager */}
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KS6BKFSR');`}
        </Script>

        {/* GA4 (via gtag.js) */}
        <Script
            src={`https://www.googletagmanager.com/gtag/js?id=G-7HPXFCS4GT`}
            strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-7HPXFCS4GT', { page_path: window.location.pathname });
          `}
        </Script>

        {/* Structured Data JSON-LD */}
        <Script type="application/ld+json" id="pdf-tool-schema" strategy="afterInteractive">
          {`
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Mon PDF - Merge PDF",
            "url": "${canonicalUrl}",
            "applicationCategory": "UtilityApplication",
            "operatingSystem": "All"
          }
          `}
        </Script>
      </head>
      <body className={`font-sans antialiased`}>
      {/* GTM noscript fallback */}
      <noscript>
        <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KS6BKFSR"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>

      <NextIntlClientProvider messages={messages}>
        <StoreProvider>
          {children}
        </StoreProvider>
      </NextIntlClientProvider>

      <Toaster position="top-right" richColors closeButton />
      <Analytics />
      <SpeedInsights/>
      </body>
      </html>
  )
}
