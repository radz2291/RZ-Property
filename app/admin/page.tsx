import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Home, Building, MessageSquare, Eye } from "lucide-react"
import { supabase } from "@/lib/supabase"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"

export default async function AdminDashboard() {
  // Get total properties count
  const { count: totalProperties, error: propertiesError } = await supabase
    .from("properties")
    .select("*", { count: "exact", head: true })

  // Get properties by category
  const { data: propertiesByCategory, error: categoryError } = await supabase
    .from("properties")
    .select("category, count", { count: "exact" })
    .groupBy("category")

  // Get properties by type
  const { data: propertiesByType, error: typeError } = await supabase
    .from("properties")
    .select("property_type, count", { count: "exact" })
    .groupBy("property_type")

  // Get inquiries count
  const { count: totalInquiries, error: inquiriesError } = await supabase
    .from("inquiries")
    .select("*", { count: "exact", head: true })

  // Get recent inquiries (last 24 hours)
  const oneDayAgo = new Date()
  oneDayAgo.setDate(oneDayAgo.getDate() - 1)
  
  const { count: recentInquiries, error: recentInquiriesError } = await supabase
    .from("inquiries")
    .select("*", { count: "exact", head: true })
    .gte("created_at", oneDayAgo.toISOString())

  // Get page views count
  const { count: totalPageViews, error: pageViewsError } = await supabase
    .from("page_views")
    .select("*", { count: "exact", head: true })

  // Get page views last 7 days
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  
  const { count: recentPageViews, error: recentPageViewsError } = await supabase
    .from("page_views")
    .select("*", { count: "exact", head: true })
    .gte("timestamp", sevenDaysAgo.toISOString())

  // Get recent properties
  const { data: recentProperties, error: recentPropertiesError } = await supabase
    .from("properties")
    .select("id, title, featured_image, created_at")
    .order("created_at", { ascending: false })
    .limit(3)

  // Get recent inquiries for display
  const { data: latestInquiries, error: latestInquiriesError } = await supabase
    .from("inquiries")
    .select(`
      id,
      name,
      message,
      created_at,
      property:property_id (title)
    `)
    .order("created_at", { ascending: false })
    .limit(3)

  // Count properties by category
  const forSaleCount = propertiesByCategory?.find(p => p.category === "For Sale")?.count || 0
  const forRentCount = propertiesByCategory?.find(p => p.category === "For Rent")?.count || 0

  // Count property types
  const residentialCount = propertiesByType?.find(p => p.property_type === "Residential")?.count || 0
  const commercialCount = propertiesByType?.find(p => p.property_type === "Commercial")?.count || 0
  const landCount = propertiesByType?.find(p => p.property_type === "Land")?.count || 0
  const propertyTypeCount = (residentialCount > 0 ? 1 : 0) + (commercialCount > 0 ? 1 : 0) + (landCount > 0 ? 1 : 0)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <Button asChild>
          <Link href="/admin/properties/new">Add New Property</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <Home className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProperties || 0}</div>
            <p className="text-xs text-muted-foreground">
              {forSaleCount} for sale, {forRentCount} for rent
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Property Types</CardTitle>
            <Building className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{propertyTypeCount}</div>
            <p className="text-xs text-muted-foreground">
              {residentialCount > 0 ? "Residential" : ""}{commercialCount > 0 ? (residentialCount > 0 ? ", Commercial" : "Commercial") : ""}
              {landCount > 0 ? ((residentialCount > 0 || commercialCount > 0) ? ", Land" : "Land") : ""}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Recent Inquiries</CardTitle>
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInquiries || 0}</div>
            <p className="text-xs text-muted-foreground">{recentInquiries || 0} new in the last 24 hours</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <Eye className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPageViews || 0}</div>
            <p className="text-xs text-muted-foreground">{recentPageViews || 0} views in the last 7 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Properties</CardTitle>
            <CardDescription>Recently added or updated properties</CardDescription>
          </CardHeader>
          <CardContent>
            {recentProperties && recentProperties.length > 0 ? (
              <div className="space-y-4">
                {recentProperties.map((property) => (
                  <div key={property.id} className="flex items-center gap-4">
                    <div className="relative w-12 h-12 overflow-hidden bg-muted rounded-md">
                      <Image
                        src={property.featured_image || "/placeholder.svg?height=48&width=48"}
                        alt={property.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <Link href={`/admin/properties/${property.id}`} className="font-medium hover:underline">
                        {property.title}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        Added {formatDistanceToNow(new Date(property.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-40 text-muted-foreground">
                No properties yet
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Inquiries</CardTitle>
            <CardDescription>Latest inquiries from potential clients</CardDescription>
          </CardHeader>
          <CardContent>
            {latestInquiries && latestInquiries.length > 0 ? (
              <div className="space-y-4">
                {latestInquiries.map((inquiry) => (
                  <div key={inquiry.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <Link href={`/admin/inquiries/${inquiry.id}`} className="font-medium hover:underline">
                          {inquiry.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {inquiry.property?.title || "Unknown property"}
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(inquiry.created_at), { addSuffix: true })}
                      </div>
                    </div>
                    <p className="text-sm truncate">{inquiry.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-40 text-muted-foreground">
                No inquiries yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
