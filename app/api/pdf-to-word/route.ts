import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument } from 'pdf-lib'
import { Document, Packer, Paragraph, TextRun } from 'docx'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    const arrayBuffer = await file.arrayBuffer()
    const pdfDoc = await PDFDocument.load(arrayBuffer)
    const pageCount = pdfDoc.getPageCount()

    // Note: Text extraction from PDF requires pdfjs-dist which has DOM dependencies
    // For a basic implementation, we create a placeholder Word document
    // For production, consider using a third-party API or client-side implementation

    const paragraphs: Paragraph[] = [
      new Paragraph({
        children: [
          new TextRun({
            text: 'PDF to Word Conversion',
            bold: true,
            size: 32,
          }),
        ],
        spacing: {
          after: 240,
        },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Source: ${file.name}`,
          }),
        ],
        spacing: {
          after: 120,
        },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Total Pages: ${pageCount}`,
          }),
        ],
        spacing: {
          after: 240,
        },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: 'Note: Full text extraction requires browser APIs. For production use, implement text extraction on the client side or use a third-party service.',
            italics: true,
          }),
        ],
      }),
    ]

    // Create Word document
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: paragraphs,
        },
      ],
    })

    // Generate document buffer
    const docBuffer = await Packer.toBuffer(doc)

    return new NextResponse(docBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${file.name.replace(/\.pdf$/i, '.docx')}"`,
        'X-Total-Pages': pageCount.toString(),
        'X-Note': 'Basic conversion - full text extraction requires client-side implementation',
      },
    })
  } catch (error) {
    console.error('Error converting PDF to Word:', error)
    return NextResponse.json(
      { error: 'Failed to convert PDF to Word', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
export const maxDuration = 60
