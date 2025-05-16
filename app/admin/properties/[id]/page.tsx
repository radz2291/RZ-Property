import { Button } from "@/components/ui/button"
import { getPropertyById } from "@/lib/data"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Edit, Eye } from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PropertyFeatures } from "@/components/property-features"
import { PropertyLocation } from "@/components/property-location"
import { PropertyDescription } from "@/components/property-description"
import DeletePropertyButton from "@/components/delete-property-button"

export default async function AdminPropertyPage({ params }: { params: { id: string } }) {
  const property = await getPropertyById(params.id)

  if (!property) {
    notFound()
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{property.title}</h1>
          <p className="text-muted-foreground">
            {property.address}, {property.district}
          </p>
        </div>

        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/properties/${property.id}`} className="gap-2">
              <Eye className="w-4 h-4" />
              View on Site
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href={`/admin/properties/${property.id}/edit`} className="gap-2">
              <Edit className="w-4 h-4" />
              Edit
            </Link>
          </Button>
          <DeletePropertyButton id={property.id} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <Image
              src={property.featuredImage || "/placeholder.svg?height=600&width=800"}
              alt={property.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="grid gap-4 grid-cols-4">
            {property.images.map((image, index) => (
              <div key={index} className="relative aspect-square rounded-md overflow-hidden">
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${property.title} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          <PropertyDescription description={property.description} additionalDetails={property.additionalDetails} />

          <PropertyFeatures property={property} />

          <PropertyLocation
            address={property.address}
            district={property.district}
            city={property.city}
            state={property.state}
          />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price</span>
                <span className="font-semibold">
                  {property.category === "For Rent"
                    ? `RM ${property.price}/month`
                    : `RM ${property.price.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category</span>
                <Badge variant="outline">{property.category}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type</span>
                <Badge variant="outline">{property.propertyType}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge
                  variant={
                    property.status === "Available"
                      ? "default"
                      : property.status === "Pending"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {property.status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Views</span>
                <span>{property.viewCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span>{new Date(property.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Updated</span>
                <span>{new Date(property.updatedAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Agent</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-muted">
                  {property.agent.photo && (
                    <Image
                      src={property.agent.photo || "/placeholder.svg"}
                      alt={property.agent.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div>
                  <p className="font-medium">{property.agent.name}</p>
                  <p className="text-sm text-muted-foreground">{property.agent.yearsOfExperience} years experience</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
