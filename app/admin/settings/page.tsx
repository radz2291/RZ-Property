"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HeroForm } from "@/components/admin/hero-form"
import { FAQForm } from "@/components/admin/faq-form"
import { AgentProfileForm } from "@/components/admin/agent-profile-form"
import { FeaturedPropertiesForm } from "@/components/admin/featured-properties-form"

export default function SettingsPage() {
  return (
    <div className="container px-4 py-12 mx-auto">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Website Content Settings</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your website content including hero section, agent profile, and FAQ section.
          </p>
        </div>

        <Tabs defaultValue="hero" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="hero">Hero Section</TabsTrigger>
            <TabsTrigger value="agent">Agent Profile</TabsTrigger>
            <TabsTrigger value="featured">Featured Properties</TabsTrigger>
            <TabsTrigger value="faq">FAQ Section</TabsTrigger>
          </TabsList>
          <TabsContent value="hero" className="space-y-6">
            <HeroForm />
          </TabsContent>
          <TabsContent value="agent" className="space-y-6">
            <AgentProfileForm />
          </TabsContent>
          <TabsContent value="featured" className="space-y-6">
            <FeaturedPropertiesForm />
          </TabsContent>
          <TabsContent value="faq" className="space-y-6">
            <FAQForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
