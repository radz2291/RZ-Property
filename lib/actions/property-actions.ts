"use server"

import { revalidatePath } from "next/cache"
import { supabase } from "../supabase"
import { redirect } from "next/navigation"

export async function createProperty(formData: FormData) {
  try {
    console.log("Creating property...")

    // Get the agent ID (using the first agent for now)
    const { data: agent, error: agentError } = await supabase.from("agents").select("id").limit(1).single()

    if (agentError) {
      console.error("Error fetching agent:", agentError)
      return { success: false, message: "Error fetching agent" }
    }

    if (!agent) {
      console.error("No agent found")
      return { success: false, message: "No agent found" }
    }

    console.log("Using agent ID:", agent.id)

    // Extract form values
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const additionalDetails = formData.get("additionalDetails") as string
    const price = Number.parseFloat(formData.get("price") as string)
    const category = formData.get("category") as "For Sale" | "For Rent"
    const propertyType = formData.get("propertyType") as "Residential" | "Commercial" | "Land"
    const status = formData.get("status") as "Available" | "Pending" | "Sold" | "Rented"
    const size = Number.parseInt(formData.get("size") as string)
    const bedrooms = Number.parseInt(formData.get("bedrooms") as string)
    const bathrooms = Number.parseInt(formData.get("bathrooms") as string)
    const address = formData.get("address") as string
    const district = formData.get("district") as string
    const city = formData.get("city") as string
    const state = formData.get("state") as string
    const country = (formData.get("country") as string) || "Malaysia"

    // Handle checkboxes
    const hasParking = formData.get("hasParking") === "on"
    const hasFurnished = formData.get("hasFurnished") === "on"
    const hasAirCon = formData.get("hasAirCon") === "on"
    const hasBalcony = formData.get("hasBalcony") === "on"
    const hasGarden = formData.get("hasGarden") === "on"

    // Handle featured image
    const featuredImageFile = formData.get("featuredImage") as File
    let featuredImageUrl = null

    if (featuredImageFile && featuredImageFile.size > 0) {
      console.log("Uploading featured image...")
      const fileName = `${Date.now()}-${featuredImageFile.name}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("property-images")
        .upload(fileName, featuredImageFile)

      if (uploadError) {
        console.error("Error uploading featured image:", uploadError)
        return { success: false, message: "Error uploading featured image" }
      }

      // Get the public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("property-images").getPublicUrl(fileName)

      featuredImageUrl = publicUrl
      console.log("Featured image uploaded:", featuredImageUrl)
    }

    // Handle additional images
    const additionalImagesFiles = formData.getAll("additionalImages") as File[]
    const imageUrls: string[] = []

    for (const file of additionalImagesFiles) {
      if (file && file.size > 0) {
        console.log("Uploading additional image:", file.name)
        const fileName = `${Date.now()}-${file.name}`
        const { error: uploadError } = await supabase.storage.from("property-images").upload(fileName, file)

        if (uploadError) {
          console.error("Error uploading additional image:", uploadError)
          continue
        }

        // Get the public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("property-images").getPublicUrl(fileName)

        imageUrls.push(publicUrl)
        console.log("Additional image uploaded:", publicUrl)
      }
    }

    console.log("Creating property in database...")
    // Create the property
    const { data, error } = await supabase
      .from("properties")
      .insert({
        title,
        description,
        additional_details: additionalDetails || null,
        price,
        category,
        property_type: propertyType,
        status,
        size,
        bedrooms,
        bathrooms,
        address,
        district,
        city,
        state,
        country,
        featured_image: featuredImageUrl,
        images: imageUrls,
        has_parking: hasParking,
        has_furnished: hasFurnished,
        has_air_con: hasAirCon,
        has_balcony: hasBalcony,
        has_garden: hasGarden,
        agent_id: agent.id,
      })
      .select("id")
      .single()

    if (error) {
      console.error("Error creating property:", error)
      return { success: false, message: "Error creating property" }
    }

    console.log("Property created successfully:", data.id)

    // Revalidate the properties page
    revalidatePath("/properties")
    revalidatePath("/admin/properties")

    try {
      // Redirect to the property page
      redirect(`/admin/properties/${data.id}`)
    } catch (redirectError) {
      console.error("Error redirecting:", redirectError)
      // Return success instead of redirecting
      return { success: true, message: "Property created successfully", id: data.id }
    }
  } catch (error) {
    console.error("Error in createProperty:", error)
    return { success: false, message: "An unexpected error occurred" }
  }
}

export async function updateProperty(id: string, formData: FormData) {
  try {
    // Extract form values (similar to createProperty)
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const additionalDetails = formData.get("additionalDetails") as string
    const price = Number.parseFloat(formData.get("price") as string)
    const category = formData.get("category") as "For Sale" | "For Rent"
    const propertyType = formData.get("propertyType") as "Residential" | "Commercial" | "Land"
    const status = formData.get("status") as "Available" | "Pending" | "Sold" | "Rented"
    const size = Number.parseInt(formData.get("size") as string)
    const bedrooms = Number.parseInt(formData.get("bedrooms") as string)
    const bathrooms = Number.parseInt(formData.get("bathrooms") as string)
    const address = formData.get("address") as string
    const district = formData.get("district") as string
    const city = formData.get("city") as string
    const state = formData.get("state") as string
    const country = (formData.get("country") as string) || "Malaysia"

    // Handle checkboxes
    const hasParking = formData.get("hasParking") === "on"
    const hasFurnished = formData.get("hasFurnished") === "on"
    const hasAirCon = formData.get("hasAirCon") === "on"
    const hasBalcony = formData.get("hasBalcony") === "on"
    const hasGarden = formData.get("hasGarden") === "on"

    // Handle featured image
    const featuredImageFile = formData.get("featuredImage") as File
    let featuredImageUrl = formData.get("currentFeaturedImage") as string

    if (featuredImageFile && featuredImageFile.size > 0) {
      const fileName = `${Date.now()}-${featuredImageFile.name}`
      const { error: uploadError } = await supabase.storage.from("property-images").upload(fileName, featuredImageFile)

      if (uploadError) {
        console.error("Error uploading featured image:", uploadError)
        return { success: false, message: "Error uploading featured image" }
      }

      // Get the public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("property-images").getPublicUrl(fileName)

      featuredImageUrl = publicUrl
    }

    // Handle additional images
    const additionalImagesFiles = formData.getAll("additionalImages") as File[]
    const currentImages = JSON.parse((formData.get("currentImages") as string) || "[]") as string[]
    const imageUrls: string[] = [...currentImages]

    for (const file of additionalImagesFiles) {
      if (file && file.size > 0) {
        const fileName = `${Date.now()}-${file.name}`
        const { error: uploadError } = await supabase.storage.from("property-images").upload(fileName, file)

        if (uploadError) {
          console.error("Error uploading additional image:", uploadError)
          continue
        }

        // Get the public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("property-images").getPublicUrl(fileName)

        imageUrls.push(publicUrl)
      }
    }

    // Update the property
    const { error } = await supabase
      .from("properties")
      .update({
        title,
        description,
        additional_details: additionalDetails || null,
        price,
        category,
        property_type: propertyType,
        status,
        size,
        bedrooms,
        bathrooms,
        address,
        district,
        city,
        state,
        country,
        featured_image: featuredImageUrl,
        images: imageUrls,
        has_parking: hasParking,
        has_furnished: hasFurnished,
        has_air_con: hasAirCon,
        has_balcony: hasBalcony,
        has_garden: hasGarden,
      })
      .eq("id", id)

    if (error) {
      console.error("Error updating property:", error)
      return { success: false, message: "Error updating property" }
    }

    // Revalidate the properties page
    revalidatePath("/properties")
    revalidatePath(`/properties/${id}`)
    revalidatePath("/admin/properties")
    revalidatePath(`/admin/properties/${id}`)

    try {
      // Redirect to the property page
      redirect(`/admin/properties/${id}`)
    } catch (redirectError) {
      console.error("Error redirecting:", redirectError)
      // Return success instead of redirecting
      return { success: true, message: "Property updated successfully", id: id }
    }
  } catch (error) {
    console.error("Error in updateProperty:", error)
    return { success: false, message: "An unexpected error occurred" }
  }
}

export async function deleteProperty(id: string) {
  try {
    console.log("Starting property deletion process for ID:", id)
    
    // First, get the property details to fetch image URLs
    const { data: property, error: fetchError } = await supabase
      .from("properties")
      .select("featured_image, images")
      .eq("id", id)
      .single()

    if (fetchError) {
      console.error("Error fetching property details:", fetchError)
      return { success: false, message: "Error fetching property details" }
    }

    // Log the property data for debugging
    console.log("Property image data:", {
      featuredImage: property?.featured_image,
      imageCount: property?.images?.length || 0,
      images: property?.images
    })

    // Delete images from storage bucket
    if (property) {
      // Create direct file paths for deletion
      const imagesToDelete: string[] = []
      
      // For featured image, get just the file name at the end
      if (property.featured_image) {
        try {
          // Example URL: https://xxxx.supabase.co/storage/v1/object/public/property-images/1747405820682-RZ01.jpg
          // We need to extract just: 1747405820682-RZ01.jpg
          const featuredImagePath = property.featured_image.split('/').pop()
          
          if (featuredImagePath) {
            imagesToDelete.push(featuredImagePath)
            console.log("Will delete featured image:", featuredImagePath)
          }
        } catch (e) {
          console.error("Error extracting featured image path:", e)
        }
      }

      // For additional images, get just the file names
      if (property.images && Array.isArray(property.images)) {
        property.images.forEach((imageUrl) => {
          try {
            const imagePath = imageUrl.split('/').pop()
            if (imagePath) {
              imagesToDelete.push(imagePath)
              console.log("Will delete additional image:", imagePath)
            }
          } catch (e) {
            console.error("Error extracting image path:", e)
          }
        })
      }

      // Delete each image one by one
      for (const imagePath of imagesToDelete) {
        try {
          console.log(`Attempting to delete file: ${imagePath}`)
          
          const { data, error: deleteError } = await supabase.storage
            .from("property-images")
            .remove([imagePath])
          
          console.log('Delete response:', { data, error: deleteError, imagePath });
          
          if (deleteError) {
            console.error(`Error deleting file ${imagePath}:`, deleteError)
          } else {
            console.log(`Successfully deleted file: ${imagePath}`, data)
          }
        } catch (e) {
          console.error(`Exception deleting file ${imagePath}:`, e)
        }
      }
    }

    // Delete the property record from the database
    const { error } = await supabase.from("properties").delete().eq("id", id)

    if (error) {
      console.error("Error deleting property:", error)
      return { success: false, message: "Error deleting property" }
    }

    console.log("Successfully deleted property with ID:", id)

    // Revalidate the properties page
    revalidatePath("/properties")
    revalidatePath("/admin/properties")

    // Redirect to the properties page
    redirect("/admin/properties")
  } catch (error) {
    console.error("Error in deleteProperty:", error)
    return { success: false, message: "An unexpected error occurred" }
  }
}
