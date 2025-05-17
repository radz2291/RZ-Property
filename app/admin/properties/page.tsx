import { getAllProperties } from "@/lib/data"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Edit, Eye, Plus } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import DeletePropertyButton from "@/components/delete-property-button"

export default async function AdminPropertiesPage() {
  const properties = await getAllProperties()

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Properties</h1>
        <Button asChild>
          <Link href="/admin/properties/new">
            <Plus className="w-4 h-4 mr-2" />
            Add New Property
          </Link>
        </Button>
      </div>

      {properties.length > 0 ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price (RM)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Views</TableHead>
                <TableHead className="w-[150px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell>
                    <div className="relative w-12 h-12 rounded-md overflow-hidden">
                      <Image
                        src={property.featuredImage || "/placeholder.svg?height=48&width=48"}
                        alt={property.title}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{property.title}</TableCell>
                  <TableCell>{property.category}</TableCell>
                  <TableCell>{property.propertyType}</TableCell>
                  <TableCell>
                    {property.category === "For Rent" ? `${property.price}/month` : property.price.toLocaleString()}
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>{property.viewCount}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/properties/${property.id}`}>
                          <Eye className="w-4 h-4" />
                          <span className="sr-only">View</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/properties/${property.id}/edit`}>
                          <Edit className="w-4 h-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                      <DeletePropertyButton id={property.id} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="p-8 text-center border rounded-lg">
          <h3 className="mb-2 text-lg font-medium">No properties found</h3>
          <p className="mb-6 text-muted-foreground">Get started by adding your first property listing.</p>
          <Button asChild>
            <Link href="/admin/properties/new">
              <Plus className="w-4 h-4 mr-2" />
              Add New Property
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}
