"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Calendar } from "./calendar"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { apiRequest } from "@/lib/api"

export function VenueBookingForm() {
  const { user } = useAuth()
  const userRole = user?.role || "student"
  const [clubName, setClubName] = useState<string>("")

  const [formData, setFormData] = useState({
    venueName: "",
    bookedDate: "",
    startTime: "",
    endTime: "",
    expectedAttendees: "",
    requirements: "",
  })

  const [selectedDate, setSelectedDate] = useState<Date>()
  const [submitted, setSubmitted] = useState(false)
  const [venues, setVenues] = useState<Array<{ id: string; name: string; capacity: number }>>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")

  /* ================= FETCH VENUES ================= */
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const res = await fetch("/api/venues")
        if (res.ok) {
          const data = await res.json()
          setVenues(data)
        }
      } catch (error) {
        console.error("Error fetching venues:", error)
      }
    }
    fetchVenues()
  }, [])

  /* ================= FETCH CLUB NAME ================= */
  useEffect(() => {
    const fetchClubName = async () => {
      if (!user?.clubId) return
      try {
        const res = await fetch(`/api/clubs/${user.clubId}`)
        if (res.ok) {
          const data = await res.json()
          setClubName(data.name)
        }
      } catch {
        console.error("Failed to fetch club name")
      }
    }
    fetchClubName()
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    setFormData((prev) => ({ ...prev, bookedDate: `${year}-${month}-${day}` }))
  }

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError("")
    setIsSubmitting(true)

    try {
      const venue = venues.find((v) => v.name === formData.venueName)
      if (!venue) {
        setSubmitError("Please select a valid venue")
        setIsSubmitting(false)
        return
      }

      const attendees = parseInt(formData.expectedAttendees)
      if (attendees > venue.capacity) {
        setSubmitError(`Venue capacity is only ${venue.capacity} people`)
        setIsSubmitting(false)
        return
      }

      const bookedStart = new Date(`${formData.bookedDate}T${formData.startTime}`).toISOString()
      const bookedEnd = new Date(`${formData.bookedDate}T${formData.endTime}`).toISOString()

      // 🔍 FRONTEND CLASH CHECK
      const availabilityResponse = await fetch(
        `/api/venues/${venue.id}/availability?start=${encodeURIComponent(bookedStart)}&end=${encodeURIComponent(bookedEnd)}`
      )

      if (availabilityResponse.ok) {
        const availabilityData = await availabilityResponse.json()
        if (availabilityData.conflicts?.length > 0) {
          setSubmitError("Venue is already booked for this time slot.")
          setIsSubmitting(false)
          return
        }
      }

      // 🔒 BACKEND BOOKING (final check also happens there)
      await apiRequest(`/api/venues/${venue.id}/book`, {
        method: "POST",
        body: JSON.stringify({
          bookedStart,
          bookedEnd,
          expectedAttendees: attendees,
          specialRequirements: formData.requirements,
        }),
      })

      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setFormData({
          venueName: "",
          bookedDate: "",
          startTime: "",
          endTime: "",
          expectedAttendees: "",
          requirements: "",
        })
        setSelectedDate(undefined)
      }, 4000)

    } catch (error: any) {
      setSubmitError(error.message || "Booking failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  /* ================= ROLE CHECK ================= */
  if (userRole !== "club_owner" && userRole !== "admin") {
    return (
      <div className="bg-destructive/10 text-destructive border border-destructive rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Access Restricted</h2>
        <p>Only club owners can book venues.</p>
      </div>
    )
  }

  /* ================= SUCCESS ================= */
  if (submitted) {
    return (
      <div className="bg-card border rounded-lg p-8 text-center">
        <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Booking Request Sent!</h2>
        <p className="text-muted-foreground">Your request is pending approval.</p>
      </div>
    )
  }

  /* ================= FORM ================= */
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold mb-4">Select Date</h3>
        <Calendar onDateSelect={handleDateSelect} selectedDate={selectedDate} />
      </div>

      <div className="bg-card border rounded-lg p-8 space-y-6">
        <div className="bg-muted border rounded-lg p-4 text-sm">
          Booking as club: <span className="font-bold">{clubName || "Your Club"}</span>
        </div>

        {submitError && (
          <div className="bg-destructive/10 text-destructive border border-destructive rounded-lg p-3 text-sm">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <select name="venueName" value={formData.venueName} onChange={handleChange} required className="w-full border rounded-lg p-2">
            <option value="">Select Venue</option>
            {venues.map((venue) => (
              <option key={venue.id} value={venue.name}>
                {venue.name} (Capacity: {venue.capacity})
              </option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-4">
            <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} required className="border rounded-lg p-2" />
            <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} required className="border rounded-lg p-2" />
          </div>

          <input type="number" name="expectedAttendees" value={formData.expectedAttendees} onChange={handleChange} required placeholder="Expected attendees" className="w-full border rounded-lg p-2" />

          <textarea name="requirements" value={formData.requirements} onChange={handleChange} rows={3} placeholder="Special requirements" className="w-full border rounded-lg p-2" />

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Submitting..." : "Submit Booking Request"}
          </Button>
        </form>
      </div>
    </div>
  )
}