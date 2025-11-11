"use client"

import { useState } from "react"
import { PDFDocument, rgb, StandardFonts, degrees } from "pdf-lib"
import { Button } from "@/components/ui/button"
import { FileUploadZone } from "@/components/file-upload-zone"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { addFiles, setProcessing } from "@/lib/features/pdf-slice"
import { Type, Download } from "lucide-react"
import { Card } from "@/components/ui/card"
import { PDFCanvasEditor, type TextElement } from "@/components/pdf-canvas-editor"

export function AddTextTool() {
  const dispatch = useAppDispatch()
  const { files, processing } = useAppSelector((state) => state.pdf)
  const [textElements, setTextElements] = useState<TextElement[]>([])

  const handleFilesSelected = async (fileList: FileList) => {
    const newFiles = await Promise.all(
      Array.from(fileList).map(async (file) => {
        const arrayBuffer = await file.arrayBuffer()
        const pdfDoc = await PDFDocument.load(arrayBuffer)
        const pageCount = pdfDoc.getPageCount()

        return {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          file,
          pages: pageCount,
        }
      }),
    )
    dispatch(addFiles(newFiles))
  }

  const handleAddText = async () => {
    if (files.length === 0 || textElements.length === 0) return

    dispatch(setProcessing(true))

    try {
      const file = files[0].file
      const arrayBuffer = await file.arrayBuffer()
      const pdfDoc = await PDFDocument.load(arrayBuffer)
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

      const pages = pdfDoc.getPages()

      pages.forEach((page) => {
        const pageHeight = page.getHeight()

        textElements.forEach((element) => {
          const hexToRgb = (hex: string) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
            return result
              ? {
                  r: Number.parseInt(result[1], 16) / 255,
                  g: Number.parseInt(result[2], 16) / 255,
                  b: Number.parseInt(result[3], 16) / 255,
                }
              : { r: 0, g: 0, b: 0 }
          }

          const color = hexToRgb(element.color)

          page.drawText(element.text, {
            x: element.x,
            y: pageHeight - element.y,
            size: element.fontSize,
            font: font,
            color: rgb(color.r, color.g, color.b),
            rotate: degrees(element.rotation),
          })
        })
      })

      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `text-added-${files[0].name}`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error adding text to PDF:", error)
    } finally {
      dispatch(setProcessing(false))
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-accent/50 border-2">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-background">
            <Type className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Add Text to PDF</h2>
            <p className="text-sm text-muted-foreground">
              Add custom text to your PDF with drag-and-drop positioning. Style and place text exactly where you want
              it.
            </p>
          </div>
        </div>
      </Card>

      <FileUploadZone onFilesSelected={handleFilesSelected} accept=".pdf" multiple={false} type="pdf" />

      {files.length > 0 && (
        <Card className="p-6 space-y-6">
          <div>
            <p className="text-sm font-medium mb-2">Selected: {files[0].name}</p>
          </div>

          <PDFCanvasEditor file={files[0].file} onTextElementsChange={setTextElements} />

          <Button
            onClick={handleAddText}
            disabled={processing || textElements.length === 0}
            className="w-full"
            size="lg"
          >
            {processing ? (
              "Processing..."
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download PDF with Text ({textElements.length} element{textElements.length !== 1 ? "s" : ""})
              </>
            )}
          </Button>
        </Card>
      )}
    </div>
  )
}
