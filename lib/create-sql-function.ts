"use server"

import { supabase } from "./supabase"

export async function createSqlFunction() {
  const { error } = await supabase.rpc("exec_sql", {
    sql_query: `
      -- Create a function to execute SQL
      CREATE OR REPLACE FUNCTION exec_sql(sql_query text) RETURNS void AS $$
      BEGIN
        EXECUTE sql_query;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `,
  })

  if (error) {
    console.error("Error creating SQL function:", error)
    return { success: false, message: "Error creating SQL function: " + error.message }
  }

  return { success: true, message: "SQL function created successfully" }
}
