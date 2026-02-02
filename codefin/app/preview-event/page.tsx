import { EventPreview } from "@/components/event-preview"

export default function PreviewEventPage() {
  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Event Preview</h1>
        <p className="text-muted-foreground">View complete event details and manage registrations</p>
      </div>

      <div className="max-w-4xl">
        <EventPreview />
      </div>
    </div>
  )
}
