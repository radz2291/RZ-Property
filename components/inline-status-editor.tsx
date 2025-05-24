"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface InlineStatusEditorProps {
  propertyId: string
  currentStatus: string
  onStatusChange?: (newStatus: string) => void
}

const statusColors = {
  "Available": "bg-green-100 text-green-800",
  "Pending": "bg-yellow-100 text-yellow-800", 
  "Sold": "bg-blue-100 text-blue-800",
  "Rented": "bg-purple-100 text-purple-800",
  "Hidden": "bg-gray-100 text-gray-800",
  "Not Available": "bg-red-100 text-red-800"
}

export function InlineStatusEditor({ propertyId, currentStatus, onStatusChange }: InlineStatusEditorProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [status, setStatus] = useState(currentStatus)

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true)
    
    try {
      const response = await fetch(`/api/properties/${propertyId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (!response.ok) {
        throw new Error('Failed to update status')
      }

      setStatus(newStatus)
      onStatusChange?.(newStatus)
      
      toast({
        title: "Status updated",
        description: `Property status changed to ${newStatus}`,
      })
    } catch (error) {
      console.error('Error updating status:', error)
      toast({
        title: "Error",
        description: "Failed to update property status",
        variant: "destructive"
      })
    } finally {
      setIsUpdating(false)
    }
  }

  if (isUpdating) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">Updating...</span>
      </div>
    )
  }

  return (
    <Select value={status} onValueChange={handleStatusChange}>
      <SelectTrigger className="w-auto border-none shadow-none p-0 h-auto">
        <SelectValue asChild>
          <Badge className={statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}>
            {status}
          </Badge>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Available">Available</SelectItem>
        <SelectItem value="Pending">Pending</SelectItem>
        <SelectItem value="Sold">Sold</SelectItem>
        <SelectItem value="Rented">Rented</SelectItem>
        <SelectItem value="Hidden">Hidden</SelectItem>
        <SelectItem value="Not Available">Not Available</SelectItem>
      </SelectContent>
    </Select>
  )
}
