"use server"

import { revalidatePath } from "next/cache"
import { supabase } from "./supabase"
import { initializeDatabase } from "./init-db"
import { initializeDatabaseDirect } from "./init-db-direct"
import { initializeDatabaseSimple } from "./init-db-simple"

export async function submitContactForm(formData: FormData) {
  const name = formData.get("name") as string
  const phone = formData.get("phone") as string
  const email = formData.get("email") as string
  const message = formData.get("message") as string

  // Validate the data
  if (!name || !phone || !message) {
    throw new Error("Missing required fields")
  }

  // Insert contact message into database
  const { error } = await supabase.from("inquiries").insert({
    name,
    phone_number: phone,
    email: email || null,
    message,
    property_id: null, // Now we can use null for general contacts
    source: "contact_page",
  })

  if (error) {
    console.error("Error submitting contact form:", error)
    throw new Error("Failed to submit message")
  }

  // Revalidate the contact page
  revalidatePath(`/contact`)

  return { success: true }
}

export async function submitInquiry(formData: FormData, propertyId: string) {
  const name = formData.get("name") as string
  const phone = formData.get("phone") as string
  const email = formData.get("email") as string
  const message = formData.get("message") as string

  // Validate the data
  if (!name || !phone || !message || !propertyId) {
    throw new Error("Missing required fields")
  }

  // Insert inquiry into database
  const { error } = await supabase.from("inquiries").insert({
    name,
    phone_number: phone,
    email: email || null,
    message,
    property_id: propertyId,
    source: "contact_form",
  })

  if (error) {
    console.error("Error submitting inquiry:", error)
    throw new Error("Failed to submit inquiry")
  }

  // Revalidate the property page to update any UI that depends on this data
  revalidatePath(`/properties/${propertyId}`)

  return { success: true }
}

export async function logPageView(page: string, propertyId?: string) {
  const { error } = await supabase.from("page_views").insert({
    page,
    property_id: propertyId || null,
  })

  if (error) {
    console.error("Error logging page view:", error)
  }

  return { success: !error }
}

export { initializeDatabase, initializeDatabaseDirect, initializeDatabaseSimple }
