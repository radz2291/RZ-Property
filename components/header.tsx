"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Menu, Search, X } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/properties?search=${encodeURIComponent(searchQuery)}`)
      setIsSearchOpen(false)
      setSearchQuery("")
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold">RZ Amin</span>
          <span className="hidden text-muted-foreground md:inline-block">Property</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
            Home
          </Link>
          <Link
            href="/properties?category=For Sale"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            For Sale
          </Link>
          <Link
            href="/properties?category=For Rent"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            For Rent
          </Link>
          <Link href="/contact" className="text-sm font-medium transition-colors hover:text-primary">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {isSearchOpen ? (
            <form onSubmit={handleSearch} className="relative flex items-center md:w-64">
              <Input
                type="search"
                placeholder="Search properties..."
                className="pr-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0"
                onClick={() => setIsSearchOpen(false)}
              >
                <X className="w-4 h-4" />
                <span className="sr-only">Close search</span>
              </Button>
            </form>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
              <Search className="w-5 h-5" />
              <span className="sr-only">Search</span>
            </Button>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="w-5 h-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetTitle className="text-left">Menu</SheetTitle>
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/" className="text-lg font-medium transition-colors hover:text-primary">
                  Home
                </Link>
                <Link
                  href="/properties?category=For Sale"
                  className="text-lg font-medium transition-colors hover:text-primary"
                >
                  For Sale
                </Link>
                <Link
                  href="/properties?category=For Rent"
                  className="text-lg font-medium transition-colors hover:text-primary"
                >
                  For Rent
                </Link>
                <Link href="/contact" className="text-lg font-medium transition-colors hover:text-primary">
                  Contact
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
