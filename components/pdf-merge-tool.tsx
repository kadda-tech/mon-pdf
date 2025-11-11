"use client"

import { PDFDocument } from "pdf-lib"
import { Button } from "@/components/ui/button"
import { FileUploadZone } from "@/components/file-upload-zone"
import { FileList } from "@/components/file-list"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { addFiles, removeFile, setProcessing, clearFiles } from "@/lib/features/pdf-slice"
import { Combine, Download } from "lucide-react"
import { Card } from "@/components/ui/card"

export function PDFMergeTool() {
  const dispatch = useAppDispatch()
  const { files, processing } = useAppSelector((state) => state.pdf)

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

  const handleMerge = async () => {
    if (files.length < 2) return

    dispatch(setProcessing(true))

    try {
      const mergedPdf = await PDFDocument.create()

      for (const file of files) {
        const arrayBuffer = await file.file.arrayBuffer()
        const pdfDoc = await PDFDocument.load(arrayBuffer)
        const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices())
        copiedPages.forEach((page) => mergedPdf.addPage(page))
      }

      const pdfBytes = await mergedPdf.save()
      const blob = new Blob([pdfBytes], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "merged-document.pdf"
      a.click()
      URL.revokeObjectURL(url)

      dispatch(clearFiles())
    } catch (error) {
      console.error("Error merging PDFs:", error)
    } finally {
      dispatch(setProcessing(false))
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-accent/50 border-2">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-background">
            <Combine className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Merge PDFs</h2>
            <p className="text-sm text-muted-foreground">
              Combine multiple PDF files into one document. Files will be merged in the order they appear.
            </p>
          </div>
        </div>
      </Card>

      <FileUploadZone onFilesSelected={handleFilesSelected} accept=".pdf" multiple={true} type="pdf" />

      <FileList
        files={files}
        selectedFiles={[]}
        onRemove={(id) => dispatch(removeFile(id))}
        onToggleSelect={() => {}}
        selectable={false}
      />

      {files.length >= 2 && (
        <Button onClick={handleMerge} disabled={processing} className="w-full" size="lg">
          {processing ? (
            "Processing..."
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Merge {files.length} PDFs
            </>
          )}
        </Button>
      )}
    </div>
  )
}
