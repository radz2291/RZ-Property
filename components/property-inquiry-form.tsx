"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, SendHorizontal } from "lucide-react"
import { WhatsAppIcon } from "@/components/icons"
import { submitInquiry } from "@/lib/actions"
import { toast } from "@/components/ui/use-toast"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

// Define validation schema with Zod
const inquiryFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .min(7, "Phone number must be at least 7 digits")
    .regex(/^[0-9+\-\s()]*$/, "Please enter a valid phone number format"),
  email: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  message: z.string().min(5, "Message must be at least 5 characters"),
})

type InquiryFormValues = z.infer<typeof inquiryFormSchema>

interface PropertyInquiryFormProps {
  propertyId: string
  propertyTitle: string
}

export function PropertyInquiryForm({ propertyId, propertyTitle }: PropertyInquiryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize form with react-hook-form
  const form = useForm<InquiryFormValues>({
    resolver: zodResolver(inquiryFormSchema),
    mode: "all",
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      message: `I'm interested in this property. Please contact me with more information.`,
    },
  })

  const onSubmit = async (values: InquiryFormValues) => {
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      Object.entries(values).forEach(([key, value]) => {
        if (value) formData.append(key, value)
      })

      await submitInquiry(formData, propertyId)

      // Show success toast
      toast({
        title: "Inquiry sent successfully",
        description: "Thank you for your interest. Our agent will contact you shortly.",
      })

      // Reset form
      form.reset({
        name: "",
        phone: "",
        email: "",
        message: `I'm interested in this property. Please contact me with more information.`,
      })
    } catch (err) {
      console.error('Inquiry submission error:', err)
      
      // Show error toast
      toast({
        title: "Error sending inquiry",
        description: "There was a problem sending your inquiry. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const openWhatsApp = () => {
    const message = `Hi, I'm interested in the property: ${propertyTitle}. Can you provide more information?`
    const encodedMessage = encodeURIComponent(message)
    const whatsappNumber = "60123456789" // Replace with actual WhatsApp number
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, "_blank")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interested in this property?</CardTitle>
        <CardDescription>Fill out the form below and our agent will contact you shortly.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Your name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input {...field} type="tel" placeholder="Your phone number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (Optional)</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="Your email address" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full" 
              variant="outline"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <SendHorizontal className="w-4 h-4" />
                  Send Inquiry
                </>
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="px-2 bg-background text-muted-foreground">Or</span>
              </div>
            </div>

            <Button 
              type="button" 
              variant="outline" 
              className="w-full gap-2 bg-[#25D366] hover:bg-[#22c05f] border-[#25D366] hover:border-[#22c05f] text-white hover:text-white" 
              onClick={openWhatsApp}
            >
              <WhatsAppIcon width={16} height={16} fill="white" />
              Inquiry via WhatsApp
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
