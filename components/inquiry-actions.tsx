"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { updateInquiryStatus, deleteInquiry } from "@/lib/actions/inquiry-actions"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

interface InquiryActionsProps {
  inquiryId: string
  currentStatus: string
}

export default function InquiryActions({ inquiryId, currentStatus }: InquiryActionsProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isDeleting, setIsDeleting] = useState(false)
  const [actionType, setActionType] = useState<string | null>(null)

  const handleUpdateStatus = (status: string) => {
    setActionType(status)
    const formData = new FormData()
    formData.append("id", inquiryId)
    formData.append("status", status)

    startTransition(async () => {
      await updateInquiryStatus(formData)
      router.refresh()
    })
  }

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this inquiry? This action cannot be undone.")) {
      setIsDeleting(true)
      const formData = new FormData()
      formData.append("id", inquiryId)

      startTransition(async () => {
        await deleteInquiry(formData)
        router.push("/admin/inquiries")
      })
    }
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <Button 
          className="w-full" 
          variant={currentStatus === "Contacted" ? "outline" : "default"} 
          disabled={isPending && actionType === "Contacted"} 
          onClick={() => handleUpdateStatus("Contacted")}
        >
          {isPending && actionType === "Contacted" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Mark as Contacted"
          )}
        </Button>
        <Button 
          className="w-full" 
          variant={currentStatus === "Closed" ? "outline" : "default"} 
          disabled={isPending && actionType === "Closed"}
          onClick={() => handleUpdateStatus("Closed")}
        >
          {isPending && actionType === "Closed" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Mark as Closed"
          )}
        </Button>
      </div>
      <Button 
        variant="destructive" 
        className="w-full mt-4" 
        disabled={isDeleting}
        onClick={handleDelete}
      >
        {isDeleting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Deleting...
          </>
        ) : (
          "Delete Inquiry"
        )}
      </Button>
    </>
  )
}
