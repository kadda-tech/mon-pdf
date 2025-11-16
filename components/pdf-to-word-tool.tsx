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
import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  Packer,
  AlignmentType,
  ImageRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  UnderlineType,
  convertInchesToTwip
} from 'docx'
import { createOCREngine, OCRPageResult } from '@/lib/ocr/ocr-engine'
import { convertPDFToImages } from '@/lib/ocr/pdf-to-image'

// Configure PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`
}

interface TextItem {
  str: string
  transform: number[]
  width: number
  height: number
  fontName?: string
  hasEOL?: boolean
  dir?: string
}

interface ExtractedImage {
  data: Uint8Array
  width: number
  height: number
  y: number
}

interface ExtractedPage {
  pageNumber: number
  text: string
  items: any[]
  hasText: boolean
  canvas?: HTMLCanvasElement
  images?: ExtractedImage[]
  viewport?: any
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
    let totalImagesExtracted = 0 // Track total images across all pages

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const viewport = page.getViewport({ scale: 1.5 })
      const textContent = await page.getTextContent()

      // Extract images from the page - use a more reliable method
      const images: ExtractedImage[] = []

      try {
        // Get all resources including images
        const operatorList = await page.getOperatorList()

        // Track graphics state stack for proper positioning
        const transformStack: number[][] = []
        let currentTransform = [1, 0, 0, 1, 0, 0]

        for (let i = 0; i < operatorList.fnArray.length; i++) {
          const op = operatorList.fnArray[i]

          // Track save/restore graphics state
          if (op === pdfjsLib.OPS.save) {
            transformStack.push([...currentTransform])
          } else if (op === pdfjsLib.OPS.restore) {
            if (transformStack.length > 0) {
              currentTransform = transformStack.pop()!
            }
          } else if (op === pdfjsLib.OPS.transform) {
            // Multiply the current transform with the new one
            const m = operatorList.argsArray[i]
            const [a1, b1, c1, d1, e1, f1] = currentTransform
            const [a2, b2, c2, d2, e2, f2] = m
            currentTransform = [
              a1 * a2 + b1 * c2,
              a1 * b2 + b1 * d2,
              c1 * a2 + d1 * c2,
              c1 * b2 + d1 * d2,
              e1 * a2 + f1 * c2 + e2,
              e1 * b2 + f1 * d2 + f2
            ]
          }

          // Look for image painting operations
          if (op === pdfjsLib.OPS.paintImageXObject) {
            try {
              const imageName = operatorList.argsArray[i][0]

              // Wait for the image object to be loaded
              const image = await page.objs.get(imageName)

              if (image) {

                // Create canvas to convert image
                const canvas = document.createElement('canvas')
                canvas.width = image.width
                canvas.height = image.height
                const ctx = canvas.getContext('2d')

                if (ctx) {
                  // Try using bitmap if data is not available
                  if (image.bitmap) {
                    ctx.drawImage(image.bitmap, 0, 0)
                  } else if (image.data) {
                    const imageData = ctx.createImageData(image.width, image.height)
                    const data = imageData.data

                    // Handle different color spaces
                    if (image.kind === 1) {
                      // Grayscale
                      for (let j = 0; j < image.data.length; j++) {
                        const idx = j * 4
                        data[idx] = image.data[j]
                        data[idx + 1] = image.data[j]
                        data[idx + 2] = image.data[j]
                        data[idx + 3] = 255
                      }
                    } else if (image.kind === 2) {
                      // RGB
                      for (let j = 0, k = 0; j < image.data.length; j += 3, k += 4) {
                        data[k] = image.data[j]
                        data[k + 1] = image.data[j + 1]
                        data[k + 2] = image.data[j + 2]
                        data[k + 3] = 255
                      }
                    } else if (image.kind === 3) {
                      // RGBA
                      for (let j = 0; j < image.data.length; j++) {
                        data[j] = image.data[j]
                      }
                    } else {
                      // Unknown kind - try intelligent detection
                      const totalPixels = image.width * image.height
                      const bytesPerPixel = image.data.length / totalPixels

                      if (Math.abs(bytesPerPixel - 1) < 0.1) {
                        // Likely grayscale
                        for (let j = 0; j < image.data.length; j++) {
                          const idx = j * 4
                          data[idx] = image.data[j]
                          data[idx + 1] = image.data[j]
                          data[idx + 2] = image.data[j]
                          data[idx + 3] = 255
                        }
                      } else if (Math.abs(bytesPerPixel - 3) < 0.1) {
                        // Likely RGB
                        for (let j = 0, k = 0; j < image.data.length; j += 3, k += 4) {
                          data[k] = image.data[j]
                          data[k + 1] = image.data[j + 1]
                          data[k + 2] = image.data[j + 2]
                          data[k + 3] = 255
                        }
                      } else if (Math.abs(bytesPerPixel - 4) < 0.1) {
                        // Likely RGBA
                        for (let j = 0; j < image.data.length; j++) {
                          data[j] = image.data[j]
                        }
                      } else {
                        // Last resort fallback
                        for (let j = 0; j < totalPixels && j * 4 < data.length; j++) {
                          data[j * 4] = image.data[j] || 0
                          data[j * 4 + 1] = image.data[j] || 0
                          data[j * 4 + 2] = image.data[j] || 0
                          data[j * 4 + 3] = 255
                        }
                      }
                    }

                    ctx.putImageData(imageData, 0, 0)
                  } else {
                    console.warn(`Image ${imageName} has no data or bitmap`)
                    continue
                  }

                  // Convert to PNG
                  const dataUrl = canvas.toDataURL('image/png')
                  const base64Data = dataUrl.split(',')[1]
                  const binaryString = atob(base64Data)
                  const bytes = new Uint8Array(binaryString.length)
                  for (let k = 0; k < binaryString.length; k++) {
                    bytes[k] = binaryString.charCodeAt(k)
                  }

                  // Y position from accumulated transform matrix
                  // Transform matrix format: [a, b, c, d, e, f]
                  // where: x' = ax + cy + e, y' = bx + dy + f
                  // For images, the origin (0,0) maps to (e, f)
                  const [a, b, c, d, e, f] = currentTransform

                  // The bottom-left corner of the image in PDF coordinates
                  const yBottom = f
                  const imageHeight = d // Y-scale gives us the height

                  // For better positioning with text, use the center or bottom of image
                  // Text baseline is typically their Y position, so we'll use image bottom
                  const imageY = yBottom

                  images.push({
                    data: bytes,
                    width: image.width,
                    height: image.height,
                    y: imageY
                  })
                }
              }
            } catch (err) {
              console.error('Failed to extract image:', err, err.stack)
            }
          }
        }

      } catch (err) {
        console.error('Error during image extraction:', err)
      }

      // Extract text with positioning info
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ')

      // Check if page has meaningful text
      const hasText = pageText.trim().length > 10

      // If no text, render page to canvas for image extraction
      let canvas: HTMLCanvasElement | undefined
      if (!hasText) {
        canvas = document.createElement('canvas')
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

      // If we have images with unreasonable Y positions, try to fix them based on figure captions
      if (images.length > 0) {
        images.forEach((image, idx) => {
          if (image.y > 10000 || image.y < 0) {
            // Calculate the figure number based on total images extracted so far
            const figureNumber = totalImagesExtracted + idx + 1

            // Find "Figure X:" in text items to estimate position
            const figureRegex = new RegExp(`Figure\\s+${figureNumber}:`, 'i')
            const figureItem = textContent.items.find((item: any) =>
              figureRegex.test(item.str)
            )

            if (figureItem) {
              // Place image slightly above the figure caption
              const captionY = figureItem.transform[5]
              image.y = captionY + 50 // Place 50 units above caption
            } else {
              console.warn(`Image ${idx} (Figure ${figureNumber}) has unusual Y=${image.y}, no Figure caption found`)
            }
          }
        })
      }

      // Update total images count
      totalImagesExtracted += images.length

      pages.push({
        pageNumber: pageNum,
        text: pageText,
        items: textContent.items,
        hasText,
        canvas,
        images: images.length > 0 ? images : undefined,
        viewport
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
    const children: (Paragraph | Table)[] = []

    for (let index = 0; index < pages.length; index++) {
      const page = pages[index]

      if (!page.hasText && page.canvas) {
        // Page has scanned image, convert to blob then to array buffer
        try {
          const dataUrl = page.canvas.toDataURL('image/png')
          const base64Data = dataUrl.split(',')[1]
          const binaryString = atob(base64Data)
          const bytes = new Uint8Array(binaryString.length)
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i)
          }

          const maxWidth = 600
          const scale = Math.min(maxWidth / page.canvas.width, 1)
          const width = Math.round(page.canvas.width * scale)
          const height = Math.round(page.canvas.height * scale)

          children.push(
            new Paragraph({
              children: [
                new ImageRun({
                  data: bytes,
                  transformation: { width, height },
                }),
              ],
              spacing: {
                before: index > 0 ? 400 : 0,
                after: 200
              },
            })
          )
        } catch (err) {
          console.error('Failed to embed scanned image:', err)
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
        // Use the same comprehensive logic as createWordDocument
        const pageWidth = page.viewport?.width || 600
        const contentItems: Array<{type: 'text' | 'image' | 'table', y: number, data: any}> = []

        // Add images with their Y positions
        if (page.images && page.images.length > 0) {
          page.images.forEach((image, idx) => {
            contentItems.push({
              type: 'image',
              y: image.y,
              data: image
            })
          })
        } else {
          console.log(`Page ${page.pageNumber} (with images): No images found`)
        }

        // Analyze text layout
        const textItems = page.items as TextItem[]
        const rowGroups = groupTextItemsByY(textItems, 5)
        const rows = Array.from(rowGroups.entries()).sort((a, b) => b[0] - a[0])

        // Detect tables
        const tableRanges = detectTableRanges(rows)

        // Separate table and non-table content
        const tableRows: Array<{y: number, items: TextItem[]}> = []
        const normalRows: Array<{y: number, items: TextItem[]}> = []

        rows.forEach(([y, items]) => {
          const isInTable = tableRanges.some(range => y >= range.start && y <= range.end)
          if (isInTable) {
            tableRows.push({y, items})
          } else {
            normalRows.push({y, items})
          }
        })

        // Add table content items
        if (tableRows.length > 0) {
          const avgY = tableRows.reduce((sum, row) => sum + row.y, 0) / tableRows.length
          contentItems.push({
            type: 'table',
            y: avgY,
            data: tableRows
          })
        }

        // Add normal text content items
        normalRows.forEach(({y, items}) => {
          contentItems.push({
            type: 'text',
            y,
            data: items
          })
        })

        // Sort all content by Y position (top to bottom)
        contentItems.sort((a, b) => b.y - a.y)

        // Process content in order
        for (const item of contentItems) {
          if (item.type === 'image') {
            try {
              const image = item.data as ExtractedImage
              const maxWidth = 600
              const scale = Math.min(maxWidth / image.width, 1)
              const width = Math.round(image.width * scale)
              const height = Math.round(image.height * scale)

              children.push(
                new Paragraph({
                  children: [
                    new ImageRun({
                      data: image.data,
                      transformation: { width, height },
                    }),
                  ],
                  spacing: { before: 200, after: 200 },
                  alignment: AlignmentType.CENTER,
                })
              )
            } catch (err) {
              console.error('Failed to embed image:', err)
            }
          } else if (item.type === 'table') {
            try {
              const tableData = item.data as Array<{y: number, items: TextItem[]}>
              const table = createTableFromRows(tableData, pageWidth)
              if (table) {
                children.push(table)
              }
            } catch (err) {
              console.error('Failed to create table:', err)
            }
          } else if (item.type === 'text') {
            try {
              const textItems = item.data as TextItem[]
              const paragraph = createParagraphFromItems(textItems, pageWidth)
              if (paragraph) {
                children.push(paragraph)
              }
            } catch (err) {
              console.error('Failed to create paragraph:', err)
            }
          }
        }
      }

      setProgress(60 + ((index + 1) / pages.length) * 40)
    }


    const doc = new Document({
      sections: [{ properties: {}, children }],
    })

    const blob = await Packer.toBlob(doc)
    return blob
  }

  const createWordDocument = async (pages: ExtractedPage[]): Promise<Blob> => {
    const children: (Paragraph | Table)[] = []

    for (let index = 0; index < pages.length; index++) {
      const page = pages[index]
      const pageWidth = page.viewport?.width || 600

      // Group text items and images by Y position for proper ordering
      const contentItems: Array<{type: 'text' | 'image' | 'table', y: number, data: any}> = []

      // Add images with their Y positions
      if (page.images && page.images.length > 0) {
        page.images.forEach((image, idx) => {
          contentItems.push({
            type: 'image',
            y: image.y,
            data: image
          })
        })
      } else {
        console.log(`Page ${page.pageNumber}: No images found`)
      }

      // Analyze text layout
      const textItems = page.items as TextItem[]

      // Group text items by Y position (rows)
      const rowGroups = groupTextItemsByY(textItems, 5)
      const rows = Array.from(rowGroups.entries()).sort((a, b) => b[0] - a[0]) // Sort top to bottom

      // Detect tables
      const tableRanges = detectTableRanges(rows)

      // Separate table and non-table content
      const tableRows: Array<{y: number, items: TextItem[]}> = []
      const normalRows: Array<{y: number, items: TextItem[]}> = []

      rows.forEach(([y, items]) => {
        const isInTable = tableRanges.some(range => y >= range.start && y <= range.end)
        if (isInTable) {
          tableRows.push({y, items})
        } else {
          normalRows.push({y, items})
        }
      })

      // Add table content items
      if (tableRows.length > 0) {
        const avgY = tableRows.reduce((sum, row) => sum + row.y, 0) / tableRows.length
        contentItems.push({
          type: 'table',
          y: avgY,
          data: tableRows
        })
      }

      // Add normal text content items
      normalRows.forEach(({y, items}) => {
        const rowText = items.map(i => i.str).join(' ').substring(0, 50)
        contentItems.push({
          type: 'text',
          y,
          data: items
        })
      })

      // Sort all content by Y position (top to bottom)
      // In PDF coordinates, Y increases from bottom to top, so higher Y = top of page
      // We want to process from top to bottom, so sort by Y descending
      contentItems.sort((a, b) => b.y - a.y)

      // Process content in order
      for (const item of contentItems) {
        if (item.type === 'image') {
          try {
            const image = item.data as ExtractedImage
            const maxWidth = 600
            const scale = Math.min(maxWidth / image.width, 1)
            const width = Math.round(image.width * scale)
            const height = Math.round(image.height * scale)


            children.push(
              new Paragraph({
                children: [
                  new ImageRun({
                    data: image.data,
                    transformation: { width, height },
                  }),
                ],
                spacing: { before: 200, after: 200 },
                alignment: AlignmentType.CENTER,
              })
            )
          } catch (err) {
            console.error('Failed to embed image:', err)
          }
        } else if (item.type === 'table') {
          try {
            const tableData = item.data as Array<{y: number, items: TextItem[]}>
            const table = createTableFromRows(tableData, pageWidth)
            if (table) {
              children.push(table)
            }
          } catch (err) {
            console.error('Failed to create table:', err)
          }
        } else if (item.type === 'text') {
          try {
            const textItems = item.data as TextItem[]
            const paragraph = createParagraphFromItems(textItems, pageWidth)
            if (paragraph) {
              children.push(paragraph)
            }
          } catch (err) {
            console.error('Failed to create paragraph:', err)
          }
        }
      }

      setProgress(60 + ((index + 1) / pages.length) * 40)
    }

    const doc = new Document({
      sections: [{ properties: {}, children }],
    })

    return await Packer.toBlob(doc)
  }

  // Helper: Group text items by Y position
  const groupTextItemsByY = (items: TextItem[], tolerance: number): Map<number, TextItem[]> => {
    const groups = new Map<number, TextItem[]>()

    items.forEach(item => {
      const y = item.transform[5]
      let foundGroup = false

      for (const [existingY, group] of groups) {
        if (Math.abs(y - existingY) < tolerance) {
          group.push(item)
          foundGroup = true
          break
        }
      }

      if (!foundGroup) {
        groups.set(y, [item])
      }
    })

    // Sort items in each group by X position
    groups.forEach(group => {
      group.sort((a, b) => a.transform[4] - b.transform[4])
    })

    return groups
  }

  // Helper: Detect table ranges
  const detectTableRanges = (rows: Array<[number, TextItem[]]>): Array<{start: number, end: number}> => {
    const ranges: Array<{start: number, end: number}> = []
    let currentRange: {start: number, end: number} | null = null

    for (let i = 0; i < rows.length - 1; i++) {
      const [y1, items1] = rows[i]
      const [y2, items2] = rows[i + 1]

      // Check if both rows have multiple items and similar structure
      if (items1.length > 1 && items2.length > 1 &&
          Math.abs(items1.length - items2.length) <= 1) {

        // Check for column alignment
        const x1Positions = items1.map(item => item.transform[4])
        const x2Positions = items2.map(item => item.transform[4])

        let alignedColumns = 0
        x1Positions.forEach(x1 => {
          if (x2Positions.some(x2 => Math.abs(x1 - x2) < 10)) {
            alignedColumns++
          }
        })

        if (alignedColumns >= Math.min(items1.length, items2.length) * 0.5) {
          if (!currentRange) {
            currentRange = {start: y1, end: y2}
          } else {
            currentRange.end = y2
          }
        } else {
          if (currentRange) {
            ranges.push(currentRange)
            currentRange = null
          }
        }
      } else {
        if (currentRange) {
          ranges.push(currentRange)
          currentRange = null
        }
      }
    }

    if (currentRange) {
      ranges.push(currentRange)
    }

    return ranges
  }

  // Helper: Create table from rows
  const createTableFromRows = (rows: Array<{y: number, items: TextItem[]}>, pageWidth: number): Table | null => {
    if (rows.length === 0) return null

    // Determine column count (max items in any row)
    const maxCols = Math.max(...rows.map(row => row.items.length))

    const tableRows = rows.map(row => {
      const cells = []

      for (let i = 0; i < maxCols; i++) {
        const item = row.items[i]
        const text = item ? item.str : ''
        const fontSize = item?.height ? Math.round(item.height * 2) : 22
        const fontName = item?.fontName || 'Calibri'
        const isBold = fontName.toLowerCase().includes('bold')

        cells.push(
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text,
                    size: fontSize,
                    font: fontName.replace(/-(Bold|Italic|BoldItalic)/gi, ''),
                    bold: isBold,
                  })
                ],
              })
            ],
            width: {
              size: 100 / maxCols,
              type: WidthType.PERCENTAGE,
            },
          })
        )
      }

      return new TableRow({ children: cells })
    })

    return new Table({
      rows: tableRows,
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },
    })
  }

  // Helper: Create paragraph from text items
  const createParagraphFromItems = (items: TextItem[], pageWidth: number): Paragraph | null => {
    if (items.length === 0) return null

    // Get full text to check
    const fullText = items.map(i => i.str).join('').trim()

    // Skip page numbers
    // Pattern 1: Just a single digit or number (1, 2, 3, etc.)
    // Pattern 2: Number with dots (1..., 2..., etc.)
    // But exclude section numbers like "2.1", "2.2", etc.
    if (/^\d+\.{0,}$/.test(fullText) && !fullText.includes('.') || /^\d+\.{2,}$/.test(fullText)) {
      // Additional check: if it's a single number and Y position is low (bottom of page)
      // or if there's only one or two items in this row
      const avgY = items.reduce((sum, item) => sum + item.transform[5], 0) / items.length
      if (items.length <= 2 || avgY < 100) {
        return null
      }
    }

    // Detect alignment
    const avgX = items.reduce((sum, item) => sum + item.transform[4], 0) / items.length
    const leftMargin = avgX
    const rightMargin = pageWidth - avgX - items.reduce((sum, item) => sum + item.width, 0) / items.length

    let alignment = AlignmentType.LEFT
    if (leftMargin > pageWidth * 0.35 && rightMargin > pageWidth * 0.35) {
      alignment = AlignmentType.CENTER
    } else if (rightMargin < leftMargin * 0.5) {
      alignment = AlignmentType.RIGHT
    }

    // Detect if it's a list item
    const isBulletList = /^[•·○●■□▪▫-]\s/.test(fullText)
    const isNumberedList = /^\d+[\.\)]\s/.test(fullText)

    // Build text runs with formatting
    const textRuns: TextRun[] = []

    items.forEach((item, index) => {
      if (!item.str) return

      const fontSize = item.height ? Math.round(item.height * 2) : 22
      const fontName = item.fontName || 'Calibri'
      const isBold = fontName.toLowerCase().includes('bold')
      const isItalic = fontName.toLowerCase().includes('italic')

      // Detect if text is heading (larger font or all caps)
      const isLikelyHeading = fontSize > 28 || (item.str === item.str.toUpperCase() && item.str.length > 3 && item.str.length < 100)

      textRuns.push(
        new TextRun({
          text: item.str + (item.hasEOL ? '' : (index < items.length - 1 ? ' ' : '')),
          size: fontSize,
          font: fontName.replace(/-(Bold|Italic|BoldItalic)/gi, ''),
          bold: isBold || isLikelyHeading,
          italics: isItalic,
        })
      )
    })

    if (textRuns.length === 0) return null

    // Determine if this is a heading
    const avgFontSize = items.reduce((sum, item) => sum + (item.height || 11), 0) / items.length
    const isHeading = avgFontSize > 14 || fullText === fullText.toUpperCase() && fullText.length < 100

    return new Paragraph({
      children: textRuns,
      alignment,
      heading: isHeading ? HeadingLevel.HEADING_2 : undefined,
      spacing: {
        before: isHeading ? 240 : 120,
        after: isHeading ? 120 : 120,
      },
      bullet: isBulletList ? { level: 0 } : undefined,
      numbering: isNumberedList ? { reference: 'default-numbering', level: 0 } : undefined,
    })
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
        blob = await createWordDocumentWithImages(pages)
      } else {
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
                  <Button variant="ghost" size="sm" onClick={reset} className="cursor-pointer">
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
                  className="flex-1 cursor-pointer"
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
                <Button variant="outline" size="sm" onClick={reset} className="cursor-pointer">
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
                <span>Text formatting preserved (fonts, sizes, styles)</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Images from PDFs are automatically extracted and embedded</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Tables are detected and converted with proper structure</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Scanned images can be embedded or converted to text using OCR</span>
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
                className="w-full h-auto py-3 px-3 flex items-start gap-3 hover:bg-primary/5 text-left cursor-pointer"
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
                className="w-full h-auto py-3 px-3 flex items-start gap-3 hover:bg-primary/5 text-left cursor-pointer"
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
