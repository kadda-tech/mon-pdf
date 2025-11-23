"use client"

import type React from "react"
import {useCallback} from "react"
import {FileText, ImageIcon, Upload} from "lucide-react"
import {cn} from "@/lib/utils"

interface FileUploadZoneProps {
  onFilesSelected: (files: FileList) => void
  accept?: string
  multiple?: boolean
  type?: "pdf" | "image" | "both"
}

export function FileUploadZone({
  onFilesSelected,
  accept = ".pdf",
  multiple = true,
  type = "pdf",
}: FileUploadZoneProps) {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        onFilesSelected(e.dataTransfer.files)
      }
    },
    [onFilesSelected],
  )

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }, [])

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        onFilesSelected(e.target.files)
      }
    },
    [onFilesSelected],
  )

  const getIcon = () => {
    if (type === "image") return <ImageIcon className="h-12 w-12 mb-4 text-muted-foreground" />
    if (type === "pdf") return <FileText className="h-12 w-12 mb-4 text-muted-foreground" />
    return <Upload className="h-12 w-12 mb-4 text-muted-foreground" />
  }

  const getAcceptText = () => {
    if (type === "image") return "PNG, JPG, GIF up to 10MB"
    if (type === "pdf") return "PDF files up to 25MB"
    return "PDF and image files"
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className={cn(
        "relative border-2 border-dashed rounded-xl p-12 text-center",
        "border-border bg-muted/20",
      )}
    >
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <div className="flex flex-col items-center">
        {getIcon()}
        <p className="text-lg font-medium mb-2">Drop your files here</p>
        <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
        <p className="text-xs text-muted-foreground">{getAcceptText()}</p>
      </div>
    </div>
  )
}
