"use client"

import {usePathname, useRouter} from 'next/navigation'
import {Button} from "@/components/ui/button"
import {ArrowRight, Sparkles} from "lucide-react"
import Image from "next/image";

export default function GetStartedPage() {
  const router = useRouter()
  const pathname = usePathname()
  const locale = pathname.split('/')[1] || 'en'

  const handleGetStarted = () => {
    router.push(`/${locale}/home`)
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-orange-950/20">
      {/* Animated background gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-400/30 dark:bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-400/30 dark:bg-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-400/20 dark:bg-orange-600/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-8 px-4 max-w-4xl mx-auto text-center">
        {/* Main heading */}
        <div className="flex flex-col items-center gap-10">
          <Image
              src="/logo.png"
              alt={locale === 'fr'
                  ? 'Mon PDF - Outils PDF Gratuits en Ligne'
                  : 'Mon PDF - Free Online PDF Tools'
              }
              priority
              width={550}
              height={100}
          />
          <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-foreground/80 text-balance">
            {locale === 'fr'
              ? 'Vos Outils PDF Professionnels'
              : 'Your Professional PDF Toolkit'}
          </p>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed">
            {locale === 'fr'
              ? 'Fusionnez, divisez, convertissez et modifiez vos PDF avec des outils puissants qui fonctionnent entièrement dans votre navigateur. Rapide, sécurisé et complètement privé.'
              : 'Split, merge, convert, and edit your PDFs with powerful tools that work entirely in your browser. Fast, secure, and completely private.'}
          </p>
        </div>

        {/* Privacy badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2 rounded-full bg-card/80 backdrop-blur-sm border border-border px-4 py-2 shadow-lg">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-xs sm:text-sm font-medium">
              {locale === 'fr' ? 'Pas de téléchargement' : 'No Upload'}
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-card/80 backdrop-blur-sm border border-border px-4 py-2 shadow-lg">
            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-xs sm:text-sm font-medium">
              {locale === 'fr' ? '100% Privé' : '100% Private'}
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-card/80 backdrop-blur-sm border border-border px-4 py-2 shadow-lg">
            <div className="h-2 w-2 rounded-full bg-purple-500" />
            <span className="text-xs sm:text-sm font-medium">
              {locale === 'fr' ? 'Gratuit pour toujours' : 'Free Forever'}
            </span>
          </div>
        </div>

        {/* Get Started Button */}
        <Button
          onClick={handleGetStarted}
          size="lg"
          className="cursor-pointer text-lg px-8 py-6 h-auto rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-2xl shadow-purple-500/50 hover:shadow-purple-600/60 hover:scale-105 transition-all duration-200 group"
        >
          {locale === 'fr' ? 'Commencer' : 'Get Started'}
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Button>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8 max-w-3xl">
          <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10">
              <Sparkles className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-center">
              {locale === 'fr' ? '10+ Outils PDF' : '10+ PDF Tools'}
            </span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
              <Sparkles className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-center">
              {locale === 'fr' ? 'Traitement Instantané' : 'Instant Processing'}
            </span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/10">
              <Sparkles className="h-6 w-6 text-pink-600" />
            </div>
            <span className="text-sm font-medium text-center">
              {locale === 'fr' ? 'Aucune Inscription' : 'No Registration'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
