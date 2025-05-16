"use server"

import { supabase } from "./supabase"
import { seedDatabase } from "./seed-data"

export async function initializeDatabaseDirect() {
  try {
    console.log("Starting database initialization...")

    // First, check if the tables already exist by trying to query the agents table
    const { data: agentsData, error: agentsQueryError } = await supabase.from("agents").select("id").limit(1)

    // If we get a specific error code, it means the table doesn't exist
    const tablesExist = !agentsQueryError || agentsQueryError.code !== "42P01"

    if (!tablesExist) {
      console.log("Tables don't exist, creating schema...")

      try {
        // Create the agents table using raw SQL
        const { error: createAgentsError } = await supabase.rpc("create_agents_table", {})

        if (createAgentsError) {
          console.error("Error creating agents table via RPC:", createAgentsError)

          // Try an alternative approach with direct SQL
          const { error: sqlError } = await supabase.auth.admin.executeSql(`
            CREATE TABLE IF NOT EXISTS public.agents (
              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              name TEXT NOT NULL,
              photo TEXT,
              bio TEXT NOT NULL,
              phone_number TEXT NOT NULL,
              whatsapp_number TEXT NOT NULL,
              email TEXT,
              years_of_experience INTEGER NOT NULL,
              specialties TEXT[] NOT NULL,
              username TEXT UNIQUE,
              password_hash TEXT,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
          `)

          if (sqlError) {
            console.error("Error executing direct SQL:", sqlError)
            return {
              success: false,
              message: "Failed to create tables. Please check Supabase permissions and try again.",
            }
          }
        }

        console.log("Agents table created successfully")
      } catch (err) {
        console.error("Exception during table creation:", err)
        return {
          success: false,
          message: `Exception during table creation: ${(err as Error).message}`,
        }
      }
    } else {
      console.log("Tables already exist, checking for data...")
    }

    // Now try to insert the default agent directly
    try {
      // Check if agent already exists
      const { data: existingAgent } = await supabase.from("agents").select("id").eq("name", "RZ Amin").limit(1)

      if (!existingAgent || existingAgent.length === 0) {
        console.log("Creating default agent...")

        // Insert the default agent
        const { data: agent, error: insertError } = await supabase
          .from("agents")
          .insert({
            name: "RZ Amin",
            bio: "Property specialist with extensive knowledge of the Tawau real estate market.",
            phone_number: "+60123456789",
            whatsapp_number: "60123456789",
            email: "rzamin@example.com",
            years_of_experience: 5,
            specialties: ["Residential", "Commercial", "Land"],
          })
          .select("id")
          .single()

        if (insertError) {
          console.error("Error inserting default agent:", insertError)
          return {
            success: false,
            message: `Failed to create default agent: ${insertError.message}`,
          }
        }

        console.log("Default agent created with ID:", agent?.id)
      } else {
        console.log("Default agent already exists")
      }

      // Seed the database with properties
      console.log("Seeding database with properties...")
      const seedResult = await seedDatabase()

      if (!seedResult.success) {
        return {
          success: false,
          message: "Failed to seed database with properties",
        }
      }

      return {
        success: true,
        message: "Database initialized successfully",
      }
    } catch (err) {
      console.error("Exception during agent creation:", err)
      return {
        success: false,
        message: `Exception during agent creation: ${(err as Error).message}`,
      }
    }
  } catch (error) {
    console.error("Error initializing database:", error)
    return {
      success: false,
      message: `Error initializing database: ${(error as Error).message}`,
    }
  }
}
