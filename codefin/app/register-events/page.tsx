"use client"

import { EventRegistrationForm } from "@/components/event-registration-form"
import { useSearchParams } from "next/navigation"

export default function RegisterEventsPage() {
  const searchParams = useSearchParams()
  const eventId = searchParams.get("eventId")

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Register for Events</h1>
        <p className="text-muted-foreground">Browse and register for upcoming events organized by university clubs</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <EventRegistrationForm eventId={eventId || undefined} />
        </div>

        {/* Sidebar Info */}
        <div className="space-y-4">
          <div className="bg-accent text-accent-foreground border border-border rounded-lg p-6">
            <h3 className="font-bold mb-2">Need Help?</h3>
            <p className="text-sm mb-4">Contact your club organizer for more details about the event.</p>
          </div>

          <div className="bg-card text-card-foreground border border-border rounded-lg p-6">
            <h3 className="font-bold mb-4">Recent Events</h3>
            <div className="space-y-3">
              {["AI Workshop", "Photography Walk", "Film Screening"].map((event) => (
                <div key={event} className="text-sm hover:text-primary cursor-pointer transition-colors">
                  • {event}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
