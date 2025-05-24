-- Add slug field to properties table
ALTER TABLE properties
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Create index for faster slug lookups
CREATE INDEX IF NOT EXISTS idx_properties_slug ON properties(slug);

-- Add function to generate slugs
CREATE OR REPLACE FUNCTION generate_slug(title TEXT)
RETURNS TEXT AS $$
DECLARE
  slug TEXT;
  base_slug TEXT;
  counter INTEGER := 0;
  slug_exists BOOLEAN;
BEGIN
  -- Convert title to lowercase, replace spaces with hyphens, remove special characters
  base_slug := lower(regexp_replace(title, '[^a-zA-Z0-9\s]', '', 'g'));
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  
  -- Initial slug is just the base slug
  slug := base_slug;
  
  -- Check if slug exists
  LOOP
    SELECT EXISTS(SELECT 1 FROM properties WHERE properties.slug = slug) INTO slug_exists;
    EXIT WHEN NOT slug_exists;
    
    -- If slug exists, increment counter and append to base slug
    counter := counter + 1;
    slug := base_slug || '-' || counter::TEXT;
  END LOOP;
  
  RETURN slug;
END;
$$ LANGUAGE plpgsql;

-- Update existing properties with slugs
DO $$
DECLARE
  property_record RECORD;
BEGIN
  FOR property_record IN SELECT id, title FROM properties WHERE slug IS NULL LOOP
    UPDATE properties
    SET slug = generate_slug(title)
    WHERE id = property_record.id;
  END LOOP;
END;
$$;

-- Make slug NOT NULL after populating existing records
ALTER TABLE properties
ALTER COLUMN slug SET NOT NULL;

-- Create a trigger to automatically generate slug for new properties
CREATE OR REPLACE FUNCTION before_insert_property()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL THEN
    NEW.slug := generate_slug(NEW.title);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER before_insert_property_trigger
BEFORE INSERT ON properties
FOR EACH ROW
EXECUTE FUNCTION before_insert_property();
