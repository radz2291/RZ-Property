import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Phone, MessageSquare } from "lucide-react"
import Link from "next/link"

export default function AgentProfile() {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Meet Your Agent</h2>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="relative w-32 h-32 overflow-hidden rounded-full shrink-0">
              <Image src="/placeholder.svg?height=128&width=128" alt="RZ Amin" fill sizes="128px" className="object-cover" />
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold">RZ Amin</h3>
                  <Badge variant="outline">Certified Agent</Badge>
                </div>
                <p className="text-muted-foreground">Property Specialist in Tawau</p>
              </div>

              <p>
                With over 5 years of experience in the Tawau property market, I specialize in helping clients find their
                perfect home or investment property. My deep knowledge of the local area ensures you get the best advice
                and service.
              </p>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Residential</Badge>
                <Badge variant="secondary">Commercial</Badge>
                <Badge variant="secondary">Land</Badge>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/contact" className="gap-2">
                    <Phone className="w-4 h-4" />
                    Contact Me
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <a href="https://wa.me/60123456789" target="_blank" rel="noopener noreferrer" className="gap-2">
                    <MessageSquare className="w-4 h-4" />
                    WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
