"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslations } from 'next-intl'
import { Loader2, Download, FileCheck, Upload } from "lucide-react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

type QualityLevel = "high" | "medium" | "low"

export function PDFCompressTool() {
  const t = useTranslations()
  const [file, setFile] = useState<File | null>(null)
  const [compressing, setCompressing] = useState(false)
  const [compressedData, setCompressedData] = useState<{
    blob: Blob
    originalSize: number
    compressedSize: number
    compressionRatio: number
  } | null>(null)
  const [quality, setQuality] = useState<QualityLevel>("medium")

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
      formData.append('quality', quality)

      const response = await fetch('/api/compress-pdf', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to compress PDF')
      }

      const compressedBlob = await response.blob()
      const originalSize = parseInt(response.headers.get('X-Original-Size') || file.size.toString())
      const compressedSize = parseInt(response.headers.get('X-Compressed-Size') || compressedBlob.size.toString())
      const ratio = parseInt(response.headers.get('X-Compression-Ratio') || '0')

      setCompressedData({
        blob: compressedBlob,
        originalSize,
        compressedSize,
        compressionRatio: ratio,
      })
    } catch (error) {
      console.error("Error compressing PDF:", error)
      alert("Failed to compress PDF. Please try again.")
    } finally {
      setCompressing(false)
    }
  }

  const handleDownload = () => {
    if (!compressedData || !file) return

    const url = URL.createObjectURL(compressedData.blob)
    const link = document.createElement("a")
    link.href = url
    link.download = file.name.replace(/\.pdf$/i, "_compressed.pdf")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0]
    if (uploadedFile && uploadedFile.type === "application/pdf") {
      setFile(uploadedFile)
      setCompressedData(null)
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const droppedFile = event.dataTransfer.files[0]
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile)
      setCompressedData(null)
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const handleReset = () => {
    setFile(null)
    setCompressedData(null)
    setQuality("medium")
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
                  <p className="font-medium">{t('tools.compressPdf.fileInfo', { name: file.name })}</p>
                  <p className="text-sm text-muted-foreground">
                    {t('tools.compressPdf.originalSize')}: {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleReset}>
                {t('common.cancel')}
              </Button>
            </div>

            {/* Quality Selection */}
            {!compressedData && (
              <div className="space-y-4">
                <Label className="text-base font-semibold">{t('tools.compressPdf.quality')}</Label>
                <RadioGroup value={quality} onValueChange={(value) => setQuality(value as QualityLevel)}>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="high" id="high" />
                    <Label htmlFor="high" className="flex-1 cursor-pointer">
                      <div>
                        <p className="font-medium">{t('tools.compressPdf.qualityHigh')}</p>
                        <p className="text-sm text-muted-foreground">
                          Best quality, smaller file size reduction
                        </p>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="medium" id="medium" />
                    <Label htmlFor="medium" className="flex-1 cursor-pointer">
                      <div>
                        <p className="font-medium">{t('tools.compressPdf.qualityMedium')}</p>
                        <p className="text-sm text-muted-foreground">
                          Good balance between quality and file size
                        </p>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="low" id="low" />
                    <Label htmlFor="low" className="flex-1 cursor-pointer">
                      <div>
                        <p className="font-medium">{t('tools.compressPdf.qualityLow')}</p>
                        <p className="text-sm text-muted-foreground">
                          Maximum compression, reduced quality
                        </p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* Compression Results */}
            {compressedData && (
              <div className="space-y-4 p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-lg border-2 border-green-200 dark:border-green-800">
                <h3 className="text-lg font-semibold text-center">
                  {t('tools.compressPdf.savedSpace', { percent: compressedData.compressionRatio })}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">
                      {t('tools.compressPdf.originalSize')}
                    </p>
                    <p className="text-xl font-bold">{formatFileSize(compressedData.originalSize)}</p>
                  </div>
                  <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">
                      {t('tools.compressPdf.compressedSize')}
                    </p>
                    <p className="text-xl font-bold text-green-600 dark:text-green-400">
                      {formatFileSize(compressedData.compressedSize)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              {!compressedData ? (
                <Button
                  onClick={handleCompress}
                  disabled={compressing}
                  className="flex-1"
                  size="lg"
                >
                  {compressing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('tools.compressPdf.compressing')}
                    </>
                  ) : (
                    t('tools.compressPdf.compressButton')
                  )}
                </Button>
              ) : (
                <>
                  <Button onClick={handleDownload} className="flex-1" size="lg">
                    <Download className="mr-2 h-4 w-4" />
                    {t('tools.compressPdf.downloadCompressed')}
                  </Button>
                  <Button onClick={handleReset} variant="outline" size="lg">
                    {t('common.cancel')}
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
