"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { getSiteContent, updateHeroContent } from "@/lib/actions/site-content"
import { FileUpload } from "./file-upload"

const formSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  background_image: z.string().optional(),
  primary_button_text: z.string().min(2, {
    message: "Button text must be at least 2 characters.",
  }),
  primary_button_url: z.string().min(1, {
    message: "Button URL is required.",
  }),
  secondary_button_text: z.string().min(2, {
    message: "Button text must be at least 2 characters.",
  }),
  secondary_button_url: z.string().min(1, {
    message: "Button URL is required.",
  }),
})

export function HeroForm() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      background_image: "",
      primary_button_text: "",
      primary_button_url: "",
      secondary_button_text: "",
      secondary_button_url: "",
    },
  })

  useEffect(() => {
    const loadHeroContent = async () => {
      try {
        const content = await getSiteContent("hero")
        if (content) {
          setBackgroundImage(content.background_image)
          form.reset({
            title: content.title,
            description: content.description || "",
            background_image: content.background_image || "",
            primary_button_text: content.data?.primary_button_text || "",
            primary_button_url: content.data?.primary_button_url || "",
            secondary_button_text: content.data?.secondary_button_text || "",
            secondary_button_url: content.data?.secondary_button_url || "",
          })
        }
      } catch (error) {
        console.error("Error loading hero content:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load hero content.",
        })
      }
    }

    loadHeroContent()
  }, [form, toast])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      await updateHeroContent({
        ...values,
        background_image: values.background_image || backgroundImage,
      })
      toast({
        title: "Success",
        description: "Hero content updated successfully.",
      })
    } catch (error) {
      console.error("Error updating hero content:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update hero content.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hero Section</CardTitle>
        <CardDescription>Update the content displayed in the homepage hero section</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Find Your Dream Property in Tawau" {...field} />
                  </FormControl>
                  <FormDescription>This is the main heading displayed in the hero section.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Discover a wide range of residential and commercial properties..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>A brief description displayed below the title.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Background Image</FormLabel>
              <FileUpload
                value={backgroundImage}
                onChange={(url) => {
                  setBackgroundImage(url)
                  form.setValue("background_image", url || "")
                }}
                onRemove={() => {
                  setBackgroundImage(null)
                  form.setValue("background_image", "")
                }}
              />
              <FormDescription>Background image for the hero section (recommended size: 1920x1080).</FormDescription>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="primary_button_text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Button Text</FormLabel>
                    <FormControl>
                      <Input placeholder="Browse Properties" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="primary_button_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Button URL</FormLabel>
                    <FormControl>
                      <Input placeholder="/properties" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="secondary_button_text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secondary Button Text</FormLabel>
                    <FormControl>
                      <Input placeholder="Contact Agent" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="secondary_button_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secondary Button URL</FormLabel>
                    <FormControl>
                      <Input placeholder="/contact" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
