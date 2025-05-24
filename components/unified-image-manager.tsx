"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FormDescription } from "@/components/ui/form"
import { Loader2, X, Star, Eye, EyeOff, Upload, Trash2, ImageIcon } from "lucide-react"
import Image from "next/image"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { PropertyImageMetadata } from "@/lib/types"

interface UnifiedImageManagerProps {
  existingImages?: PropertyImageMetadata[]
  onImagesChange: (images: PropertyImageMetadata[], newFiles?: File[]) => void
  maxImages?: number
  maxFileSize?: number // in MB
}

export default function UnifiedImageManager({
  existingImages = [],
  onImagesChange,
  maxImages = 15,
  maxFileSize = 5
}: UnifiedImageManagerProps) {
  const [images, setImages] = useState<PropertyImageMetadata[]>(existingImages)
  const [newFiles, setNewFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const handleFileUpload = useCallback(async (files: FileList) => {
    const fileArray = Array.from(files)
    
    // Validate total image count
    if (images.length + fileArray.length > maxImages) {
      toast({
        title: "Too many images",
        description: `Maximum ${maxImages} images allowed`,
        variant: "destructive"
      })
      return
    }

    const validFiles: File[] = []
    const newImageMetadata: PropertyImageMetadata[] = []

    // Validate each file
    for (const file of fileArray) {
      if (file.size > maxFileSize * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds ${maxFileSize}MB limit`,
          variant: "destructive"
        })
        continue
      }

      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not an image`,
          variant: "destructive"
        })
        continue
      }

      validFiles.push(file)

      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      
      newImageMetadata.push({
        url: previewUrl,
        isHidden: false,
        isFeatured: images.length === 0 && newImageMetadata.length === 0, // First image is featured
        uploadedAt: new Date().toISOString(),
        order: images.length + newImageMetadata.length + 1
      })
    }

    if (validFiles.length > 0) {
      const updatedImages = [...images, ...newImageMetadata]
      setImages(updatedImages)
      setNewFiles(prev => [...prev, ...validFiles])
      onImagesChange(updatedImages, [...newFiles, ...validFiles])
      
      toast({
        title: "Images added",
        description: `${validFiles.length} image(s) added successfully`
      })
    }
  }, [images, newFiles, maxImages, maxFileSize, onImagesChange])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files)
    }
  }, [handleFileUpload])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files)
    }
  }

  const removeImage = (index: number) => {
    const imageToRemove = images[index]
    const updatedImages = images.filter((_, i) => i !== index)
    
    // If removing featured image, make the first remaining image featured
    if (imageToRemove.isFeatured && updatedImages.length > 0) {
      updatedImages[0].isFeatured = true
    }
    
    // Reorder remaining images
    const reorderedImages = updatedImages.map((img, i) => ({ ...img, order: i + 1 }))
    
    setImages(reorderedImages)
    
    // Remove corresponding file if it's a new upload
    if (imageToRemove.url.startsWith('blob:')) {
      const fileIndex = newFiles.findIndex((_, i) => i === index - existingImages.length)
      if (fileIndex >= 0) {
        const updatedFiles = newFiles.filter((_, i) => i !== fileIndex)
        setNewFiles(updatedFiles)
        onImagesChange(reorderedImages, updatedFiles)
      }
    } else {
      onImagesChange(reorderedImages, newFiles)
    }
  }

  const toggleImageVisibility = (index: number) => {
    const updatedImages = images.map((img, i) => 
      i === index ? { ...img, isHidden: !img.isHidden } : img
    )
    setImages(updatedImages)
    onImagesChange(updatedImages, newFiles)
  }

  const setFeaturedImage = (index: number) => {
    const updatedImages = images.map((img, i) => ({
      ...img,
      isFeatured: i === index
    }))
    setImages(updatedImages)
    onImagesChange(updatedImages, newFiles)
  }

  const moveImage = (fromIndex: number, toIndex: number) => {
    const updatedImages = [...images]
    const [movedImage] = updatedImages.splice(fromIndex, 1)
    updatedImages.splice(toIndex, 0, movedImage)
    
    // Update order values
    const reorderedImages = updatedImages.map((img, i) => ({ ...img, order: i + 1 }))
    
    setImages(reorderedImages)
    onImagesChange(reorderedImages, newFiles)
  }

  const visibleImages = images.filter(img => !img.isHidden)
  const hiddenImages = images.filter(img => img.isHidden)
  const hasImages = images.length > 0

  return (
    <div className="space-y-6">
      <div>
        <Label>Property Images</Label>
        <FormDescription>
          Upload up to {maxImages} images (max {maxFileSize}MB each). First image or selected featured image will be the main display image.
        </FormDescription>
      </div>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 transition-colors ${
          dragActive
            ? "border-primary bg-primary/5"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <Label htmlFor="image-upload" className="cursor-pointer">
              <span className="font-medium text-primary hover:text-primary/80">
                Click to upload
              </span>
              <span className="text-gray-500"> or drag and drop</span>
            </Label>
            <Input
              id="image-upload"
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            PNG, JPG, GIF up to {maxFileSize}MB each
          </p>
        </div>
      </div>

      {/* Image Grid - Visible Images */}
      {visibleImages.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <ImageIcon className="h-5 w-5" />
            <Label className="text-base font-medium">Visible Images ({visibleImages.length})</Label>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {visibleImages.map((image, index) => {
              const originalIndex = images.findIndex(img => img === image)
              return (
                <Card key={originalIndex} className="relative group overflow-hidden">
                  <div className="aspect-square">
                    <Image
                      src={image.url}
                      alt={`Property image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  </div>
                  
                  {/* Image Controls Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => toggleImageVisibility(originalIndex)}
                        title="Hide image"
                      >
                        <EyeOff className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeImage(originalIndex)}
                        title="Delete image"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="absolute bottom-2 left-2 right-2">
                      <Button
                        size="sm"
                        variant={image.isFeatured ? "default" : "secondary"}
                        onClick={() => setFeaturedImage(originalIndex)}
                        className="w-full"
                      >
                        <Star className={`h-4 w-4 mr-1 ${image.isFeatured ? "fill-current" : ""}`} />
                        {image.isFeatured ? "Featured" : "Set Featured"}
                      </Button>
                    </div>
                  </div>
                  
                  {/* Featured Badge */}
                  {image.isFeatured && (
                    <Badge className="absolute top-2 left-2 bg-yellow-500">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      Featured
                    </Badge>
                  )}
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Hidden Images */}
      {hiddenImages.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <EyeOff className="h-5 w-5 text-gray-500" />
            <Label className="text-base font-medium text-gray-500">Hidden Images ({hiddenImages.length})</Label>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {hiddenImages.map((image, index) => {
              const originalIndex = images.findIndex(img => img === image)
              return (
                <Card key={originalIndex} className="relative group overflow-hidden opacity-50">
                  <div className="aspect-square">
                    <Image
                      src={image.url}
                      alt={`Hidden image ${index + 1}`}
                      fill
                      className="object-cover grayscale"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  </div>
                  
                  {/* Image Controls Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => toggleImageVisibility(originalIndex)}
                        title="Show image"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeImage(originalIndex)}
                        title="Delete image"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Hidden Badge */}
                  <Badge variant="secondary" className="absolute top-2 left-2">
                    <EyeOff className="h-3 w-3 mr-1" />
                    Hidden
                  </Badge>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* No Images State */}
      {!hasImages && (
        <div className="text-center py-8 text-gray-500">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <p>No images uploaded yet</p>
          <p className="text-sm">Upload images using the area above</p>
        </div>
      )}

      {/* Summary */}
      {hasImages && (
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600">
            <span className="font-medium">{images.length}</span> total images
            {visibleImages.length !== images.length && (
              <span className="ml-2">
                (<span className="font-medium">{visibleImages.length}</span> visible, 
                <span className="font-medium ml-1">{hiddenImages.length}</span> hidden)
              </span>
            )}
          </div>
          <div className="text-sm text-gray-600">
            {images.find(img => img.isFeatured) ? (
              <span className="text-yellow-600 font-medium">Featured image set</span>
            ) : (
              <span className="text-orange-600">No featured image selected</span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
