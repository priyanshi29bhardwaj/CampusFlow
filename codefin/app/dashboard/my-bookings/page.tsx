"use client"

import { useEffect, useState } from "react"
import { apiRequest } from "@/lib/api"

interface Booking {
  id: string
  venue_name: string
  booked_start: string
  booked_end: string
  expected_attendees: number
  special_requirements: string
  status: string
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBookings = async () => {
      const data = await apiRequest("/api/venues/my-bookings")
      setBookings(data)
      setLoading(false)
    }
    fetchBookings()
  }, [])

  if (loading) return <p className="p-6">Loading bookings...</p>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Venue Booking Requests</h1>

      {bookings.length === 0 ? (
        <p>No booking requests yet.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b.id} className="bg-card border border-border rounded-lg p-4">
              <h2 className="font-bold text-lg">{b.venue_name}</h2>
              <p className="text-sm">
                {new Date(b.booked_start).toLocaleString()} → {new Date(b.booked_end).toLocaleString()}
              </p>
              <p className="text-sm">Attendees: {b.expected_attendees}</p>
              {b.special_requirements && (
                <p className="text-sm">Requirements: {b.special_requirements}</p>
              )}
              <span className={`mt-2 inline-block px-3 py-1 text-xs rounded-full 
                ${b.status === "approved" ? "bg-green-100 text-green-700" :
                  b.status === "rejected" ? "bg-red-100 text-red-700" :
                  "bg-yellow-100 text-yellow-700"}`}>
                {b.status.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}