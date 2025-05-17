import { NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  // Only apply to admin routes
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
  matcher: ["/admin/:path*"],
}
