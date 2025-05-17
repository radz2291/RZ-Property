import { NextRequest, NextResponse } from "next/server"
import { checkAdminAuth } from "./lib/actions/auth-actions"

export async function middleware(request: NextRequest) {
  // Only apply to admin routes
  if (!request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next()
  }

  // Skip authentication for login page
  if (request.nextUrl.pathname.startsWith("/auth/login")) {
    return NextResponse.next()
  }

  // Check if user is authenticated
  const authResult = await checkAdminAuth()

  if (!authResult.authenticated) {
    // Redirect to login
    const url = new URL("/auth/login", request.nextUrl.origin)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
