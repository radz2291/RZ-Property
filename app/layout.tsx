import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import ClientOnly from "@/components/client-only"

const setupInitialAdmin = async () => {
  const { setupInitialAdmin } = await import("@/lib/actions/setup-admin")
  return setupInitialAdmin()
}

const inter = Inter({ subsets: ["latin"], display: "swap" })

export const metadata: Metadata = {
  title: "RZ Amin Property Catalog - Find Your Dream Property in Tawau",
  description:
    "Browse residential and commercial properties for sale and rent in Tawau, Sabah with RZ Amin, your trusted local property agent.",
    generator: 'v0.dev'
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Setup initial admin user (only runs on server)
  await setupInitialAdmin()

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="preconnect"
          href="https://hgrohapbnvejwwblmmyw.supabase.co"
          crossOrigin="anonymous"
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <div className="flex min-h-screen flex-col">
            <ClientOnly />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
