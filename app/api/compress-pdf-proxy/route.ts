import { NextRequest, NextResponse } from 'next/server'

// Python backend URL
const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://0.0.0.0:8000'

export async function POST(request: NextRequest) {
  try {
    console.log('[Compress PDF Proxy] Forwarding request to Python backend')

    // Get the form data from the request
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      console.error('[Compress PDF Proxy] No file provided')
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    const fileSizeMB = (file.size / 1024 / 1024).toFixed(2)
    console.log(`[Compress PDF Proxy] Forwarding ${file.name} (${fileSizeMB}MB) to Python API`)

    // Forward to Python backend
    const pythonFormData = new FormData()
    pythonFormData.append('file', file)

    const response = await fetch(`${PYTHON_API_URL}/compress-pdf`, {
      method: 'POST',
      body: pythonFormData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      let errorData
      try {
        errorData = JSON.parse(errorText)
      } catch {
        errorData = { error: 'Failed to compress PDF', details: errorText }
      }

      console.error(`[Compress PDF Proxy] Python API error (${response.status}):`, errorData)

      return NextResponse.json(
        errorData,
        { status: response.status }
      )
    }

    const result = await response.json()
    console.log('[Compress PDF Proxy] Compression successful')

    return NextResponse.json(result)
  } catch (error) {
    console.error('[Compress PDF Proxy] Error:', error)

    let errorMessage = 'Failed to compress PDF'
    let errorDetails = error instanceof Error ? error.message : 'Unknown error'

    if (error instanceof Error) {
      // Check for specific error types
      if (error.message.includes('ECONNREFUSED')) {
        errorMessage = 'Python backend unavailable'
        errorDetails = `Cannot connect to Python API at ${PYTHON_API_URL}. Please ensure the backend is running.`
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Processing timeout'
        errorDetails = 'The compression took too long. Please try a smaller file.'
      }
    }

    return NextResponse.json(
      { error: errorMessage, details: errorDetails },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
export const maxDuration = 60
