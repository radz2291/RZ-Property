import { Phone, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import type { Agent } from "@/lib/types"

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
              className="object-cover"
            />
          </div>

          <div>
            <h3 className="font-semibold">{agent.name}</h3>
            <p className="text-sm text-muted-foreground">{agent.yearsOfExperience} years experience</p>
          </div>
        </div>

        <div className="space-y-2">
          <Button asChild className="w-full gap-2">
            <a href={`tel:${agent.phoneNumber}`}>
              <Phone className="w-4 h-4" />
              Call Agent
            </a>
          </Button>

          <Button variant="outline" asChild className="w-full gap-2">
            <a href={`https://wa.me/${agent.whatsappNumber}`} target="_blank" rel="noopener noreferrer">
              <MessageSquare className="w-4 h-4" />
              WhatsApp
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
