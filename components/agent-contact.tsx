import { Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import type { Agent } from "@/lib/types"
import { WhatsAppIcon } from "@/components/icons"

interface AgentContactProps {
  agent: Agent
}

export default function AgentContact({ agent }: AgentContactProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Agent</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 overflow-hidden rounded-full shrink-0">
            <Image
              src={agent.photo || "/placeholder.svg?height=64&width=64"}
              alt={agent.name}
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>

          <div>
            <h3 className="font-semibold">{agent.name}</h3>
            <p className="text-sm text-muted-foreground">{agent.yearsOfExperience} years experience</p>
          </div>
        </div>

        <div className="space-y-2">
          <Button 
            variant="outline" 
            asChild 
            className="w-full gap-2 bg-[#25D366] hover:bg-[#22c05f] border-[#25D366] hover:border-[#22c05f] text-white hover:text-white"
          >
            <a href={`https://wa.me/${agent.whatsappNumber}`} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon width={16} height={16} fill="white" />
              WhatsApp
            </a>
          </Button>

          <Button variant="outline" asChild className="w-full gap-2">
            <a href={`tel:${agent.phoneNumber}`}>
              <Phone className="w-4 h-4" />
              Call Agent
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
