import { PropertyCard } from "@/components/property-card"
import { Button } from "@/components/ui/button"
import { getFeaturedProperties } from "@/lib/data"
import AgentProfile from "@/components/agent-profile"
import Hero from "@/components/hero"
import FAQ from "@/components/faq"
import CategoryButtons from "@/components/category-buttons"
import Link from "next/link"

export default async function Home() {
  const featuredProperties = await getFeaturedProperties()

  return (
    <div className="container px-4 py-8 mx-auto space-y-12 md:space-y-16">
      <Hero />

      <CategoryButtons />

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Featured Properties</h2>
          <Button variant="outline" asChild>
            <Link href="/properties">View all properties</Link>
          </Button>
        </div>

        {featuredProperties.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {featuredProperties.map((property, index) => (
              <PropertyCard key={property.id} property={property} isPriority={index === 0} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center border rounded-lg">
            <h3 className="mb-2 text-lg font-medium">No properties found</h3>
            <p className="mb-6 text-muted-foreground">It looks like the database hasn't been initialized yet.</p>
            <Button asChild>
              <Link href="/admin/setup">Initialize Database</Link>
            </Button>
          </div>
        )}
      </section>

      <AgentProfile />

      <FAQ />
    </div>
  )
}
