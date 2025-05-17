"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, X, Upload, Image as ImageIcon } from "lucide-react"
import Image from "next/image"
import { createClient } from "@/lib/supabase"

interface FileUploadProps {
  value: string | null
  onChange: (url: string | null) => void
  onRemove: () => void
}

export function FileUpload({ value, onChange, onRemove }: FileUploadProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload an image file.",
      })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Image size should be less than 5MB.",
      })
      return
    }

    setIsLoading(true)

    try {
      // Generate a unique filename
      const timestamp = new Date().getTime()
      const fileExt = file.name.split(".").pop()
      const fileName = `${timestamp}.${fileExt}`
      const filePath = `images/${fileName}`

      // Upload to Supabase storage
      const { error: uploadError } = await supabase.storage.from("property-catalog").upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      // Get the public URL
      const { data } = supabase.storage.from("property-catalog").getPublicUrl(filePath)
      
      if (data && data.publicUrl) {
        onChange(data.publicUrl)
        toast({
          title: "Upload successful",
          description: "Image has been uploaded successfully.",
        })
      }
    } catch (error) {
      console.error("Error uploading file:", error)
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "There was an error uploading your image. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {value ? (
        <Card className="relative overflow-hidden w-full aspect-video">
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 z-10"
            onClick={onRemove}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="relative w-full h-full">
            <Image
              src={value}
              alt="Uploaded image"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        </Card>
      ) : (
        <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-6 text-center">
          <div className="flex flex-col items-center gap-2">
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Drag & drop an image here or click to browse</p>
          </div>
          <Input
            type="file"
            accept="image/*"
            className="cursor-pointer opacity-0 absolute inset-0"
            onChange={handleUpload}
            disabled={isLoading}
          />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
