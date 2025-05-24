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

  // Get all properties to count categories and types
  const { data: allProperties, error: allPropertiesError } = await supabase
    .from("properties")
    .select("category, property_type")

  // Count properties by category
  const forSaleCount = allProperties?.filter(p => p.category === "For Sale").length || 0
  const forRentCount = allProperties?.filter(p => p.category === "For Rent").length || 0

  // Count properties by type
  const residentialCount = allProperties?.filter(p => p.property_type === "Residential").length || 0
  const commercialCount = allProperties?.filter(p => p.property_type === "Commercial").length || 0
  const landCount = allProperties?.filter(p => p.property_type === "Land").length || 0
  
  // Count unique property types
  const propertyTypes = new Set(allProperties?.map(p => p.property_type) || [])
  const propertyTypeCount = propertyTypes.size

  // Get inquiries count
  const { count: totalInquiries, error: inquiriesError } = await supabase
    .from("inquiries")
    .select("*", { count: "exact", head: true })

  // Get recent inquiries (last 24 hours)
  const oneDayAgo = new Date()
  oneDayAgo.setDate(oneDayAgo.getDate() - 1)
  
  const { data: recentInquiriesData, error: recentInquiriesError } = await supabase
    .from("inquiries")
    .select("created_at")
    .gte("created_at", oneDayAgo.toISOString())

  const recentInquiries = recentInquiriesData?.length || 0

  // Page views tracking - Disabled for now, will be implemented in future
  /*
  // Get page views count (client views only)
  const { count: totalPageViews, error: pageViewsError } = await supabase
    .from("page_views")
    .select("*", { count: "exact", head: true })
    .eq("is_admin_view", false)

  // Get page views last 7 days (client views only)
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  
  const { data: recentPageViewsData, error: recentPageViewsError } = await supabase
    .from("page_views")
    .select("timestamp")
    .eq("is_admin_view", false)
    .gte("timestamp", sevenDaysAgo.toISOString())

  const recentPageViews = recentPageViewsData?.length || 0
  */

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

  // Create property type display string
  const propertyTypesText = [
    residentialCount > 0 ? "Residential" : null,
    commercialCount > 0 ? "Commercial" : null,
    landCount > 0 ? "Land" : null
  ].filter(Boolean).join(", ")

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <Button asChild>
          <Link href="/admin/properties/new">Add New Property</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
              {propertyTypesText || "None"}
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
        {/* Page Views Card - Disabled for now, will be implemented in future
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
        */}
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
                        sizes="48px"
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
