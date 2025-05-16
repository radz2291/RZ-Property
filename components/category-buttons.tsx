import { Button } from "@/components/ui/button"
import { Home, Building2 } from "lucide-react"
import Link from "next/link"

export default function CategoryButtons() {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Property Categories</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/properties?category=For Sale" className="block">
          <div className="flex flex-col h-full p-6 transition-colors border rounded-lg hover:border-primary hover:bg-muted/50">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-full bg-primary/10">
                <Home className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">For Sale</h3>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Browse properties available for purchase in Tawau, Sabah.
            </p>
            <Button variant="link" className="mt-4 justify-start px-0">
              View Properties
            </Button>
          </div>
        </Link>

        <Link href="/properties?category=For Rent" className="block">
          <div className="flex flex-col h-full p-6 transition-colors border rounded-lg hover:border-primary hover:bg-muted/50">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-full bg-primary/10">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">For Rent</h3>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Discover rental properties available in Tawau, Sabah.</p>
            <Button variant="link" className="mt-4 justify-start px-0">
              View Properties
            </Button>
          </div>
        </Link>
      </div>
    </section>
  )
}
