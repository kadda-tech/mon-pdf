"use client"

import {useState, useRef} from "react"
import {useTranslations} from 'next-intl'
import {PDFDocument} from "pdf-lib"
import {GripVertical, RotateCcw, Upload, X, Download} from "lucide-react"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Alert, AlertDescription} from "@/components/ui/alert"
import {EmailShareButton} from "@/components/email-share-button"
import {FilenameDialog} from "@/components/filename-dialog"
import * as pdfjs from "pdfjs-dist";

interface PageData {
  pageNumber: number
  imageUrl: string | null // Allow null for lazy loading
  isDeleted: boolean
  isLoading?: boolean
}

export function PDFOrganizeTool() {
  const t = useTranslations()
  const [file, setFile] = useState<File | null>(null)
  const [pages, setPages] = useState<PageData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [organizedBlob, setOrganizedBlob] = useState<Blob | null>(null)
  const [showFilenameDialog, setShowFilenameDialog] = useState(false)
  const [pendingFilename, setPendingFilename] = useState("")
  const emailShareButtonRef = useRef<HTMLButtonElement>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0]
    if (uploadedFile && uploadedFile.type === "application/pdf") {
      setFile(uploadedFile)
      setError(null)
      await loadPDFPages(uploadedFile)
    }
  }

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const droppedFile = event.dataTransfer.files[0]
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile)
      setError(null)
      await loadPDFPages(droppedFile)
    }
  }

  const loadPDFPages = async (pdfFile: File) => {
    setIsLoading(true)
    try {
      const pdfjsLib = await import("pdfjs-dist")
      pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`

      const arrayBuffer = await pdfFile.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

      // Initialize pages with placeholders - progressive loading
      const initialPages: PageData[] = []
      for (let i = 1; i <= pdf.numPages; i++) {
        initialPages.push({
          pageNumber: i,
          imageUrl: null, // Lazy load images
          isDeleted: false,
          isLoading: true,
        })
      }

      setPages(initialPages)
      setIsLoading(false) // Mark initial load as complete

      // Batch render first 8 pages immediately for better UX
      const batchSize = 8
      const firstBatch = Math.min(batchSize, pdf.numPages)

      for (let i = 1; i <= firstBatch; i++) {
        renderPage(pdf, i, i - 1)
      }

      // Lazy render remaining pages
      for (let i = firstBatch + 1; i <= pdf.numPages; i++) {
        // Delay to avoid blocking main thread
        await new Promise(resolve => setTimeout(resolve, 50))
        renderPage(pdf, i, i - 1)
      }

    } catch (err) {
      console.error("Error loading PDF:", err)
      setError("Failed to load PDF. Please try again.")
      setIsLoading(false)
    }
  }

  const renderPage = async (pdf: any, pageNum: number, index: number) => {
    try {
      const page = await pdf.getPage(pageNum)
      const viewport = page.getViewport({ scale: 1.0 }) // Reduced from 1.5x to 1.0x for faster rendering

      const canvas = document.createElement("canvas")
      const context = canvas.getContext("2d")
      canvas.width = viewport.width
      canvas.height = viewport.height

      if (context) {
        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise

        const imageUrl = canvas.toDataURL("image/jpeg", 0.85) // Use JPEG with 85% quality instead of PNG

        setPages(prev => {
          const newPages = [...prev]
          if (newPages[index]) {
            newPages[index] = {
              ...newPages[index],
              imageUrl,
              isLoading: false,
            }
          }
          return newPages
        })
      }
    } catch (err) {
      console.error(`Error rendering page ${pageNum}:`, err)
      setPages(prev => {
        const newPages = [...prev]
        if (newPages[index]) {
          newPages[index] = {
            ...newPages[index],
            isLoading: false,
          }
        }
        return newPages
      })
    }
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (event: React.DragEvent, index: number) => {
    event.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newPages = [...pages]
    const draggedPage = newPages[draggedIndex]
    newPages.splice(draggedIndex, 1)
    newPages.splice(index, 0, draggedPage)

    setPages(newPages)
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const toggleDeletePage = (index: number) => {
    const newPages = [...pages]
    newPages[index].isDeleted = !newPages[index].isDeleted
    setPages(newPages)
  }

  const generateBlob = async (): Promise<Blob | null> => {
    return organizedBlob
  }

  const getDefaultFilename = () => {
    if (!file) return "organized.pdf"
    return `organized_${file.name}`
  }

  const handleDownload = async () => {
    if (!file) return

    const activePagesCount = pages.filter(p => !p.isDeleted).length
    if (activePagesCount === 0) {
      setError(t('tools.organizePdf.noPages'))
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      // Get page numbers in the current order, skipping deleted ones
      const pageOrder = pages
        .filter(p => !p.isDeleted)
        .map(p => p.pageNumber)
        .join(',')

      const formData = new FormData()
      formData.append('file', file)
      formData.append('pageOrder', pageOrder)

      const response = await fetch('/api/organize-pdf', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to organize PDF')
      }

      const blob = await response.blob()
      setOrganizedBlob(blob)

      // Show filename dialog instead of auto-downloading
      setShowFilenameDialog(true)
    } catch (err) {
      console.error("Error organizing PDF:", err)
      setError("Failed to organize PDF. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFilenameConfirm = async (filename: string, action: 'download' | 'email') => {
    if (!organizedBlob) return

    setPendingFilename(filename)

    if (action === 'download') {
      const url = URL.createObjectURL(organizedBlob)
      const link = document.createElement("a")
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

  const activePageCount = pages.filter(p => !p.isDeleted).length
  const deletedPageCount = pages.filter(p => p.isDeleted).length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GripVertical className="h-6 w-6" />
          {t('tools.organizePdf.heading')}
        </CardTitle>
        <CardDescription>{t('tools.organizePdf.intro')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!file ? (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => document.getElementById("pdf-upload")?.click()}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg mb-2">{t('fileUpload.dragDrop', { type: t('fileUpload.pdf') })}</p>
            <p className="text-sm text-muted-foreground mb-4">{t('fileUpload.or')}</p>
            <Button variant="secondary">{t('fileUpload.browse')}</Button>
            <input
              id="pdf-upload"
              type="file"
              accept="application/pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">{t('tools.organizePdf.loadingPages')}</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {t('tools.organizePdf.pageCount', { count: activePageCount })}
                      {deletedPageCount > 0 && ` (${deletedPageCount} deleted)`}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => {
                    setFile(null)
                    setPages([])
                    setError(null)
                  }}>
                    {t('common.cancel')}
                  </Button>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{t('tools.organizePdf.dragToReorder')}</p>
                  <p className="text-sm text-muted-foreground">{t('tools.organizePdf.clickToDelete')}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {pages.map((page, index) => (
                    <div
                      key={`${page.pageNumber}-${index}`}
                      draggable={!page.isDeleted}
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                      className={`relative group cursor-move border-2 rounded-lg overflow-hidden transition-all ${
                        page.isDeleted
                          ? 'opacity-40 border-red-500'
                          : draggedIndex === index
                          ? 'border-primary scale-105 shadow-lg'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium z-10">
                        {t('tools.organizePdf.page')} {index + 1}
                      </div>

                      <button
                        onClick={() => toggleDeletePage(index)}
                        className={`absolute top-2 right-2 p-1 rounded-full transition-colors z-10 ${
                          page.isDeleted
                            ? 'bg-green-500 hover:bg-green-600 text-white'
                            : 'bg-red-500 hover:bg-red-600 text-white'
                        }`}
                        title={page.isDeleted ? t('tools.organizePdf.restorePage') : t('tools.organizePdf.deletePage')}
                      >
                        {page.isDeleted ? (
                          <RotateCcw className="h-4 w-4" />
                        ) : (
                          <X className="h-4 w-4" />
                        )}
                      </button>

                      {page.isLoading ? (
                        <div className="w-full aspect-[8.5/11] bg-muted flex items-center justify-center">
                          <div className="text-sm text-muted-foreground">Loading...</div>
                        </div>
                      ) : page.imageUrl ? (
                        <img
                          src={page.imageUrl}
                          alt={`Page ${page.pageNumber}`}
                          className="w-full h-auto"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full aspect-[8.5/11] bg-muted flex items-center justify-center">
                          <div className="text-sm text-muted-foreground">Error</div>
                        </div>
                      )}

                      {!page.isDeleted && (
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <GripVertical className="h-6 w-6 text-white drop-shadow-lg" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={handleDownload}
                  disabled={isProcessing || activePageCount === 0}
                  className="w-full"
                  size="lg"
                >
                  {isProcessing ? t('tools.organizePdf.organizing') : t('tools.organizePdf.downloadOrganized')}
                </Button>
              </>
            )}
          </div>
        )}

        {/* Hidden Email Share Button */}
        <div className="hidden">
          <EmailShareButton
            ref={emailShareButtonRef}
            onGenerateBlob={generateBlob}
            fileName={pendingFilename || getDefaultFilename()}
            shareMessage="I've organized a PDF document using Mon PDF."
          />
        </div>

        {/* Filename Dialog */}
        <FilenameDialog
          open={showFilenameDialog}
          onOpenChange={setShowFilenameDialog}
          defaultFilename={getDefaultFilename()}
          onConfirm={handleFilenameConfirm}
          title="Save Organized PDF"
          description="Choose a filename for your organized PDF"
        />
      </CardContent>
    </Card>
  )
}
