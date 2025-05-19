export interface Property {
  id: string
  title: string
  description: string
  additionalDetails?: string
  price: number
  category: "For Sale" | "For Rent"
  propertyType: "Residential" | "Commercial" | "Land"
  status: "Available" | "Pending" | "Sold" | "Rented"
  slug: string

  // Essential details
  size: number
  bedrooms: number
  bathrooms: number

  // Location
  address: string
  district: string
  city: string
  state: string

  // Media
  featuredImage?: string
  images: string[]

  // Amenities
  hasParking: boolean
  hasFurnished: boolean
  hasAirCon: boolean
  hasBalcony?: boolean
  hasGarden?: boolean

  // Metadata
  createdAt: string
  updatedAt: string
  viewCount: number

  // Relations
  agent: Agent
}

export interface PropertyFormValues {
  title: string
  description: string
  additionalDetails?: string
  price: number
  category: "For Sale" | "For Rent"
  propertyType: "Residential" | "Commercial" | "Land"
  status: "Available" | "Pending" | "Sold" | "Rented"
  slug?: string
  size: number
  bedrooms: number
  bathrooms: number
  address: string
  district: string
  city: string
  state: string
  country: string
  featuredImage?: File | null
  additionalImages?: File[]
  hasParking: boolean
  hasFurnished: boolean
  hasAirCon: boolean
  hasBalcony: boolean
  hasGarden: boolean
}

export interface Agent {
  id: string
  name: string
  photo?: string
  bio: string
  phoneNumber: string
  whatsappNumber: string
  email?: string
  yearsOfExperience: number
  specialties: string[]
}

export interface Inquiry {
  id: string
  name: string
  phoneNumber: string
  email?: string
  message: string
  status: "New" | "Contacted" | "Closed"
  propertyId: string
  createdAt: string
  source: "contact_form" | "whatsapp"
}

export interface PageView {
  id: string
  page: string
  referrer?: string
  userAgent?: string
  ipAddress?: string
  propertyId?: string
  timestamp: string
}

export interface SEOMetadata {
  id: string
  path: string
  title: string
  description: string
  keywords: string[]
  ogImage?: string
  propertyId?: string
  createdAt: string
  updatedAt: string
}
