'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export function Analytics() {
  const pathname = usePathname()
  const lastPathRef = useRef(pathname)
  
  useEffect(() => {
    // Only log page view if path changed and component is mounted
    if (pathname !== lastPathRef.current && typeof window !== 'undefined') {
      lastPathRef.current = pathname
      
      // Use a lightweight approach - don't wait for response
      const logView = async () => {
        try {
          // Insert in background, don't block rendering
          supabase.from("page_views").insert({
            page: pathname,
            referrer: document.referrer || null,
          }).then(() => {
            // Optional: console.log('View logged')
          }).catch(() => {
            // Silently fail - analytics shouldn't break the app
          })
        } catch (e) {
          // Ignore errors
        }
      }
      
      // Schedule this for when the browser is idle
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => logView())
      } else {
        // Fallback for browsers that don't support requestIdleCallback
        setTimeout(logView, 1000)
      }
    }
  }, [pathname])

  return null // This component doesn't render anything
}

export default Analytics