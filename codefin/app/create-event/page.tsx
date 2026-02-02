import { EventCreationForm } from "@/components/event-creation-form"

export default function CreateEventPage() {
  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create an Event</h1>
        <p className="text-muted-foreground">Organize and publish a new event for your club</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <EventCreationForm />
        </div>

        {/* Sidebar Tips */}
        <div className="space-y-4">
          <div className="bg-secondary text-secondary-foreground border border-border rounded-lg p-6">
            <h3 className="font-bold mb-2">Event Tips</h3>
            <ul className="text-sm space-y-2">
              <li>✓ Add a clear event title</li>
              <li>✓ Write detailed description</li>
              <li>✓ Choose appropriate venue</li>
              <li>✓ Set realistic capacity</li>
            </ul>
          </div>

          <div className="bg-card text-card-foreground border border-border rounded-lg p-6">
            <h3 className="font-bold mb-4">Event Categories</h3>
            <div className="space-y-2 text-sm">
              <p>• Workshop: Hands-on learning</p>
              <p>• Seminar: Educational talk</p>
              <p>• Conference: Formal meeting</p>
              <p>• Competition: Contest/Challenge</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
