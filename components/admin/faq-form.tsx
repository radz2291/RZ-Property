"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import { z } from "zod"
import { getSiteContent, updateFAQContent, FAQItem } from "@/lib/actions/site-content"
import { Plus, Trash2, GripVertical } from "lucide-react"

const faqItemSchema = z.object({
  question: z.string().min(5, {
    message: "Question must be at least 5 characters.",
  }),
  answer: z.string().min(10, {
    message: "Answer must be at least 10 characters.",
  }),
})

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().optional(),
  faqs: z.array(faqItemSchema).min(1, {
    message: "At least one FAQ item is required.",
  }),
})

export function FAQForm() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "Frequently Asked Questions",
      description: "",
      faqs: [
        {
          question: "",
          answer: "",
        },
      ],
    },
  })

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "faqs",
  })

  useEffect(() => {
    const loadFAQContent = async () => {
      try {
        const content = await getSiteContent("faq")
        if (content) {
          const faqs = Array.isArray(content.data) ? content.data : []
          form.reset({
            title: content.title,
            description: content.description || "",
            faqs: faqs.length > 0 ? faqs : [{ question: "", answer: "" }],
          })
        }
      } catch (error) {
        console.error("Error loading FAQ content:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load FAQ content.",
        })
      }
    }

    loadFAQContent()
  }, [form, toast])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      await updateFAQContent({
        title: values.title,
        description: values.description,
        faqs: values.faqs,
      })
      toast({
        title: "Success",
        description: "FAQ content updated successfully.",
      })
    } catch (error) {
      console.error("Error updating FAQ content:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update FAQ content.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>FAQ Section</CardTitle>
        <CardDescription>Manage the questions and answers displayed in the FAQ section</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Frequently Asked Questions" {...field} />
                  </FormControl>
                  <FormDescription>The heading displayed above the FAQ items.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Common questions our clients ask..." {...field} value={field.value || ""} />
                  </FormControl>
                  <FormDescription>Optional description to display below the title.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel>FAQ Items</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ question: "", answer: "" })}
                  className="gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Add FAQ
                </Button>
              </div>

              {fields.map((field, index) => (
                <Card key={field.id} className="p-4 relative">
                  <div className="absolute right-2 top-2 flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className="h-8 w-8"
                      disabled={fields.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>

                  <div className="grid gap-4">
                    <FormField
                      control={form.control}
                      name={`faqs.${index}.question`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Question {index + 1}</FormLabel>
                          <FormControl>
                            <Input placeholder="How do I schedule a property viewing?" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`faqs.${index}.answer`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Answer {index + 1}</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="You can schedule a viewing by contacting us directly..."
                              {...field}
                              rows={4}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </Card>
              ))}
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
