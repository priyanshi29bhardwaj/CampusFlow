"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Calendar, MapPin, Users, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

interface Event {
  id: string
  name: string
  description: string
  start_time: string
  end_time: string
  venue_id: string | null
  capacity: number | null
  registration_fee: number
  venue_name?: string
  venue_location?: string
  club_id: string | null
}

interface Club {
  id: string
  name: string
  description: string
  contact_email: string
}

export default function ClubDetailPage() {
  const params = useParams()
  const clubId = params.id as string
  const [events, setEvents] = useState<Event[]>([])
  const [club, setClub] = useState<Club | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const clubNames: { [key: string]: { name: string; description: string; logo: string } } = {
    ieee: { name: "IEEE", description: "Institute of Electrical and Electronics Engineers", logo: "/ieee-logo-professional.jpg" },
    acm: { name: "ACM", description: "Association for Computing Machinery", logo: "/acm-logo-computing.jpg" },
    aperture: { name: "APERTURE", description: "Photography and Visual Arts Club", logo: "/camera-aperture-logo.jpg" },
    cactus: { name: "CACTUS", description: "Environmental and Sustainability Club", logo: "/cactus-nature-logo.jpg" },
    litmus: { name: "LITMUS", description: "Literary Arts and Writing Club", logo: "/literature-book-logo.jpg" },
    cinefelia: { name: "CINEFELIA", description: "Cinema and Film Discussion Club", logo: "/film-reel-movie-logo.jpg" },
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        
        // Fetch clubs from backend
        const clubsResponse = await fetch("/api/clubs")
        if (clubsResponse.ok) {
          const allClubs = await clubsResponse.json()
          const clubInfo = clubNames[clubId.toLowerCase()]
          
          // Find club by ID first, then by name match
          let dbClub = allClubs.find((c: any) => c.id === clubId)
          
          // If not found by ID, try to match by name
          if (!dbClub && clubInfo) {
            dbClub = allClubs.find((c: any) => 
              c.name.toLowerCase() === clubInfo.name.toLowerCase()
            )
          }
          
          if (dbClub) {
            setClub({
              id: dbClub.id,
              name: dbClub.name,
              description: dbClub.description,
              contact_email: dbClub.contact_email,
            })
            
            // Fetch events and filter by club_id
            const eventsResponse = await fetch("/api/events")
            if (eventsResponse.ok) {
              const allEvents = await eventsResponse.json()
              const clubEvents = allEvents.filter((e: any) => e.club_id === dbClub.id)
              setEvents(clubEvents)
            }
          } else if (clubInfo) {
            // Fallback to static data if club not in database
            setClub({
              id: clubId,
              name: clubInfo.name,
              description: clubInfo.description,
              contact_email: `${clubId}@university.edu`,
            })
            
            // Show all events if club not in database
            const eventsResponse = await fetch("/api/events")
            if (eventsResponse.ok) {
              const allEvents = await eventsResponse.json()
              setEvents(allEvents)
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (clubId) {
      fetchData()
    }
  }, [clubId])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading club events...</p>
        </div>
      </div>
    )
  }

  if (!club) {
    return (
      <div className="p-6 md:p-8">
        <div className="bg-destructive/10 text-destructive border border-destructive rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Club Not Found</h2>
          <p className="mb-4">The club you're looking for doesn't exist.</p>
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  const clubLogo = clubNames[clubId.toLowerCase()]?.logo || "/placeholder-logo.svg"

  return (
    <div className="p-6 md:p-8">
      {/* Club Header */}
      <div className="mb-8">
        <div className="flex items-center gap-6 mb-4 bg-card border border-border rounded-lg p-6">
          <div className="w-24 h-24 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
            <Image
              src={clubLogo}
              alt={club.name}
              width={96}
              height={96}
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{club.name}</h1>
            <p className="text-muted-foreground">{club.description}</p>
            <p className="text-sm text-muted-foreground mt-2">{club.contact_email}</p>
          </div>
        </div>
        <Link href="/dashboard">
          <Button variant="outline">← Back to Dashboard</Button>
        </Link>
      </div>

      {/* Events Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Upcoming Events ({events.length})</h2>

        {events.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <p className="text-muted-foreground">No events scheduled yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                {event.payment_qr_code && (
                  <div className="w-full h-48 bg-muted flex items-center justify-center overflow-hidden">
                    <Image
                      src={event.payment_qr_code}
                      alt={event.name}
                      width={400}
                      height={200}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Hide image if it fails to load
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{event.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{event.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar size={16} className="text-muted-foreground" />
                    <span>{formatDate(event.start_time)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock size={16} className="text-muted-foreground" />
                    <span>
                      {formatTime(event.start_time)} - {formatTime(event.end_time)}
                    </span>
                  </div>
                  {event.venue_name && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin size={16} className="text-muted-foreground" />
                      <span>{event.venue_name}</span>
                    </div>
                  )}
                  {event.capacity && (
                    <div className="flex items-center gap-2 text-sm">
                      <Users size={16} className="text-muted-foreground" />
                      <span>Capacity: {event.capacity}</span>
                    </div>
                  )}
                  {event.registration_fee > 0 && (
                    <div className="text-sm font-semibold text-primary">
                      Registration Fee: ₹{event.registration_fee}
                    </div>
                  )}
                </div>

                  <div className="flex gap-2">
                    <Link href={`/preview-event?id=${event.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">View Details</Button>
                    </Link>
                    <Link href={`/register-events?eventId=${event.id}`} className="flex-1">
                      <Button className="w-full">Register Now</Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

