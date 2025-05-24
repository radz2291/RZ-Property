"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useIsMobile } from "@/components/ui/use-mobile"
import MobileFilterDrawer from "@/components/mobile-filter-drawer"

interface PropertyFiltersProps {
  selectedCategory?: string
  selectedType?: string
  minPrice?: string
  maxPrice?: string
  hasParking?: boolean
  hasFurnished?: boolean
  hasAirCon?: boolean
  totalProperties?: number
}

export default function PropertyFilters({
  selectedCategory,
  selectedType,
  minPrice: initialMinPrice,
  maxPrice: initialMaxPrice,
  hasParking: initialHasParking,
  hasFurnished: initialHasFurnished,
  hasAirCon: initialHasAirCon,
  totalProperties = 0
}: PropertyFiltersProps) {
  const router = useRouter()
  const isMobile = useIsMobile()
  const [category, setCategory] = useState<string | undefined>(selectedCategory)
  const [propertyType, setPropertyType] = useState<string | undefined>(selectedType)
  const [minPrice, setMinPrice] = useState<string>(initialMinPrice ?? "")
  const [maxPrice, setMaxPrice] = useState<string>(initialMaxPrice ?? "")
  const [features, setFeatures] = useState({
    hasParking: initialHasParking ?? false,
    hasFurnished: initialHasFurnished ?? false,
    hasAirCon: initialHasAirCon ?? false,
  })
  const [mounted, setMounted] = useState(false)

  // This effect ensures hydration mismatch is avoided
  useEffect(() => {
    setMounted(true)
  }, [])

  // If not mounted yet, return nothing to avoid hydration mismatch
  if (!mounted) {
    return null
  }

  const handleCategoryChange = (value: string) => {
    setCategory(category === value ? undefined : value)
  }

  const handlePropertyTypeChange = (value: string) => {
    setPropertyType(propertyType === value ? undefined : value)
  }

  const handleFeatureChange = (feature: keyof typeof features) => {
    setFeatures({
      ...features,
      [feature]: !features[feature],
    })
  }

  const applyFilters = () => {
    const params = new URLSearchParams()

    if (category) params.set("category", category)
    if (propertyType) params.set("type", propertyType)
    
    // Validate and apply price filters
    const minPriceNum = minPrice ? parseFloat(minPrice) : 0
    const maxPriceNum = maxPrice ? parseFloat(maxPrice) : Infinity
    
    if (minPrice && (!maxPrice || minPriceNum <= maxPriceNum)) {
      params.set("minPrice", minPrice)
    }
    
    if (maxPrice && (!minPrice || minPriceNum <= maxPriceNum)) {
      params.set("maxPrice", maxPrice)
    }

    Object.entries(features).forEach(([key, value]) => {
      if (value) params.set(key, "true")
    })

    router.push(`/properties?${params.toString()}`)
  }

  const clearFilters = () => {
    setCategory(undefined)
    setPropertyType(undefined)
    setMinPrice("")
    setMaxPrice("")
    setFeatures({
      hasParking: false,
      hasFurnished: false,
      hasAirCon: false,
    })

    router.push("/properties")
  }

  // For mobile, render the drawer component
  if (isMobile) {
    return (
      <MobileFilterDrawer
        selectedCategory={selectedCategory}
        selectedType={selectedType}
        minPrice={initialMinPrice}
        maxPrice={initialMaxPrice}
        hasParking={initialHasParking}
        hasFurnished={initialHasFurnished}
        hasAirCon={initialHasAirCon}
        totalProperties={totalProperties}
      />
    )
  }

  // For desktop, render the sidebar filters
  return (
    <div className="space-y-6">
      <div className="p-4 border rounded-lg">
        <Accordion type="multiple" defaultValue={["category", "type", "price", "features"]}>
          <AccordionItem value="category">
            <AccordionTrigger>Category</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={category === "For Sale"}
                    onCheckedChange={() => handleCategoryChange("For Sale")}
                  />
                  For Sale
                </Label>
                <Label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={category === "For Rent"}
                    onCheckedChange={() => handleCategoryChange("For Rent")}
                  />
                  For Rent
                </Label>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="type">
            <AccordionTrigger>Property Type</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={propertyType === "Residential"}
                    onCheckedChange={() => handlePropertyTypeChange("Residential")}
                  />
                  Residential
                </Label>
                <Label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={propertyType === "Commercial"}
                    onCheckedChange={() => handlePropertyTypeChange("Commercial")}
                  />
                  Commercial
                </Label>
                <Label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={propertyType === "Land"}
                    onCheckedChange={() => handlePropertyTypeChange("Land")}
                  />
                  Land
                </Label>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="price">
            <AccordionTrigger>Price Range</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="min-price">Minimum (RM)</Label>
                  <Input
                    id="min-price"
                    type="number"
                    placeholder="Min price"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-price">Maximum (RM)</Label>
                  <Input
                    id="max-price"
                    type="number"
                    placeholder="Max price"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="features">
            <AccordionTrigger>Features</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={features.hasParking} onCheckedChange={() => handleFeatureChange("hasParking")} />
                  Parking
                </Label>
                <Label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={features.hasFurnished}
                    onCheckedChange={() => handleFeatureChange("hasFurnished")}
                  />
                  Furnished
                </Label>
                <Label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={features.hasAirCon} onCheckedChange={() => handleFeatureChange("hasAirCon")} />
                  Air Conditioning
                </Label>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex gap-2 mt-6">
          <Button onClick={applyFilters} className="flex-1">
            Apply Filters
          </Button>
          <Button variant="outline" onClick={clearFilters}>
            Clear
          </Button>
        </div>
      </div>
    </div>
  )
}