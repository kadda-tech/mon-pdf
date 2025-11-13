"use client"

import { useEffect, useRef, useState } from 'react'
import * as pdfjs from 'pdfjs-dist'
import { Button } from './ui/button'
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react'
import { cn } from '@/lib/utils'

// Set up the worker
if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`
}

interface PDFViewerProps {
  file: Uint8Array | null
  className?: string
}

export function PDFViewer({ file, className }: PDFViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [pdf, setPdf] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [scale, setScale] = useState(1.0)
  const [loading, setLoading] = useState(false)

  // Load PDF
  useEffect(() => {
    if (!file) {
      setPdf(null)
      setTotalPages(0)
      setCurrentPage(1)
      return
    }

    setLoading(true)
    const loadingTask = pdfjs.getDocument({ data: file })

    loadingTask.promise
      .then((pdfDoc) => {
        setPdf(pdfDoc)
        setTotalPages(pdfDoc.numPages)
        setCurrentPage(1)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error loading PDF:', error)
        setLoading(false)
      })
  }, [file])

  // Render current page
  useEffect(() => {
    if (!pdf || !canvasRef.current) return

    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    if (!context) return

    pdf.getPage(currentPage).then((page: any) => {
      const viewport = page.getViewport({ scale })

      canvas.height = viewport.height
      canvas.width = viewport.width

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      }

      page.render(renderContext)
    })
  }, [pdf, currentPage, scale])

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 3.0))
  }

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.5))
  }

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  if (!file) {
    return (
      <div className={cn(
        "flex items-center justify-center bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/20",
        className
      )}>
        <p className="text-muted-foreground text-sm">No PDF loaded</p>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Controls */}
      <div className="flex items-center justify-between gap-2 bg-card border rounded-lg p-2">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevPage}
            disabled={currentPage === 1 || loading}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium px-2 min-w-[80px] text-center">
            {loading ? '...' : `${currentPage} / ${totalPages}`}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNextPage}
            disabled={currentPage === totalPages || loading}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomOut}
            disabled={scale <= 0.5 || loading}
            className="h-8 w-8"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium px-2 min-w-[60px] text-center">
            {Math.round(scale * 100)}%
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomIn}
            disabled={scale >= 3.0 || loading}
            className="h-8 w-8"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-auto bg-muted/30 rounded-lg border p-4">
        <div className="flex items-center justify-center min-h-full">
          {loading ? (
            <p className="text-muted-foreground text-sm">Loading...</p>
          ) : (
            <canvas
              ref={canvasRef}
              className="shadow-lg max-w-full h-auto"
            />
          )}
        </div>
      </div>
    </div>
  )
}
