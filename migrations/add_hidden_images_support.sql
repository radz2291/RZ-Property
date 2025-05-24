-- Migration: Add support for hidden images and unified image management
-- Date: December 2024

-- Add columns to support unified image management with hidden images
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS image_metadata JSONB DEFAULT '[]';

-- Update existing properties to migrate current image structure to new format
-- This will convert existing featured_image and images arrays to the new metadata format
UPDATE properties 
SET image_metadata = (
  SELECT jsonb_agg(
    jsonb_build_object(
      'url', image_url,
      'isHidden', false,
      'isFeatured', CASE WHEN image_url = featured_image THEN true ELSE false END,
      'uploadedAt', created_at,
      'order', row_number() OVER ()
    )
  )
  FROM (
    -- First add featured image if it exists
    SELECT featured_image as image_url, created_at, 1 as priority
    FROM properties p1 
    WHERE p1.id = properties.id AND featured_image IS NOT NULL
    
    UNION ALL
    
    -- Then add additional images
    SELECT unnest(images) as image_url, created_at, 2 as priority
    FROM properties p2 
    WHERE p2.id = properties.id AND array_length(images, 1) > 0
  ) combined_images
  ORDER BY priority, image_url
)
WHERE (featured_image IS NOT NULL OR array_length(images, 1) > 0);

-- Add comment explaining the new structure
COMMENT ON COLUMN properties.image_metadata IS 'JSON array storing image metadata: [{"url": "...", "isHidden": false, "isFeatured": false, "uploadedAt": "...", "order": 1}]';
