"use client"

import {useState} from 'react'
import {useTranslations} from 'next-intl'
import {usePathname} from 'next/navigation'
import Link from 'next/link'
import {
  ChevronRight,
  Combine,
  FileImage,
  FileText,
  FileType,
  Hash,
  ImageIcon,
  Menu,
  Package,
  Scan,
  Scissors,
  SendToBack,
  Sparkles
} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {Sheet, SheetContent, SheetHeader, SheetTrigger} from '@/components/ui/sheet'
import {Badge} from '@/components/ui/badge'
import Image from "next/image";

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const t = useTranslations()
  const pathname = usePathname()
  const locale = pathname.split('/')[1] || 'en'

  const tools = [
    {
      id: 'split-pdf',
      icon: Scissors,
      title: t('tools.split.title'),
      color: 'text-purple-600',
      bgColor: 'bg-purple-500/10',
      isBeta: false,
    },
    {
      id: 'merge-pdf',
      icon: Combine,
      title: t('tools.merge.title'),
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
      isBeta: false,
    },
    {
      id: 'organize-pdf',
      icon: SendToBack,
      title: t('tools.organizePdf.title'),
      color: 'text-teal-600',
      bgColor: 'bg-teal-500/10',
      isBeta: false,
    },
    {
      id: 'compress-pdf',
      icon: Package,
      title: t('tools.compressPdf.title'),
      color: 'text-green-600',
      bgColor: 'bg-green-500/10',
      isBeta: false,
    },
    {
      id: 'image-to-pdf',
      icon: FileImage,
      title: t('tools.imageToPdf.title'),
      color: 'text-orange-600',
      bgColor: 'bg-orange-500/10',
      isBeta: false,
    },
    {
      id: 'pdf-to-images',
      icon: ImageIcon,
      title: t('tools.pdfToImages.title'),
      color: 'text-pink-600',
      bgColor: 'bg-pink-500/10',
      isBeta: false,
    },
    {
      id: 'page-numbering',
      icon: Hash,
      title: t('tools.pageNumbering.title'),
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-500/10',
      isBeta: false,
    },
    {
      id: 'scan-pdf',
      icon: Scan,
      title: t('tools.scanPdf.title'),
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-500/10',
      isBeta: false,
    },
    {
      id: 'pdf-to-word',
      icon: FileType,
      title: t('tools.pdfToWord.title'),
      color: 'text-violet-600',
      bgColor: 'bg-violet-500/10',
      isBeta: true,
    },
    {
      id: 'ocr',
      icon: FileText,
      title: t('tools.ocr.title'),
      color: 'text-amber-600',
      bgColor: 'bg-amber-500/10',
      isBeta: true,
    },
  ]

  const isActive = (toolId: string) => pathname.includes(toolId)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden p-2 hover:bg-muted"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="px-6 py-4 border-b border-border/40">
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
          </SheetHeader>

          {/* Tools List */}
          <div className="flex-1 overflow-y-auto py-4 px-4">
            <div className="space-y-1">
              {tools.map((tool) => {
                const Icon = tool.icon
                const active = isActive(tool.id)

                return (
                  <Link
                    key={tool.id}
                    href={`/${locale}/${tool.id}`}
                    onClick={() => setOpen(false)}
                    className={`
                      group flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200
                      ${active
                        ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20'
                        : 'hover:bg-muted border border-transparent'
                      }
                    `}
                  >
                    {/* Icon */}
                    <div className={`
                      flex items-center justify-center w-10 h-10 rounded-lg transition-transform duration-200
                      ${tool.bgColor}
                      ${active ? 'scale-110' : 'group-hover:scale-105'}
                    `}>
                      <Icon className={`h-5 w-5 ${tool.color}`} />
                    </div>

                    {/* Title */}
                    <div className="flex-1 min-w-0">
                      <p className={`
                        text-sm font-medium truncate
                        ${active ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'}
                      `}>
                        {tool.title}
                      </p>
                    </div>

                    {/* Beta Badge or Arrow */}
                    {tool.isBeta ? (
                      <Badge variant="secondary" className="text-xs px-2 py-0 h-5 bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20">
                        Beta
                      </Badge>
                    ) : (
                      <ChevronRight className={`
                        h-4 w-4 transition-transform duration-200
                        ${active ? 'text-purple-600 translate-x-1' : 'text-muted-foreground/40 group-hover:translate-x-1 group-hover:text-muted-foreground'}
                      `} />
                    )}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-border/40 p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
              <Sparkles className="h-4 w-4 text-purple-600 flex-shrink-0" />
              <p className="leading-relaxed">
                {locale === 'fr'
                  ? 'Tous les outils fonctionnent localement dans votre navigateur pour une confidentialité totale.'
                  : 'All tools work locally in your browser for complete privacy.'}
              </p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
