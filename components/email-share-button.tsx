"use client"

import {useState, forwardRef} from "react"
import {CheckCircle2, Mail, XCircle} from "lucide-react"
import {Button} from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Textarea} from "@/components/ui/textarea"
import {useTranslations} from 'next-intl'
import {toast} from 'sonner'

/**
 * EmailShareButton Component
 *
 * A reusable button for sharing PDF files via email.
 * Opens a dialog where users can enter recipient email and message.
 * Sends the PDF as an email attachment using the Resend API.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <EmailShareButton
 *   onGenerateBlob={async () => {
 *     // Your PDF generation logic here
 *     return blob
 *   }}
 *   fileName="my-document.pdf"
 *   shareMessage="Check out this PDF!"
 * />
 *
 * // With custom styling
 * <EmailShareButton
 *   onGenerateBlob={generatePDF}
 *   fileName="output.pdf"
 *   variant="default"
 *   size="sm"
 *   className="custom-class"
 *   iconOnlyMobile={false}
 * />
 * ```
 */

interface EmailShareButtonProps {
  /**
   * Function that generates the file blob to be shared
   */
  onGenerateBlob: () => Promise<Blob | null>

  /**
   * The filename to use when downloading/sharing
   */
  fileName: string

  /**
   * Optional custom share message
   */
  shareMessage?: string

  /**
   * Whether the component is in a processing state
   */
  disabled?: boolean

  /**
   * Optional custom button variant
   */
  variant?: "default" | "outline" | "ghost" | "secondary"

  /**
   * Optional custom button size
   */
  size?: "default" | "sm" | "lg" | "icon"

  /**
   * Optional custom button className
   */
  className?: string

  /**
   * Show only icon on mobile
   */
  iconOnlyMobile?: boolean
}

export const EmailShareButton = forwardRef<HTMLButtonElement, EmailShareButtonProps>(({
  onGenerateBlob,
  fileName,
  shareMessage,
  disabled = false,
  variant = "outline",
  size = "lg",
  className = "",
  iconOnlyMobile = true,
}, ref) => {
  const t = useTranslations()
  const [showEmailDialog, setShowEmailDialog] = useState(false)
  const [recipientEmail, setRecipientEmail] = useState('')
  const [emailMessage, setEmailMessage] = useState('')
  const [isSending, setIsSending] = useState(false)

  const handleEmailShare = async () => {
    if (!recipientEmail) {
      toast.error(t('tools.split.emailRequired'), {
        icon: <XCircle className="h-5 w-5" />,
        duration: 4000,
      })
      return
    }

    setIsSending(true)

    try {
      const blob = await onGenerateBlob()
      if (!blob) {
        setIsSending(false)
        return
      }

      const formData = new FormData()
      formData.append('file', blob, fileName)
      formData.append('recipient', recipientEmail)
      formData.append('message', emailMessage || shareMessage || 'Sharing a PDF document with you.')
      formData.append('platform', 'email')

      const response = await fetch('/api/share-pdf', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send email')
      }

      // Success! Show beautiful toast notification
      toast.success(t('tools.split.emailSentTitle'), {
        description: t('tools.split.emailSentMessage', { email: recipientEmail }),
        icon: <CheckCircle2 className="h-5 w-5" />,
        duration: 6000,
        className: 'text-left',
      })

      setShowEmailDialog(false)
      setRecipientEmail('')
      setEmailMessage('')
    } catch (error) {
      console.error('Email share error:', error)

      toast.error(t('tools.split.emailErrorTitle'), {
        description: t('tools.split.emailErrorMessage'),
        icon: <XCircle className="h-5 w-5" />,
        duration: 5000,
        className: 'text-left',
      })
    } finally {
      setIsSending(false)
    }
  }

  const handleEmailClick = () => {
    // Show the email dialog
    setShowEmailDialog(true)
  }

  return (
    <>
    <Button
      ref={ref}
      onClick={handleEmailClick}
      disabled={disabled}
      variant={variant}
      size={size}
      className={`${className}`}
    >
      <Mail className="h-5 w-5 group-hover:scale-110 transition-transform" />
      {iconOnlyMobile && <span className="ml-2 hidden sm:inline">{t('tools.split.shareEmail')}</span>}
      {!iconOnlyMobile && <span className="ml-2">{t('tools.split.shareEmail')}</span>}
    </Button>

    {/* Email Dialog */}
    <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-600" />
            {t('tools.split.shareEmailDialogTitle')}
          </DialogTitle>
          <DialogDescription>
            {t('tools.split.shareEmailDialogDescription')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="recipient">{t('tools.split.recipientEmailLabel')} *</Label>
            <Input
              id="recipient"
              type="email"
              placeholder={t('tools.split.recipientEmailPlaceholder')}
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              disabled={isSending}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">{t('tools.split.messageLabel')}</Label>
            <Textarea
              id="message"
              placeholder={t('tools.split.messagePlaceholder')}
              value={emailMessage}
              onChange={(e) => setEmailMessage(e.target.value)}
              disabled={isSending}
              rows={4}
            />
          </div>

          <div className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950/20 p-3 rounded-md flex items-start gap-2">
            <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{t('tools.split.emailNoteMessage')}</span>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setShowEmailDialog(false)}
            disabled={isSending}
          >
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleEmailShare}
            disabled={isSending || !recipientEmail}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSending ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                {t('tools.split.sending')}
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                {t('tools.split.sendEmail')}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </>
  )
})

EmailShareButton.displayName = 'EmailShareButton'
