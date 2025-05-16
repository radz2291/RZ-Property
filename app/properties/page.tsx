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
  const category = typeof searchParams.category === "string" ? searchParams.category : undefined
  const propertyType = typeof searchParams.type === "string" ? searchParams.type : undefined
  const sort = typeof searchParams.sort === "string" ? searchParams.sort : "newest"

  const properties = await getAllProperties({ category, propertyType, sort })

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Properties</h1>
        {category && <div className="ml-2 px-3 py-1 text-sm bg-muted rounded-full">{category}</div>}
      </div>

      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <PropertyFilters selectedCategory={category} selectedType={propertyType} />

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">{properties.length} properties found</p>
            <PropertySort selectedSort={sort} />
          </div>

          {properties.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
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
