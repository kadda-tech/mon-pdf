import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument } from 'pdf-lib'

type QualityLevel = 'high' | 'medium' | 'low'

export async function POST(request: NextRequest) {
  try {
    console.log('[Compress PDF] Request received')

    const formData = await request.formData()
    const file = formData.get('file') as File
    const quality = (formData.get('quality') as QualityLevel) || 'medium'

    if (!file) {
      console.error('[Compress PDF] No file provided')
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    const fileSizeMB = (file.size / 1024 / 1024).toFixed(2)
    console.log(`[Compress PDF] File received: ${file.name}, Size: ${fileSizeMB}MB`)

    // Check file size limit (50MB for Vercel Pro, 4.5MB for Hobby)
    const maxSizeMB = 50 // Adjust based on your Vercel plan
    if (file.size > maxSizeMB * 1024 * 1024) {
      console.error(`[Compress PDF] File too large: ${fileSizeMB}MB exceeds ${maxSizeMB}MB limit`)
      return NextResponse.json(
        { error: `File too large. Maximum size is ${maxSizeMB}MB`, fileSize: fileSizeMB },
        { status: 413 }
      )
    }

    console.log('[Compress PDF] Loading file into memory...')
    const arrayBuffer = await file.arrayBuffer()
    console.log('[Compress PDF] File loaded, parsing PDF...')

    // Load the PDF document
    const pdfDoc = await PDFDocument.load(arrayBuffer)
    const pageCount = pdfDoc.getPageCount()
    console.log(`[Compress PDF] PDF loaded successfully: ${pageCount} pages`)

    console.log('[Compress PDF] Compressing PDF...')
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

    console.log(`[Compress PDF] Compression complete: ${(originalSize/1024/1024).toFixed(2)}MB → ${(compressedSize/1024/1024).toFixed(2)}MB (${ratio}% reduction)`)

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
    console.error('[Compress PDF] Error:', error)

    // More detailed error reporting
    let errorMessage = 'Failed to compress PDF'
    let errorDetails = error instanceof Error ? error.message : 'Unknown error'

    if (error instanceof Error) {
      // Check for specific error types
      if (error.message.includes('memory') || error.message.includes('heap')) {
        errorMessage = 'File too large to process in memory'
        errorDetails = 'The PDF file is too large for server memory. Please try a smaller file or use a different compression method.'
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Processing timeout'
        errorDetails = 'The compression took too long. Please try a smaller file.'
      } else if (error.message.includes('Invalid PDF')) {
        errorMessage = 'Invalid PDF file'
        errorDetails = 'The file appears to be corrupted or is not a valid PDF.'
      }
    }

    return NextResponse.json(
      { error: errorMessage, details: errorDetails, stack: error instanceof Error ? error.stack : undefined },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
export const maxDuration = 60
