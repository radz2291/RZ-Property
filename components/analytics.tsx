'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { logPageView } from '@/lib/actions'

export function Analytics() {
  const pathname = usePathname()

  useEffect(() => {
    logPageView(pathname)
  }, [pathname])

  return null // This component doesn't render anything
}
