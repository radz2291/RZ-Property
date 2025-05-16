"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Property } from "@/lib/types"
import { createProperty, updateProperty } from "@/lib/actions/property-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2 } from "lucide-react"
import Image from "next/image"

interface PropertyFormProps {
  property?: Property
  isEdit?: boolean
}

export default function PropertyForm({ property, isEdit = false }: PropertyFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [featuredImagePreview, setFeaturedImagePreview] = useState<string | null>(property?.featuredImage || null)
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>(property?.images || [])

  const handleFeaturedImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setFeaturedImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newPreviews: string[] = []

      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          newPreviews.push(e.target?.result as string)
          if (newPreviews.length === files.length) {
            setAdditionalImagePreviews((prev) => [...prev, ...newPreviews])
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const formData = new FormData(e.currentTarget)

      // Add current images if editing
      if (isEdit && property) {
        formData.append("currentFeaturedImage", property.featuredImage || "")
        formData.append("currentImages", JSON.stringify(property.images))
      }

      if (isEdit && property) {
        await updateProperty(property.id, formData)
      } else {
        await createProperty(formData)
      }
    } catch (err) {
      console.error("Error submitting form:", err)
      setError("An error occurred while submitting the form. Please try again.")
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && <div className="p-4 text-sm text-red-600 bg-red-50 rounded-md">{error}</div>}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Property Title</Label>
            <Input
              id="title"
              name="title"
              defaultValue={property?.title}
              required
              placeholder="e.g. Spacious Family Home in Taman Megah"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={property?.description}
              required
              rows={5}
              placeholder="Describe the property in detail"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalDetails">Additional Details (Optional)</Label>
            <Textarea
              id="additionalDetails"
              name="additionalDetails"
              defaultValue={property?.additionalDetails}
              rows={3}
              placeholder="Any additional information about the property"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price">Price (RM)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                defaultValue={property?.price}
                required
                min="1"
                step="0.01"
                placeholder="e.g. 350000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                name="category"
                defaultValue={property?.category || "For Sale"}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="For Sale">For Sale</option>
                <option value="For Rent">For Rent</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="propertyType">Property Type</Label>
              <select
                id="propertyType"
                name="propertyType"
                defaultValue={property?.propertyType || "Residential"}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Land">Land</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                defaultValue={property?.status || "Available"}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="Available">Available</option>
                <option value="Pending">Pending</option>
                <option value="Sold">Sold</option>
                <option value="Rented">Rented</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="size">Size (sq ft)</Label>
              <Input
                id="size"
                name="size"
                type="number"
                defaultValue={property?.size}
                required
                min="1"
                placeholder="e.g. 1500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input
                id="bedrooms"
                name="bedrooms"
                type="number"
                defaultValue={property?.bedrooms}
                required
                min="0"
                placeholder="e.g. 3"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input
                id="bathrooms"
                name="bathrooms"
                type="number"
                defaultValue={property?.bathrooms}
                required
                min="0"
                placeholder="e.g. 2"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              defaultValue={property?.address}
              required
              placeholder="e.g. Jalan Megah 12, Taman Megah"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="district">District</Label>
              <Input
                id="district"
                name="district"
                defaultValue={property?.district}
                required
                placeholder="e.g. Taman Megah"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" name="city" defaultValue={property?.city || "Tawau"} required placeholder="e.g. Tawau" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                name="state"
                defaultValue={property?.state || "Sabah"}
                required
                placeholder="e.g. Sabah"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input id="country" name="country" defaultValue="Malaysia" required placeholder="e.g. Malaysia" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Features</Label>
            <div className="grid gap-2 md:grid-cols-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="hasParking" name="hasParking" defaultChecked={property?.hasParking} />
                <Label htmlFor="hasParking" className="cursor-pointer">
                  Parking
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="hasFurnished" name="hasFurnished" defaultChecked={property?.hasFurnished} />
                <Label htmlFor="hasFurnished" className="cursor-pointer">
                  Furnished
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="hasAirCon" name="hasAirCon" defaultChecked={property?.hasAirCon} />
                <Label htmlFor="hasAirCon" className="cursor-pointer">
                  Air Conditioning
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="hasBalcony" name="hasBalcony" defaultChecked={property?.hasBalcony} />
                <Label htmlFor="hasBalcony" className="cursor-pointer">
                  Balcony
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="hasGarden" name="hasGarden" defaultChecked={property?.hasGarden} />
                <Label htmlFor="hasGarden" className="cursor-pointer">
                  Garden
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="featuredImage">Featured Image</Label>
            <div className="grid gap-4">
              {featuredImagePreview && (
                <div className="relative aspect-video rounded-md overflow-hidden">
                  <Image
                    src={featuredImagePreview || "/placeholder.svg"}
                    alt="Featured image preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <Input
                id="featuredImage"
                name="featuredImage"
                type="file"
                accept="image/*"
                onChange={handleFeaturedImageChange}
                className="cursor-pointer"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalImages">Additional Images</Label>
            <div className="grid gap-4">
              {additionalImagePreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {additionalImagePreviews.map((preview, index) => (
                    <div key={index} className="relative aspect-square rounded-md overflow-hidden">
                      <Image
                        src={preview || "/placeholder.svg"}
                        alt={`Image preview ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
              <Input
                id="additionalImages"
                name="additionalImages"
                type="file"
                accept="image/*"
                multiple
                onChange={handleAdditionalImagesChange}
                className="cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

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
  )
}
