import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, User, Phone, Mail, MessageSquare, Home } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import InquiryActions from "@/components/inquiry-actions"

export default async function InquiryDetailPage({ params }: { params: { id: string } }) {
  const { data: inquiry, error } = await supabase
    .from("inquiries")
    .select(`
      *,
      property:property_id (
        id,
        title,
        address,
        district,
        city,
        featured_image
      )
    `)
    .eq("id", params.id)
    .single()

  if (error || !inquiry) {
    console.error("Error fetching inquiry:", error)
    notFound()
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/inquiries">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Inquiry Details</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Inquiry Information</CardTitle>
              <CardDescription>Details about the inquiry from {inquiry.name}.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 mt-0.5 text-primary" />
                <div>
                  <h3 className="font-medium">Contact Information</h3>
                  <p className="text-lg">{inquiry.name}</p>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{inquiry.phone_number}</span>
                  </div>
                  {inquiry.email && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{inquiry.email}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MessageSquare className="h-5 w-5 mt-0.5 text-primary" />
                <div>
                  <h3 className="font-medium">Message</h3>
                  <p className="mt-1 whitespace-pre-wrap">{inquiry.message}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 mt-0.5 text-primary" />
                <div>
                  <h3 className="font-medium">Date Submitted</h3>
                  <p>{format(new Date(inquiry.created_at), "PPP 'at' p")}</p>
                </div>
              </div>
            </CardContent>

            <CardFooter className="border-t p-6 flex justify-between">
              <div className="flex gap-2">
                <div>
                  <Badge
                    variant={
                      inquiry.status === "New" ? "default" : inquiry.status === "Contacted" ? "secondary" : "outline"
                    }
                  >
                    {inquiry.status}
                  </Badge>
                </div>
                <div>
                  <Badge
                    variant="outline"
                    className={`
                      ${inquiry.source === 'contact_form' ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' : ''} 
                      ${inquiry.source === 'general_contact' ? 'bg-green-50 text-green-700 hover:bg-green-100' : ''}
                      ${inquiry.source === 'whatsapp' ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : ''}
                    `}
                  >
                    {inquiry.source === 'contact_form' ? 'Property Inquiry' : 
                     inquiry.source === 'general_contact' ? 'Contact Page' : 
                     inquiry.source === 'whatsapp' ? 'WhatsApp' : 
                     inquiry.source}
                  </Badge>
                </div>
              </div>
              <Button variant="secondary" asChild>
                <Link href={`mailto:${inquiry.email || ""}`}>
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Actions</CardTitle>
              <CardDescription>Manage this inquiry status.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 flex-grow">
              <div>
                <InquiryActions inquiryId={inquiry.id} currentStatus={inquiry.status} />
              </div>
            </CardContent>
            <CardFooter className="border-t p-6">
              {/* Delete action is now handled by the InquiryActions component */}
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          {inquiry.property ? (
            <Card>
              <CardHeader>
                <CardTitle>Related Property</CardTitle>
                <CardDescription>The property this inquiry is about.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md overflow-hidden aspect-video relative bg-muted">
                  {inquiry.property.featured_image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={inquiry.property.featured_image} 
                      alt={inquiry.property.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Home className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-medium text-lg">{inquiry.property.title}</h3>
                  <p className="text-muted-foreground">
                    {inquiry.property.address}, {inquiry.property.district}, {inquiry.property.city}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="border-t p-6">
                <Button className="w-full" asChild>
                  <Link href={`/admin/properties/${inquiry.property.id}`}>
                    View Property
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>General Contact</CardTitle>
                <CardDescription>This is a general inquiry not related to a specific property.</CardDescription>
              </CardHeader>
              <CardContent className="h-40 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2" />
                  <p>General Contact Message</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
