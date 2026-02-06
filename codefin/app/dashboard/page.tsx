"use client"

import { useState, useEffect } from "react"
import { ClubCard } from "@/components/club-card"
import { Search } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { apiRequest } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface Club {
  id: string
  name: string
  description: string
  contact_email: string
}

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [clubs, setClubs] = useState<Club[]>([])
  const [eventCounts, setEventCounts] = useState<{ [key: string]: number }>({})
  const [isLoading, setIsLoading] = useState(true)

  const { user } = useAuth()
  const router = useRouter()
  const userRole = user?.role
  const userClubId = user?.clubId

  const [myEvents, setMyEvents] = useState<any[]>([])

  const clubLogos: { [key: string]: string } = {
    ieee: "/ieee-logo-professional.jpg",
    acm: "/acm-logo-computing.jpg",
    aperture: "/camera-aperture-logo.jpg",
    cactus: "/cactus-nature-logo.jpg",
    litmus: "/literature-book-logo.jpg",
    cinefelia: "/film-reel-movie-logo.jpg",
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [clubsRes, eventsRes] = await Promise.all([
          fetch("http://localhost:3001/api/clubs"),
          fetch("/api/events"),
        ])

        let clubsData: Club[] = []
        if (clubsRes.ok) {
          clubsData = await clubsRes.json()
          setClubs(clubsData)
        }

        if (eventsRes.ok) {
          const eventsData = await eventsRes.json()
          const counts: { [key: string]: number } = {}
          clubsData.forEach((club: Club) => {
            counts[club.id] = eventsData.filter((e: any) => e.club_id === club.id).length
          })
          setEventCounts(counts)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const fetchEventCounts = async () => {
      try {
        const eventsRes = await fetch("/api/events")
        if (eventsRes.ok) {
          const eventsData = await eventsRes.json()
          const counts: { [key: string]: number } = {}
          clubs.forEach((club) => {
            counts[club.id] = eventsData.filter((e: any) => e.club_id === club.id).length
          })
          setEventCounts(counts)
        }
      } catch (error) {
        console.error("Error fetching event counts:", error)
      }
    }

    if (clubs.length > 0) {
      fetchEventCounts()
    }
  }, [clubs.length])

  // Fetch ONLY this club owner's events
  useEffect(() => {
    const fetchMyEvents = async () => {
      if (userRole !== "club_owner" || !userClubId) return

      try {
        const events = await apiRequest("/api/events")
        const filtered = events.filter((e: any) => e.club_id === userClubId)
        setMyEvents(filtered)
      } catch (err) {
        console.error("Failed to load my events", err)
      }
    }

    fetchMyEvents()
  }, [userRole, userClubId])

  const filteredClubs = clubs.filter((club) => {
    const query = searchQuery.toLowerCase()
    return (
      club.name.toLowerCase().includes(query) ||
      club.description.toLowerCase().includes(query) ||
      club.id.toLowerCase().includes(query)
    )
  })

  const totalEvents = Object.values(eventCounts).reduce((sum, count) => sum + count, 0)
  const upcomingEvents = Math.floor(totalEvents * 0.3)

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome to Campus Flow</h1>
        <p className="text-muted-foreground">Discover and manage university events across all clubs</p>
      </div>

      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search clubs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-card text-card-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-card text-card-foreground border border-border rounded-lg p-6">
          <p className="text-sm text-muted-foreground mb-1">Total Clubs</p>
          <p className="text-3xl font-bold text-primary">{clubs.length}</p>
        </div>
        <div className="bg-card text-card-foreground border border-border rounded-lg p-6">
          <p className="text-sm text-muted-foreground mb-1">Active Events</p>
          <p className="text-3xl font-bold text-primary">{totalEvents}</p>
        </div>
        <div className="bg-card text-card-foreground border border-border rounded-lg p-6">
          <p className="text-sm text-muted-foreground mb-1">Upcoming Events</p>
          <p className="text-3xl font-bold text-primary">{upcomingEvents}</p>
        </div>
      </div>

      {/* Clubs Grid */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-6">
          College Clubs {searchQuery && `(${filteredClubs.length} found)`}
        </h2>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading clubs...</p>
          </div>
        ) : filteredClubs.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <p className="text-muted-foreground">No clubs found matching "{searchQuery}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClubs.map((club) => {
              const clubKey = club.name.toLowerCase()
              return (
                <ClubCard
                  key={club.id}
                  id={club.id}
                  name={club.name}
                  logo={clubLogos[clubKey] || "/placeholder-logo.svg"}
                  description={club.description}
                  eventCount={eventCounts[club.id] || 0}
                />
              )
            })}
          </div>
        )}
      </div>

      {/* ================= MY CLUB EVENTS ================= */}
      {userRole === "club_owner" && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">My Club Events</h2>

          {myEvents.length === 0 ? (
            <p className="text-muted-foreground">You haven't created any events yet.</p>
          ) : (
            <div className="space-y-4">
              {myEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-card border border-border p-4 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-semibold">{event.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(event.start_time).toLocaleDateString()}
                    </p>
                  </div>

                  <Button
                    variant="destructive"
                    onClick={async () => {
                      if (!confirm("Delete this event?")) return
                      try {
                        await apiRequest(`/api/events/${event.id}`, { method: "DELETE" })
                        setMyEvents((prev) => prev.filter((e) => e.id !== event.id))
                      } catch (err: any) {
                        alert(err.message)
                      }
                    }}
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
