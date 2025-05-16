import PropertyForm from "@/components/property-form"
import { getPropertyById } from "@/lib/data"
import { notFound } from "next/navigation"

export default async function EditPropertyPage({ params }: { params: { id: string } }) {
  const property = await getPropertyById(params.id)

  if (!property) {
    notFound()
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit Property</h1>
        <p className="text-muted-foreground">Update property information</p>
      </div>

      <PropertyForm property={property} isEdit />
    </div>
  )
}
