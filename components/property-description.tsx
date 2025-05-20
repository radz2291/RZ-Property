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
  
  // Determine whether to show Show More button (if more than 12 paragraphs)
  const shouldShowButton = paragraphs.length > 12;
  
  // If not expanded and has many paragraphs, only show first 12 paragraphs
  const visibleParagraphs = expanded || !shouldShowButton ? paragraphs : paragraphs.slice(0, 12);
  
  // Function to determine if a line is a list item (starts with -, bullet, or emoji + text pattern)
  const isListItem = (text: string) => {
    const trimmed = text.trim();
    // Basic bullet check
    if (trimmed.startsWith('-') || trimmed.startsWith('•')) return true;
    
    // Check for emoji-like pattern at start (common in the property listings)
    const emojiPattern = /^[\p{Emoji}\p{Emoji_Presentation}\p{Emoji_Modifier}\p{Emoji_Modifier_Base}\p{Emoji_Component}]+ /u;
    return emojiPattern.test(trimmed);
  }
  
  // Function to split bullet/emoji from content
  const splitListItem = (text: string) => {
    const trimmed = text.trim();
    
    // For dash or bullet, just take the first character
    if (trimmed.startsWith('-') || trimmed.startsWith('•')) {
      return {
        marker: trimmed.substring(0, 1),
        content: trimmed.substring(1).trim()
      };
    }
    
    // For emoji pattern, try to find where the emoji ends and content begins
    const matches = trimmed.match(/^([\p{Emoji}\p{Emoji_Presentation}\p{Emoji_Modifier}\p{Emoji_Modifier_Base}\p{Emoji_Component}]+)\s+(.+)/u);
    if (matches && matches.length >= 3) {
      return {
        marker: matches[1],
        content: matches[2]
      };
    }
    
    // Fallback - treat first character as marker
    return {
      marker: trimmed.substring(0, 1),
      content: trimmed.substring(1).trim()
    };
  }
  
  // Function to format a paragraph (handle list items differently)
  const formatParagraph = (text: string, index: number) => {
    if (isListItem(text)) {
      // This is a list item, preserve the bullet/emoji and format appropriately
      const { marker, content } = splitListItem(text);
      return (
        <div key={index} className="flex items-start mb-1">
          <div className="flex-none w-6 text-center">{marker}</div>
          <div className="ml-1">{content}</div>
        </div>
      );
    } else if (text.trim().startsWith('#') || text.trim().startsWith('📋') || text.trim().startsWith('📌')) {
      // This is a section header
      return <p key={index} className="font-semibold mt-3">{text}</p>;
    } else {
      // Regular paragraph
      return <p key={index} className="mb-2">{text}</p>;
    }
  };
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Description</h2>

      <div className="prose max-w-none">
        {visibleParagraphs.map((paragraph, index) => formatParagraph(paragraph, index))}
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