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

        <div className={`prose max-w-none ${!expanded && "line-clamp-4"} [&>p]:my-1`}>
          {description.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

      {description.length > 100 && (
        <Button variant="ghost" size="sm" className="flex items-center gap-1" onClick={() => setExpanded(!expanded)}>
          {expanded ? "Show less" : "Show more"}
          <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </Button>
      )}

      {/* Additional Details section removed as requested */}
    </div>
  )
}
