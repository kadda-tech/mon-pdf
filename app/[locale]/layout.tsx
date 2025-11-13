// app/[locale]/layout.tsx
import type React from "react"
import { Geist, Geist_Mono } from "next/font/google"
import Script from "next/script"
import { Analytics } from "@vercel/analytics/next"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { Toaster } from "sonner"
import StoreProvider from "@/components/providers/store-provider"
import { notFound } from "next/navigation"
import { locales } from "@/i18n"
import "../globals.css"

const geist = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
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
        {/* SEO Meta Tags */}
        <meta name="description" content="Merge, split, compress, and convert PDF files online for free and securely." />
        <link rel="canonical" href={canonicalUrl} />
        {locales.map((l) => (
            <link key={l} rel="alternate" hrefLang={l} href={`${baseUrl}/${l}`} />
        ))}

        {/* Open Graph */}
        <meta property="og:title" content="Mon PDF - Merge PDF Online" />
        <meta property="og:description" content="Combine your PDFs securely and quickly with our free online tool." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />

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
        <StoreProvider>{children}</StoreProvider>
      </NextIntlClientProvider>

      <Toaster position="top-right" richColors closeButton />
      <Analytics />
      </body>
      </html>
  )
}
