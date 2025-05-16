"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { setupStoragePolicies } from "@/lib/actions/storage-policies";

export default function StoragePoliciesPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSetupPolicies = async () => {
    setIsSubmitting(true);
    try {
      const result = await setupStoragePolicies();
      setResult(result);
    } catch (error) {
      console.error("Error setting up policies:", error);
      setResult({ success: false, message: "An unexpected error occurred" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Storage Policies</h1>
      <p className="text-muted-foreground">
        This page allows you to set up storage policies for the property-images bucket.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Configure Storage Policies</CardTitle>
          <CardDescription>
            Click the button below to set up DELETE and SELECT policies for the property-images bucket.
            This is required to properly delete images when properties are deleted.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {result && (
            <div
              className={`p-4 mb-4 rounded-lg ${
                result.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              <p className="font-medium">{result.success ? "Success!" : "Error!"}</p>
              <p>{result.message}</p>
            </div>
          )}

          <Button onClick={handleSetupPolicies} disabled={isSubmitting}>
            {isSubmitting ? "Setting up policies..." : "Set Up Storage Policies"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
