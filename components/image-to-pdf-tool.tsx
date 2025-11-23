"use client"

import { PDFDocument } from "pdf-lib"
import { useTranslations } from 'next-intl'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileUploadZone } from "@/components/file-upload-zone"
import { FileList } from "@/components/file-list"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { addFiles, removeFile, setProcessing, clearFiles } from "@/lib/features/pdf-slice"
import { FileImage, Download } from "lucide-react"

export function ImageToPDFTool() {
  const t = useTranslations()
  const dispatch = useAppDispatch()
  const { files, processing } = useAppSelector((state) => state.pdf)

  const handleFilesSelected = async (fileList: FileList) => {
    const newFiles = Array.from(fileList).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      file,
      preview: URL.createObjectURL(file),
    }))
    dispatch(addFiles(newFiles))
  }

  const handleConvert = async () => {
    if (files.length === 0) return

    dispatch(setProcessing(true))

    try {
      const pdfDoc = await PDFDocument.create()

      for (const file of files) {
        const arrayBuffer = await file.file.arrayBuffer()
        let image

        if (file.file.type === "image/png") {
          image = await pdfDoc.embedPng(arrayBuffer)
        } else if (file.file.type === "image/jpeg" || file.file.type === "image/jpg") {
          image = await pdfDoc.embedJpg(arrayBuffer)
        } else {
          continue
        }

        const page = pdfDoc.addPage()
        const { width, height } = image.scale(1)

        // Scale image to fit page
        const pageWidth = page.getWidth()
        const pageHeight = page.getHeight()
        const scale = Math.min(pageWidth / width, pageHeight / height)

        const scaledWidth = width * scale
        const scaledHeight = height * scale

        page.drawImage(image, {
          x: (pageWidth - scaledWidth) / 2,
          y: (pageHeight - scaledHeight) / 2,
          width: scaledWidth,
          height: scaledHeight,
        })
      }

      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "images-to-pdf.pdf"
      a.click()
      URL.revokeObjectURL(url)

      dispatch(clearFiles())
    } catch (error) {
      console.error("Error converting images to PDF:", error)
    } finally {
      dispatch(setProcessing(false))
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileImage className="h-6 w-6" />
          {t('tools.imageToPdf.heading')}
        </CardTitle>
        <CardDescription>{t('tools.imageToPdf.intro')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FileUploadZone onFilesSelected={handleFilesSelected} accept=".png,.jpg,.jpeg" multiple={true} type="image" />

        <FileList
          files={files}
          selectedFiles={[]}
          onRemove={(id) => dispatch(removeFile(id))}
          onToggleSelect={() => {}}
          selectable={false}
        />

        {files.length > 0 && (
          <Button onClick={handleConvert} disabled={processing} className="w-full" size="lg">
            {processing ? (
              t('tools.imageToPdf.converting')
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                {t('tools.imageToPdf.convertAll')}
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
