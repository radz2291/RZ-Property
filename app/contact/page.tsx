import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, Mail, MapPin, MessageSquare } from "lucide-react"
import AgentProfile from "@/components/agent-profile"
import { ContactForm } from "@/components/contact-form"

export default function ContactPage() {
  return (
    <div className="container px-4 py-8 mx-auto space-y-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Contact RZ Amin</h1>
        <p className="mt-4 text-muted-foreground">
          Have questions about a property or need assistance? Get in touch with me directly.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <ContactForm />

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Reach out directly through any of these channels.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 mt-0.5 text-primary" />
                <div>
                  <h3 className="font-medium">Phone</h3>
                  <p>+60 12-345 6789</p>
                  <p className="text-sm text-muted-foreground">Available 9am-7pm, Monday-Saturday</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 mt-0.5 text-primary" />
                <div>
                  <h3 className="font-medium">WhatsApp</h3>
                  <p>+60 12-345 6789</p>
                  <Button variant="link" className="px-0" asChild>
                    <a href="https://wa.me/60123456789" target="_blank" rel="noopener noreferrer">
                      Message on WhatsApp
                    </a>
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 mt-0.5 text-primary" />
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p>rzamin@example.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 text-primary" />
                <div>
                  <h3 className="font-medium">Office Location</h3>
                  <p>123 Property Street, Tawau, Sabah, Malaysia</p>
                  <p className="text-sm text-muted-foreground">Office hours: 9am-5pm, Monday-Friday</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Looking for a specific property?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                If you're looking for a specific type of property that's not listed on our website, let me know your
                requirements and I'll help you find it.
              </p>
              <Button asChild>
                <a href="/properties">Browse All Properties</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <AgentProfile />
    </div>
  )
}
