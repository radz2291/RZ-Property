"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { supabase } from "@/lib/supabase"

export async function updateInquiryStatus(formData: FormData) {
  const id = formData.get("id") as string
  const status = formData.get("status") as string

  if (!id || !status) {
    throw new Error("Missing required fields")
  }

  // Validate status values
  if (!["New", "Contacted", "Closed"].includes(status)) {
    throw new Error("Invalid status value")
  }

  const { error } = await supabase
    .from("inquiries")
    .update({ status })
    .eq("id", id)

  if (error) {
    console.error("Error updating inquiry status:", error)
    throw new Error("Failed to update inquiry status")
  }

  // Revalidate the inquiries pages
  revalidatePath("/admin/inquiries")
  revalidatePath(`/admin/inquiries/${id}`)

  // Redirect back to the inquiry detail page
  redirect(`/admin/inquiries/${id}`)
}

export async function deleteInquiry(formData: FormData) {
  const id = formData.get("id") as string

  if (!id) {
    throw new Error("Missing inquiry ID")
  }

  const { error } = await supabase
    .from("inquiries")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("Error deleting inquiry:", error)
    throw new Error("Failed to delete inquiry")
  }

  // Revalidate the inquiries page
  revalidatePath("/admin/inquiries")

  // Redirect back to the inquiries list
  redirect("/admin/inquiries")
}
