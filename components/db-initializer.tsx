"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { initializeDatabaseSimple } from "@/lib/init-db-simple"
import { createStorageBucket } from "@/lib/create-storage-bucket"
import { initializeSiteContent } from "@/lib/init-site-content"
import { Loader2 } from "lucide-react"

export default function DbInitializer() {
  const [isInitializing, setIsInitializing] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const [logs, setLogs] = useState<string[]>([])

  const handleInitialize = async () => {
    setIsInitializing(true)
    setLogs(["Starting database initialization..."])

    try {
      // Initialize the database
      const dbResult = await initializeDatabaseSimple()
      setLogs((prev) => [...prev, dbResult.message])

      // Create storage bucket
      setLogs((prev) => [...prev, "Creating storage bucket..."])
      const storageResult = await createStorageBucket()
      setLogs((prev) => [...prev, storageResult.message])
      
      // Initialize site content
      setLogs((prev) => [...prev, "Initializing site content..."])
      const contentResult = await initializeSiteContent()
      setLogs((prev) => [...prev, contentResult.message])

      setResult({
        success: dbResult.success && storageResult.success && contentResult.success,
        message:
          dbResult.success && storageResult.success && contentResult.success
            ? "Database, storage, and site content initialized successfully"
            : "Initialization completed with some errors",
      })
    } catch (error) {
      const errorMessage = `Error: ${(error as Error).message}`
      setResult({
        success: false,
        message: errorMessage,
      })
      setLogs((prev) => [...prev, errorMessage])
    } finally {
      setIsInitializing(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Database Initialization</CardTitle>
        <CardDescription>Set up the database tables and seed with initial data</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          This will create all necessary tables in your Supabase database, set up storage for images, and populate the
          database with sample data.
        </p>

        {result && (
          <div
            className={`p-4 mb-4 rounded-md ${
              result.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
            }`}
          >
            {result.message}
          </div>
        )}

        {logs.length > 0 && (
          <div className="mt-4 p-2 bg-gray-50 rounded-md text-sm font-mono h-32 overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index} className="mb-1">
                {log}
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleInitialize} disabled={isInitializing} className="w-full">
          {isInitializing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Initializing...
            </>
          ) : (
            "Initialize Database"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
