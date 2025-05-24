import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { isFeatured } = await request.json()

    // Update property featured status
    const { error } = await supabase
      .from("properties")
      .update({ is_featured: isFeatured })
      .eq("id", id)

    if (error) {
      console.error("Error updating featured status:", error)
      return NextResponse.json(
        { error: "Failed to update featured status" },
        { status: 500 }
      )
    }

    // Revalidate cache
    revalidatePath("/admin/properties")
    revalidatePath("/")
    revalidatePath("/properties")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in featured status update API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
