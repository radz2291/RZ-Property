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
  
  // Split description into paragraphs
  const paragraphs = description.split('\n');
  
  // Determine whether to show Show More button (if more than 6 paragraphs)
  const shouldShowButton = paragraphs.length > 6;
  
  // If not expanded and has many paragraphs, only show first 6 paragraphs
  const visibleParagraphs = expanded || !shouldShowButton ? paragraphs : paragraphs.slice(0, 6);
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Description</h2>

        <div className="prose max-w-none [&>p]:my-1">
          {visibleParagraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

      {shouldShowButton && (
        <Button variant="ghost" size="sm" className="flex items-center gap-1" onClick={() => setExpanded(!expanded)}>
          {expanded ? "Show less" : "Show more"}
          <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </Button>
      )}

      {/* Additional Details section removed as requested */}
    </div>
  )
}
