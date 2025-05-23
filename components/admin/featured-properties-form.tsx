"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { FeaturedToggle } from "@/components/featured-toggle"
import { getFeaturedImage } from "@/lib/image-utils"
import { Star } from "lucide-react"

// Helper function to get featured image from any property object
function getPropertyFeaturedImage(property: any): string | null {
  // If we have imageMetadata, find the featured image
  if (property.imageMetadata && property.imageMetadata.length > 0) {
    const featuredImg = property.imageMetadata.find((img: any) => img.isFeatured && !img.isHidden)
    if (featuredImg) {
      return featuredImg.url
    }
    
    // If no featured image is marked, use the first visible image
    const firstVisible = property.imageMetadata
      .filter((img: any) => !img.isHidden)
      .sort((a: any, b: any) => a.order - b.order)[0]
    if (firstVisible) {
      return firstVisible.url
    }
  }
  
  // Fall back to legacy featuredImage or first image
  return property.featuredImage || (property.images && property.images[0]) || null
}

interface Property {
  id: string
  title: string
  district: string
  city: string
  category: string
  status: string
  isFeatured?: boolean
  featuredImage?: string
  images?: string[]
  imageMetadata?: any[]
}

export function FeaturedPropertiesForm() {
  const [allProperties, setAllProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/admin/properties')
      if (response.ok) {
        const data = await response.json()
        setAllProperties(data)
      }
    } catch (error) {
      console.error('Error fetching properties:', error)
    } finally {
      setLoading(false)
    }
  }

  const featuredProperties = allProperties.filter(p => p.isFeatured)
  const availableProperties = allProperties.filter(p => !p.isFeatured && p.status === "Available")

  const handleFeaturedChange = (propertyId: string, isFeatured: boolean) => {
    setAllProperties(prev => 
      prev.map(p => 
        p.id === propertyId ? { ...p, isFeatured } : p
      )
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Loading properties...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Featured Properties</h3>
        <p className="text-sm text-muted-foreground">
          Manage which properties appear on the homepage. Click the star to toggle featured status.
        </p>
      </div>

      {/* Currently Featured */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500 fill-current" />
            Currently Featured ({featuredProperties.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {featuredProperties.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {featuredProperties.map((property) => (
                <div key={property.id} className="border rounded-lg p-4 space-y-3">
                  <div className="relative aspect-video rounded-md overflow-hidden">
                    <Image
                      src={getPropertyFeaturedImage(property) || "/placeholder.svg"}
                      alt={property.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium line-clamp-1">{property.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {property.district}, {property.city}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{property.category}</Badge>
                        <Badge variant="outline">{property.status}</Badge>
                      </div>
                      <FeaturedToggle
                        propertyId={property.id}
                        isFeatured={true}
                        onFeaturedChange={(isFeatured) => handleFeaturedChange(property.id, isFeatured)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Star className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No featured properties selected</p>
              <p className="text-sm">Select properties below to feature on homepage</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available to Feature */}
      <Card>
        <CardHeader>
          <CardTitle>Available Properties ({availableProperties.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {availableProperties.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {availableProperties.map((property) => (
                <div key={property.id} className="border rounded-lg p-3 space-y-2">
                  <div className="relative aspect-video rounded-md overflow-hidden">
                    <Image
                      src={getPropertyFeaturedImage(property) || "/placeholder.svg"}
                      alt={property.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h5 className="font-medium text-sm line-clamp-1">{property.title}</h5>
                    <p className="text-xs text-muted-foreground">
                      {property.district}, {property.city}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {property.category}
                      </Badge>
                      <FeaturedToggle
                        propertyId={property.id}
                        isFeatured={false}
                        onFeaturedChange={(isFeatured) => handleFeaturedChange(property.id, isFeatured)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No available properties to feature</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
