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
    const hasParking = formData.get("hasParking") === "on" || formData.get("hasParking") === "true"
    const hasFurnished = formData.get("hasFurnished") === "on" || formData.get("hasFurnished") === "true"
    const hasAirCon = formData.get("hasAirCon") === "on" || formData.get("hasAirCon") === "true"
    const hasBalcony = formData.get("hasBalcony") === "on" || formData.get("hasBalcony") === "true"
    const hasGarden = formData.get("hasGarden") === "on" || formData.get("hasGarden") === "true"

    // Handle featured image
    const featuredImageFile = formData.get("featuredImage") as File
    let featuredImageUrl = null

    if (featuredImageFile && featuredImageFile.size > 0) {
      console.log("Uploading featured image:", featuredImageFile.name, "Size:", (featuredImageFile.size / 1024 / 1024).toFixed(2), "MB")
      
      try {
        const fileName = `${Date.now()}-${featuredImageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("property-images")
          .upload(fileName, featuredImageFile, {
            cacheControl: "3600",
            upsert: false
          })

        if (uploadError) {
          console.error("Error uploading featured image:", uploadError)
          throw new Error(`Featured image upload failed: ${uploadError.message}`)
        }

        // Get the public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("property-images").getPublicUrl(fileName)

        featuredImageUrl = publicUrl
        console.log("Featured image uploaded successfully:", featuredImageUrl)
      } catch (error) {
        console.error("Error in featured image upload:", error)
        return { success: false, message: "Error uploading featured image. Please try again with a smaller file." }
      }
    }

    // Handle additional images
    const additionalImagesFiles = formData.getAll("additionalImages") as File[]
    const imageUrls: string[] = []
    let additionalImagesError = false

    console.log(`Processing ${additionalImagesFiles.length} additional images`)
    
    if (additionalImagesFiles.length > 0) {
      for (let i = 0; i < additionalImagesFiles.length; i++) {
        const file = additionalImagesFiles[i]
        
        if (file && file.size > 0) {
          console.log(`Uploading image ${i+1}/${additionalImagesFiles.length}: ${file.name}, Size: ${(file.size / 1024 / 1024).toFixed(2)} MB`)
          
          try {
            // Use a safe filename that won't cause issues
            const fileName = `${Date.now()}-${i}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
            
            // Upload with retry logic
            let uploadAttempts = 0
            let uploadSuccess = false
            let uploadError = null
            
            while (uploadAttempts < 3 && !uploadSuccess) {
              uploadAttempts++
              
              try {
                const { data, error } = await supabase.storage
                  .from("property-images")
                  .upload(fileName, file, {
                    cacheControl: "3600",
                    upsert: false
                  })
                  
                if (error) {
                  uploadError = error
                  console.error(`Upload attempt ${uploadAttempts} failed for image ${i+1}:`, error)
                  // Wait a bit before retrying
                  await new Promise(resolve => setTimeout(resolve, 1000))
                } else {
                  uploadSuccess = true
                }
              } catch (err) {
                uploadError = err
                console.error(`Exception in upload attempt ${uploadAttempts} for image ${i+1}:`, err)
                // Wait a bit before retrying
                await new Promise(resolve => setTimeout(resolve, 1000))
              }
            }
            
            if (!uploadSuccess) {
              console.error(`Failed to upload image ${i+1} after ${uploadAttempts} attempts`)
              additionalImagesError = true
              continue
            }

            // Get the public URL
            const {
              data: { publicUrl },
            } = supabase.storage.from("property-images").getPublicUrl(fileName)

            imageUrls.push(publicUrl)
            console.log(`Image ${i+1} uploaded successfully`)
          } catch (error) {
            console.error(`Error processing image ${i+1}:`, error)
            additionalImagesError = true
          }
        }
      }
    }

    console.log("Creating property in database with", imageUrls.length, "additional images")
    
    // Create the property
    const { data, error } = await supabase
      .from("properties")
      .insert({
        title,
        description,
        internal_details: additionalDetails || null, // Use internal_details column name from DB
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
        images: allImageUrls,
        image_metadata: finalImageMetadata,
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
      console.error("Error creating property:", error.message, error.details, error.hint)
      return { success: false, message: `Error creating property: ${error.message}` }
    }

    console.log("Property created successfully:", data.id)

    // Revalidate the properties page
    revalidatePath("/properties")
    revalidatePath("/admin/properties")

    // Add message about images if there were any errors
    let resultMessage = "Property created successfully"
    if (imageUploadError) {
      resultMessage += ", but some images could not be uploaded. You can edit the property to add more images."
    }

    try {
      // Redirect to the property page
      redirect(`/admin/properties/${data.id}`)
    } catch (redirectError) {
      console.error("Error redirecting:", redirectError)
      // Return success instead of redirecting
      return { success: true, message: resultMessage, id: data.id }
    }
  } catch (error) {
    console.error("Error in createProperty:", error)
    return { success: false, message: "An unexpected error occurred. Please try again." }
  }
}

export async function updateProperty(id: string, formData: FormData) {
  try {
    console.log("Updating property:", id)
    
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
    const hasParking = formData.get("hasParking") === "on" || formData.get("hasParking") === "true"
    const hasFurnished = formData.get("hasFurnished") === "on" || formData.get("hasFurnished") === "true"
    const hasAirCon = formData.get("hasAirCon") === "on" || formData.get("hasAirCon") === "true"
    const hasBalcony = formData.get("hasBalcony") === "on" || formData.get("hasBalcony") === "true"
    const hasGarden = formData.get("hasGarden") === "on" || formData.get("hasGarden") === "true"

    // Handle unified image management
    const imageMetadataStr = formData.get("imageMetadata") as string
    const imageMetadata = imageMetadataStr ? JSON.parse(imageMetadataStr) : []
    const newImageFiles = formData.getAll("newImages") as File[]
    
    let featuredImageUrl = null
    const allImageUrls: string[] = []
    const finalImageMetadata: any[] = []
    let imageUploadError = false
    
    console.log(`Processing ${imageMetadata.length} total images (${newImageFiles.length} new files)`)
    
    // Process existing images first
    for (const imgMeta of imageMetadata) {
      if (!imgMeta.url.startsWith('blob:')) {
        // This is an existing image, keep it
        allImageUrls.push(imgMeta.url)
        finalImageMetadata.push({
          url: imgMeta.url,
          isHidden: imgMeta.isHidden,
          isFeatured: imgMeta.isFeatured,
          uploadedAt: imgMeta.uploadedAt,
          order: imgMeta.order
        })
        
        if (imgMeta.isFeatured) {
          featuredImageUrl = imgMeta.url
        }
      }
    }
    
    // Upload new images
    if (newImageFiles.length > 0) {
      for (let i = 0; i < newImageFiles.length; i++) {
        const file = newImageFiles[i]
        
        if (file && file.size > 0) {
          console.log(`Uploading image ${i+1}/${newImageFiles.length}: ${file.name}, Size: ${(file.size / 1024 / 1024).toFixed(2)} MB`)
          
          try {
            const fileName = `${Date.now()}-${i}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
            
            // Upload with retry logic
            let uploadAttempts = 0
            let uploadSuccess = false
            let uploadError = null
            
            while (uploadAttempts < 3 && !uploadSuccess) {
              uploadAttempts++
              
              try {
                const { data, error } = await supabase.storage
                  .from("property-images")
                  .upload(fileName, file, {
                    cacheControl: "3600",
                    upsert: false
                  })
                  
                if (error) {
                  uploadError = error
                  console.error(`Upload attempt ${uploadAttempts} failed for image ${i+1}:`, error)
                  await new Promise(resolve => setTimeout(resolve, 1000))
                } else {
                  uploadSuccess = true
                }
              } catch (err) {
                uploadError = err
                console.error(`Exception in upload attempt ${uploadAttempts} for image ${i+1}:`, err)
                await new Promise(resolve => setTimeout(resolve, 1000))
              }
            }
            
            if (!uploadSuccess) {
              console.error(`Failed to upload image ${i+1} after ${uploadAttempts} attempts`)
              imageUploadError = true
              continue
            }

            // Get the public URL
            const {
              data: { publicUrl },
            } = supabase.storage.from("property-images").getPublicUrl(fileName)

            allImageUrls.push(publicUrl)
            
            // Find corresponding metadata for this new image
            const blobIndex = imageMetadata.findIndex((meta: any, idx: number) => 
              meta.url.startsWith('blob:') && (idx - imageMetadata.filter((m: any, i: number) => i < idx && !m.url.startsWith('blob:')).length) === i
            )
            
            if (blobIndex >= 0) {
              const imgMeta = imageMetadata[blobIndex]
              finalImageMetadata.push({
                url: publicUrl,
                isHidden: imgMeta.isHidden,
                isFeatured: imgMeta.isFeatured,
                uploadedAt: new Date().toISOString(),
                order: imgMeta.order
              })
              
              if (imgMeta.isFeatured) {
                featuredImageUrl = publicUrl
              }
            }
            
            console.log(`Image ${i+1} uploaded successfully`)
          } catch (error) {
            console.error(`Error processing image ${i+1}:`, error)
            imageUploadError = true
          }
        }
      }
    }

    console.log("Updating property in database with", allImageUrls.length, "total images")
    
    // Update the property
    const { error } = await supabase
      .from("properties")
      .update({
        title,
        description,
        internal_details: additionalDetails || null, // Use internal_details column name from DB
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
        images: allImageUrls,
        image_metadata: finalImageMetadata,
        has_parking: hasParking,
        has_furnished: hasFurnished,
        has_air_con: hasAirCon,
        has_balcony: hasBalcony,
        has_garden: hasGarden,
      })
      .eq("id", id)

    if (error) {
      console.error("Error updating property:", error.message, error.details, error.hint)
      return { success: false, message: `Error updating property: ${error.message}` }
    }

    console.log("Property updated successfully:", id)

    // Revalidate the properties page
    revalidatePath("/properties")
    revalidatePath(`/properties/${id}`)
    revalidatePath("/admin/properties")
    revalidatePath(`/admin/properties/${id}`)

    // Add message about images if there were any errors
    let resultMessage = "Property updated successfully"
    if (imageUploadError) {
      resultMessage += ", but some images could not be uploaded. You can try uploading them again."
    }

    try {
      // Redirect to the property page
      redirect(`/admin/properties/${id}`)
    } catch (redirectError) {
      console.error("Error redirecting:", redirectError)
      // Return success instead of redirecting
      return { success: true, message: resultMessage, id: id }
    }
  } catch (error) {
    console.error("Error in updateProperty:", error)
    return { success: false, message: "An unexpected error occurred. Please try again." }
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
