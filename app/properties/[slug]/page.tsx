import { getPropertyBySlug, getSimilarProperties } from "@/lib/data"
import { PropertyGallery } from "@/components/property-gallery"
import { PropertyFeatures } from "@/components/property-features"
import { PropertyDescription } from "@/components/property-description"
import { PropertyLocation } from "@/components/property-location"
import { PropertyInquiryForm } from "@/components/property-inquiry-form"
import { PropertyCard } from "@/components/property-card"
import AgentContact from "@/components/agent-contact"
import { notFound } from "next/navigation"

export default async function PropertyPage({ params }: { params: { slug: string } }) {
  // Make sure to await the params object
  const routeParams = await Promise.resolve(params)
  const propertySlug = routeParams.slug
  
  const property = await getPropertyBySlug(propertySlug)

  if (!property) {
    notFound()
  }

  const similarProperties = await getSimilarProperties(property)

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="mb-4 text-sm breadcrumbs">
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/properties">Properties</a>
          </li>
          <li>{property.title}</li>
        </ul>
      </div>

      <PropertyGallery images={property.images} title={property.title} />

      <div className="grid gap-8 mt-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="mb-2 text-2xl font-bold md:text-3xl">{property.title}</h1>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary">
                {property.category}
              </span>
              <span className="px-2 py-1 text-sm font-medium rounded-full bg-muted">{property.propertyType}</span>
              <span className="px-2 py-1 text-sm font-medium rounded-full bg-muted">{property.status}</span>
            </div>
            <p className="mt-4 text-2xl font-bold text-primary">
              {property.category === "For Rent"
                ? `RM ${property.price}/month`
                : `RM ${property.price.toLocaleString()}`}
            </p>
          </div>

          <PropertyFeatures property={property} />

          <PropertyDescription description={property.description} additionalDetails={property.additionalDetails} />

          <PropertyLocation
            address={property.address}
            district={property.district}
            city={property.city}
            state={property.state}
          />
        </div>

        <div className="space-y-8">
          <PropertyInquiryForm propertyId={property.id} propertyTitle={property.title} />

          <AgentContact agent={property.agent} />
        </div>
      </div>

      {similarProperties.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-bold">Similar Properties</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {similarProperties.map((property, index) => (
              <PropertyCard key={property.id} property={property} isPriority={index === 0} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
