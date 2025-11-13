"use client"

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { FileText, Upload, Download, Loader2, FileType, AlertCircle, Image as ImageIcon, Scan } from 'lucide-react'
import { toast } from 'sonner'
import * as pdfjsLib from 'pdfjs-dist'
import { Document, Paragraph, TextRun, HeadingLevel, Packer, AlignmentType, ImageRun } from 'docx'
import { createOCREngine, OCRPageResult } from '@/lib/ocr/ocr-engine'
import { convertPDFToImages } from '@/lib/ocr/pdf-to-image'

// Configure PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`
}

interface ExtractedPage {
  pageNumber: number
  text: string
  items: any[]
  hasText: boolean
  canvas?: HTMLCanvasElement
}

export function PDFToWordTool() {
  const t = useTranslations('tools.pdfToWord')
  const [file, setFile] = useState<File | null>(null)
  const [converting, setConverting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [extractedPages, setExtractedPages] = useState<ExtractedPage[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const [showScannedDialog, setShowScannedDialog] = useState(false)
  const [scannedPagesCount, setScannedPagesCount] = useState(0)
  const [conversionMethod, setConversionMethod] = useState<'image' | 'ocr' | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const pdfFile = acceptedFiles[0]
    if (pdfFile && pdfFile.type === 'application/pdf') {
      setFile(pdfFile)
      setError(null)
    } else {
      setError('Please upload a valid PDF file')
      toast.error('Invalid file type')
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
  })

  const extractTextFromPDF = async (file: File): Promise<ExtractedPage[]> => {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    const pages: ExtractedPage[] = []

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const textContent = await page.getTextContent()

      // Extract text with positioning info
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ')

      // Check if page has meaningful text (more than just whitespace)
      const hasText = pageText.trim().length > 10

      // If no text, render page to canvas for image extraction
      let canvas: HTMLCanvasElement | undefined
      if (!hasText) {
        canvas = document.createElement('canvas')
        const viewport = page.getViewport({ scale: 2 })
        canvas.width = viewport.width
        canvas.height = viewport.height
        const context = canvas.getContext('2d')
        if (context) {
          await page.render({
            canvasContext: context,
            viewport: viewport,
          } as any).promise
        }
      }

      pages.push({
        pageNumber: pageNum,
        text: pageText,
        items: textContent.items,
        hasText,
        canvas
      })

      setProgress((pageNum / pdf.numPages) * 20) // First 20% for extraction
    }

    return pages
  }

  const performOCR = async (pages: ExtractedPage[]): Promise<ExtractedPage[]> => {
    toast.info('Initializing OCR engine...')
    const ocrEngine = await createOCREngine('eng')
    const ocrResults: ExtractedPage[] = []

    try {
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i]

        if (!page.hasText && page.canvas) {
          toast.info(`Performing OCR on page ${page.pageNumber}...`)
          setProgress(20 + ((i + 1) / pages.length) * 40) // 20-60% for OCR

          const result = await ocrEngine.recognize(page.canvas)

          ocrResults.push({
            ...page,
            text: result.text,
            hasText: true,
          })
        } else {
          ocrResults.push(page)
        }
      }

      return ocrResults
    } finally {
      await ocrEngine.terminate()
    }
  }

  const createWordDocumentWithImages = async (pages: ExtractedPage[]): Promise<Blob> => {
    console.log('createWordDocumentWithImages called with', pages.length, 'pages')
    const children: Paragraph[] = []

    for (let index = 0; index < pages.length; index++) {
      const page = pages[index]
      console.log(`Processing page ${page.pageNumber}, hasText: ${page.hasText}, hasCanvas: ${!!page.canvas}`)

      if (!page.hasText && page.canvas) {
        // Page has scanned image, convert to blob then to array buffer
        console.log(`Embedding image for page ${page.pageNumber}`)
        try {
          // Convert canvas to data URL first
          const dataUrl = page.canvas.toDataURL('image/png')
          const base64Data = dataUrl.split(',')[1]

          // Convert base64 to binary
          const binaryString = atob(base64Data)
          const bytes = new Uint8Array(binaryString.length)
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i)
          }

          // Calculate dimensions - max width 600 pixels
          const maxWidth = 600
          const scale = Math.min(maxWidth / page.canvas.width, 1)
          const width = Math.round(page.canvas.width * scale)
          const height = Math.round(page.canvas.height * scale)

          console.log(`Image dimensions: ${width}x${height}, canvas: ${page.canvas.width}x${page.canvas.height}`)

          children.push(
            new Paragraph({
              children: [
                new ImageRun({
                  data: bytes,
                  transformation: {
                    width: width,
                    height: height,
                  },
                }),
              ],
              spacing: {
                before: index > 0 ? 400 : 0,
                after: 200
              },
            })
          )
          console.log(`Successfully added image for page ${page.pageNumber}`)
        } catch (err) {
          console.error('Failed to embed image:', err)
          // Add a text placeholder if image fails
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `[Image from page ${page.pageNumber} could not be embedded]`,
                  italics: true,
                })
              ],
              spacing: { after: 200 },
            })
          )
        }
      } else {
        // Process text content
        const paragraphs = page.text.split(/\n\n+/).filter(p => p.trim())

        paragraphs.forEach((paraText) => {
          const trimmedText = paraText.trim()
          if (!trimmedText) return

          const isLikelyHeading = trimmedText.length < 100 &&
                                  (trimmedText === trimmedText.toUpperCase() ||
                                   !trimmedText.includes('.'))

          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: trimmedText,
                  bold: isLikelyHeading,
                })
              ],
              heading: isLikelyHeading ? HeadingLevel.HEADING_3 : undefined,
              spacing: { after: 200 },
            })
          )
        })
      }

      setProgress(60 + ((index + 1) / pages.length) * 40) // 60-100% for document creation
    }

    console.log(`Creating Word document with ${children.length} elements`)

    const doc = new Document({
      sections: [{ properties: {}, children }],
    })

    const blob = await Packer.toBlob(doc)
    console.log(`Word document created, blob size: ${blob.size} bytes`)
    return blob
  }

  const createWordDocument = async (pages: ExtractedPage[]): Promise<Blob> => {
    const children: Paragraph[] = []

    pages.forEach((page, index) => {
      // Process text content
      // Split by double newlines to detect paragraphs
      const paragraphs = page.text.split(/\n\n+/).filter(p => p.trim())

      paragraphs.forEach((paraText) => {
        const trimmedText = paraText.trim()
        if (!trimmedText) return

        // Detect if it looks like a heading (short, often in caps or followed by content)
        const isLikelyHeading = trimmedText.length < 100 &&
                                (trimmedText === trimmedText.toUpperCase() ||
                                 !trimmedText.includes('.'))

        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: trimmedText,
                bold: isLikelyHeading,
              })
            ],
            heading: isLikelyHeading ? HeadingLevel.HEADING_3 : undefined,
            spacing: {
              after: 200,
            },
          })
        )
      })

      setProgress(60 + ((index + 1) / pages.length) * 40) // 60-100% for document creation
    })

    const doc = new Document({
      sections: [
        {
          properties: {},
          children,
        },
      ],
    })

    return await Packer.toBlob(doc)
  }

  const convertToWord = async () => {
    if (!file) return

    setConverting(true)
    setProgress(0)
    setError(null)

    try {
      toast.info('Extracting text from PDF...')
      const pages = await extractTextFromPDF(file)

      // Check if any pages are scanned (no text)
      const scannedPages = pages.filter(p => !p.hasText)

      if (scannedPages.length > 0) {
        // Show dialog to ask user preference
        setExtractedPages(pages)
        setScannedPagesCount(scannedPages.length)
        setShowScannedDialog(true)
        setConverting(false)
        setProgress(0)
        return
      }

      // All pages have text, proceed normally
      setExtractedPages(pages)
      await finishConversion(pages, 'text')
    } catch (error) {
      console.error('Conversion error:', error)
      setError('Failed to convert PDF to Word. Please try again.')
      toast.error('Conversion failed')
      setConverting(false)
      setProgress(0)
    }
  }

  const handleScannedPagesChoice = async (choice: 'image' | 'ocr') => {
    setShowScannedDialog(false)
    setConverting(true)
    setConversionMethod(choice)

    try {
      if (choice === 'ocr') {
        // Perform OCR on scanned pages
        toast.info('Performing OCR on scanned pages...')
        const ocrPages = await performOCR(extractedPages)
        setExtractedPages(ocrPages)
        await finishConversion(ocrPages, 'ocr')
      } else {
        // Keep images
        await finishConversion(extractedPages, 'image')
      }
    } catch (error) {
      console.error('Conversion error:', error)
      setError('Failed to convert PDF to Word. Please try again.')
      toast.error('Conversion failed')
    } finally {
      setConverting(false)
    }
  }

  const finishConversion = async (pages: ExtractedPage[], method: 'text' | 'image' | 'ocr') => {
    try {
      let blob: Blob

      if (method === 'image') {
        toast.info('Creating Word document with images...')
        console.log('Creating Word document with images, pages:', pages.length)
        console.log('Pages with canvas:', pages.filter(p => p.canvas).length)
        blob = await createWordDocumentWithImages(pages)
      } else {
        toast.info('Creating Word document...')
        blob = await createWordDocument(pages)
      }

      // Download the file
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = file!.name.replace('.pdf', '.docx')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast.success('PDF converted to Word successfully!', {
        description: `${pages.length} pages converted`,
      })

      setProgress(100)
      setShowPreview(true)
    } finally {
      setConverting(false)
    }
  }

  const reset = () => {
    setFile(null)
    setProgress(0)
    setError(null)
    setExtractedPages([])
    setShowPreview(false)
    setShowScannedDialog(false)
    setScannedPagesCount(0)
    setConversionMethod(null)
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardContent className="pt-6">
          {!file ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-muted-foreground/25 hover:border-primary/50'
              }`}
            >
              <input {...getInputProps()} />
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">
                {isDragActive ? 'Drop PDF here' : 'Upload PDF to convert'}
              </p>
              <p className="text-sm text-muted-foreground">
                Click to browse or drag and drop your PDF file
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                {!converting && (
                  <Button variant="ghost" size="sm" onClick={reset}>
                    Change
                  </Button>
                )}
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {converting && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Converting...</span>
                    <span className="font-medium">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={convertToWord}
                  disabled={converting}
                  className="flex-1"
                  size="lg"
                >
                  {converting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Converting...
                    </>
                  ) : (
                    <>
                      <FileType className="mr-2 h-5 w-5" />
                      Convert to Word
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {showPreview && extractedPages.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                  <FileType className="h-5 w-5" />
                  Word Document Preview
                </h3>
                <Button variant="outline" size="sm" onClick={reset}>
                  Convert Another
                </Button>
              </div>

              <div className="bg-white dark:bg-slate-900 border rounded-lg p-6 max-h-[500px] overflow-y-auto">
                <div className="space-y-4 font-serif">
                  {extractedPages.map((page, index) => {
                    return (
                      <div key={index} className="space-y-3">
                        <h2 className="text-lg font-bold text-primary border-b pb-2">
                          Page {page.pageNumber}
                        </h2>

                        {!page.hasText && page.canvas ? (
                          // Show image preview for scanned pages
                          <div className="flex justify-center my-4">
                            <img
                              src={page.canvas.toDataURL('image/png')}
                              alt={`Page ${page.pageNumber}`}
                              className="max-w-full border rounded shadow-sm"
                              style={{ maxHeight: '400px' }}
                            />
                          </div>
                        ) : (
                          // Show text for pages with extractable text
                          <>
                            {page.text.split(/\n\n+/).filter(p => p.trim()).map((para, pIndex) => {
                              const trimmedText = para.trim()
                              if (!trimmedText) return null

                              const isLikelyHeading = trimmedText.length < 100 &&
                                                      (trimmedText === trimmedText.toUpperCase() ||
                                                       !trimmedText.includes('.'))

                              return isLikelyHeading ? (
                                <h3 key={pIndex} className="text-base font-bold mt-4 mb-2">
                                  {trimmedText}
                                </h3>
                              ) : (
                                <p key={pIndex} className="text-sm leading-relaxed text-justify">
                                  {trimmedText}
                                </p>
                              )
                            })}
                          </>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertCircle className="h-4 w-4" />
                <span>This is a preview of the converted content. The actual Word document has been downloaded.</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Conversion Notes
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span>•</span>
                <span>Text and paragraphs are preserved with basic formatting</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Complex layouts (tables, columns) may not convert perfectly</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Scanned images can be embedded or converted to text using OCR</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>OCR works best with clear, high-resolution scanned documents</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>All processing happens in your browser - your files stay private</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Scanned Pages Dialog */}
      <Dialog open={showScannedDialog} onOpenChange={setShowScannedDialog}>
        <DialogContent className="flex flex-col sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              {t('scannedDialogTitle')}
            </DialogTitle>
            <DialogDescription className="pt-2">
              {t('scannedDialogDescription', { count: scannedPagesCount })}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col space-y-3 py-4">
            <Button
                onClick={() => handleScannedPagesChoice('image')}
                variant="outline"
                className="w-full h-auto py-3 px-3 flex items-start gap-3 hover:bg-primary/5 text-left"
            >
              <ImageIcon className="h-5 w-5 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0 flex flex-col">
                <div className="font-semibold mb-1">{t('keepImagesTitle')}</div>
                <div className="text-xs text-muted-foreground font-normal leading-tight break-words whitespace-normal">
                  {t('keepImagesDescription')}
                </div>
              </div>
            </Button>

            <Button
                onClick={() => handleScannedPagesChoice('ocr')}
                variant="outline"
                className="w-full h-auto py-3 px-3 flex items-start gap-3 hover:bg-primary/5 text-left"
            >
              <Scan className="h-5 w-5 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0 flex flex-col">
                <div className="font-semibold mb-1">{t('useOcrTitle')}</div>
                <div className="text-xs text-muted-foreground font-normal leading-tight break-words whitespace-normal">
                  {t('useOcrDescription')}
                </div>
              </div>
            </Button>
          </div>

          <DialogFooter className="flex-row items-center justify-center gap-2 text-xs text-muted-foreground sm:justify-center">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span className="text-center">{t('dialogNote')}</span>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
