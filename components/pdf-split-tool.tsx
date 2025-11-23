"use client"

import {useState} from "react"
import {useTranslations} from 'next-intl'
import {PDFDocument} from "pdf-lib"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {FileUploadZone} from "@/components/file-upload-zone"
import {useAppDispatch, useAppSelector} from "@/lib/hooks"
import {addFiles, clearFiles, setProcessing} from "@/lib/features/pdf-slice"
import {CheckSquare, Download, Scissors, Square} from "lucide-react"
import {PDFPageSelector} from "@/components/pdf-page-selector"

export function PDFSplitTool() {
  const t = useTranslations()
  const dispatch = useAppDispatch()
  const { files, processing } = useAppSelector((state) => state.pdf)
  const [pageRange, setPageRange] = useState<string>("")
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set())

  const handleFilesSelected = async (fileList: FileList) => {
    // Clear existing files first since this tool only handles one file at a time
    dispatch(clearFiles())

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
    setSelectedPages(new Set()) // Reset selection when new file is uploaded
    setPageRange("") // Reset page range when new file is uploaded
  }

  const handlePageToggle = (pageNumber: number) => {
    setSelectedPages((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(pageNumber)) {
        newSet.delete(pageNumber)
      } else {
        newSet.add(pageNumber)
      }
      return newSet
    })
  }

  const handleSelectAll = () => {
    if (files.length > 0) {
      const allPages = new Set(Array.from({ length: files[0].pages }, (_, i) => i + 1))
      setSelectedPages(allPages)
    }
  }

  const handleDeselectAll = () => {
    setSelectedPages(new Set())
  }

  const handleDownloadSelected = async () => {
    if (files.length === 0 || selectedPages.size === 0) return

    dispatch(setProcessing(true))

    try {
      const file = files[0].file
      const arrayBuffer = await file.arrayBuffer()
      const pdfDoc = await PDFDocument.load(arrayBuffer)

      // Create new PDF with selected pages
      const newPdf = await PDFDocument.create()
      const sortedPages = Array.from(selectedPages).sort((a, b) => a - b)

      for (const pageNum of sortedPages) {
        const [copiedPage] = await newPdf.copyPages(pdfDoc, [pageNum - 1])
        newPdf.addPage(copiedPage)
      }

      const pdfBytes = await newPdf.save()
      const blob = new Blob([pdfBytes], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `selected-pages-${files[0].name}`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error downloading selected pages:", error)
    } finally {
      dispatch(setProcessing(false))
    }
  }

  const handleSplit = async () => {
    if (files.length === 0 || !pageRange) return

    dispatch(setProcessing(true))

    try {
      const file = files[0].file
      const arrayBuffer = await file.arrayBuffer()
      const pdfDoc = await PDFDocument.load(arrayBuffer)

      // Parse page range (e.g., "1-3,5,7-9")
      const ranges = pageRange.split(",").map((r) => r.trim())

      for (const range of ranges) {
        const newPdf = await PDFDocument.create()

        if (range.includes("-")) {
          const [start, end] = range.split("-").map((n) => Number.parseInt(n.trim()))
          for (let i = start - 1; i < end; i++) {
            const [copiedPage] = await newPdf.copyPages(pdfDoc, [i])
            newPdf.addPage(copiedPage)
          }
        } else {
          const pageNum = Number.parseInt(range) - 1
          const [copiedPage] = await newPdf.copyPages(pdfDoc, [pageNum])
          newPdf.addPage(copiedPage)
        }

        const pdfBytes = await newPdf.save()
        const blob = new Blob([pdfBytes], { type: "application/pdf" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `split-${range}-${files[0].name}`
        a.click()
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error("Error splitting PDF:", error)
    } finally {
      dispatch(setProcessing(false))
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scissors className="h-6 w-6" />
          {t('tools.split.heading')}
        </CardTitle>
        <CardDescription>{t('tools.split.intro')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FileUploadZone onFilesSelected={handleFilesSelected} accept=".pdf" multiple={false} type="pdf" />

        {files.length > 0 && (
          <>
            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-sm font-medium">
                    {files[0].name} ({files[0].pages} {t('tools.split.pages')})
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {selectedPages.size > 0
                      ? t('tools.split.pagesSelected', { count: selectedPages.size })
                      : t('tools.split.selectPages')}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSelectAll} variant="outline" size="sm">
                    <CheckSquare className="mr-2 h-4 w-4" />
                    {t('common.selectAll')}
                  </Button>
                  <Button onClick={handleDeselectAll} variant="outline" size="sm">
                    <Square className="mr-2 h-4 w-4" />
                    {t('common.deselectAll')}
                  </Button>
                </div>
              </div>
            </Card>

            <PDFPageSelector
              file={files[0].file}
              selectedPages={selectedPages}
              onPageToggle={handlePageToggle}
            />

            {selectedPages.size > 0 && (
              <Card className="p-6 space-y-4 sticky bottom-4 shadow-lg">
                <Button onClick={handleDownloadSelected} disabled={processing} className="w-full" size="lg">
                  {processing ? (
                    t('common.processing')
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      {t('tools.split.downloadSelected')}
                    </>
                  )}
                </Button>
              </Card>
            )}

            <Card className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pageRange">{t('tools.split.orUseRange')}</Label>
                <Input
                  id="pageRange"
                  placeholder={t('tools.split.pageRangePlaceholder')}
                  value={pageRange}
                  onChange={(e) => setPageRange(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">{t('tools.split.pageRangeHelp')}</p>
              </div>

              <Button onClick={handleSplit} disabled={processing || !pageRange} className="w-full" size="lg">
                {processing ? (
                  t('common.processing')
                ) : (
                  <>
                    <Scissors className="mr-2 h-4 w-4" />
                    {t('tools.split.splitByRange')}
                  </>
                )}
              </Button>
            </Card>
          </>
        )}
      </CardContent>
    </Card>
  )
}
