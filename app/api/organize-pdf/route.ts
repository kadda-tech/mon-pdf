import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument } from 'pdf-lib'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const pageOrder = formData.get('pageOrder') as string // e.g., "3,1,2,4"

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    if (!pageOrder) {
      return NextResponse.json(
        { error: 'Page order not provided' },
        { status: 400 }
      )
    }

    const arrayBuffer = await file.arrayBuffer()
    const pdfDoc = await PDFDocument.load(arrayBuffer)
    const totalPages = pdfDoc.getPageCount()

    // Parse page order (1-based indices)
    const order = pageOrder.split(',').map(p => parseInt(p.trim()) - 1)

    // Validate page order
    if (order.some(p => p < 0 || p >= totalPages)) {
      return NextResponse.json(
        { error: 'Invalid page order' },
        { status: 400 }
      )
    }

    // Create new PDF with reordered pages
    const newPdf = await PDFDocument.create()
    const copiedPages = await newPdf.copyPages(pdfDoc, order)
    copiedPages.forEach((page) => newPdf.addPage(page))

    const pdfBytes = await newPdf.save()

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${file.name.replace(/\.pdf$/i, '_organized.pdf')}"`,
        'X-Total-Pages': totalPages.toString(),
        'X-New-Order': pageOrder,
      },
    })
  } catch (error) {
    console.error('Error organizing PDF:', error)
    return NextResponse.json(
      { error: 'Failed to organize PDF', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
export const maxDuration = 60
