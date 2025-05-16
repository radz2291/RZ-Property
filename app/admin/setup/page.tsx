import DbInitializer from "@/components/db-initializer"

export default function SetupPage() {
  return (
    <div className="container px-4 py-12 mx-auto">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Database Setup</h1>
          <p className="mt-4 text-muted-foreground">
            Initialize your Supabase database for the Property Catalog Platform
          </p>
        </div>

        <DbInitializer />

        <div className="p-4 border rounded-lg bg-muted/30">
          <h2 className="mb-2 text-lg font-medium">What this does</h2>
          <ul className="ml-6 space-y-2 list-disc">
            <li>Creates all necessary database tables according to the schema</li>
            <li>Sets up relationships between tables</li>
            <li>Creates a default agent profile</li>
            <li>Seeds the database with sample property listings</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
