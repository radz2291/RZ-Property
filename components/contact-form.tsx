"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare } from "lucide-react"
import { submitContactForm } from "@/lib/actions"

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)

    try {
      await submitContactForm(formData)
      setIsSuccess(true)
      e.currentTarget.reset()
    } catch (err) {
      setError("There was an error submitting your message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const openWhatsApp = () => {
    const message = `Hi, I'd like to inquire about properties in Tawau.`
    const encodedMessage = encodeURIComponent(message)
    const whatsappNumber = "60123456789" // Replace with actual WhatsApp number
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, "_blank")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send a Message</CardTitle>
        <CardDescription>Fill out the form below and I'll get back to you as soon as possible.</CardDescription>
      </CardHeader>
      <CardContent>
        {isSuccess ? (
          <div className="p-4 text-center bg-primary/10 rounded-lg">
            <h3 className="mb-2 font-semibold text-primary">Message Sent Successfully!</h3>
            <p className="mb-4 text-sm">Thank you for contacting us. We'll get back to you shortly.</p>
            <Button variant="outline" onClick={() => setIsSuccess(false)}>
              Send Another Message
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" type="tel" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email (Optional)</Label>
              <Input id="email" name="email" type="email" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                rows={4}
                placeholder="Let me know how I can help you..."
                required
              />
            </div>

            {error && <div className="p-2 text-sm text-red-600 bg-red-50 rounded">{error}</div>}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="px-2 bg-background text-muted-foreground">Or</span>
              </div>
            </div>

            <Button type="button" variant="outline" className="w-full gap-2" onClick={openWhatsApp}>
              <MessageSquare className="w-4 h-4" />
              Contact via WhatsApp
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
