import { NextRequest, NextResponse } from 'next/server'

const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://0.0.0.0:8000'

// Map frontend position to Python API position format
const positionMap: Record<string, string> = {
  'top-left': 'top_left',
  'top-center': 'top_center',
  'top-right': 'top_right',
  'middle-left': 'middle_left',
  'middle-center': 'middle_center',
  'middle-right': 'middle_right',
  'bottom-left': 'bottom_left',
  'bottom-center': 'bottom_center',
  'bottom-right': 'bottom_right',
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const position = formData.get('position') as string || 'bottom-center'
    const style = formData.get('style') as string || 'numeric'
    const fontSize = formData.get('fontSize') as string || '12'
    const startNumber = formData.get('startNumber') as string || '1'
    const prefix = formData.get('prefix') as string || ''
    const suffix = formData.get('suffix') as string || ''

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    if (!file.type || !file.type.includes('pdf')) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload a PDF file.' },
        { status: 400 }
      )
    }

    // Map position to Python API format
    const pythonPosition = positionMap[position] || 'bottom_center'

    // Build format string based on style, prefix, and suffix
    const formatNumber = (pageNum: string) => {
      return `{page}` // Will be replaced by Python API with actual page number
    }

    // Create format string with prefix and suffix
    const formatString = `${prefix}{page}${suffix}`

    // Create new FormData for Python API
    const pythonFormData = new FormData()
    pythonFormData.append('file', file)
    pythonFormData.append('position', pythonPosition)
    pythonFormData.append('font_size', fontSize)
    pythonFormData.append('margin', '30')
    pythonFormData.append('start_page', startNumber)
    pythonFormData.append('format_string', formatString)
    pythonFormData.append('font_color_r', '0')
    pythonFormData.append('font_color_g', '0')
    pythonFormData.append('font_color_b', '0')

    console.log('Calling Python API with:', {
      position: pythonPosition,
      font_size: fontSize,
      start_page: startNumber,
      format_string: formatString,
      file_size: file.size,
      file_name: file.name,
    })

    // Call Python API
    const response = await fetch(`${PYTHON_API_URL}/add-page-numbers`, {
      method: 'POST',
      body: pythonFormData,
    })

    console.log('Python API response status:', response.status)
    console.log('Python API response headers:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Python API error:', errorText)
      let errorDetail = 'Failed to add page numbers'
      try {
        const errorJson = JSON.parse(errorText)
        errorDetail = errorJson.error || errorJson.detail || errorDetail
      } catch (e) {
        errorDetail = errorText || errorDetail
      }
      return NextResponse.json(
        { error: errorDetail },
        { status: response.status }
      )
    }

    // Get the PDF bytes from Python API
    const pdfBlob = await response.blob()
    const pdfBytes = await pdfBlob.arrayBuffer()

    console.log('PDF bytes length:', pdfBytes.byteLength)

    if (pdfBytes.byteLength === 0) {
      return NextResponse.json(
        { error: 'Received empty PDF from Python API' },
        { status: 500 }
      )
    }

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${file.name.replace(/\.pdf$/i, '_numbered.pdf')}"`,
      },
    })
  } catch (error) {
    console.error('Error calling Python API:', error)
    return NextResponse.json(
      { error: 'Failed to add page numbers', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
export const maxDuration = 60
