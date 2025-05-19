-- Add slug column to properties table
ALTER TABLE properties
ADD COLUMN slug TEXT UNIQUE;

-- Create index for faster slug lookups
CREATE INDEX idx_properties_slug ON properties(slug);
