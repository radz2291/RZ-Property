import { cookies } from "next/headers"

/**
 * Check if the current user is an admin (logged into admin panel)
 */
export async function isAdminUser(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    
    // Check for admin session cookie
    const adminSession = cookieStore.get('admin_session')
    
    return !!adminSession?.value
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
}

/**
 * Check if current request is from admin context
 */
export function isAdminRequest(request?: Request): boolean {
  if (!request) return false
  
  const url = new URL(request.url)
  const referer = request.headers.get('referer')
  
  // Check if accessing admin routes
  if (url.pathname.startsWith('/admin')) {
    return true
  }
  
  // Check if referred from admin pages
  if (referer && referer.includes('/admin')) {
    return true
  }
  
  return false
}
