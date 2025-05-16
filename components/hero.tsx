import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-lg">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/40" />
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/placeholder.svg?height=600&width=1200')",
          opacity: 0.4,
        }}
      />

      <div className="relative px-6 py-12 md:py-24 md:px-12">
        <div className="max-w-lg space-y-6">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Find Your Dream Property in Tawau
          </h1>
          <p className="text-lg text-white/90">
            Discover a wide range of residential and commercial properties for sale and rent in Tawau, Sabah.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="gap-2">
              <a href="/properties">
                Browse Properties
                <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="bg-white/20 text-white border-white/40 hover:bg-white/30 hover:text-white"
            >
              <a href="/contact">Contact Agent</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
