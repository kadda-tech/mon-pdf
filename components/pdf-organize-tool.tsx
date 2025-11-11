"use client"

import { useState, useEffect } from "react"
import { useTranslations } from 'next-intl'
import { PDFDocument } from "pdf-lib"
import { Upload, GripVertical, X, RotateCcw } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface PageData {
  pageNumber: number
  imageUrl: string
  isDeleted: boolean
}

export function PDFOrganizeTool() {
  const t = useTranslations()
  const [file, setFile] = useState<File | null>(null)
  const [pages, setPages] = useState<PageData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

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
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`

      const arrayBuffer = await pdfFile.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

      const loadedPages: PageData[] = []

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const viewport = page.getViewport({ scale: 1.5 })

        const canvas = document.createElement("canvas")
        const context = canvas.getContext("2d")
        canvas.width = viewport.width
        canvas.height = viewport.height

        if (context) {
          await page.render({
            canvasContext: context,
            viewport: viewport,
          }).promise

          const imageUrl = canvas.toDataURL()
          loadedPages.push({
            pageNumber: i,
            imageUrl,
            isDeleted: false,
          })
        }
      }

      setPages(loadedPages)
    } catch (err) {
      console.error("Error loading PDF:", err)
      setError("Failed to load PDF. Please try again.")
    } finally {
      setIsLoading(false)
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
      const arrayBuffer = await file.arrayBuffer()
      const pdfDoc = await PDFDocument.load(arrayBuffer)
      const newPdf = await PDFDocument.create()

      // Add pages in the current order, skipping deleted ones
      for (const pageData of pages) {
        if (!pageData.isDeleted) {
          const [copiedPage] = await newPdf.copyPages(pdfDoc, [pageData.pageNumber - 1])
          newPdf.addPage(copiedPage)
        }
      }

      const pdfBytes = await newPdf.save()
      const blob = new Blob([pdfBytes], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `organized_${file.name}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Error organizing PDF:", err)
      setError("Failed to organize PDF. Please try again.")
    } finally {
      setIsProcessing(false)
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

                      <img
                        src={page.imageUrl}
                        alt={`Page ${page.pageNumber}`}
                        className="w-full h-auto"
                      />

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
      </CardContent>
    </Card>
  )
}
