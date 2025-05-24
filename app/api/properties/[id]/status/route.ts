import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { status } = await request.json()

    // Validate status
    const validStatuses = ["Available", "Pending", "Sold", "Rented", "Hidden", "Not Available"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      )
    }

    // Update property status
    const { error } = await supabase
      .from("properties")
      .update({ status })
      .eq("id", id)

    if (error) {
      console.error("Error updating property status:", error)
      return NextResponse.json(
        { error: "Failed to update status" },
        { status: 500 }
      )
    }

    // Revalidate cache
    revalidatePath("/admin/properties")
    revalidatePath("/properties")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in status update API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
