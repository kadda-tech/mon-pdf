"use client"

import { useState, useEffect } from "react"
import { Star, Command, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslations } from 'next-intl'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface BrowserInfo {
  name: string
  os: string
  isMac: boolean
  isWindows: boolean
  isLinux: boolean
}

export function BookmarkButton() {
  const t = useTranslations()
  const [showDialog, setShowDialog] = useState(false)
  const [browserInfo, setBrowserInfo] = useState<BrowserInfo | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ua = navigator.userAgent
      const isMac = /Mac/i.test(ua)
      const isWindows = /Win/i.test(ua)
      const isLinux = /Linux/i.test(ua)

      let browserName = 'Browser'
      if (/Chrome/i.test(ua) && !/Edge/i.test(ua)) browserName = 'Chrome'
      else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browserName = 'Safari'
      else if (/Firefox/i.test(ua)) browserName = 'Firefox'
      else if (/Edge/i.test(ua)) browserName = 'Edge'

      let osName = 'your system'
      if (isMac) osName = 'macOS'
      else if (isWindows) osName = 'Windows'
      else if (isLinux) osName = 'Linux'

      setBrowserInfo({
        name: browserName,
        os: osName,
        isMac,
        isWindows,
        isLinux,
      })
    }
  }, [])

  const handleBookmark = () => {
    setShowDialog(true)
  }

  const getKeyboardShortcut = () => {
    if (!browserInfo) return 'Ctrl + D'
    return browserInfo.isMac ? '⌘ + D' : 'Ctrl + D'
  }

  const getInstructions = () => {
    if (!browserInfo) return []

    const shortcut = getKeyboardShortcut()

    const instructions = [
      {
        step: 1,
        text: t('bookmark.step1', { shortcut }),
        icon: '⌨️'
      },
      {
        step: 2,
        text: t('bookmark.step2'),
        icon: '📁'
      },
      {
        step: 3,
        text: t('bookmark.step3'),
        icon: '✅'
      }
    ]

    return instructions
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleBookmark}
        className="gap-2"
      >
        <Star className="h-4 w-4" />
        <span className="hidden sm:inline">{t('bookmark.button')}</span>
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              {t('bookmark.title')}
            </DialogTitle>
            <DialogDescription>
              {t('bookmark.description')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Keyboard Shortcut Highlight */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 p-6 rounded-lg border-2 border-blue-200 dark:border-blue-800">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-3">{t('bookmark.quickTip')}</p>
                <div className="flex items-center justify-center gap-2 text-3xl font-bold">
                  {browserInfo?.isMac ? (
                    <>
                      <kbd className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-300 dark:border-gray-600">
                        ⌘
                      </kbd>
                      <span>+</span>
                      <kbd className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-300 dark:border-gray-600">
                        D
                      </kbd>
                    </>
                  ) : (
                    <>
                      <kbd className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-300 dark:border-gray-600 text-sm">
                        Ctrl
                      </kbd>
                      <span>+</span>
                      <kbd className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-300 dark:border-gray-600">
                        D
                      </kbd>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Step-by-step instructions */}
            <div className="space-y-3">
              <p className="text-sm font-medium">{t('bookmark.stepsTitle')}</p>
              {getInstructions().map((instruction) => (
                <div key={instruction.step} className="flex gap-3 items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    {instruction.step}
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-sm">
                      <span className="mr-2">{instruction.icon}</span>
                      {instruction.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Alternative method */}
            <div className="bg-muted/50 p-4 rounded-lg border border-dashed border-border">
              <p className="text-xs text-muted-foreground">
                <strong>{t('bookmark.alternative')}:</strong> {t('bookmark.alternativeText', { browser: browserInfo?.name })}
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => setShowDialog(false)} variant="default">
              {t('bookmark.gotIt')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
