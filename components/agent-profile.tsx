import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Phone } from "lucide-react"
import { WhatsAppIcon } from "@/components/icons"
import Link from "next/link"
import { getAgentProfile } from "@/lib/actions/site-content"

export default async function AgentProfile() {
  const agent = await getAgentProfile() || {
    name: "RZ Amin",
    photo: null,
    bio: "With over 5 years of experience in the Tawau property market, I specialize in helping clients find their perfect home or investment property. My deep knowledge of the local area ensures you get the best advice and service.",
    phone_number: "+60123456789",
    whatsapp_number: "60123456789",
    years_of_experience: 5,
    specialties: ["Residential", "Commercial", "Land"]
  }

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Meet Your Agent</h2>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="relative w-32 h-32 overflow-hidden rounded-full shrink-0">
              <Image 
                src={agent.photo || "/placeholder.svg?height=128&width=128"} 
                alt={agent.name} 
                fill 
                sizes="128px" 
                className="object-cover" 
              />
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold">{agent.name}</h3>
                  <Badge variant="outline">Certified Agent</Badge>
                </div>
                <p className="text-muted-foreground">Property Specialist in Tawau</p>
              </div>

              <p>{agent.bio}</p>

              <div className="flex flex-wrap gap-2">
                {agent.specialties.map((specialty, index) => (
                  <Badge key={`specialty-${index}`} variant="secondary">{specialty}</Badge>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/contact" className="gap-2">
                    <Phone className="w-4 h-4" />
                    Contact Me
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  asChild 
                  className="bg-white hover:bg-gray-50 border-[#25D366] hover:border-[#22c05f]"
                >
                  <a 
                    href={`https://wa.me/${agent.whatsapp_number}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="gap-2 text-[#25D366] hover:text-[#22c05f]"
                  >
                    <WhatsAppIcon width={16} height={16} />
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
