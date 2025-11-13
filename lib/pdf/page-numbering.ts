import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';

export type NumberPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'middle-left'
  | 'middle-center'
  | 'middle-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export type NumberStyle = 'numeric' | 'roman-lower' | 'roman-upper' | 'alpha-lower' | 'alpha-upper';

export interface PageNumberingOptions {
  position: NumberPosition;
  style: NumberStyle;
  fontSize: number;
  startPage: number;
  startNumber: number;
  prefix?: string;
  suffix?: string;
  excludePages?: number[];
  fontColor?: { r: number; g: number; b: number };
  marginX?: number;
  marginY?: number;
}

/**
 * Convert number to Roman numerals
 */
function toRoman(num: number, uppercase: boolean = false): string {
  const romanNumerals = [
    ['M', 1000], ['CM', 900], ['D', 500], ['CD', 400],
    ['C', 100], ['XC', 90], ['L', 50], ['XL', 40],
    ['X', 10], ['IX', 9], ['V', 5], ['IV', 4], ['I', 1]
  ] as const;

  let result = '';
  let remaining = num;

  for (const [roman, value] of romanNumerals) {
    while (remaining >= value) {
      result += roman;
      remaining -= value;
    }
  }

  return uppercase ? result : result.toLowerCase();
}

/**
 * Convert number to alphabetical
 */
function toAlpha(num: number, uppercase: boolean = false): string {
  let result = '';
  let n = num;

  while (n > 0) {
    n--;
    const charCode = uppercase ? 65 : 97; // A or a
    result = String.fromCharCode(charCode + (n % 26)) + result;
    n = Math.floor(n / 26);
  }

  return result || (uppercase ? 'A' : 'a');
}

/**
 * Format page number based on style
 */
function formatPageNumber(pageNum: number, style: NumberStyle): string {
  switch (style) {
    case 'numeric':
      return pageNum.toString();
    case 'roman-lower':
      return toRoman(pageNum, false);
    case 'roman-upper':
      return toRoman(pageNum, true);
    case 'alpha-lower':
      return toAlpha(pageNum, false);
    case 'alpha-upper':
      return toAlpha(pageNum, true);
    default:
      return pageNum.toString();
  }
}

/**
 * Calculate position coordinates for page number
 */
function calculatePosition(
  position: NumberPosition,
  pageWidth: number,
  pageHeight: number,
  textWidth: number,
  textHeight: number,
  marginX: number,
  marginY: number
): { x: number; y: number } {
  const positions = {
    'top-left': { x: marginX, y: pageHeight - marginY - textHeight },
    'top-center': { x: (pageWidth - textWidth) / 2, y: pageHeight - marginY - textHeight },
    'top-right': { x: pageWidth - marginX - textWidth, y: pageHeight - marginY - textHeight },
    'middle-left': { x: marginX, y: (pageHeight - textHeight) / 2 },
    'middle-center': { x: (pageWidth - textWidth) / 2, y: (pageHeight - textHeight) / 2 },
    'middle-right': { x: pageWidth - marginX - textWidth, y: (pageHeight - textHeight) / 2 },
    'bottom-left': { x: marginX, y: marginY },
    'bottom-center': { x: (pageWidth - textWidth) / 2, y: marginY },
    'bottom-right': { x: pageWidth - marginX - textWidth, y: marginY },
  };

  return positions[position];
}

/**
 * Add page numbers to PDF
 */
export async function addPageNumbers(
  pdfFile: File,
  options: PageNumberingOptions,
  onProgress?: (current: number, total: number) => void
): Promise<Uint8Array> {
  // Load the PDF
  const arrayBuffer = await pdfFile.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);

  // Embed font
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const pages = pdfDoc.getPages();
  const totalPages = pages.length;

  // Set defaults
  const marginX = options.marginX ?? 40;
  const marginY = options.marginY ?? 40;
  const color = options.fontColor ?? { r: 0, g: 0, b: 0 };

  // Pre-calculate maximum text width for consistent positioning
  let maxTextWidth = 0;
  for (let i = 0; i < totalPages; i++) {
    const pageIndex = i + 1;
    if (pageIndex < options.startPage) continue;
    if (options.excludePages?.includes(pageIndex)) continue;

    const numberingIndex = pageIndex - options.startPage + options.startNumber;
    const formattedNumber = formatPageNumber(numberingIndex, options.style);
    const pageNumberText = `${options.prefix || ''}${formattedNumber}${options.suffix || ''}`;
    const textWidth = font.widthOfTextAtSize(pageNumberText, options.fontSize);
    maxTextWidth = Math.max(maxTextWidth, textWidth);
  }

  // Process each page
  for (let i = 0; i < totalPages; i++) {
    const pageIndex = i + 1;

    // Skip if before start page
    if (pageIndex < options.startPage) {
      onProgress?.(i + 1, totalPages);
      continue;
    }

    // Skip if in exclude list
    if (options.excludePages?.includes(pageIndex)) {
      onProgress?.(i + 1, totalPages);
      continue;
    }

    const page = pages[i];

    // Calculate page number
    const numberingIndex = pageIndex - options.startPage + options.startNumber;
    const formattedNumber = formatPageNumber(numberingIndex, options.style);
    const pageNumberText = `${options.prefix || ''}${formattedNumber}${options.suffix || ''}`;

    // Measure text for this specific page
    const textWidth = font.widthOfTextAtSize(pageNumberText, options.fontSize);
    const textHeight = options.fontSize;

    // Check page rotation first
    const rotation = page.getRotation().angle;
    const mediaBox = page.getMediaBox();
    const originalWidth = mediaBox.width;
    const originalHeight = mediaBox.height;

    // Calculate VISUAL dimensions (what the user sees after rotation)
    let visualWidth = originalWidth;
    let visualHeight = originalHeight;

    if (rotation === 90 || rotation === -90 || rotation === 270 || rotation === -270) {
      // For 90° or 270° rotations, width and height are swapped
      visualWidth = originalHeight;
      visualHeight = originalWidth;
    }

    // Calculate position based on VISUAL dimensions (what user sees)
    const { x: baseX, y: baseY } = calculatePosition(
      options.position,
      visualWidth,
      visualHeight,
      maxTextWidth,
      textHeight,
      marginX,
      marginY
    );

    // For centered positions, adjust x based on actual text width
    let x = baseX;
    if (options.position.includes('center')) {
      x = baseX + (maxTextWidth - textWidth) / 2;
    } else if (options.position.includes('right')) {
      x = baseX + (maxTextWidth - textWidth);
    }

    let y = baseY;

    // Handle rotation transformation
    let finalX = x;
    let finalY = y;
    let textRotation = degrees(0);

    // Transform coordinates based on rotation to ensure numbers appear at the correct visual position
    if (rotation === 90 || rotation === -270) {
      // Page rotated 90° clockwise
      // Visual horizontal → Physical vertical (from bottom, inverted)
      // Visual vertical → Physical horizontal (direct mapping)
      finalX = originalWidth - y - textHeight;
      finalY = x;
      textRotation = degrees(90);
    } else if (rotation === 180 || rotation === -180) {
      // Page rotated 180°
      // Both coordinates are inverted
      finalX = originalWidth - x - textWidth;
      finalY = originalHeight - y - textHeight;
      textRotation = degrees(180);
    } else if (rotation === 270 || rotation === -90) {
      // Page rotated 270° clockwise (or 90° counter-clockwise)
      // Visual horizontal → Physical vertical (inverted from right)
      // Visual vertical → Physical horizontal (direct mapping)
      finalX = y;
      finalY = visualWidth - x - textWidth;
      textRotation = degrees(-90);
    }
    // else: 0° rotation, use coordinates as-is

    page.drawText(pageNumberText, {
      x: finalX,
      y: finalY,
      size: options.fontSize,
      font,
      color: rgb(color.r, color.g, color.b),
      rotate: textRotation,
    });

    onProgress?.(i + 1, totalPages);
  }

  // Save the PDF
  return await pdfDoc.save();
}
