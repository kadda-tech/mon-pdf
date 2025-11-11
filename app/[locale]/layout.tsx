import type React from "react"
import { Geist, Geist_Mono } from "next/font/google"
import Script from 'next/script'
import { Analytics } from "@vercel/analytics/next"
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import StoreProvider from "@/components/providers/store-provider"
import { notFound } from 'next/navigation'
import { locales } from '@/i18n'
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

  return (
    <html lang={locale}>
      <head>
        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','G-7HPXFCS4GT');`}
        </Script>
        {/* End Google Tag Manager */}
      </head>
      <body className={`font-sans antialiased`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=G-7HPXFCS4GT"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <NextIntlClientProvider messages={messages}>
          <StoreProvider>{children}</StoreProvider>
        </NextIntlClientProvider>
      <Analytics />
      </body>
    </html>
  )
}
