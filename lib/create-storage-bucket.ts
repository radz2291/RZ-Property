"use server"

import { supabase } from "./supabase"

export async function createStorageBucket() {
  try {
    console.log("Checking for storage bucket...")

    // Check if the bucket already exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()

    if (listError) {
      console.error("Error listing buckets:", listError)
      return { success: false, message: "Error listing buckets" }
    }

    const bucketExists = buckets.some((bucket) => bucket.name === "property-images")
    console.log("Bucket exists:", bucketExists)

    if (!bucketExists) {
      console.log("Creating storage bucket...")
      // Create the bucket
      const { error: createError } = await supabase.storage.createBucket("property-images", {
        public: true,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ["image/png", "image/jpeg", "image/webp", "image/gif"],
      })

      if (createError) {
        console.error("Error creating bucket:", createError)
        return { success: false, message: "Error creating bucket" }
      }

      console.log("Storage bucket created successfully")
      return { success: true, message: "Storage bucket created successfully" }
    }

    console.log("Storage bucket already exists")
    return { success: true, message: "Storage bucket already exists" }
  } catch (error) {
    console.error("Error in createStorageBucket:", error)
    return { success: false, message: "An unexpected error occurred" }
  }
}
