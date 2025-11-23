"use client"

import {usePathname} from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {LanguageSwitcher} from "@/components/language-switcher"
import {BookmarkButton} from "@/components/bookmark-button"
import {MobileNav} from "@/components/mobile-nav"
import {Home, Sparkles} from "lucide-react"
import {Button} from "@/components/ui/button"

export function SiteHeader() {
  const pathname = usePathname()
  const locale = pathname.split('/')[1] || 'en'
  const isHomePage = pathname.endsWith('/home') || pathname === `/${locale}` || pathname === `/${locale}/`

  return (
    <header className="border-b border-border/40 backdrop-blur-xl bg-background/80 sticky top-0 z-50">
      {/* Subtle gradient line at top */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 opacity-60" />

      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between py-3 sm:py-4">
          {/* Mobile Menu & Logo Section */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Navigation Menu - Only show on feature pages, not on home */}
            {!isHomePage && <MobileNav />}

            {/* Logo */}
            <Link
              href={`/${locale}`}
              className="flex items-center gap-3 group relative"
            >
              {/* Mobile: Show icon only (below md breakpoint) */}
              <div className="block md:hidden">
                <Image
                  src="/icon.png"
                  alt={locale === 'fr'
                    ? 'Mon PDF'
                    : 'Mon PDF'
                  }
                  priority
                  width={40}
                  height={40}
                  className="transition-transform group-hover:scale-105 duration-300"
                />
              </div>

              {/* Desktop: Show full logo (md breakpoint and above) */}
              <div className="hidden md:block">
                <Image
                  src="/logo.png"
                  alt={locale === 'fr'
                    ? 'Mon PDF - Outils PDF Gratuits en Ligne'
                    : 'Mon PDF - Free Online PDF Tools'
                  }
                  priority
                  width={250}
                  height={120}
                  className="transition-transform group-hover:scale-105 duration-300"
                />
              </div>
            </Link>
          </div>

          {/* Navigation & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Home Button (only show if not on home page) */}
            {!isHomePage && (
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="hidden sm:flex items-center gap-2 hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-pink-500/10 transition-all duration-300"
              >
                <Link href={`/${locale}`}>
                  <Home className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {locale === 'fr' ? 'Accueil' : 'Home'}
                  </span>
                </Link>
              </Button>
            )}

            {/* Privacy Indicator */}
            <div className="hidden md:flex items-center gap-2 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 px-3 py-1.5 group hover:border-green-500/40 transition-all duration-300">
              <div className="relative">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <div className="absolute inset-0 h-2 w-2 rounded-full bg-green-500 animate-ping opacity-75" />
              </div>
              <span className="text-xs font-medium text-green-700 dark:text-green-300">
                {locale === 'fr' ? '100% Privé' : '100% Private'}
              </span>
              <Sparkles className="h-3 w-3 text-green-600 dark:text-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Bookmark Button */}
            <BookmarkButton />

            {/* Language Switcher */}
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  )
}
