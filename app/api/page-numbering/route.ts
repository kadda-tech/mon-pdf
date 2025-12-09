import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

type Position = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right' | 'center-left' | 'center-right' | 'center'
type NumberingStyle = 'numeric' | 'roman-lower' | 'roman-upper' | 'alpha-lower' | 'alpha-upper'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const position = (formData.get('position') as Position) || 'bottom-center'
    const style = (formData.get('style') as NumberingStyle) || 'numeric'
    const startNumber = parseInt((formData.get('startNumber') as string) || '1')
    const fontSize = parseInt((formData.get('fontSize') as string) || '12')
    const prefix = (formData.get('prefix') as string) || ''
    const suffix = (formData.get('suffix') as string) || ''

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    const arrayBuffer = await file.arrayBuffer()
    const pdfDoc = await PDFDocument.load(arrayBuffer)
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const pages = pdfDoc.getPages()

    // Helper function to convert number to different styles
    const formatNumber = (num: number, style: NumberingStyle): string => {
      switch (style) {
        case 'roman-lower':
          return toRoman(num).toLowerCase()
        case 'roman-upper':
          return toRoman(num)
        case 'alpha-lower':
          return toAlpha(num).toLowerCase()
        case 'alpha-upper':
          return toAlpha(num)
        default:
          return num.toString()
      }
    }

    // Helper to convert number to Roman numerals
    const toRoman = (num: number): string => {
      const romanNumerals: [number, string][] = [
        [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
        [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
        [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
      ]
      let result = ''
      for (const [value, numeral] of romanNumerals) {
        while (num >= value) {
          result += numeral
          num -= value
        }
      }
      return result
    }

    // Helper to convert number to alphabetic
    const toAlpha = (num: number): string => {
      let result = ''
      while (num > 0) {
        num--
        result = String.fromCharCode(65 + (num % 26)) + result
        num = Math.floor(num / 26)
      }
      return result
    }

    // Add page numbers
    pages.forEach((page, index) => {
      const { width, height } = page.getSize()
      const pageNumber = startNumber + index
      const pageText = `${prefix}${formatNumber(pageNumber, style)}${suffix}`
      const textWidth = font.widthOfTextAtSize(pageText, fontSize)
      const textHeight = font.heightAtSize(fontSize)

      // Calculate position
      let x = 0
      let y = 0
      const margin = 20

      switch (position) {
        case 'top-left':
          x = margin
          y = height - margin - textHeight
          break
        case 'top-center':
          x = (width - textWidth) / 2
          y = height - margin - textHeight
          break
        case 'top-right':
          x = width - margin - textWidth
          y = height - margin - textHeight
          break
        case 'bottom-left':
          x = margin
          y = margin
          break
        case 'bottom-center':
          x = (width - textWidth) / 2
          y = margin
          break
        case 'bottom-right':
          x = width - margin - textWidth
          y = margin
          break
        case 'center-left':
          x = margin
          y = (height - textHeight) / 2
          break
        case 'center-right':
          x = width - margin - textWidth
          y = (height - textHeight) / 2
          break
        case 'center':
          x = (width - textWidth) / 2
          y = (height - textHeight) / 2
          break
      }

      page.drawText(pageText, {
        x,
        y,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      })
    })

    const pdfBytes = await pdfDoc.save()

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${file.name.replace(/\.pdf$/i, '_numbered.pdf')}"`,
        'X-Total-Pages': pages.length.toString(),
      },
    })
  } catch (error) {
    console.error('Error adding page numbers:', error)
    return NextResponse.json(
      { error: 'Failed to add page numbers', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
export const maxDuration = 60
