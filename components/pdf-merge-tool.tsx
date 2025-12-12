"use client"

import React, { useRef } from 'react'
import {useTranslations} from 'next-intl'
import {PDFDocument} from "pdf-lib"
import {Combine, Download, GripVertical, Upload, X} from "lucide-react"
import {EmailShareButton} from "@/components/email-share-button"
import {FilenameDialog} from "@/components/filename-dialog"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {FileUploadZone} from "@/components/file-upload-zone"
import {FileList} from "@/components/file-list"
import {useAppDispatch, useAppSelector} from "@/lib/hooks"
import {addFiles, clearFiles, setProcessing} from "@/lib/features/pdf-slice"
import * as pdfjs from "pdfjs-dist"

interface PDFFileWithPreview {
  id: string
  name: string
  file: File
  pages: number
  previewUrl: string | null
  isLoading: boolean
}

export function PDFMergeTool() {
  const t = useTranslations()
  const dispatch = useAppDispatch()
  const { files, processing } = useAppSelector((state) => state.pdf)
  const [mergedBlob, setMergedBlob] = React.useState<Blob | null>(null)
  const [filesWithPreviews, setFilesWithPreviews] = React.useState<PDFFileWithPreview[]>([])
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null)
  const [showFilenameDialog, setShowFilenameDialog] = React.useState(false)
  const [pendingFilename, setPendingFilename] = React.useState("")
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

    // Generate previews for the new files and append to existing
    await generatePreviewsAndAppend(newFiles)
  }

  const generatePreviewsAndAppend = async (fileList: any[]) => {
    const pdfjsLib = await import("pdfjs-dist")
    pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`

    // Create placeholder entries for new files
    const newPreviews: PDFFileWithPreview[] = fileList.map(f => ({
      ...f,
      previewUrl: null,
      isLoading: true,
    }))

    // Append to existing files
    setFilesWithPreviews(prev => [...prev, ...newPreviews])

    // Generate preview for each new PDF (first page)
    for (let i = 0; i < fileList.length; i++) {
      try {
        const arrayBuffer = await fileList[i].file.arrayBuffer()
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
        const page = await pdf.getPage(1)
        const viewport = page.getViewport({ scale: 0.5 })

        const canvas = document.createElement("canvas")
        const context = canvas.getContext("2d")
        canvas.width = viewport.width
        canvas.height = viewport.height

        if (context) {
          await page.render({
            canvasContext: context,
            viewport: viewport,
          }).promise

          const imageUrl = canvas.toDataURL("image/jpeg", 0.85)

          // Update the specific file in the array
          setFilesWithPreviews(prev => {
            const updated = [...prev]
            // Find the index of this new file (it should be at the end)
            const targetIndex = prev.length - fileList.length + i
            if (updated[targetIndex]) {
              updated[targetIndex] = {
                ...updated[targetIndex],
                previewUrl: imageUrl,
                isLoading: false,
              }
            }
            return updated
          })
        }
      } catch (err) {
        console.error(`Error generating preview for ${fileList[i].name}:`, err)
        setFilesWithPreviews(prev => {
          const updated = [...prev]
          const targetIndex = prev.length - fileList.length + i
          if (updated[targetIndex]) {
            updated[targetIndex] = {
              ...updated[targetIndex],
              isLoading: false,
            }
          }
          return updated
        })
      }
    }
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (event: React.DragEvent, index: number) => {
    event.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newFiles = [...filesWithPreviews]
    const draggedFile = newFiles[draggedIndex]
    newFiles.splice(draggedIndex, 1)
    newFiles.splice(index, 0, draggedFile)

    setFilesWithPreviews(newFiles)
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const removeFile = (index: number) => {
    setFilesWithPreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleMerge = async () => {
    if (filesWithPreviews.length < 2) return

    dispatch(setProcessing(true))

    try {
      const formData = new FormData()
      filesWithPreviews.forEach((file, index) => {
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
      setMergedBlob(blob)
    } catch (error) {
      console.error("Error merging PDFs:", error)
      alert("Failed to merge PDFs. Please try again.")
    } finally {
      dispatch(setProcessing(false))
    }
  }

  const generateMergedBlob = async (): Promise<Blob | null> => {
    return mergedBlob
  }

  const getDefaultFilename = () => {
    return "merged-document.pdf"
  }

  const handleFilenameConfirm = async (filename: string, action: 'download' | 'email') => {
    if (!mergedBlob) return

    setPendingFilename(filename)

    if (action === 'download') {
      const url = URL.createObjectURL(mergedBlob)
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

  const handleReset = () => {
    setMergedBlob(null)
    setFilesWithPreviews([])
    dispatch(clearFiles())
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
        {filesWithPreviews.length === 0 ? (
          <FileUploadZone onFilesSelected={handleFilesSelected} accept=".pdf" multiple={true} type="pdf" />
        ) : mergedBlob ? (
          <div className="flex flex-col gap-4">
            <div className="text-center space-y-2 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <p className="text-green-700 dark:text-green-400 font-medium">
                ✓ {filesWithPreviews.length} PDFs merged successfully!
              </p>
            </div>

            <Button
              onClick={() => setShowFilenameDialog(true)}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              size="lg"
            >
              <Download className="mr-2 h-4 w-4" />
              Save Merged PDF
            </Button>

            <Button onClick={handleReset} variant="outline" size="lg">
              Start Over
            </Button>
          </div>
        ) : (
          <>
            {filesWithPreviews.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {filesWithPreviews.length} PDF{filesWithPreviews.length !== 1 ? 's' : ''} ready to merge
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Drag and drop to reorder PDFs before merging
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('add-more-pdfs')?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Add More PDFs
                  </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filesWithPreviews.map((file, index) => (
                    <div
                      key={file.id}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                      className={`relative group cursor-move border-2 rounded-lg overflow-hidden transition-all ${
                        draggedIndex === index
                          ? 'border-primary scale-105 shadow-lg'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium z-10">
                        {index + 1}
                      </div>

                      <button
                        onClick={() => removeFile(index)}
                        className="absolute top-2 right-2 p-1 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors z-10"
                        title="Remove PDF"
                      >
                        <X className="h-4 w-4" />
                      </button>

                      {file.isLoading ? (
                        <div className="w-full aspect-[8.5/11] bg-muted flex items-center justify-center">
                          <div className="text-sm text-muted-foreground">Loading...</div>
                        </div>
                      ) : file.previewUrl ? (
                        <img
                          src={file.previewUrl}
                          alt={file.name}
                          className="w-full h-auto"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full aspect-[8.5/11] bg-muted flex items-center justify-center">
                          <div className="text-sm text-muted-foreground">No preview</div>
                        </div>
                      )}

                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2">
                        <p className="text-xs truncate font-medium">{file.name}</p>
                        <p className="text-xs text-gray-300">{file.pages} page{file.pages !== 1 ? 's' : ''}</p>
                      </div>

                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <GripVertical className="h-6 w-6 text-white drop-shadow-lg" />
                      </div>
                    </div>
                  ))}
                </div>

                <input
                  id="add-more-pdfs"
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={(e) => {
                    if (e.target.files) {
                      handleFilesSelected(e.target.files)
                      e.target.value = '' // Reset input to allow same file selection
                    }
                  }}
                  className="hidden"
                />
              </div>
            )}

            {filesWithPreviews.length === 0 && (
              <FileUploadZone onFilesSelected={handleFilesSelected} accept=".pdf" multiple={true} type="pdf" />
            )}

            {filesWithPreviews.length >= 2 && (
              <Button onClick={handleMerge} disabled={processing} className="w-full" size="lg">
                {processing ? (
                  t('common.processing')
                ) : (
                  <>
                    <Combine className="mr-2 h-4 w-4" />
                    Merge {filesWithPreviews.length} PDFs
                  </>
                )}
              </Button>
            )}

            {filesWithPreviews.length === 1 && (
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Add at least one more PDF to merge
                </p>
              </div>
            )}
          </>
        )}

        {/* Hidden Email Share Button */}
        <div className="hidden">
          <EmailShareButton
            ref={emailShareButtonRef}
            onGenerateBlob={generateMergedBlob}
            fileName={pendingFilename || getDefaultFilename()}
            shareMessage={`I've merged ${filesWithPreviews.length} PDF documents into one using Mon PDF.`}
          />
        </div>

        {/* Filename Dialog */}
        <FilenameDialog
          open={showFilenameDialog}
          onOpenChange={setShowFilenameDialog}
          defaultFilename={getDefaultFilename()}
          onConfirm={handleFilenameConfirm}
          title="Save Merged PDF"
          description="Choose a filename for your merged PDF"
        />
      </CardContent>
    </Card>
  )
}
