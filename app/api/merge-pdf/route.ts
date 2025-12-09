import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument } from 'pdf-lib'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files: File[] = []

    // Extract all files from FormData
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('file') && value instanceof File) {
        files.push(value)
      }
    }

    if (files.length < 2) {
      return NextResponse.json(
        { error: 'At least 2 PDF files are required for merging' },
        { status: 400 }
      )
    }

    // Create merged PDF document
    const mergedPdf = await PDFDocument.create()

    // Process each file in order
    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer()
      const pdfDoc = await PDFDocument.load(arrayBuffer)
      const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices())
      copiedPages.forEach((page) => mergedPdf.addPage(page))
    }

    // Save the merged PDF
    const pdfBytes = await mergedPdf.save()

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="merged-document.pdf"',
        'X-Total-Files': files.length.toString(),
        'X-Total-Pages': mergedPdf.getPageCount().toString(),
      },
    })
  } catch (error) {
    console.error('Error merging PDFs:', error)
    return NextResponse.json(
      { error: 'Failed to merge PDFs', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
export const maxDuration = 60
