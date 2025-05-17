"use server"

import { cookies } from "next/headers"
import { supabase } from "@/lib/supabase"
// import bcrypt from "bcrypt" - Not edge runtime compatible

// Simple password hashing and verification functions
async function hashPassword(password: string): Promise<string> {
  // In production, use bcrypt. For now, use a simple hash
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "RZAmin-Salt-Value");
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
}

async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  // In production, use bcrypt.compare. For now, use the simple hash
  const hashedInput = await hashPassword(password);
  return hashedInput === hashedPassword;
}

/**
 * Login the admin user
 */
export async function loginAdmin(username: string, password: string) {
  try {
    // Fetch the agent with the given username
    const { data: agent, error } = await supabase
      .from("agents")
      .select("id, name, username, password_hash")
      .eq("username", username)
      .single()

    if (error || !agent) {
      console.log("Agent not found or error:", error)
      return { success: false, message: "Invalid username or password" }
    }

    // If there's no password hash set yet, and this is the default agent, allow setting up the password
    if (!agent.password_hash && username === "admin") {
      // Create a password hash
      // In production, use bcrypt here but for now use a simple hash
      const hashedPassword = await hashPassword(password)
      
      // Update the agent with the new password hash and username
      const { error: updateError } = await supabase
        .from("agents")
        .update({ 
          password_hash: hashedPassword,
          username: username 
        })
        .eq("id", agent.id)

      if (updateError) {
        console.error("Error setting password:", updateError)
        return { success: false, message: "Failed to set password" }
      }

      // Set auth cookie
      const cookieStore = await cookies()
      await cookieStore.set("admin_session", agent.id, {
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/"
      })

      return { success: true }
    }

    // Check password
    if (!agent.password_hash) {
      return { success: false, message: "Password not set for this account" }
    }

    // In production use bcrypt.compare, but for now use a simpler check
    const passwordMatch = await verifyPassword(password, agent.password_hash)
    if (!passwordMatch) {
      return { success: false, message: "Invalid username or password" }
    }

    // Set auth cookie
    const cookieStore = await cookies()
    await cookieStore.set("admin_session", agent.id, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/"
    })

    return { success: true }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, message: "An unexpected error occurred" }
  }
}

/**
 * Check if the user is logged in
 */
export async function checkAdminAuth() {
  const cookieStore = await cookies()
  const adminSession = await cookieStore.get("admin_session")

  if (!adminSession?.value) {
    return { authenticated: false }
  }

  try {
    // Check if agent with this ID exists
    const { data: agent, error } = await supabase
      .from("agents")
      .select("id, name")
      .eq("id", adminSession.value)
      .single()

    if (error || !agent) {
      return { authenticated: false }
    }

    return { authenticated: true, agent }
  } catch (error) {
    console.error("Auth check error:", error)
    return { authenticated: false }
  }
}

/**
 * Logout the admin user
 */
export async function logoutAdmin() {
  const cookieStore = cookies()
  cookieStore.delete("admin_session")
  return { success: true }
}
