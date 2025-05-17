import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Settings, PlusCircle, ListFilter, MessageSquare, BarChart, Database } from "lucide-react"
import LogoutButton from "@/components/logout-button"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { supabase } from "@/lib/supabase"

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Verify authentication on the server
  const cookieStore = cookies()
  const adminSession = await cookieStore.get("admin_session")

  if (!adminSession?.value) {
    redirect("/auth/login")
  }

  // Check if agent with this ID exists
  const { data: agent, error } = await supabase
    .from("agents")
    .select("id, name")
    .eq("id", adminSession.value)
    .single()

  if (error || !agent) {
    // Clear invalid cookie and redirect
    await cookieStore.delete("admin_session")
    redirect("/auth/login")
  }
  return (
    <div className="flex min-h-screen">
      <div className="w-64 p-4 border-r bg-muted/30">
        <div className="mb-8">
          <h2 className="text-xl font-bold">Admin Panel</h2>
          <p className="text-sm text-muted-foreground">Property Catalog Management</p>
        </div>

        <nav className="space-y-1">
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/admin">
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/admin/properties">
              <ListFilter className="w-4 h-4 mr-2" />
              Properties
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/admin/properties/new">
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Property
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/admin/inquiries">
              <MessageSquare className="w-4 h-4 mr-2" />
              Inquiries
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/admin/analytics">
              <BarChart className="w-4 h-4 mr-2" />
              Analytics
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/admin/storage-policies">
              <Database className="w-4 h-4 mr-2" />
              Storage Policies
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/admin/setup">
              <Settings className="w-4 h-4 mr-2" />
              Setup
            </Link>
          </Button>
        </nav>

        <div className="pt-4 mt-8 space-y-2 border-t">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/">View Website</Link>
          </Button>
          <LogoutButton />
        </div>
      </div>

      <div className="flex-1">{children}</div>
    </div>
  )
}
