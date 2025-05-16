"use client"

import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PropertySortProps {
  selectedSort: string
}

export default function PropertySort({ selectedSort }: PropertySortProps) {
  const router = useRouter()

  const handleSortChange = (value: string) => {
    const url = new URL(window.location.href)
    url.searchParams.set("sort", value)
    router.push(url.pathname + url.search)
  }

  return (
    <Select defaultValue={selectedSort} onValueChange={handleSortChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="newest">Newest</SelectItem>
        <SelectItem value="price-low">Price: Low to High</SelectItem>
        <SelectItem value="price-high">Price: High to Low</SelectItem>
        <SelectItem value="size">Size</SelectItem>
      </SelectContent>
    </Select>
  )
}
