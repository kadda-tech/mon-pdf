"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download, Mail } from "lucide-react"

interface FilenameDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultFilename: string
  onConfirm: (filename: string, action: 'download' | 'email') => void
  title?: string
  description?: string
}

export function FilenameDialog({
  open,
  onOpenChange,
  defaultFilename,
  onConfirm,
  title = "Save File",
  description = "Choose a filename for your PDF",
}: FilenameDialogProps) {
  const [filename, setFilename] = useState(defaultFilename)

  // Update filename when defaultFilename changes
  useState(() => {
    setFilename(defaultFilename)
  })

  const handleConfirm = (action: 'download' | 'email') => {
    // Ensure .pdf extension
    let finalFilename = filename.trim()
    if (!finalFilename.toLowerCase().endsWith('.pdf')) {
      finalFilename += '.pdf'
    }
    onConfirm(finalFilename, action)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="filename">Filename</Label>
            <Input
              id="filename"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="Enter filename"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleConfirm('download')
                }
              }}
            />
            <p className="text-xs text-muted-foreground">
              The .pdf extension will be added automatically if not included
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => handleConfirm('email')}
            className="w-full sm:w-auto"
          >
            <Mail className="mr-2 h-4 w-4" />
            Email
          </Button>
          <Button
            onClick={() => handleConfirm('download')}
            className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
