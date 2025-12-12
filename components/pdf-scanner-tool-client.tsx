'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import QRCode from 'qrcode'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Scan,
  Smartphone,
  Download,
  Trash2,
  CheckCircle,
  Loader2,
  Image as ImageIcon,
  X,
  RefreshCw,
} from 'lucide-react'
import { PDFDocument } from 'pdf-lib'
import { EmailShareButton } from '@/components/email-share-button'
import { FilenameDialog } from '@/components/filename-dialog'

interface ScannedImage {
  data: string // base64
  timestamp: number
}

const POLL_INTERVAL = 1000 // Check for new images every second

export function PDFScannerToolClient() {
  const t = useTranslations()
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')
  const [images, setImages] = useState<ScannedImage[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [lastCheckTime, setLastCheckTime] = useState<number>(Date.now())
  const [scannedBlob, setScannedBlob] = useState<Blob | null>(null)
  const [showFilenameDialog, setShowFilenameDialog] = useState(false)
  const [pendingFilename, setPendingFilename] = useState("")
  const emailShareButtonRef = useRef<HTMLButtonElement>(null)

  // Check for existing session from URL params (mobile return flow)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const existingSessionId = params.get('session')

    if (existingSessionId) {
      // Restore existing session
      setSessionId(existingSessionId)
      toast.success('Session restored', {
        description: 'Your scanned pages are ready',
      })

      // Generate QR code for the session (in case user wants to continue scanning)
      const locale = window.location.pathname.split('/')[1] || 'en'
      const scanUrl = `${window.location.origin}/${locale}/scan/${existingSessionId}`

      QRCode.toDataURL(scanUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      })
      .then((url) => {
        setQrCodeUrl(url)
      })
      .catch((err) => {
        console.error('QR code generation error:', err)
      })

      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [])

  // Check if user is on mobile device
  const isMobileDevice = () => {
    if (typeof window === 'undefined') return false
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (window.innerWidth <= 768)
  }

  // Generate unique session ID via API
  const startScanning = async () => {
    try {
      const response = await fetch('/api/scan/create', {
        method: 'POST'
      })

      const data = await response.json()

      if (!data.success) {
        toast.error('Failed to create session')
        return
      }

      const id = data.sessionId
      const locale = window.location.pathname.split('/')[1] || 'en'
      const scanUrl = `${window.location.origin}/${locale}/scan/${id}`

      // If user is on mobile, redirect directly to scan page
      if (isMobileDevice()) {
        window.location.href = scanUrl
        return
      }

      // Otherwise, show QR code for desktop users
      setSessionId(id)

      QRCode.toDataURL(scanUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      })
      .then((url) => {
        setQrCodeUrl(url)
        toast.success('Scan session started', {
          description: 'Scan the QR code with your phone',
        })
      })
      .catch((err) => {
        console.error('QR code generation error:', err)
        toast.error('Failed to generate QR code')
      })
    } catch (error) {
      console.error('Error starting scan session:', error)
      toast.error('Failed to start session')
    }
  }

  // Poll for new images from API
  useEffect(() => {
    if (!sessionId) return

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/scan/${sessionId}`)
        const data = await response.json()

        if (data.success && data.images) {
          const apiImages = data.images.map((img: string, index: number) => ({
            data: img,
            timestamp: Date.now() + index
          }))

          // Check if there are new images
          if (apiImages.length > images.length) {
            setImages(apiImages)
            const newCount = apiImages.length - images.length
            toast.success(`${newCount} new ${newCount === 1 ? 'image' : 'images'} captured`)
          } else if (apiImages.length < images.length) {
            // Images were removed
            setImages(apiImages)
          }
        }
      } catch (error) {
        console.error('Error polling for images:', error)
      }
    }, POLL_INTERVAL)

    return () => clearInterval(pollInterval)
  }, [sessionId, images.length])

  const resetSession = () => {
    setSessionId(null)
    setQrCodeUrl('')
    setImages([])
  }

  const removeImage = async (index: number) => {
    if (!sessionId) return

    try {
      const response = await fetch(`/api/scan/${sessionId}/remove`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ index })
      })

      const data = await response.json()

      if (data.success) {
        setImages(images.filter((_, i) => i !== index))
      } else {
        toast.error('Failed to remove image')
      }
    } catch (error) {
      console.error('Error removing image:', error)
      toast.error('Failed to remove image')
    }
  }

  const generatePDF = async () => {
    if (images.length === 0) {
      toast.error('No images to generate PDF')
      return
    }

    setIsGenerating(true)

    try {
      const pdfDoc = await PDFDocument.create()

      for (const image of images) {
        // Convert base64 to image
        let embeddedImage
        if (image.data.startsWith('data:image/png')) {
          const pngImageBytes = await fetch(image.data).then((res) => res.arrayBuffer())
          embeddedImage = await pdfDoc.embedPng(pngImageBytes)
        } else {
          const jpgImageBytes = await fetch(image.data).then((res) => res.arrayBuffer())
          embeddedImage = await pdfDoc.embedJpg(jpgImageBytes)
        }

        // Create page with same dimensions as image
        const page = pdfDoc.addPage([embeddedImage.width, embeddedImage.height])

        // Draw image to fill the page
        page.drawImage(embeddedImage, {
          x: 0,
          y: 0,
          width: embeddedImage.width,
          height: embeddedImage.height,
        })
      }

      const pdfBytes = await pdfDoc.save()

      // Save PDF blob
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      setScannedBlob(blob)

      toast.success('PDF generated successfully', {
        description: `${images.length} pages scanned`,
      })
    } catch (error) {
      console.error('PDF generation error:', error)
      toast.error('Failed to generate PDF')
    } finally {
      setIsGenerating(false)
    }
  }

  const generateBlob = async (): Promise<Blob | null> => {
    return scannedBlob
  }

  const getDefaultFilename = () => {
    return `scanned_${Date.now()}.pdf`
  }

  const handleFilenameConfirm = async (filename: string, action: 'download' | 'email') => {
    if (!scannedBlob) return

    setPendingFilename(filename)

    if (action === 'download') {
      const url = URL.createObjectURL(scannedBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } else {
      // Trigger email share button click
      emailShareButtonRef.current?.click()
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Scanner Control */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scan className="h-5 w-5" />
            PDF Scanner
          </CardTitle>
          <CardDescription className="text-xs">
            Scan documents with your phone camera
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!sessionId ? (
            <div className="space-y-4">
              <Alert>
                <Smartphone className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  Start a scan session and use your phone camera to capture documents
                </AlertDescription>
              </Alert>

              <Button onClick={startScanning} className="w-full">
                <Scan className="mr-2 h-4 w-4" />
                Start Scanning
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* QR Code */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-center">Scan with your phone</p>

                {qrCodeUrl && (
                  <div className="flex justify-center p-4 bg-white rounded-lg border">
                    <img src={qrCodeUrl} alt="QR Code" className="w-full max-w-[250px]" />
                  </div>
                )}

                <p className="text-xs text-muted-foreground text-center">
                  Or manually open:<br />
                  <code className="text-xs bg-muted px-2 py-1 rounded break-all">
                    {window.location.origin}/{window.location.pathname.split('/')[1]}/scan/{sessionId}
                  </code>
                </p>
              </div>

              <Separator />

              {/* Images Count */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {images.length} {images.length === 1 ? 'page' : 'pages'} scanned
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                {!scannedBlob ? (
                  <Button
                    onClick={generatePDF}
                    className="w-full"
                    disabled={images.length === 0 || isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Scan className="mr-2 h-4 w-4" />
                        Generate PDF
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <p className="text-green-700 dark:text-green-400 font-medium text-sm">
                        ✓ PDF generated successfully!
                      </p>
                    </div>

                    <Button
                      onClick={() => setShowFilenameDialog(true)}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Save PDF
                    </Button>
                  </div>
                )}

                {isMobileDevice() && (
                  <Button
                    onClick={() => {
                      const locale = window.location.pathname.split('/')[1] || 'en'
                      window.location.href = `${window.location.origin}/${locale}/scan/${sessionId}`
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Continue Scanning
                  </Button>
                )}

                <Button onClick={resetSession} variant="outline" className="w-full">
                  <Trash2 className="mr-2 h-4 w-4" />
                  End Session
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Right Column - Preview */}
      <div className="lg:col-span-2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Scanned Pages</CardTitle>
            <CardDescription>Preview and manage your scanned pages</CardDescription>
          </CardHeader>
          <CardContent>
            {images.length === 0 ? (
              <div className="flex items-center justify-center h-[600px] bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/20">
                <div className="text-center">
                  <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No pages scanned yet</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {sessionId
                      ? 'Use your phone to capture pages'
                      : 'Start a scan session to begin'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div key={image.timestamp} className="relative group">
                    <div className="aspect-[3/4] rounded-lg border overflow-hidden bg-muted">
                      <img
                        src={image.data}
                        alt={`Page ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary" className="text-xs">
                        {index + 1}
                      </Badge>
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Hidden Email Share Button */}
      <div className="hidden">
        <EmailShareButton
          ref={emailShareButtonRef}
          onGenerateBlob={generateBlob}
          fileName={pendingFilename || getDefaultFilename()}
          shareMessage={`I've scanned ${images.length} page${images.length !== 1 ? 's' : ''} to PDF using Mon PDF.`}
        />
      </div>

      {/* Filename Dialog */}
      <FilenameDialog
        open={showFilenameDialog}
        onOpenChange={setShowFilenameDialog}
        defaultFilename={getDefaultFilename()}
        onConfirm={handleFilenameConfirm}
        title="Save Scanned PDF"
        description="Choose a filename for your scanned PDF"
      />
    </div>
  )
}
