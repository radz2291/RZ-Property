import { Bed, Bath, SquareIcon as SquareFoot, Car, Sofa, Wind } from "lucide-react"
import type { Property } from "@/lib/types"

interface PropertyFeaturesProps {
  property: Property
}

export function PropertyFeatures({ property }: PropertyFeaturesProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Features</h2>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-2 p-3 border rounded-lg">
          <Bed className="w-5 h-5 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Bedrooms</p>
            <p className="font-medium">{property.bedrooms}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 border rounded-lg">
          <Bath className="w-5 h-5 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Bathrooms</p>
            <p className="font-medium">{property.bathrooms}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 border rounded-lg">
          <SquareFoot className="w-5 h-5 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Size</p>
            <p className="font-medium">{property.size} sq ft</p>
          </div>
        </div>

        {property.hasParking && (
          <div className="flex items-center gap-2 p-3 border rounded-lg">
            <Car className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Parking</p>
              <p className="font-medium">Available</p>
            </div>
          </div>
        )}

        {property.hasFurnished && (
          <div className="flex items-center gap-2 p-3 border rounded-lg">
            <Sofa className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Furnished</p>
              <p className="font-medium">Yes</p>
            </div>
          </div>
        )}

        {property.hasAirCon && (
          <div className="flex items-center gap-2 p-3 border rounded-lg">
            <Wind className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Air Conditioning</p>
              <p className="font-medium">Yes</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
