"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Star, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface FeaturedToggleProps {
  propertyId: string
  isFeatured: boolean
  onFeaturedChange?: (isFeatured: boolean) => void
}

export function FeaturedToggle({ propertyId, isFeatured, onFeaturedChange }: FeaturedToggleProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [featured, setFeatured] = useState(isFeatured)

  const handleToggle = async () => {
    setIsUpdating(true)
    
    try {
      const newFeaturedStatus = !featured
      
      const response = await fetch(`/api/properties/${propertyId}/featured`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isFeatured: newFeaturedStatus })
      })

      if (!response.ok) {
        throw new Error('Failed to update featured status')
      }

      setFeatured(newFeaturedStatus)
      onFeaturedChange?.(newFeaturedStatus)
      
      toast({
        title: newFeaturedStatus ? "Added to featured" : "Removed from featured",
        description: newFeaturedStatus 
          ? "Property will appear on homepage" 
          : "Property removed from homepage",
      })
    } catch (error) {
      console.error('Error updating featured status:', error)
      toast({
        title: "Error",
        description: "Failed to update featured status",
        variant: "destructive"
      })
    } finally {
      setIsUpdating(false)
    }
  }

  if (isUpdating) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      className={featured ? "text-yellow-600 hover:text-yellow-700" : "text-gray-400 hover:text-gray-600"}
      title={featured ? "Remove from featured" : "Add to featured"}
    >
      <Star className={`h-4 w-4 ${featured ? "fill-current" : ""}`} />
    </Button>
  )
}
