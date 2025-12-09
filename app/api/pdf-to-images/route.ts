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

    // Note: PDF to images conversion requires canvas which has complex dependencies in serverless
    // For production, consider:
    // 1. Using a third-party API service
    // 2. Implementing this on the client side (current approach)
    // 3. Using a dedicated service with proper infrastructure

    return NextResponse.json(
      {
        error: 'PDF to images conversion requires canvas rendering',
        suggestion: 'This feature works best on the client side or requires additional infrastructure setup',
        workaround: 'Keep using the client-side implementation for now'
      },
      { status: 501 }
    )
  } catch (error) {
    console.error('Error converting PDF to images:', error)
    return NextResponse.json(
      { error: 'Failed to convert PDF to images', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
export const maxDuration = 60
