import PropertyForm from "@/components/property-form"

export default function NewPropertyPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Add New Property</h1>
        <p className="text-muted-foreground">Create a new property listing</p>
      </div>

      <PropertyForm />
    </div>
  )
}
