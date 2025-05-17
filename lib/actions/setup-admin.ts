"use server"

import { getSupabaseClient } from "@/lib/supabase"

export async function setupInitialAdmin() {
  try {
    // Get the default agent
    const supabase = getSupabaseClient()
    // Get the first agent (don't rely on a specific name)
    const { data: agent, error } = await supabase
      .from("agents")
      .select("id, username")
      .order("created_at", { ascending: true })
      .limit(1)
      .single()

    if (error || !agent) {
      console.error("Error fetching default agent:", error)
      return { success: false, message: "Error fetching default agent" }
    }

    // Only update if username is not already set
    if (!agent.username) {
      // Update with default admin username
      const { error: updateError } = await supabase
        .from("agents")
        .update({ username: "admin" })
        .eq("id", agent.id)

      if (updateError) {
        console.error("Error setting default username:", updateError)
        return { success: false, message: "Error setting default username" }
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in setupInitialAdmin:", error)
    return { success: false, message: "An unexpected error occurred" }
  }
}
