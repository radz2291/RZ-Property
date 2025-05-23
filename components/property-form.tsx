"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import type { Property, PropertyImageMetadata } from "@/lib/types"
import { createProperty, updateProperty } from "@/lib/actions/property-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, AlertTriangle } from "lucide-react"
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription
} from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "@/components/ui/use-toast"
import UnifiedImageManager from "@/components/unified-image-manager"

// Define validation schema with Zod
const propertyFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  additionalDetails: z.string().optional(),
  price: z.coerce.number().positive("Price must be a positive number"),
  category: z.enum(["For Sale", "For Rent"]),
  propertyType: z.enum(["Residential", "Commercial", "Land"]),
  status: z.enum(["Available", "Pending", "Sold", "Rented"]),
  size: z.coerce.number().positive("Size must be a positive number"),
  bedrooms: z.coerce.number().min(0, "Bedrooms cannot be negative"),
  bathrooms: z.coerce.number().min(0, "Bathrooms cannot be negative"),
  address: z.string().min(3, "Address is required"),
  district: z.string().min(2, "District is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  country: z.string().min(2, "Country is required"),
  hasParking: z.boolean().optional().default(false),
  hasFurnished: z.boolean().optional().default(false),
  hasAirCon: z.boolean().optional().default(false),
  hasBalcony: z.boolean().optional().default(false),
  hasGarden: z.boolean().optional().default(false),
})

type PropertyFormValues = z.infer<typeof propertyFormSchema>

interface PropertyFormProps {
  property?: Property
  isEdit?: boolean
}

export default function PropertyForm({ property, isEdit = false }: PropertyFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageMetadata, setImageMetadata] = useState<PropertyImageMetadata[]>(() => {
    // Convert existing property images to new format if needed
    if (property?.imageMetadata) {
      return property.imageMetadata
    }
    
    // Convert legacy format to new format
    const legacyImages: PropertyImageMetadata[] = []
    let order = 1
    
    if (property?.featuredImage) {
      legacyImages.push({
        url: property.featuredImage,
        isHidden: false,
        isFeatured: true,
        uploadedAt: property.createdAt || new Date().toISOString(),
        order: order++
      })
    }
    
    if (property?.images) {
      property.images.forEach(imageUrl => {
        // Don't duplicate featured image
        if (imageUrl !== property.featuredImage) {
          legacyImages.push({
            url: imageUrl,
            isHidden: false,
            isFeatured: false,
            uploadedAt: property.createdAt || new Date().toISOString(),
            order: order++
          })
        }
      })
    }
    
    return legacyImages
  })
  const [newImageFiles, setNewImageFiles] = useState<File[]>([])

  // Initialize form with react-hook-form
  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      title: property?.title || "",
      description: property?.description || "",
      additionalDetails: property?.additionalDetails || "",
      price: property?.price || 0,
      category: property?.category || "For Sale",
      propertyType: property?.propertyType || "Residential",
      status: property?.status || "Available",
      size: property?.size || 0,
      bedrooms: property?.bedrooms || 0,
      bathrooms: property?.bathrooms || 0,
      address: property?.address || "",
      district: property?.district || "",
      city: property?.city || "Tawau",
      state: property?.state || "Sabah",
      country: property?.country || "Malaysia",
      hasParking: property?.hasParking || false,
      hasFurnished: property?.hasFurnished || false,
      hasAirCon: property?.hasAirCon || false,
      hasBalcony: property?.hasBalcony || false,
      hasGarden: property?.hasGarden || false,
    },
  })

  // Handle image changes from UnifiedImageManager
  const handleImageChange = (updatedImages: PropertyImageMetadata[], newFiles?: File[]) => {
    setImageMetadata(updatedImages)
    if (newFiles) {
      setNewImageFiles(newFiles)
    }
  }

  const onSubmit = async (values: PropertyFormValues) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const formData = new FormData()
      
      // Add form values
      for (const [key, value] of Object.entries(values)) {
        formData.append(key, value.toString())
      }
      
      // Add image metadata
      formData.append("imageMetadata", JSON.stringify(imageMetadata))
      
      // Add new image files
      if (newImageFiles.length > 0) {
        toast({
          title: "Uploading images",
          description: `Please wait while we upload ${newImageFiles.length} images. This may take a moment...`,
        })
        
        newImageFiles.forEach(file => {
          formData.append("newImages", file)
        })
      }

      // Submit the form
      let result;
      if (isEdit && property) {
        result = await updateProperty(property.id, formData)
      } else {
        result = await createProperty(formData)
      }
      
      if (!result || !result.success) {
        setError(result?.message || "An error occurred while submitting the form.")
        setIsSubmitting(false)
        return
      }
      
      // Show success toast
      toast({
        title: isEdit ? "Property updated" : "Property created",
        description: result.message || (isEdit ? "The property has been updated successfully" : "The property has been created successfully"),
      })
      
      // Redirect
      setTimeout(() => {
        if (isEdit && property) {
          router.push(`/admin/properties/${property.id}`)
        } else if (result.id) {
          router.push(`/admin/properties/${result.id}`)
        } else {
          router.push('/admin/properties')
        }
        router.refresh()
      }, 1000)
      
    } catch (err) {
      console.error("Error submitting form:", err)
      setError("An error occurred while submitting the form. Please try again.")
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {form.formState.errors && Object.keys(form.formState.errors).length > 0 && (
          <Alert variant="destructive" className="bg-red-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Form has errors</AlertTitle>
            <AlertDescription>
              Please fix the highlighted fields below before submitting
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            {/* Property Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Title</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="e.g. Spacious Family Home in Taman Megah"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Describe the property in detail"
                      rows={5} 
                    />
                  </FormControl>
                  <FormDescription>
                    At least 5 characters describing the property
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Additional Details */}
            <FormField
              control={form.control}
              name="additionalDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Details (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Any additional information about the property"
                      rows={3} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              {/* Price */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (RM)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number"
                        placeholder="e.g. 350000"
                        min="1"
                        step="0.01"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="For Sale">For Sale</SelectItem>
                        <SelectItem value="For Rent">For Rent</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Property Type */}
              <FormField
                control={form.control}
                name="propertyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select property type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Residential">Residential</SelectItem>
                        <SelectItem value="Commercial">Commercial</SelectItem>
                        <SelectItem value="Land">Land</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Sold">Sold</SelectItem>
                        <SelectItem value="Rented">Rented</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {/* Size */}
              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Size (sq ft)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number"
                        placeholder="e.g. 1500"
                        min="1"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Bedrooms */}
              <FormField
                control={form.control}
                name="bedrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bedrooms</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number"
                        placeholder="e.g. 3"
                        min="0"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Bathrooms */}
              <FormField
                control={form.control}
                name="bathrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bathrooms</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number"
                        placeholder="e.g. 2"
                        min="0"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-4">
            {/* Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="e.g. Jalan Megah 12, Taman Megah"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              {/* District */}
              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>District</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="e.g. Taman Megah"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* City */}
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="e.g. Tawau"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* State */}
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="e.g. Sabah"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Country */}
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="e.g. Malaysia"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Features Section */}
            <div className="space-y-2">
              <Label>Features</Label>
              <div className="grid gap-2 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="hasParking"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange} 
                        />
                      </FormControl>
                      <FormLabel className="cursor-pointer">Parking</FormLabel>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="hasFurnished"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange} 
                        />
                      </FormControl>
                      <FormLabel className="cursor-pointer">Furnished</FormLabel>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="hasAirCon"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange} 
                        />
                      </FormControl>
                      <FormLabel className="cursor-pointer">Air Conditioning</FormLabel>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="hasBalcony"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange} 
                        />
                      </FormControl>
                      <FormLabel className="cursor-pointer">Balcony</FormLabel>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="hasGarden"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange} 
                        />
                      </FormControl>
                      <FormLabel className="cursor-pointer">Garden</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Unified Image Manager */}
            <UnifiedImageManager
              existingImages={imageMetadata}
              onImagesChange={handleImageChange}
              maxImages={15}
              maxFileSize={5}
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isEdit ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>{isEdit ? "Update Property" : "Create Property"}</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
