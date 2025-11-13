"use client"

import { use, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Camera,
  Loader2,
  Trash2,
  X,
  AlertCircle,
  CheckCircle,
  RefreshCcw,
  ArrowLeft,
  Check
} from 'lucide-react'
import { toast } from 'sonner'

export default function MobileScanPageClient({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = use(params)
  const router = useRouter()
  const [capturing, setCapturing] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [connected, setConnected] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Check if session exists via API with retry logic
  useEffect(() => {
    let retryCount = 0
    const maxRetries = 5
    const retryDelay = 1000 // 1 second

    const checkSession = async () => {
      try {
        const response = await fetch(`/api/scan/${sessionId}`)
        const data = await response.json()

        if (!data.success) {
          // Retry if session not found and we haven't exceeded max retries
          if (retryCount < maxRetries) {
            retryCount++
            console.log(`Session not found, retrying... (${retryCount}/${maxRetries})`)
            setTimeout(checkSession, retryDelay)
            return
          }

          setError('Session not found. Please scan the QR code again.')
          return
        }

        setImages(data.images || [])
        setConnected(true)
      } catch (err) {
        console.error('Error checking session:', err)

        // Retry on network errors too
        if (retryCount < maxRetries) {
          retryCount++
          console.log(`Connection error, retrying... (${retryCount}/${maxRetries})`)
          setTimeout(checkSession, retryDelay)
          return
        }

        setError('Failed to connect to session')
      }
    }

    checkSession()
  }, [sessionId])

  // Start camera
  useEffect(() => {
    if (!connected) return

    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment', // Use back camera
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          }
        })

        setStream(mediaStream)

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
        }
      } catch (err) {
        console.error('Camera error:', err)
        setError('Could not access camera. Please allow camera permissions.')
        toast.error('Camera access denied')
      }
    }

    startCamera()

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [connected])

  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current) return

    setCapturing(true)

    const video = videoRef.current
    const canvas = canvasRef.current

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw video frame to canvas
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      setCapturing(false)
      return
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Convert to base64
    const imageData = canvas.toDataURL('image/jpeg', 0.9)

    try {
      // Upload to API
      const response = await fetch(`/api/scan/${sessionId}/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ imageData })
      })

      const data = await response.json()

      if (data.success) {
        // Add to local images
        setImages([...images, imageData])
        toast.success('Image captured')

        // Haptic feedback if available
        if (navigator.vibrate) {
          navigator.vibrate(50)
        }
      } else {
        toast.error('Failed to upload image')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Failed to upload image')
    }

    setCapturing(false)
  }

  const removeImage = async (index: number) => {
    try {
      const response = await fetch(`/api/scan/${sessionId}/remove`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ index })
      })

      const data = await response.json()

      if (data.success) {
        setImages(images.filter((_, i) => i !== index))
        toast.success('Image removed')

        // Haptic feedback if available
        if (navigator.vibrate) {
          navigator.vibrate(50)
        }
      } else {
        toast.error('Failed to remove image')
      }
    } catch (error) {
      console.error('Error removing image:', error)
      toast.error('Failed to remove image')
    }
  }

  const handleDone = () => {
    // Stop camera stream before navigating
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
    }

    // Navigate back to scan page with session ID in URL params
    const locale = window.location.pathname.split('/')[1] || 'en'
    router.push(`/${locale}/scan-pdf?session=${sessionId}`)
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
              <h2 className="text-xl font-semibold mb-2">Connection Error</h2>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => window.location.reload()} variant="outline">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!connected) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin" />
          <p className="text-lg font-medium">Loading session...</p>
        </div>
      </div>
    )
  }

  return (
      <div className="relative min-h-screen bg-black">
        {/* Full-screen video */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-contain bg-black"
          />
          {/* Overlay frame */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="border-2 border-white/40 rounded-xl w-[85%] h-[70%]" />
          </div>
          {/* Hidden canvas */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Header (overlayed on top) */}
        <div className="absolute top-0 left-0 right-0 z-20 bg-card/80 backdrop-blur-md border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="font-medium">Connected</span>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary">{images.length} pages</Badge>
              <Button
                variant="default"
                size="sm"
                onClick={handleDone}
                className="gap-1"
              >
                <Check className="h-4 w-4" />
                Done
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom controls (overlayed too) */}
        <div className="absolute bottom-8 w-full flex justify-center items-center z-20">
          <Button
              size="icon"
              onClick={captureImage}
              disabled={capturing || !stream}
              className={`rounded-full h-20 w-20 p-0 bg-primary text-white transition-transform duration-150 ${
                  capturing ? "scale-95 bg-primary/70" : "hover:scale-105"
              }`}
          >
            {capturing ? (
                <Loader2 className="h-8 w-8 animate-spin" />
            ) : (
                <Camera className="h-8 w-8" />
            )}
          </Button>
        </div>
      </div>
  )
}
