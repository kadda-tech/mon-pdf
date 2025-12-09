import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument } from 'pdf-lib'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const images: File[] = []

    // Extract all image files from FormData
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('image') && value instanceof File) {
        images.push(value)
      }
    }

    if (images.length === 0) {
      return NextResponse.json(
        { error: 'No images provided' },
        { status: 400 }
      )
    }

    // Create new PDF document
    const pdfDoc = await PDFDocument.create()

    // Process each image
    for (const imageFile of images) {
      const imageBytes = await imageFile.arrayBuffer()
      const imageType = imageFile.type

      let image
      if (imageType === 'image/png') {
        image = await pdfDoc.embedPng(imageBytes)
      } else if (imageType === 'image/jpeg' || imageType === 'image/jpg') {
        image = await pdfDoc.embedJpg(imageBytes)
      } else {
        // For other formats, skip or convert
        console.warn(`Unsupported image type: ${imageType}`)
        continue
      }

      // Create page with image dimensions
      const page = pdfDoc.addPage([image.width, image.height])

      // Draw image on page
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: image.width,
        height: image.height,
      })
    }

    if (pdfDoc.getPageCount() === 0) {
      return NextResponse.json(
        { error: 'No valid images were processed' },
        { status: 400 }
      )
    }

    const pdfBytes = await pdfDoc.save()

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="images-to-pdf.pdf"',
        'X-Total-Images': images.length.toString(),
        'X-Total-Pages': pdfDoc.getPageCount().toString(),
      },
    })
  } catch (error) {
    console.error('Error converting images to PDF:', error)
    return NextResponse.json(
      { error: 'Failed to convert images to PDF', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
export const maxDuration = 60
