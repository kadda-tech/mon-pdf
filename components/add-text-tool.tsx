"use client"

import { useState, useRef } from "react"
import { PDFDocument, rgb, StandardFonts, degrees } from "pdf-lib"
import { Button } from "@/components/ui/button"
import { FileUploadZone } from "@/components/file-upload-zone"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { addFiles, setProcessing } from "@/lib/features/pdf-slice"
import { Type, Download } from "lucide-react"
import { Card } from "@/components/ui/card"
import { PDFCanvasEditor, type TextElement } from "@/components/pdf-canvas-editor"
import { EmailShareButton } from "@/components/email-share-button"
import { FilenameDialog } from "@/components/filename-dialog"

export function AddTextTool() {
  const dispatch = useAppDispatch()
  const { files, processing } = useAppSelector((state) => state.pdf)
  const [textElements, setTextElements] = useState<TextElement[]>([])
  const [modifiedBlob, setModifiedBlob] = useState<Blob | null>(null)
  const [showFilenameDialog, setShowFilenameDialog] = useState(false)
  const [pendingFilename, setPendingFilename] = useState("")
  const emailShareButtonRef = useRef<HTMLButtonElement>(null)

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
      setModifiedBlob(blob)
    } catch (error) {
      console.error("Error adding text to PDF:", error)
    } finally {
      dispatch(setProcessing(false))
    }
  }

  const generateBlob = async (): Promise<Blob | null> => {
    return modifiedBlob
  }

  const getDefaultFilename = () => {
    if (!files[0]) return "text-added.pdf"
    return `text-added-${files[0].name}`
  }

  const handleFilenameConfirm = async (filename: string, action: 'download' | 'email') => {
    if (!modifiedBlob) return

    setPendingFilename(filename)

    if (action === 'download') {
      const url = URL.createObjectURL(modifiedBlob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
    } else {
      // Trigger email share button click
      emailShareButtonRef.current?.click()
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

          {!modifiedBlob ? (
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
                  <Type className="mr-2 h-4 w-4" />
                  Add Text to PDF ({textElements.length} element{textElements.length !== 1 ? "s" : ""})
                </>
              )}
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <p className="text-green-700 dark:text-green-400 font-medium">
                  ✓ Text added successfully!
                </p>
              </div>

              <Button
                onClick={() => setShowFilenameDialog(true)}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                size="lg"
              >
                <Download className="mr-2 h-4 w-4" />
                Save PDF
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* Hidden Email Share Button */}
      <div className="hidden">
        <EmailShareButton
          ref={emailShareButtonRef}
          onGenerateBlob={generateBlob}
          fileName={pendingFilename || getDefaultFilename()}
          shareMessage="I've added text to a PDF using Mon PDF."
        />
      </div>

      {/* Filename Dialog */}
      <FilenameDialog
        open={showFilenameDialog}
        onOpenChange={setShowFilenameDialog}
        defaultFilename={getDefaultFilename()}
        onConfirm={handleFilenameConfirm}
        title="Save PDF with Text"
        description="Choose a filename for your PDF"
      />
    </div>
  )
}
