import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument } from 'pdf-lib'

type QualityLevel = 'high' | 'medium' | 'low'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const quality = (formData.get('quality') as QualityLevel) || 'medium'

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    const arrayBuffer = await file.arrayBuffer()

    // Load the PDF document
    const pdfDoc = await PDFDocument.load(arrayBuffer)

    // Save with compression options
    // pdf-lib automatically applies compression when saving
    const compressedPdfBytes = await pdfDoc.save({
      useObjectStreams: true,
      addDefaultPage: false,
      objectsPerTick: 50,
    })

    const originalSize = arrayBuffer.byteLength
    const compressedSize = compressedPdfBytes.length
    const ratio = Math.round(((originalSize - compressedSize) / originalSize) * 100)

    return new NextResponse(compressedPdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${file.name.replace(/\.pdf$/i, '_compressed.pdf')}"`,
        'X-Original-Size': originalSize.toString(),
        'X-Compressed-Size': compressedSize.toString(),
        'X-Compression-Ratio': ratio.toString(),
      },
    })
  } catch (error) {
    console.error('Error compressing PDF:', error)
    return NextResponse.json(
      { error: 'Failed to compress PDF', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
export const maxDuration = 60
