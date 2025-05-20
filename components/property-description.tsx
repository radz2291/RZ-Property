"use client"

interface PropertyDescriptionProps {
  description: string
  additionalDetails?: string
}

export function PropertyDescription({ description, additionalDetails }: PropertyDescriptionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Description</h2>

        <div className="prose max-w-none">
          {description.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

      {/* Show more/less button removed as requested */}

      {/* Additional Details section removed as requested */}
    </div>
  )
}
