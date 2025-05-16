"use server";

import { supabase } from "../supabase";
import * as fs from 'fs';
import * as path from 'path';

export async function setupStoragePolicies() {
  try {
    console.log("Setting up storage policies...");
    
    // Read the SQL file
    const sqlFilePath = path.join(process.cwd(), 'lib', 'sql', 'storage-policies.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');

    // Execute the SQL
    const { error } = await supabase.rpc('exec_sql', {
      sql_query: sql
    });

    if (error) {
      console.error("Error setting up storage policies:", error);
      return { success: false, message: "Error setting up storage policies" };
    }

    console.log("Storage policies set up successfully");
    return { success: true, message: "Storage policies set up successfully" };
  } catch (error) {
    console.error("Error in setupStoragePolicies:", error);
    return { success: false, message: "An unexpected error occurred" };
  }
}
