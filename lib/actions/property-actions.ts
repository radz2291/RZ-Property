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

    // Redirect to the property page
    redirect(`/admin/properties/${data.id}`)
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

    // Redirect to the property page
    redirect(`/admin/properties/${id}`)
  } catch (error) {
    console.error("Error in updateProperty:", error)
    return { success: false, message: "An unexpected error occurred" }
  }
}

export async function deleteProperty(id: string) {
  try {
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

    // Delete images from storage bucket
    if (property) {
      const imagesToDelete: string[] = []

      // Add featured image to deletion list if it exists
      if (property.featured_image) {
        try {
          // Logging the full URL for debugging
          console.log('Featured image URL:', property.featured_image)
          
          // Extract the filename directly - the URL structure is typically:
          // https://*.supabase.co/storage/v1/object/public/property-images/1747405820682-RZ01.jpg
          const filename = property.featured_image.split('/property-images/').pop()
          
          if (filename) {
            console.log('Extracted featured image filename:', filename)
            imagesToDelete.push(filename)
          }
        } catch (e) {
          console.error('Error extracting featured image filename:', e)
        }
      }

      // Add additional images to deletion list
      if (property.images && Array.isArray(property.images)) {
        property.images.forEach((imageUrl, index) => {
          try {
            // Logging the full URL for debugging
            console.log(`Image ${index} URL:`, imageUrl)
            
            // Extract the filename directly
            const filename = imageUrl.split('/property-images/').pop()
            
            if (filename) {
              console.log(`Extracted image ${index} filename:`, filename)
              imagesToDelete.push(filename)
            }
          } catch (e) {
            console.error(`Error extracting filename for image ${index}:`, imageUrl, e)
          }
        })
      }

      console.log("Files to delete from storage:", imagesToDelete)

      // Delete images from storage bucket one by one for better error handling
      if (imagesToDelete.length > 0) {
        for (const filename of imagesToDelete) {
          try {
            console.log(`Attempting to delete file: ${filename}`)
            const { data, error: storageError } = await supabase.storage
              .from("property-images")
              .remove([filename])
            
            if (storageError) {
              console.error(`Error deleting file ${filename}:`, storageError)
            } else {
              console.log(`Successfully deleted file: ${filename}`, data)
            }
          } catch (e) {
            console.error(`Exception when deleting file ${filename}:`, e)
          }
        }
      }
    }

    // Delete the property record from the database
    const { error } = await supabase.from("properties").delete().eq("id", id)

    if (error) {
      console.error("Error deleting property:", error)
      return { success: false, message: "Error deleting property" }
    }

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
