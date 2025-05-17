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
import { getAgentProfile, updateAgentProfile } from "@/lib/actions/site-content"
import { FileUpload } from "./file-upload"
import { MultiSelect } from "./multi-select"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  photo: z.string().optional(),
  bio: z.string().min(20, {
    message: "Bio must be at least 20 characters.",
  }),
  phone_number: z.string().min(8, {
    message: "Please enter a valid phone number.",
  }),
  whatsapp_number: z.string().min(8, {
    message: "Please enter a valid WhatsApp number.",
  }),
  email: z.string().email().optional().or(z.literal("")),
  years_of_experience: z.number().min(0, {
    message: "Years of experience must be a positive number.",
  }),
  specialties: z.array(z.string()).min(1, {
    message: "Please select at least one specialty.",
  }),
})

// Available agent specialties
const specialtyOptions = [
  { value: "Residential", label: "Residential" },
  { value: "Commercial", label: "Commercial" },
  { value: "Land", label: "Land" },
  { value: "New Developments", label: "New Developments" },
  { value: "Luxury Properties", label: "Luxury Properties" },
  { value: "Investment Properties", label: "Investment Properties" },
]

export function AgentProfileForm() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [agentPhoto, setAgentPhoto] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      bio: "",
      phone_number: "",
      whatsapp_number: "",
      email: "",
      years_of_experience: 0,
      specialties: [],
    },
  })

  useEffect(() => {
    const loadAgentProfile = async () => {
      try {
        const agent = await getAgentProfile()
        if (agent) {
          setAgentPhoto(agent.photo)
          form.reset({
            name: agent.name,
            bio: agent.bio,
            phone_number: agent.phone_number,
            whatsapp_number: agent.whatsapp_number,
            email: agent.email || "",
            years_of_experience: agent.years_of_experience,
            specialties: agent.specialties,
          })
        }
      } catch (error) {
        console.error("Error loading agent profile:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load agent profile.",
        })
      }
    }

    loadAgentProfile()
  }, [form, toast])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      await updateAgentProfile({
        ...values,
        photo: values.photo || agentPhoto,
      })
      toast({
        title: "Success",
        description: "Agent profile updated successfully.",
      })
    } catch (error) {
      console.error("Error updating agent profile:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update agent profile.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agent Profile</CardTitle>
        <CardDescription>Update your personal information and profile details</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <FormLabel>Profile Photo</FormLabel>
              <FileUpload
                value={agentPhoto}
                onChange={(url) => {
                  setAgentPhoto(url)
                  form.setValue("photo", url || "")
                }}
                onRemove={() => {
                  setAgentPhoto(null)
                  form.setValue("photo", "")
                }}
              />
              <FormDescription>Your profile photo displayed on the website.</FormDescription>
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="RZ Amin" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="With over 5 years of experience in the Tawau property market..."
                      {...field}
                      rows={5}
                    />
                  </FormControl>
                  <FormDescription>
                    A brief description of yourself and your expertise that will be displayed on the website.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+60123456789" {...field} />
                    </FormControl>
                    <FormDescription>Your contact phone number with country code.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="whatsapp_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp Number</FormLabel>
                    <FormControl>
                      <Input placeholder="60123456789" {...field} />
                    </FormControl>
                    <FormDescription>Your WhatsApp number (without '+' for direct integration).</FormDescription>
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
                      <Input placeholder="yourname@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="years_of_experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Years of Experience</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="5"
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="specialties"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specialties</FormLabel>
                  <FormControl>
                    <MultiSelect
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      options={specialtyOptions}
                      placeholder="Select specialties..."
                    />
                  </FormControl>
                  <FormDescription>Select your areas of specialization in real estate.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
