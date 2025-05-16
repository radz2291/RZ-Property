import { updateInquiryStatus } from "@/lib/actions/inquiry-actions"

export async function POST(request: Request) {
  const formData = await request.formData()
  
  try {
    await updateInquiryStatus(formData)
    return Response.json({ success: true })
  } catch (error) {
    console.error("Error in update status route:", error)
    return Response.json({ success: false, error: (error as Error).message }, { status: 400 })
  }
}
