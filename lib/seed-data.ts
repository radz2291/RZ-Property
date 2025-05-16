import { supabase } from "./supabase"

export async function seedDatabase() {
  try {
    console.log("Starting database seeding...")

    // First, ensure the default agent exists
    const { data: existingAgent, error: agentCheckError } = await supabase
      .from("agents")
      .select("id")
      .eq("name", "RZ Amin")
      .limit(1)

    if (agentCheckError) {
      console.error("Error checking for default agent:", agentCheckError)
      return { success: false, message: `Error checking for default agent: ${agentCheckError.message}` }
    }

    let agentId: string

    if (!existingAgent || existingAgent.length === 0) {
      // Agent doesn't exist, create it
      console.log("Default agent not found, creating...")

      const { data: newAgent, error: createAgentError } = await supabase
        .from("agents")
        .insert({
          name: "RZ Amin",
          bio: "Property specialist with extensive knowledge of the Tawau real estate market.",
          phone_number: "+60123456789",
          whatsapp_number: "60123456789",
          email: "rzamin@example.com",
          years_of_experience: 5,
          specialties: ["Residential", "Commercial", "Land"],
        })
        .select("id")
        .single()

      if (createAgentError) {
        console.error("Error creating default agent:", createAgentError)
        return { success: false, message: `Error creating default agent: ${createAgentError.message}` }
      }

      if (!newAgent) {
        console.error("Agent created but no ID returned")
        return { success: false, message: "Agent created but no ID returned" }
      }

      agentId = newAgent.id
      console.log("Created new agent with ID:", agentId)
    } else {
      agentId = existingAgent[0].id
      console.log("Using existing agent with ID:", agentId)
    }

    // Check if properties already exist
    const { count: propertyCount, error: countError } = await supabase
      .from("properties")
      .select("*", { count: "exact", head: true })

    if (countError) {
      console.error("Error checking property count:", countError)
      return { success: false, message: `Error checking property count: ${countError.message}` }
    }

    if (propertyCount && propertyCount > 0) {
      console.log(`${propertyCount} properties already exist, skipping seed`)
      return { success: true, message: "Properties already exist, skipping seed" }
    }

    // Sample properties
    const properties = [
      {
        title: "Spacious Family Home in Taman Megah",
        description:
          "A beautiful and spacious family home located in the heart of Taman Megah. This property features a modern design with ample natural light, a well-maintained garden, and a spacious living area perfect for family gatherings.",
        additional_details:
          "Recently renovated with new flooring and fresh paint throughout. The property includes a covered parking area and is located within walking distance to local amenities including schools, shops, and public transport.",
        price: 350000,
        category: "For Sale",
        property_type: "Residential",
        status: "Available",
        size: 1500,
        bedrooms: 3,
        bathrooms: 2,
        address: "Jalan Megah 12, Taman Megah",
        district: "Taman Megah",
        city: "Tawau",
        state: "Sabah",
        country: "Malaysia",
        featured_image: "/placeholder.svg?height=400&width=600",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        has_parking: true,
        has_furnished: true,
        has_air_con: true,
        has_balcony: true,
        has_garden: true,
        agent_id: agentId,
      },
      {
        title: "Modern Apartment in City Center",
        description:
          "A stylish and modern apartment located in the heart of Tawau city center. Perfect for young professionals or small families looking for convenience and comfort.",
        price: 280000,
        category: "For Sale",
        property_type: "Residential",
        status: "Available",
        size: 900,
        bedrooms: 2,
        bathrooms: 1,
        address: "Block A-12-3, Menara City",
        district: "City Center",
        city: "Tawau",
        state: "Sabah",
        country: "Malaysia",
        featured_image: "/placeholder.svg?height=400&width=600",
        images: ["/placeholder.svg?height=600&width=800", "/placeholder.svg?height=600&width=800"],
        has_parking: true,
        has_furnished: false,
        has_air_con: true,
        agent_id: agentId,
      },
      {
        title: "Cozy Studio for Rent",
        description:
          "A cozy and well-maintained studio apartment available for rent. Ideal for students or working professionals.",
        price: 800,
        category: "For Rent",
        property_type: "Residential",
        status: "Available",
        size: 500,
        bedrooms: 1,
        bathrooms: 1,
        address: "Unit 5, Tawau Heights",
        district: "Fajar",
        city: "Tawau",
        state: "Sabah",
        country: "Malaysia",
        featured_image: "/placeholder.svg?height=400&width=600",
        images: ["/placeholder.svg?height=600&width=800", "/placeholder.svg?height=600&width=800"],
        has_parking: false,
        has_furnished: true,
        has_air_con: true,
        agent_id: agentId,
      },
    ]

    console.log("Inserting sample properties...")

    // Insert properties one by one to better handle errors
    for (const property of properties) {
      const { error: insertError } = await supabase.from("properties").insert(property)

      if (insertError) {
        console.error("Error inserting property:", insertError)
        return { success: false, message: `Error inserting property: ${insertError.message}` }
      }
    }

    console.log("Database seeded successfully")
    return { success: true, message: "Database seeded successfully" }
  } catch (error) {
    console.error("Error in seedDatabase:", error)
    return { success: false, message: `Error in seedDatabase: ${(error as Error).message}` }
  }
}
