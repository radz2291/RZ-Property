import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Analytics } from "@/components/analytics"
import { setupInitialAdmin } from "@/lib/actions/setup-admin"

const inter = Inter({ subsets: ["latin"] })

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
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <div className="flex min-h-screen flex-col">
            <Analytics />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
