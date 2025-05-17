-- Create site_content table
CREATE TABLE site_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  background_image TEXT,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add trigger for updated_at
CREATE TRIGGER update_site_content_updated_at
BEFORE UPDATE ON site_content
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Insert default hero content
INSERT INTO site_content (
  section,
  title,
  description,
  background_image,
  data
) VALUES (
  'hero',
  'Find Your Dream Property in Tawau',
  'Discover a wide range of residential and commercial properties for sale and rent in Tawau, Sabah.',
  '/hero-bg.webp',
  '{
    "primary_button_text": "Browse Properties",
    "primary_button_url": "/properties",
    "secondary_button_text": "Contact Agent",
    "secondary_button_url": "/contact"
  }'::jsonb
);

-- Insert default FAQ content
INSERT INTO site_content (
  section,
  title,
  description,
  data
) VALUES (
  'faq',
  'Frequently Asked Questions',
  NULL,
  '[
    {
      "question": "How do I schedule a property viewing?",
      "answer": "You can schedule a viewing by contacting RZ Amin directly through the contact form on any property listing, or by calling the provided phone number. Alternatively, you can send a message via WhatsApp for a quick response."
    },
    {
      "question": "What areas in Tawau do you cover?",
      "answer": "We cover all residential and commercial areas in Tawau, including Taman Megah, Fajar, Taman Sri, Bukit, and surrounding districts. Our extensive local knowledge ensures we can help you find properties in your preferred location."
    },
    {
      "question": "How quickly can I move into a rental property?",
      "answer": "The timeline depends on the property's current status and the completion of necessary paperwork. Typically, you can move in within 2-4 weeks after signing the rental agreement and paying the required deposits. For properties marked as \"Ready to Move In,\" the process can be expedited."
    },
    {
      "question": "What documents do I need when buying a property?",
      "answer": "When purchasing a property, you'll need identification documents (IC/passport), proof of income (salary slips or tax returns), bank statements, and sometimes a letter of employment. For financing, additional documents may be required by your bank or financial institution. We can guide you through the entire documentation process."
    },
    {
      "question": "Do you help with property financing?",
      "answer": "While we don't provide financing directly, we can connect you with trusted financial advisors and banks that offer competitive mortgage rates. We can also help you understand the financing options available for different property types and guide you through the loan application process."
    }
  ]'::jsonb
);
