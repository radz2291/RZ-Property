"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

interface PropertyDescriptionProps {
  description: string
  additionalDetails?: string
}

export function PropertyDescription({ description, additionalDetails }: PropertyDescriptionProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Description</h2>

      <div className={`prose max-w-none ${!expanded && "line-clamp-4"}`}>
        <p>{description}</p>
      </div>

      {description.length > 300 && (
        <Button variant="ghost" size="sm" className="flex items-center gap-1" onClick={() => setExpanded(!expanded)}>
          {expanded ? "Show less" : "Show more"}
          <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </Button>
      )}

      {additionalDetails && (
        <>
          <h2 className="text-xl font-semibold">Additional Details</h2>
          <div className="prose max-w-none">
            <p>{additionalDetails}</p>
          </div>
        </>
      )}
    </div>
  )
}
