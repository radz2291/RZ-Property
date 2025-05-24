import { NextRequest, NextResponse } from "next/server"

import { supabase } from "./lib/supabase"

export async function middleware(request: NextRequest) {
  // Handle redirects for property URLs with UUIDs
  const propertyIdMatch = request.nextUrl.pathname.match(/\/properties\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i)
  
  if (propertyIdMatch) {
    const propertyId = propertyIdMatch[1]
    
    // Get the slug for this property ID
    const { data, error } = await supabase
      .from("properties")
      .select("slug")
      .eq("id", propertyId)
      .single()
      
    if (!error && data?.slug) {
      // Redirect to the slug-based URL
      const url = new URL(`/properties/${data.slug}`, request.nextUrl.origin)
      return NextResponse.redirect(url, 301) // 301 permanent redirect
    }
  }
  
  // Only apply admin auth to admin routes
  if (!request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next()
  }

  // Skip authentication for login page and API routes
  if (
    request.nextUrl.pathname.startsWith("/auth/login") ||
    request.nextUrl.pathname.startsWith("/api/")
  ) {
    return NextResponse.next()
  }

  // Simple cookie-based check (doesn't use bcrypt)
  const adminSession = request.cookies.get("admin_session")
  
  if (!adminSession?.value) {
    // Redirect to login
    const url = new URL("/auth/login", request.nextUrl.origin)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/properties/:path*"],
}
