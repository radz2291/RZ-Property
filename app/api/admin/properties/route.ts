import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("properties")
      .select(`
        id,
        title,
        district,
        city,
        category,
        status,
        is_featured
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching properties:", error)
      return NextResponse.json(
        { error: "Failed to fetch properties" },
        { status: 500 }
      )
    }

    // Map database fields to frontend format
    const properties = data.map(property => ({
      id: property.id,
      title: property.title,
      district: property.district,
      city: property.city,
      category: property.category,
      status: property.status,
      isFeatured: property.is_featured
    }))

    return NextResponse.json(properties)
  } catch (error) {
    console.error("Error in properties API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
