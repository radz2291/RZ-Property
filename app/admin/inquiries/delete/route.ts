import { deleteInquiry } from "@/lib/actions/inquiry-actions"

export async function POST(request: Request) {
  const formData = await request.formData()
  
  try {
    await deleteInquiry(formData)
    return Response.json({ success: true })
  } catch (error) {
    console.error("Error in delete inquiry route:", error)
    return Response.json({ success: false, error: (error as Error).message }, { status: 400 })
  }
}
