import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"

export default async function AdminAnalyticsPage() {
  // Total Property Views - Disabled for now, will be implemented in future
  /*
  // Get page views count (all page views now only from property pages)
  const { data: pageViewsCount, error: pageViewsError } = await supabase
    .from("page_views")
    .select("*", { count: "exact", head: true })
  */

  // Get property views (all page views are now property views)
  const { data: propertyViews, error: propertyViewsError } = await supabase
    .from("page_views")
    .select(`
      property_id,
      property:property_id (title)
    `)
    .not("property_id", "is", null)

  // Count views by property
  const propertyViewCounts: Record<string, { title: string; count: number }> = {}

  if (propertyViews) {
    propertyViews.forEach((view) => {
      if (view.property_id) {
        if (!propertyViewCounts[view.property_id]) {
          propertyViewCounts[view.property_id] = {
            title: view.property?.title || "Unknown property",
            count: 0,
          }
        }
        propertyViewCounts[view.property_id].count++
      }
    })
  }

  // Sort properties by view count
  const topProperties = Object.entries(propertyViewCounts)
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, 5)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {/* Total Property Views Card - Disabled for now, will be implemented in future
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Property Views</CardTitle>
            <CardDescription>All time property page views</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pageViewsCount || 0}</div>
          </CardContent>
        </Card>
        */}

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Property Views</CardTitle>
            <CardDescription>Individual property view records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{propertyViews?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Unique Properties Viewed</CardTitle>
            <CardDescription>Number of properties that received views</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{Object.keys(propertyViewCounts).length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Properties by Views</CardTitle>
          <CardDescription>Properties with the most page views</CardDescription>
        </CardHeader>
        <CardContent>
          {topProperties.length > 0 ? (
            <div className="space-y-4">
              {topProperties.map(([id, { title, count }]) => (
                <div key={id} className="flex items-center justify-between">
                  <div className="font-medium">{title}</div>
                  <div className="text-muted-foreground">{count} views</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground">No property views recorded yet</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
