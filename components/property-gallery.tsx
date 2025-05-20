"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Maximize } from "lucide-react"

interface PropertyGalleryProps {
  images: string[]
  title: string
}

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [currentImage, setCurrentImage] = useState(0)

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length)
  }

  // If no images are provided, use a placeholder
  const displayImages = images.length > 0 ? images : ["/placeholder.svg?height=600&width=800"]

  return (
    <div className="space-y-2">
      <div className="relative overflow-hidden rounded-lg aspect-[16/9]">
        {/* Blurred background image */}
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={displayImages[currentImage] || "/placeholder.svg"}
            alt="Background"
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover scale-110 blur-lg brightness-90"
          />
        </div>
        
        {/* Main image */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src={displayImages[currentImage] || "/placeholder.svg"}
            alt={`${title} - Image ${currentImage + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-contain"
            priority
          />
        </div>

        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity">
          <div className="absolute inset-0 bg-black/20" />

          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4">
            <Button
              variant="secondary"
              size="icon"
              onClick={prevImage}
              disabled={displayImages.length <= 1}
              className="rounded-full bg-white/80 hover:bg-white"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="sr-only">Previous image</span>
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondary" size="sm" className="rounded-full bg-white/80 hover:bg-white">
                  <Maximize className="w-4 h-4 mr-2" />
                  View all photos
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl p-0 bg-transparent border-none">
                <DialogTitle className="sr-only">{title} Gallery</DialogTitle>
                <div className="relative aspect-[16/9]">
                  <Image
                    src={displayImages[currentImage] || "/placeholder.svg"}
                    alt={`${title} - Image ${currentImage + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 1200px"
                    className="object-contain"
                  />

                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={prevImage}
                    disabled={displayImages.length <= 1}
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <span className="sr-only">Previous image</span>
                  </Button>

                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={nextImage}
                    disabled={displayImages.length <= 1}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white"
                  >
                    <ChevronRight className="w-5 h-5" />
                    <span className="sr-only">Next image</span>
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button
              variant="secondary"
              size="icon"
              onClick={nextImage}
              disabled={displayImages.length <= 1}
              className="rounded-full bg-white/80 hover:bg-white"
            >
              <ChevronRight className="w-5 h-5" />
              <span className="sr-only">Next image</span>
            </Button>
          </div>
        </div>
      </div>

      {displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0 transition-opacity ${
                currentImage === index ? "ring-2 ring-primary" : "opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={`${title} - Thumbnail ${index + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
