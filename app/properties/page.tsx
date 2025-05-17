import { PropertyCard } from "@/components/property-card"
import { Button } from "@/components/ui/button"
import { getAllProperties } from "@/lib/data"
import PropertyFilters from "@/components/property-filters"
import PropertySort from "@/components/property-sort"

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Make sure to await the searchParams object
  const params = await Promise.resolve(searchParams)
  
  const category = typeof params.category === "string" ? params.category : undefined
  const propertyType = typeof params.type === "string" ? params.type : undefined
  const sort = typeof params.sort === "string" ? params.sort : "newest"
  const minPrice = typeof params.minPrice === "string" ? params.minPrice : undefined
  const maxPrice = typeof params.maxPrice === "string" ? params.maxPrice : undefined
  const searchQuery = typeof params.search === "string" ? params.search : undefined
  
  // Extract feature filters
  const hasParking = params.hasParking === "true"
  const hasFurnished = params.hasFurnished === "true"
  const hasAirCon = params.hasAirCon === "true"

  const properties = await getAllProperties({
    category,
    propertyType,
    sort,
    minPrice,
    maxPrice,
    search: searchQuery,
    features: {
      hasParking,
      hasFurnished,
      hasAirCon
    }
  })

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Properties</h1>
        {category && <div className="ml-2 px-3 py-1 text-sm bg-muted rounded-full">{category}</div>}
        {searchQuery && (
          <div className="ml-2 px-3 py-1 text-sm bg-muted rounded-full flex items-center gap-2">
            <span>Search: {searchQuery}</span>
          </div>
        )}
      </div>

      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <PropertyFilters
          selectedCategory={category}
          selectedType={propertyType}
          minPrice={minPrice}
          maxPrice={maxPrice}
          hasParking={hasParking}
          hasFurnished={hasFurnished}
          hasAirCon={hasAirCon}
        />

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">{properties.length} properties found</p>
            <PropertySort selectedSort={sort} />
          </div>

          {properties.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((property, index) => (
                <PropertyCard key={property.id} property={property} isPriority={index === 0} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center border rounded-lg">
              <h3 className="mb-2 text-lg font-medium">No properties found</h3>
              <p className="mb-6 text-muted-foreground">Try adjusting your filters or search criteria</p>
              <Button asChild variant="outline">
                <a href="/properties">Clear all filters</a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
