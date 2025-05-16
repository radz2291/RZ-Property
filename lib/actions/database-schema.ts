"use server"

import { supabase } from "./supabase"

export async function modifyInquiriesTable() {
  try {
    // Execute SQL to modify the table
    const { error } = await supabase.rpc("exec_sql", {
      sql_query: `
        -- First drop the foreign key constraint
        ALTER TABLE inquiries 
        DROP CONSTRAINT inquiries_property_id_fkey;
        
        -- Then alter the column to allow NULL values
        ALTER TABLE inquiries 
        ALTER COLUMN property_id DROP NOT NULL;
        
        -- Re-add the foreign key constraint but allow NULL values
        ALTER TABLE inquiries 
        ADD CONSTRAINT inquiries_property_id_fkey 
        FOREIGN KEY (property_id) 
        REFERENCES properties(id) 
        ON DELETE CASCADE;
      `,
    })

    if (error) {
      console.error("Error modifying inquiries table:", error)
      return { success: false, message: error.message }
    }

    console.log("Successfully modified inquiries table to allow NULL property_id")
    return { success: true, message: "Successfully updated database schema" }
  } catch (error) {
    console.error("Error in modifyInquiriesTable:", error)
    return { success: false, message: (error as Error).message }
  }
}
