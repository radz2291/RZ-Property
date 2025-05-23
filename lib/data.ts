import { supabase } from "./supabase"
import type { Property, Agent } from "./types"

export async function getFeaturedProperties(): Promise<Property[]> {
  const { data, error } = await supabase
    .from("properties")
    .select(`
      id,
      title,
      slug,
      price,
      category,
      status,
      bedrooms,
      bathrooms,
      size,
      district,
      city,
      featured_image,
      property_type,
      created_at,
      agent:agent_id (id, name)
    `)
    .not("status", "in", "(Hidden,Not Available)")
    .order("created_at", { ascending: false })
    .limit(4)

  if (error) {
    console.error("Error fetching featured properties:", error)
    return []
  }

  return data.map(mapPropertyFromDb)
}

export async function getAllProperties(filters?: {
  category?: string
  propertyType?: string
  sort?: string
  minPrice?: string
  maxPrice?: string
  features?: Record<string, boolean>
  search?: string
  includeHidden?: boolean
}): Promise<Property[]> {
  let query = supabase.from("properties").select(`
      id,
      title,
      slug,
      price,
      category,
      status,
      bedrooms,
      bathrooms,
      size,
      district,
      city,
      featured_image,
      property_type,
      created_at,
      has_parking,
      has_furnished,
      has_air_con,
      agent:agent_id (id, name)
    `)

  // Filter out hidden and not available properties for public views
  if (!filters?.includeHidden) {
    query = query.not("status", "in", "(Hidden,Not Available)")
  }

  // Apply filters
  if (filters?.category) {
    query = query.eq("category", filters.category)
  }

  if (filters?.propertyType) {
    query = query.eq("property_type", filters.propertyType)
  }

  if (filters?.minPrice) {
    query = query.gte("price", Number.parseFloat(filters.minPrice))
  }

  if (filters?.maxPrice) {
    query = query.lte("price", Number.parseFloat(filters.maxPrice))
  }

  // Apply feature filters
  if (filters?.features) {
    Object.entries(filters.features).forEach(([key, value]) => {
      if (value) {
        query = query.eq(key, true)
      }
    })
  }

  // Apply search filter (if search query is provided)
  if (filters?.search) {
    query = query.or(
      `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,address.ilike.%${filters.search}%,district.ilike.%${filters.search}%`
    )
  }

  // Apply sorting
  if (filters?.sort) {
    switch (filters.sort) {
      case "price-low":
        query = query.order("price", { ascending: true })
        break
      case "price-high":
        query = query.order("price", { ascending: false })
        break
      case "size":
        query = query.order("size", { ascending: false })
        break
      case "newest":
      default:
        query = query.order("created_at", { ascending: false })
    }
  } else {
    query = query.order("created_at", { ascending: false })
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching properties:", error)
    return []
  }

  return data.map(mapPropertyFromDb)
}

export async function getPropertyById(id: string): Promise<Property | null> {
  const { data, error } = await supabase
    .from("properties")
    .select(`
      *,
      agent:agent_id (*)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching property:", error)
    return null
  }

  // Increment view count
  await supabase
    .from("properties")
    .update({ view_count: data.view_count + 1 })
    .eq("id", id)

  // Log page view
  await supabase.from("page_views").insert({
    page: `/properties/${data.slug || id}`,
    property_id: id,
  })

  return mapPropertyFromDb(data)
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  const { data, error } = await supabase
    .from("properties")
    .select(`
      *,
      agent:agent_id (*)
    `)
    .eq("slug", slug)
    .single()

  if (error) {
    console.error("Error fetching property by slug:", error)
    return null
  }

  // Increment view count
  await supabase
    .from("properties")
    .update({ view_count: data.view_count + 1 })
    .eq("id", data.id)

  // Log page view
  await supabase.from("page_views").insert({
    page: `/properties/${slug}`,
    property_id: data.id,
  })

  return mapPropertyFromDb(data)
}

export async function getSimilarProperties(property: Property): Promise<Property[]> {
  const { data, error } = await supabase
    .from("properties")
    .select(`
      *,
      agent:agent_id (*)
    `)
    .eq("category", property.category)
    .eq("property_type", property.propertyType)
    .not("status", "in", "(Hidden,Not Available)")
    .neq("id", property.id)
    .limit(3)

  if (error) {
    console.error("Error fetching similar properties:", error)
    return []
  }

  return data.map(mapPropertyFromDb)
}

export async function getAgentById(id: string): Promise<Agent | null> {
  const { data, error } = await supabase.from("agents").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching agent:", error)
    return null
  }

  return mapAgentFromDb(data)
}

// Helper function to map database property to our Property type
function mapPropertyFromDb(dbProperty: any): Property {
  return {
    id: dbProperty.id,
    title: dbProperty.title,
    description: dbProperty.description,
    additionalDetails: dbProperty.internal_details, // Mapped from internal_details in DB
    price: dbProperty.price,
    category: dbProperty.category,
    propertyType: dbProperty.property_type,
    status: dbProperty.status,
    slug: dbProperty.slug,
    size: dbProperty.size,
    bedrooms: dbProperty.bedrooms,
    bathrooms: dbProperty.bathrooms,
    address: dbProperty.address,
    district: dbProperty.district,
    city: dbProperty.city,
    state: dbProperty.state,
    featuredImage: dbProperty.featured_image,
    images: dbProperty.images,
    imageMetadata: dbProperty.image_metadata || [],
    hasParking: dbProperty.has_parking,
    hasFurnished: dbProperty.has_furnished,
    hasAirCon: dbProperty.has_air_con,
    hasBalcony: dbProperty.has_balcony,
    hasGarden: dbProperty.has_garden,
    createdAt: dbProperty.created_at,
    updatedAt: dbProperty.updated_at,
    viewCount: dbProperty.view_count,
    agent: mapAgentFromDb(dbProperty.agent),
  }
}

// Helper function to map database agent to our Agent type
function mapAgentFromDb(dbAgent: any): Agent {
  return {
    id: dbAgent.id,
    name: dbAgent.name,
    photo: dbAgent.photo,
    bio: dbAgent.bio,
    phoneNumber: dbAgent.phone_number,
    whatsappNumber: dbAgent.whatsapp_number,
    email: dbAgent.email,
    yearsOfExperience: dbAgent.years_of_experience,
    specialties: dbAgent.specialties,
  }
}
