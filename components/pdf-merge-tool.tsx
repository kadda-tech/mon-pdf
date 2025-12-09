"use client"

import { useTranslations } from 'next-intl'
import { PDFDocument } from "pdf-lib"
import { Combine, Download } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileUploadZone } from "@/components/file-upload-zone"
import { FileList } from "@/components/file-list"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { addFiles, removeFile, setProcessing, clearFiles } from "@/lib/features/pdf-slice"

export function PDFMergeTool() {
  const t = useTranslations()
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
      const formData = new FormData()
      files.forEach((file, index) => {
        formData.append(`file${index}`, file.file)
      })

      const response = await fetch('/api/merge-pdf', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to merge PDFs')
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "merged-document.pdf"
      a.click()
      URL.revokeObjectURL(url)

      dispatch(clearFiles())
    } catch (error) {
      console.error("Error merging PDFs:", error)
      alert("Failed to merge PDFs. Please try again.")
    } finally {
      dispatch(setProcessing(false))
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Combine className="h-6 w-6" />
          {t('tools.merge.heading')}
        </CardTitle>
        <CardDescription>{t('tools.merge.intro')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {files.length === 0 ? (
          <FileUploadZone onFilesSelected={handleFilesSelected} accept=".pdf" multiple={true} type="pdf" />
        ) : (
          <>
            <FileUploadZone onFilesSelected={handleFilesSelected} accept=".pdf" multiple={true} type="pdf" />

            {files.length >= 2 && (
              <Button onClick={handleMerge} disabled={processing} className="w-full" size="lg">
                {processing ? (
                  t('common.processing')
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Merge {files.length} PDFs
                  </>
                )}
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
