import { MapPin } from "lucide-react"

interface PropertyLocationProps {
  address: string
  district: string
  city: string
  state: string
}

export function PropertyLocation({ address, district, city, state }: PropertyLocationProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Location</h2>

      <div className="flex items-start gap-2">
        <MapPin className="w-5 h-5 mt-0.5 text-muted-foreground" />
        <div>
          <p>{address}</p>
          <p>
            {district}, {city}, {state}
          </p>
        </div>
      </div>

      <div className="overflow-hidden border rounded-lg aspect-[16/9] bg-muted">
        {/* Placeholder for map - in a real implementation, you would integrate with a mapping service */}
        <div className="flex items-center justify-center w-full h-full text-muted-foreground">
          Map view would be displayed here
        </div>
      </div>
    </div>
  )
}
