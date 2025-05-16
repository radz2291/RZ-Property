"use server"

import { supabase } from "./supabase"

export async function initializeDatabaseSimple() {
  try {
    console.log("Starting simple database initialization...")

    // Try to insert the default agent directly
    const { data: agent, error: agentError } = await supabase
      .from("agents")
      .upsert(
        {
          name: "RZ Amin",
          bio: "Property specialist with extensive knowledge of the Tawau real estate market.",
          phone_number: "+60123456789",
          whatsapp_number: "60123456789",
          email: "rzamin@example.com",
          years_of_experience: 5,
          specialties: ["Residential", "Commercial", "Land"],
        },
        {
          onConflict: "name",
          ignoreDuplicates: true,
        },
      )
      .select("id")
      .single()

    if (agentError) {
      console.error("Error creating agent:", agentError)
      return {
        success: false,
        message: `Error creating agent: ${agentError.message}`,
      }
    }

    if (!agent) {
      console.error("No agent ID returned")
      return {
        success: false,
        message: "No agent ID returned",
      }
    }

    console.log("Agent created or found with ID:", agent.id)

    // Sample properties
    const properties = [
      {
        title: "Spacious Family Home in Taman Megah",
        description: "A beautiful and spacious family home located in the heart of Taman Megah.",
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
        images: ["/placeholder.svg?height=600&width=800"],
        has_parking: true,
        has_furnished: true,
        has_air_con: true,
        agent_id: agent.id,
      },
    ]

    // Insert a sample property
    const { error: propertyError } = await supabase.from("properties").upsert(properties, {
      onConflict: "title",
      ignoreDuplicates: true,
    })

    if (propertyError) {
      console.error("Error creating property:", propertyError)
      return {
        success: false,
        message: `Error creating property: ${propertyError.message}`,
      }
    }

    return {
      success: true,
      message: "Database initialized successfully",
    }
  } catch (error) {
    console.error("Error in simple initialization:", error)
    return {
      success: false,
      message: `Error in simple initialization: ${(error as Error).message}`,
    }
  }
}
