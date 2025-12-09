import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument } from 'pdf-lib'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const pagesParam = formData.get('pages') as string // e.g., "1,3,5-7"
    const mode = formData.get('mode') as string || 'pages' // 'pages' or 'ranges'

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    const arrayBuffer = await file.arrayBuffer()
    const pdfDoc = await PDFDocument.load(arrayBuffer)
    const totalPages = pdfDoc.getPageCount()

    // Parse page selection
    let pageIndices: number[] = []

    if (mode === 'pages' && pagesParam) {
      // Parse comma-separated pages and ranges (e.g., "1,3,5-7")
      const parts = pagesParam.split(',').map(p => p.trim())
      for (const part of parts) {
        if (part.includes('-')) {
          const [start, end] = part.split('-').map(n => parseInt(n.trim()))
          for (let i = start; i <= end; i++) {
            if (i > 0 && i <= totalPages) {
              pageIndices.push(i - 1) // Convert to 0-based index
            }
          }
        } else {
          const pageNum = parseInt(part)
          if (pageNum > 0 && pageNum <= totalPages) {
            pageIndices.push(pageNum - 1)
          }
        }
      }
    } else {
      // If no pages specified, split into individual pages
      pageIndices = Array.from({ length: totalPages }, (_, i) => i)
    }

    if (pageIndices.length === 0) {
      return NextResponse.json(
        { error: 'No valid pages selected' },
        { status: 400 }
      )
    }

    // Create new PDF with selected pages
    const newPdf = await PDFDocument.create()
    const copiedPages = await newPdf.copyPages(pdfDoc, pageIndices)
    copiedPages.forEach((page) => newPdf.addPage(page))

    const pdfBytes = await newPdf.save()

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${file.name.replace(/\.pdf$/i, '_split.pdf')}"`,
        'X-Total-Pages': totalPages.toString(),
        'X-Selected-Pages': pageIndices.length.toString(),
      },
    })
  } catch (error) {
    console.error('Error splitting PDF:', error)
    return NextResponse.json(
      { error: 'Failed to split PDF', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
export const maxDuration = 60
