"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Calendar, MapPin, Users, Clock, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface EventPreviewProps {
  event?: {
    id: string
    title: string
    club: string
    date: string
    time: string
    venue: string
    capacity: number
    registered: number
    description: string
    posterUrl?: string
  }
}

export function EventPreview({ event }: EventPreviewProps) {
  const defaultEvent = {
    id: "1",
    title: "AI & Machine Learning Workshop",
    club: "IEEE",
    date: "March 15, 2025",
    time: "2:00 PM - 5:00 PM",
    venue: "Main Auditorium",
    capacity: 500,
    registered: 342,
    description:
      "Join us for an exciting workshop on AI and Machine Learning. Learn from industry experts about the latest trends and practical applications of AI. This workshop covers deep learning, neural networks, and real-world use cases.",
    posterUrl: "/placeholder.svg?key=poster1",
  }

  const searchParams = useSearchParams()
  const router = useRouter()
  const [apiEvent, setApiEvent] = useState<any | null>(null)
  const eventId = searchParams.get("id")

  useEffect(() => {
    const load = async () => {
      if (!eventId) return
      try {
        const res = await fetch(`/api/events/${eventId}`)
        if (res.ok) {
          const data = await res.json()
          setApiEvent(data)
        }
      } catch {
        // ignore
      }
    }
    load()
  }, [eventId])

  const displayEvent = useMemo(() => {
    if (apiEvent) {
      const start = new Date(apiEvent.start_time)
      const end = new Date(apiEvent.end_time)
      return {
        id: apiEvent.id,
        title: apiEvent.name,
        club: apiEvent.club_id || "Club",
        date: start.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
        time: `${start.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })} - ${end.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`,
        venue: apiEvent.venue_name || "Venue",
        capacity: apiEvent.capacity || 0,
        registered: 0,
        description: apiEvent.description || "",
        posterUrl: apiEvent.payment_qr_code || undefined,
      }
    }
    if (event) return event
    return defaultEvent
  }, [apiEvent, event])

  const spotsLeft = displayEvent.capacity - displayEvent.registered
  const isAlmostFull = spotsLeft < 50

  return (
    <div className="space-y-6">
      {/* Poster */}
      <div className="bg-card text-card-foreground border border-border rounded-lg overflow-hidden">
        <div className="relative w-full h-96 bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
          {displayEvent.posterUrl ? (
            <Image
              src={displayEvent.posterUrl}
              alt={displayEvent.title}
              fill
              className="object-cover"
              onError={(e) => {
                const el = e.target as HTMLImageElement
                if (el) el.style.display = "none"
              }}
            />
          ) : (
            <img src="/placeholder.svg" alt={displayEvent.title} className="w-full h-full object-cover" />
          )}
        </div>
      </div>

      {/* Event Details */}
      <div className="bg-card text-card-foreground border border-border rounded-lg p-8">
        {/* Header */}
        <div className="mb-6">
          <div className="inline-block px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-medium mb-3">
            {displayEvent.club}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{displayEvent.title}</h1>
          <p className="text-muted-foreground">{displayEvent.description}</p>
        </div>

        {/* Key Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 pb-8 border-b border-border">
          <div className="flex items-start gap-4">
            <Calendar className="text-primary flex-shrink-0 mt-1" size={24} />
            <div>
              <p className="text-sm text-muted-foreground">Date & Time</p>
              <p className="font-semibold">{displayEvent.date}</p>
              <p className="text-sm text-muted-foreground">{displayEvent.time}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <MapPin className="text-primary flex-shrink-0 mt-1" size={24} />
            <div>
              <p className="text-sm text-muted-foreground">Venue</p>
              <p className="font-semibold">{displayEvent.venue}</p>
              <p className="text-sm text-muted-foreground">Building A, Room 101</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Users className="text-primary flex-shrink-0 mt-1" size={24} />
            <div>
              <p className="text-sm text-muted-foreground">Attendees</p>
              <p className="font-semibold">{displayEvent.registered} Registered</p>
              <p className="text-sm text-muted-foreground">Capacity: {displayEvent.capacity}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Clock className="text-primary flex-shrink-0 mt-1" size={24} />
            <div>
              <p className="text-sm text-muted-foreground">Spots Available</p>
              <p className={`font-semibold ${isAlmostFull ? "text-destructive" : "text-primary"}`}>{spotsLeft} left</p>
              <p className="text-xs text-muted-foreground">{isAlmostFull && "Hurry! Spots are filling up"}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => router.push(`/register-events?eventId=${displayEvent.id}`)}
          >
            Register Now
          </Button>
          <Button variant="outline" className="flex-1 flex items-center justify-center gap-2 bg-transparent">
            <Share2 size={18} />
            Share Event
          </Button>
          <Button variant="outline" className="flex-1 bg-transparent">
            Add to Calendar
          </Button>
        </div>
      </div>

      {/* More Information */}
      <div className="bg-secondary/10 text-card-foreground border border-border rounded-lg p-6">
        <h3 className="font-bold mb-4">What to Expect</h3>
        <ul className="space-y-3 text-sm">
          <li className="flex gap-3">
            <span className="text-primary">✓</span>
            <span>Expert lectures and live demonstrations</span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary">✓</span>
            <span>Hands-on coding sessions</span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary">✓</span>
            <span>Q&A session with professionals</span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary">✓</span>
            <span>Refreshments and networking</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
