"use server"

import { revalidatePath } from "next/cache"
import { getSupabaseClient } from "@/lib/supabase"

// Type definitions for site content
export type HeroContent = {
  title: string
  description: string
  background_image: string | null
  data: {
    primary_button_text: string
    primary_button_url: string
    secondary_button_text: string
    secondary_button_url: string
  }
}

export type FAQItem = {
  question: string
  answer: string
}

export type FAQContent = {
  title: string
  description: string | null
  data: FAQItem[]
}

export type AgentProfile = {
  id: string
  name: string
  photo: string | null
  bio: string
  phone_number: string
  whatsapp_number: string
  email: string | null
  years_of_experience: number
  specialties: string[]
}

// Fetch site content by section
export async function getSiteContent(section: string) {
  const supabase = getSupabaseClient()
  
  const { data, error } = await supabase
    .from("site_content")
    .select("*")
    .eq("section", section)
    .single()
  
  if (error) {
    console.error(`Error fetching ${section} content:`, error)
    return null
  }
  
  return data
}

// Update hero content
export async function updateHeroContent(content: {
  title: string
  description: string
  background_image?: string | null
  primary_button_text: string
  primary_button_url: string
  secondary_button_text: string
  secondary_button_url: string
}) {
  const supabase = getSupabaseClient()
  
  const { error } = await supabase
    .from("site_content")
    .update({
      title: content.title,
      description: content.description,
      background_image: content.background_image,
      data: {
        primary_button_text: content.primary_button_text,
        primary_button_url: content.primary_button_url,
        secondary_button_text: content.secondary_button_text,
        secondary_button_url: content.secondary_button_url
      }
    })
    .eq("section", "hero")
  
  if (error) {
    console.error("Error updating hero content:", error)
    throw new Error("Failed to update hero content")
  }
  
  revalidatePath("/")
  return { success: true }
}

// Update FAQ content
export async function updateFAQContent(content: {
  title: string
  description?: string | null
  faqs: FAQItem[]
}) {
  const supabase = getSupabaseClient()
  
  const { error } = await supabase
    .from("site_content")
    .update({
      title: content.title,
      description: content.description,
      data: content.faqs
    })
    .eq("section", "faq")
  
  if (error) {
    console.error("Error updating FAQ content:", error)
    throw new Error("Failed to update FAQ content")
  }
  
  revalidatePath("/")
  return { success: true }
}

// Get agent profile
export async function getAgentProfile() {
  const supabase = getSupabaseClient()
  
  const { data, error } = await supabase
    .from("agents")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(1)
    .single()
  
  if (error) {
    console.error("Error fetching agent profile:", error)
    return null
  }
  
  return data
}

// Update agent profile
export async function updateAgentProfile(agent: {
  name: string
  photo?: string | null
  bio: string
  phone_number: string
  whatsapp_number: string
  email?: string | null
  years_of_experience: number
  specialties: string[]
}) {
  const supabase = getSupabaseClient()
  
  // Get the first agent (since we only have one)
  const { data: existingAgent } = await supabase
    .from("agents")
    .select("id")
    .order("created_at", { ascending: true })
    .limit(1)
    .single()
  
  if (!existingAgent) {
    throw new Error("Agent not found")
  }
  
  const { error } = await supabase
    .from("agents")
    .update({
      name: agent.name,
      photo: agent.photo,
      bio: agent.bio,
      phone_number: agent.phone_number,
      whatsapp_number: agent.whatsapp_number,
      email: agent.email,
      years_of_experience: agent.years_of_experience,
      specialties: agent.specialties
    })
    .eq("id", existingAgent.id)
  
  if (error) {
    console.error("Error updating agent profile:", error)
    throw new Error("Failed to update agent profile")
  }
  
  revalidatePath("/")
  return { success: true }
}
