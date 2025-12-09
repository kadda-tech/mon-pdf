/**
 * PDF API Client
 * Utility functions for calling the PDF processing API routes
 */

export type QualityLevel = 'high' | 'medium' | 'low'
export type ImageFormat = 'png' | 'jpeg' | 'webp'
export type NumberingPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right' | 'center-left' | 'center-right' | 'center'
export type NumberingStyle = 'numeric' | 'roman-lower' | 'roman-upper' | 'alpha-lower' | 'alpha-upper'

export interface CompressOptions {
  file: File
  quality?: QualityLevel
  onProgress?: (progress: number) => void
}

export interface MergeOptions {
  files: File[]
  onProgress?: (progress: number) => void
}

export interface SplitOptions {
  file: File
  pages?: string // e.g., "1,3,5-7"
  mode?: 'pages' | 'ranges'
  onProgress?: (progress: number) => void
}

export interface ImageToPdfOptions {
  images: File[]
  onProgress?: (progress: number) => void
}

export interface PdfToImagesOptions {
  file: File
  format?: ImageFormat
  quality?: number
  scale?: number
  pageNumber?: number
  onProgress?: (progress: number) => void
}

export interface PdfToWordOptions {
  file: File
  onProgress?: (progress: number) => void
}

export interface PageNumberingOptions {
  file: File
  position?: NumberingPosition
  style?: NumberingStyle
  startNumber?: number
  fontSize?: number
  prefix?: string
  suffix?: string
  onProgress?: (progress: number) => void
}

export interface OrganizePdfOptions {
  file: File
  pageOrder: number[] // 1-based page indices
  onProgress?: (progress: number) => void
}

export interface OcrOptions {
  file: File
  language?: string
  outputFormat?: 'text' | 'hocr' | 'pdf'
  onProgress?: (progress: number) => void
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  blob?: Blob
  headers?: Record<string, string>
}

/**
 * Compress a PDF file
 */
export async function compressPdf(options: CompressOptions): Promise<ApiResponse> {
  const formData = new FormData()
  formData.append('file', options.file)
  formData.append('quality', options.quality || 'medium')

  try {
    const response = await fetch('/api/compress-pdf', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.error || 'Failed to compress PDF' }
    }

    const blob = await response.blob()
    const headers: Record<string, string> = {}
    response.headers.forEach((value, key) => {
      headers[key] = value
    })

    return {
      success: true,
      blob,
      headers,
      data: {
        originalSize: parseInt(headers['x-original-size'] || '0'),
        compressedSize: parseInt(headers['x-compressed-size'] || '0'),
        compressionRatio: parseInt(headers['x-compression-ratio'] || '0'),
      },
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Merge multiple PDF files
 */
export async function mergePdfs(options: MergeOptions): Promise<ApiResponse> {
  const formData = new FormData()
  options.files.forEach((file, index) => {
    formData.append(`file${index}`, file)
  })

  try {
    const response = await fetch('/api/merge-pdf', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.error || 'Failed to merge PDFs' }
    }

    const blob = await response.blob()
    const headers: Record<string, string> = {}
    response.headers.forEach((value, key) => {
      headers[key] = value
    })

    return {
      success: true,
      blob,
      headers,
      data: {
        totalFiles: parseInt(headers['x-total-files'] || '0'),
        totalPages: parseInt(headers['x-total-pages'] || '0'),
      },
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Split a PDF file
 */
export async function splitPdf(options: SplitOptions): Promise<ApiResponse> {
  const formData = new FormData()
  formData.append('file', options.file)
  if (options.pages) formData.append('pages', options.pages)
  if (options.mode) formData.append('mode', options.mode)

  try {
    const response = await fetch('/api/split-pdf', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.error || 'Failed to split PDF' }
    }

    const blob = await response.blob()
    const headers: Record<string, string> = {}
    response.headers.forEach((value, key) => {
      headers[key] = value
    })

    return {
      success: true,
      blob,
      headers,
      data: {
        totalPages: parseInt(headers['x-total-pages'] || '0'),
        selectedPages: parseInt(headers['x-selected-pages'] || '0'),
      },
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Convert images to PDF
 */
export async function imagesToPdf(options: ImageToPdfOptions): Promise<ApiResponse> {
  const formData = new FormData()
  options.images.forEach((image, index) => {
    formData.append(`image${index}`, image)
  })

  try {
    const response = await fetch('/api/image-to-pdf', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.error || 'Failed to convert images to PDF' }
    }

    const blob = await response.blob()
    const headers: Record<string, string> = {}
    response.headers.forEach((value, key) => {
      headers[key] = value
    })

    return {
      success: true,
      blob,
      headers,
      data: {
        totalImages: parseInt(headers['x-total-images'] || '0'),
        totalPages: parseInt(headers['x-total-pages'] || '0'),
      },
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Convert PDF to images
 */
export async function pdfToImages(options: PdfToImagesOptions): Promise<ApiResponse> {
  const formData = new FormData()
  formData.append('file', options.file)
  if (options.format) formData.append('format', options.format)
  if (options.quality) formData.append('quality', options.quality.toString())
  if (options.scale) formData.append('scale', options.scale.toString())
  if (options.pageNumber) formData.append('pageNumber', options.pageNumber.toString())

  try {
    const response = await fetch('/api/pdf-to-images', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.error || 'Failed to convert PDF to images' }
    }

    const contentType = response.headers.get('content-type')

    if (contentType?.includes('application/json')) {
      const data = await response.json()
      return { success: true, data }
    } else {
      const blob = await response.blob()
      return { success: true, blob }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Convert PDF to Word
 */
export async function pdfToWord(options: PdfToWordOptions): Promise<ApiResponse> {
  const formData = new FormData()
  formData.append('file', options.file)

  try {
    const response = await fetch('/api/pdf-to-word', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.error || 'Failed to convert PDF to Word' }
    }

    const blob = await response.blob()
    const headers: Record<string, string> = {}
    response.headers.forEach((value, key) => {
      headers[key] = value
    })

    return {
      success: true,
      blob,
      headers,
      data: {
        totalPages: parseInt(headers['x-total-pages'] || '0'),
      },
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Add page numbers to PDF
 */
export async function addPageNumbers(options: PageNumberingOptions): Promise<ApiResponse> {
  const formData = new FormData()
  formData.append('file', options.file)
  if (options.position) formData.append('position', options.position)
  if (options.style) formData.append('style', options.style)
  if (options.startNumber) formData.append('startNumber', options.startNumber.toString())
  if (options.fontSize) formData.append('fontSize', options.fontSize.toString())
  if (options.prefix) formData.append('prefix', options.prefix)
  if (options.suffix) formData.append('suffix', options.suffix)

  try {
    const response = await fetch('/api/page-numbering', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.error || 'Failed to add page numbers' }
    }

    const blob = await response.blob()
    const headers: Record<string, string> = {}
    response.headers.forEach((value, key) => {
      headers[key] = value
    })

    return {
      success: true,
      blob,
      headers,
      data: {
        totalPages: parseInt(headers['x-total-pages'] || '0'),
      },
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Organize/reorder PDF pages
 */
export async function organizePdf(options: OrganizePdfOptions): Promise<ApiResponse> {
  const formData = new FormData()
  formData.append('file', options.file)
  formData.append('pageOrder', options.pageOrder.join(','))

  try {
    const response = await fetch('/api/organize-pdf', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.error || 'Failed to organize PDF' }
    }

    const blob = await response.blob()
    const headers: Record<string, string> = {}
    response.headers.forEach((value, key) => {
      headers[key] = value
    })

    return {
      success: true,
      blob,
      headers,
      data: {
        totalPages: parseInt(headers['x-total-pages'] || '0'),
        newOrder: headers['x-new-order'],
      },
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Perform OCR on PDF
 */
export async function performOcr(options: OcrOptions): Promise<ApiResponse> {
  const formData = new FormData()
  formData.append('file', options.file)
  if (options.language) formData.append('language', options.language)
  if (options.outputFormat) formData.append('outputFormat', options.outputFormat)

  try {
    const response = await fetch('/api/ocr', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.error || 'Failed to perform OCR', data: error }
    }

    const contentType = response.headers.get('content-type')

    if (contentType?.includes('application/json')) {
      const data = await response.json()
      return { success: true, data }
    } else {
      const blob = await response.blob()
      return { success: true, blob }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Helper function to download a blob
 */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
