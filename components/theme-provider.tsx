'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

export function ThemeProvider({ children, ...props }) {
  // Use suppressHydrationWarning on the html element
  React.useEffect(() => {
    document.documentElement.setAttribute('suppressHydrationWarning', 'true')
    return () => document.documentElement.removeAttribute('suppressHydrationWarning')
  }, [])

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
