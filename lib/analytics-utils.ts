import { supabase } from "./supabase"
import { isAdminUser } from "./admin-utils"

/**
 * Log a page view if the user is not an admin
 */
export async function logPageView(page: string, propertyId?: string): Promise<void> {
  try {
    const isAdmin = await isAdminUser()
    
    if (!isAdmin) {
      await supabase.from("page_views").insert({
        page,
        property_id: propertyId || null,
      })
    }
  } catch (error) {
    console.error('Error logging page view:', error)
  }
}

/**
 * Increment property view count if user is not admin
 */
export async function incrementPropertyViews(propertyId: string): Promise<void> {
  try {
    const isAdmin = await isAdminUser()
    
    if (!isAdmin) {
      await supabase
        .from("properties")
        .update({ 
          view_count: supabase.sql`view_count + 1`
        })
        .eq("id", propertyId)
    }
  } catch (error) {
    console.error('Error incrementing property views:', error)
  }
}
