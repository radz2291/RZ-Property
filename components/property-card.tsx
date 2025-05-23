import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bed, Bath, SquareIcon as SquareFoot, MapPin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Property } from "@/lib/types"
import { getFeaturedImage } from "@/lib/image-utils"

interface PropertyCardProps {
  property: Property
  isPriority?: boolean
}

export function PropertyCard({ property, isPriority = false }: PropertyCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <Link href={`/properties/${property.slug}`} className="block">
        <div className="relative aspect-[4/3]">
          <Image
            src={getFeaturedImage(property) || "/placeholder.svg?height=300&width=400"}
            alt={property.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            priority={isPriority}
            className="object-cover"
          />
          <Badge className="absolute top-2 left-2" variant={property.category === "For Sale" ? "default" : "secondary"}>
            {property.category}
          </Badge>
          {property.status !== "Available" && (
            <Badge className="absolute top-2 right-2" variant="outline">
              {property.status}
            </Badge>
          )}
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/properties/${property.slug}`} className="block">
          <h3 className="mb-2 font-semibold line-clamp-1">{property.title}</h3>
          <p className="mb-3 text-lg font-bold text-primary">
            {property.category === "For Rent" ? `RM ${property.price}/month` : `RM ${property.price.toLocaleString()}`}
          </p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Bed className="w-4 h-4" />
              <span>{property.bedrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="w-4 h-4" />
              <span>{property.bathrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <SquareFoot className="w-4 h-4" />
              <span>{property.size} sq ft</span>
            </div>
          </div>
        </Link>
      </CardContent>

      <CardFooter className="px-4 py-3 border-t bg-muted/30">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3" />
          <span>
            {property.district}, {property.city}
          </span>
        </div>
      </CardFooter>
    </Card>
  )
}
