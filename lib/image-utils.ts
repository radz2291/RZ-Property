import type { Property, PropertyImageMetadata } from "./types"

/**
 * Get visible images from a property, handling both new and legacy formats
 */
export function getVisibleImages(property: Property): string[] {
  // If we have imageMetadata, use it and filter out hidden images
  if (property.imageMetadata && property.imageMetadata.length > 0) {
    return property.imageMetadata
      .filter(img => !img.isHidden)
      .sort((a, b) => a.order - b.order)
      .map(img => img.url)
  }
  
  // Fall back to legacy images array
  return property.images || []
}

/**
 * Get the featured image from a property, handling both new and legacy formats
 */
export function getFeaturedImage(property: Property): string | null {
  // If we have imageMetadata, find the featured image
  if (property.imageMetadata && property.imageMetadata.length > 0) {
    const featuredImg = property.imageMetadata.find(img => img.isFeatured && !img.isHidden)
    if (featuredImg) {
      return featuredImg.url
    }
    
    // If no featured image is marked, use the first visible image
    const firstVisible = property.imageMetadata
      .filter(img => !img.isHidden)
      .sort((a, b) => a.order - b.order)[0]
    if (firstVisible) {
      return firstVisible.url
    }
  }
  
  // Fall back to legacy featuredImage or first image
  return property.featuredImage || (property.images && property.images[0]) || null
}

/**
 * Get all images for gallery display (visible images excluding the featured image)
 */
export function getGalleryImages(property: Property): string[] {
  const visibleImages = getVisibleImages(property)
  const featuredImage = getFeaturedImage(property)
  
  // Return all visible images for the gallery - featured image will be shown first
  return visibleImages
}

/**
 * Check if a property has any visible images
 */
export function hasVisibleImages(property: Property): boolean {
  return getVisibleImages(property).length > 0
}

/**
 * Get image count for display
 */
export function getImageCount(property: Property): number {
  return getVisibleImages(property).length
}

/**
 * Get hidden images count
 */
export function getHiddenImageCount(property: Property): number {
  if (property.imageMetadata && property.imageMetadata.length > 0) {
    return property.imageMetadata.filter(img => img.isHidden).length
  }
  return 0
}
