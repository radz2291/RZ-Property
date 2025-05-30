-- Create enum types
CREATE TYPE property_category AS ENUM ('For Sale', 'For Rent');
CREATE TYPE property_type AS ENUM ('Residential', 'Commercial', 'Land');
CREATE TYPE property_status AS ENUM ('Available', 'Pending', 'Sold', 'Rented');
CREATE TYPE inquiry_status AS ENUM ('New', 'Contacted', 'Closed');
CREATE TYPE inquiry_source AS ENUM ('contact_form', 'whatsapp');

-- Create agents table
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  photo TEXT,
  bio TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  email TEXT,
  years_of_experience INTEGER NOT NULL,
  specialties TEXT[] NOT NULL,
  username TEXT UNIQUE,
  password_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create properties table
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  additional_details TEXT,
  price DECIMAL NOT NULL,
  category property_category NOT NULL,
  property_type property_type NOT NULL,
  status property_status NOT NULL DEFAULT 'Available',
  size INTEGER NOT NULL,
  bedrooms INTEGER NOT NULL,
  bathrooms INTEGER NOT NULL,
  address TEXT NOT NULL,
  district TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Tawau',
  state TEXT NOT NULL DEFAULT 'Sabah',
  country TEXT NOT NULL DEFAULT 'Malaysia',
  featured_image TEXT,
  images TEXT[] NOT NULL DEFAULT '{}',
  has_parking BOOLEAN NOT NULL DEFAULT FALSE,
  has_furnished BOOLEAN NOT NULL DEFAULT FALSE,
  has_air_con BOOLEAN NOT NULL DEFAULT FALSE,
  has_balcony BOOLEAN,
  has_garden BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  view_count INTEGER NOT NULL DEFAULT 0,
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  
  -- Add search index
  CONSTRAINT price_positive CHECK (price > 0),
  CONSTRAINT size_positive CHECK (size > 0)
);

-- Create inquiries table
CREATE TABLE inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  email TEXT,
  message TEXT NOT NULL,
  status inquiry_status NOT NULL DEFAULT 'New',
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  source inquiry_source NOT NULL DEFAULT 'contact_form'
);

-- Create page_views table
CREATE TABLE page_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  ip_address TEXT,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create seo_metadata table
CREATE TABLE seo_metadata (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  path TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  keywords TEXT[] NOT NULL,
  og_image TEXT,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_properties_category ON properties(category);
CREATE INDEX idx_properties_property_type ON properties(property_type);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_district ON properties(district);
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_agent_id ON properties(agent_id);
CREATE INDEX idx_inquiries_property_id ON inquiries(property_id);
CREATE INDEX idx_inquiries_status ON inquiries(status);
CREATE INDEX idx_page_views_property_id ON page_views(property_id);
CREATE INDEX idx_page_views_timestamp ON page_views(timestamp);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_agents_updated_at
BEFORE UPDATE ON agents
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_properties_updated_at
BEFORE UPDATE ON properties
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_inquiries_updated_at
BEFORE UPDATE ON inquiries
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_seo_metadata_updated_at
BEFORE UPDATE ON seo_metadata
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Insert default agent
INSERT INTO agents (
  name, 
  bio, 
  phone_number, 
  whatsapp_number, 
  email, 
  years_of_experience, 
  specialties
) VALUES (
  'RZ Amin',
  'Property specialist with extensive knowledge of the Tawau real estate market.',
  '+60123456789',
  '60123456789',
  'rzamin@example.com',
  5,
  ARRAY['Residential', 'Commercial', 'Land']
);
