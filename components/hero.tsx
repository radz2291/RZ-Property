import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { getSiteContent } from "@/lib/actions/site-content"

export default async function Hero() {
  const heroContent = await getSiteContent("hero") || {
    title: "Find Your Dream Property in Tawau",
    description: "Discover a wide range of residential and commercial properties for sale and rent in Tawau, Sabah.",
    background_image: "/hero-bg.webp",
    data: {
      primary_button_text: "Browse Properties",
      primary_button_url: "/properties",
      secondary_button_text: "Contact Agent",
      secondary_button_url: "/contact"
    }
  }
  
  const { 
    title, 
    description, 
    background_image,
    data
  } = heroContent
  
  return (
    <section className="relative overflow-hidden rounded-lg">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/40" />
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('${background_image || "/hero-bg.webp"}')`,
          opacity: 0.4,
        }}
      />

      <div className="relative px-6 py-12 md:py-24 md:px-12">
        <div className="max-w-lg space-y-6">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            {title}
          </h1>
          <p className="text-lg text-white/90">{description}</p>
          <div className="flex flex-wrap gap-4">
            {data?.primary_button_url && (
              <Button asChild size="lg" className="gap-2">
                <a href={data.primary_button_url}>
                  {data.primary_button_text || "Browse Properties"}
                  <ArrowRight className="w-4 h-4" />
                </a>
              </Button>
            )}
            {data?.secondary_button_url && (
              <Button
                asChild
                variant="outline"
                size="lg"
                className="bg-white/20 text-white border-white/40 hover:bg-white/30 hover:text-white"
              >
                <a href={data.secondary_button_url}>{data.secondary_button_text || "Contact Agent"}</a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
