import { NextRequest, NextResponse } from 'next/server'

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

    // Note: OCR requires pdfjs-dist which has DOM dependencies not available in Node.js serverless
    // For production, consider:
    // 1. Using a third-party OCR API service
    // 2. Implementing this on the client side (current approach)
    // 3. Using a dedicated service with proper infrastructure

    return NextResponse.json(
      {
        error: 'OCR requires browser APIs not available in serverless environment',
        suggestion: 'This feature works best on the client side or requires external OCR service',
        workaround: 'Keep using the client-side implementation for now'
      },
      { status: 501 }
    )
  } catch (error) {
    console.error('Error performing OCR:', error)
    return NextResponse.json(
      { error: 'Failed to perform OCR', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
export const maxDuration = 60
