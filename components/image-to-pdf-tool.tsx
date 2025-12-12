"use client"

import { useState, useRef } from "react"
import { useTranslations } from 'next-intl'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileUploadZone } from "@/components/file-upload-zone"
import { FileList } from "@/components/file-list"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { addFiles, removeFile, setProcessing, clearFiles } from "@/lib/features/pdf-slice"
import { FileImage, Download } from "lucide-react"
import { EmailShareButton } from "@/components/email-share-button"
import { FilenameDialog } from "@/components/filename-dialog"

export function ImageToPDFTool() {
  const t = useTranslations()
  const dispatch = useAppDispatch()
  const { files, processing } = useAppSelector((state) => state.pdf)
  const [convertedBlob, setConvertedBlob] = useState<Blob | null>(null)
  const [showFilenameDialog, setShowFilenameDialog] = useState(false)
  const [pendingFilename, setPendingFilename] = useState("")
  const emailShareButtonRef = useRef<HTMLButtonElement>(null)

  const handleFilesSelected = async (fileList: FileList) => {
    const newFiles = Array.from(fileList).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      file,
      preview: URL.createObjectURL(file),
    }))
    dispatch(addFiles(newFiles))
  }

  const generateBlob = async (): Promise<Blob | null> => {
    return convertedBlob
  }

  const getDefaultFilename = () => {
    return "images-to-pdf.pdf"
  }

  const handleConvert = async () => {
    if (files.length === 0) return

    dispatch(setProcessing(true))

    try {
      const formData = new FormData()
      files.forEach((file, index) => {
        formData.append(`image${index}`, file.file)
      })

      const response = await fetch('/api/image-to-pdf', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to convert images to PDF')
      }

      const blob = await response.blob()
      setConvertedBlob(blob)

      // Show filename dialog instead of auto-downloading
      setShowFilenameDialog(true)
    } catch (error) {
      console.error("Error converting images to PDF:", error)
      alert("Failed to convert images to PDF. Please try again.")
    } finally {
      dispatch(setProcessing(false))
    }
  }

  const handleFilenameConfirm = async (filename: string, action: 'download' | 'email') => {
    if (!convertedBlob) return

    setPendingFilename(filename)

    if (action === 'download') {
      const url = URL.createObjectURL(convertedBlob)
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

        {/* Hidden Email Share Button */}
        <div className="hidden">
          <EmailShareButton
            ref={emailShareButtonRef}
            onGenerateBlob={generateBlob}
            fileName={pendingFilename || getDefaultFilename()}
            shareMessage={`I've converted ${files.length} image${files.length !== 1 ? 's' : ''} to PDF using Mon PDF.`}
          />
        </div>

        {/* Filename Dialog */}
        <FilenameDialog
          open={showFilenameDialog}
          onOpenChange={setShowFilenameDialog}
          defaultFilename={getDefaultFilename()}
          onConfirm={handleFilenameConfirm}
          title="Save PDF"
          description="Choose a filename for your converted PDF"
        />
      </CardContent>
    </Card>
  )
}
