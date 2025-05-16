import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"

export default async function AdminInquiriesPage() {
  const { data: inquiries, error } = await supabase
    .from("inquiries")
    .select(`
      *,
      property:property_id (title)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching inquiries:", error)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Inquiries</h1>
      </div>

      {inquiries && inquiries.length > 0 ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Source</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inquiries.map((inquiry) => (
                <TableRow key={inquiry.id}>
                  <TableCell className="font-medium">{inquiry.name}</TableCell>
                  <TableCell>
                    {inquiry.phone_number}
                    {inquiry.email && <div className="text-xs text-muted-foreground">{inquiry.email}</div>}
                  </TableCell>
                  <TableCell>{inquiry.property?.title || "Unknown property"}</TableCell>
                  <TableCell>{new Date(inquiry.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        inquiry.status === "New" ? "default" : inquiry.status === "Contacted" ? "secondary" : "outline"
                      }
                    >
                      {inquiry.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`
                      ${inquiry.source === 'contact_form' ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' : ''} 
                      ${inquiry.source === 'general_contact' ? 'bg-green-50 text-green-700 hover:bg-green-100' : ''}
                      ${inquiry.source === 'whatsapp' ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : ''}
                    `}>
                      {inquiry.source === 'contact_form' ? 'Property Inquiry' : 
                       inquiry.source === 'general_contact' ? 'Contact Page' : 
                       inquiry.source === 'whatsapp' ? 'WhatsApp' : 
                       inquiry.source}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="p-8 text-center border rounded-lg">
          <h3 className="mb-2 text-lg font-medium">No inquiries yet</h3>
          <p className="text-muted-foreground">Inquiries from potential clients will appear here.</p>
        </div>
      )}
    </div>
  )
}
