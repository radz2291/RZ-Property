import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { supabase } from "./supabase"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generates a URL-friendly slug from a string
 * @param text The text to convert to a slug
 * @returns A URL-friendly slug
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading and trailing hyphens
    .replace(/-{2,}/g, '-') // Replace multiple hyphens with a single one
}

/**
 * Ensures a slug is unique by appending a number if necessary
 * @param baseSlug The original slug
 * @param existingPropertyId Optional ID of the property being updated (to exclude from uniqueness check)
 * @returns A unique slug
 */
export async function ensureUniqueSlug(baseSlug: string, existingPropertyId?: string): Promise<string> {
  let slug = baseSlug;
  let counter = 0;
  let isUnique = false;
  
  while (!isUnique) {
    // Check if slug exists in database
    const query = supabase
      .from('properties')
      .select('id')
      .eq('slug', slug)
    
    // If we're updating an existing property, exclude it from the check
    if (existingPropertyId) {
      query.neq('id', existingPropertyId)
    }
    
    const { data } = await query
    
    if (data && data.length > 0) {
      // Slug exists, append counter and try again
      counter++
      slug = `${baseSlug}-${counter}`
    } else {
      isUnique = true
    }
  }
  
  return slug
}
