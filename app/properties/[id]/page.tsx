import { redirect } from "next/navigation"
import { getPropertyById } from "@/lib/data"

// This route will redirect old ID-based URLs to slug-based URLs
export default async function PropertyRedirectPage({ params }: { params: { id: string } }) {
  const propertyId = params.id
  const property = await getPropertyById(propertyId)

  if (!property) {
    return redirect("/properties")
  }

  // Redirect to the slug-based URL
  return redirect(`/properties/${property.slug}`)
}
