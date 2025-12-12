"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslations } from 'next-intl'
import { Loader2, Download, FileCheck, Upload, Check, Mail } from "lucide-react"
import { FilenameDialog } from "@/components/filename-dialog"
import { EmailShareButton } from "@/components/email-share-button"

type QualityLevel = "high" | "medium" | "low"

interface CompressedQuality {
  size: number
  ratio: number
  blob: string // base64
}

export function PDFCompressTool() {
  const t = useTranslations()
  const [file, setFile] = useState<File | null>(null)
  const [compressing, setCompressing] = useState(false)
  const [compressedData, setCompressedData] = useState<{
    originalSize: number
    qualities: {
      high: CompressedQuality
      medium: CompressedQuality
      low: CompressedQuality
    }
  } | null>(null)
  const [selectedQuality, setSelectedQuality] = useState<QualityLevel | null>(null)
  const [showFilenameDialog, setShowFilenameDialog] = useState(false)
  const [pendingFilename, setPendingFilename] = useState("")
  const emailShareButtonRef = useRef<HTMLButtonElement>(null)

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  const handleCompress = async () => {
    if (!file) return

    setCompressing(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/compress-pdf-all', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to compress PDF')
      }

      const result = await response.json()

      setCompressedData({
        originalSize: result.originalSize,
        qualities: result.qualities,
      })
    } catch (error) {
      console.error("Error compressing PDF:", error)
      alert("Failed to compress PDF. Please try again.")
    } finally {
      setCompressing(false)
    }
  }

  const generateCompressedBlob = async (): Promise<Blob | null> => {
    if (!compressedData || !selectedQuality) return null

    const base64Data = compressedData.qualities[selectedQuality].blob
    const binaryData = atob(base64Data)
    const bytes = new Uint8Array(binaryData.length)
    for (let i = 0; i < binaryData.length; i++) {
      bytes[i] = binaryData.charCodeAt(i)
    }
    return new Blob([bytes], { type: 'application/pdf' })
  }

  const getDefaultFilename = () => {
    if (!file) return "compressed.pdf"
    return file.name.replace(/\.pdf$/i, `_compressed_${selectedQuality}.pdf`)
  }

  const handleFilenameConfirm = async (filename: string, action: 'download' | 'email') => {
    if (!compressedData || !selectedQuality) return

    setPendingFilename(filename)

    if (action === 'download') {
      const blob = await generateCompressedBlob()
      if (!blob) return

      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } else {
      // Trigger email share button click
      emailShareButtonRef.current?.click()
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0]
    if (uploadedFile && uploadedFile.type === "application/pdf") {
      setFile(uploadedFile)
      setCompressedData(null)
      setSelectedQuality(null)

      // Auto-compress to all qualities
      await autoCompressFile(uploadedFile)
    }
  }

  const autoCompressFile = async (file: File) => {
    setCompressing(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/compress-pdf-all', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to compress PDF')
      }

      const result = await response.json()

      setCompressedData({
        originalSize: result.originalSize,
        qualities: result.qualities,
      })
    } catch (error) {
      console.error("Error compressing PDF:", error)
      alert("Failed to compress PDF. Please try again.")
    } finally {
      setCompressing(false)
    }
  }

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const droppedFile = event.dataTransfer.files[0]
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile)
      setCompressedData(null)
      setSelectedQuality(null)

      // Auto-compress to all qualities
      await autoCompressFile(droppedFile)
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const handleReset = () => {
    setFile(null)
    setCompressedData(null)
    setSelectedQuality(null)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">{t('tools.compressPdf.heading')}</CardTitle>
        <CardDescription>{t('tools.compressPdf.intro')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!file ? (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer"
          >
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
              id="pdf-upload"
            />
            <label htmlFor="pdf-upload" className="cursor-pointer">
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">{t('tools.compressPdf.uploadFile')}</p>
              <p className="text-sm text-muted-foreground">
                {t('fileUpload.dragDrop', { type: t('fileUpload.pdf') })}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {t('fileUpload.acceptedFormats')} {t('fileUpload.pdf')}
              </p>
            </label>
          </div>
        ) : (
          <div className="space-y-6">
            {/* File Info */}
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <FileCheck className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Original Size: {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleReset}>
                {t('common.cancel')}
              </Button>
            </div>

            {/* Compressing State */}
            {compressing && (
              <div className="text-center py-8">
                <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-primary" />
                <p className="text-lg font-medium">Compressing to all quality levels...</p>
                <p className="text-sm text-muted-foreground mt-2">This may take a moment</p>
              </div>
            )}

            {/* Quality Cards */}
            {compressedData && !compressing && (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Choose Your Compression Level</h3>
                  <p className="text-sm text-muted-foreground">
                    Select the quality that best fits your needs
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* High Quality Card */}
                  <Card
                    className={`cursor-pointer transition-all ${
                      selectedQuality === 'high'
                        ? 'ring-2 ring-primary border-primary'
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedQuality('high')}
                  >
                    <CardContent className="p-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-lg">High Quality</h4>
                        {selectedQuality === 'high' && (
                          <Check className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-baseline">
                          <span className="text-sm text-muted-foreground">File Size:</span>
                          <span className="text-xl font-bold text-primary">
                            {formatFileSize(compressedData.qualities.high.size)}
                          </span>
                        </div>
                        <div className="flex justify-between items-baseline">
                          <span className="text-sm text-muted-foreground">Saved:</span>
                          <span className="text-lg font-semibold text-green-600">
                            {compressedData.qualities.high.ratio}%
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground pt-2 border-t">
                        Best quality, smaller file size reduction
                      </p>
                    </CardContent>
                  </Card>

                  {/* Medium Quality Card */}
                  <Card
                    className={`cursor-pointer transition-all ${
                      selectedQuality === 'medium'
                        ? 'ring-2 ring-primary border-primary'
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedQuality('medium')}
                  >
                    <CardContent className="p-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-lg">Medium Quality</h4>
                        {selectedQuality === 'medium' && (
                          <Check className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-baseline">
                          <span className="text-sm text-muted-foreground">File Size:</span>
                          <span className="text-xl font-bold text-primary">
                            {formatFileSize(compressedData.qualities.medium.size)}
                          </span>
                        </div>
                        <div className="flex justify-between items-baseline">
                          <span className="text-sm text-muted-foreground">Saved:</span>
                          <span className="text-lg font-semibold text-green-600">
                            {compressedData.qualities.medium.ratio}%
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground pt-2 border-t">
                        Good balance between quality and file size
                      </p>
                    </CardContent>
                  </Card>

                  {/* Low Quality Card */}
                  <Card
                    className={`cursor-pointer transition-all ${
                      selectedQuality === 'low'
                        ? 'ring-2 ring-primary border-primary'
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedQuality('low')}
                  >
                    <CardContent className="p-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-lg">Low Quality</h4>
                        {selectedQuality === 'low' && (
                          <Check className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-baseline">
                          <span className="text-sm text-muted-foreground">File Size:</span>
                          <span className="text-xl font-bold text-primary">
                            {formatFileSize(compressedData.qualities.low.size)}
                          </span>
                        </div>
                        <div className="flex justify-between items-baseline">
                          <span className="text-sm text-muted-foreground">Saved:</span>
                          <span className="text-lg font-semibold text-green-600">
                            {compressedData.qualities.low.ratio}%
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground pt-2 border-t">
                        Maximum compression, reduced quality
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Action Buttons */}
                {selectedQuality && (
                  <div className="flex flex-col gap-3 pt-4">
                    <Button
                      onClick={() => setShowFilenameDialog(true)}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      size="lg"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Save ({selectedQuality} quality)
                    </Button>
                    <Button onClick={handleReset} variant="outline" size="lg">
                      Start Over
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Hidden Email Share Button */}
        <div className="hidden">
          <EmailShareButton
            ref={emailShareButtonRef}
            onGenerateBlob={generateCompressedBlob}
            fileName={pendingFilename || getDefaultFilename()}
            shareMessage="I've compressed a PDF document using Mon PDF."
          />
        </div>

        {/* Filename Dialog */}
        <FilenameDialog
          open={showFilenameDialog}
          onOpenChange={setShowFilenameDialog}
          defaultFilename={getDefaultFilename()}
          onConfirm={handleFilenameConfirm}
          title="Save Compressed PDF"
          description="Choose a filename for your compressed PDF"
        />
      </CardContent>
    </Card>
  )
}
