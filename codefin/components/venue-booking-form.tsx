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

  const [formData, setFormData] = useState({
    club: "",
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
  const [clubs, setClubs] = useState<Array<{ id: string; name: string }>>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [venuesRes, clubsRes] = await Promise.all([
          fetch("/api/venues"),
          fetch("/api/clubs"),
        ])

        if (venuesRes.ok) {
          const venuesData = await venuesRes.json()
          setVenues(venuesData)
        }

        if (clubsRes.ok) {
          const clubsData = await clubsRes.json()
          setClubs(clubsData)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    // Use local date string to avoid timezone issues
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const dateString = `${year}-${month}-${day}`
    setFormData((prev) => ({
      ...prev,
      bookedDate: dateString,
    }))
  }

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

      if (!formData.bookedDate || !formData.startTime || !formData.endTime) {
        setSubmitError("Please fill in date, start time, and end time")
        setIsSubmitting(false)
        return
      }

      const bookedStart = new Date(`${formData.bookedDate}T${formData.startTime}`).toISOString()
      const bookedEnd = new Date(`${formData.bookedDate}T${formData.endTime}`).toISOString()

      // Check for clashes before booking
      try {
        const availabilityResponse = await fetch(
          `/api/venues/${venue.id}/availability?start=${encodeURIComponent(bookedStart)}&end=${encodeURIComponent(bookedEnd)}`
        )
        
        if (availabilityResponse.ok) {
          const availabilityData = await availabilityResponse.json()
          if (availabilityData.conflicts && availabilityData.conflicts.length > 0) {
            setSubmitError(
              `Venue is already booked during this time. ${availabilityData.conflicts.length} conflicting booking(s) found. Please choose a different time slot.`
            )
            setIsSubmitting(false)
            return
          }
        }
      } catch (availabilityError) {
        console.error("Error checking availability:", availabilityError)
        // Continue with booking attempt - backend will also check
      }

      await apiRequest(`/api/venues/${venue.id}/book`, {
        method: "POST",
        body: JSON.stringify({
          bookedStart,
          bookedEnd,
          expectedAttendees: parseInt(formData.expectedAttendees),
          specialRequirements: formData.requirements,
          clubId: formData.club || null,
        }),
      })

      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setFormData({
          club: "",
          venueName: "",
          bookedDate: "",
          startTime: "",
          endTime: "",
          expectedAttendees: "",
          requirements: "",
        })
        setSelectedDate(undefined)
      }, 5000)
    } catch (error: any) {
      console.error("Booking failed:", error)
      setSubmitError(error.message || "Failed to book venue. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (userRole !== "club_owner" && userRole !== "admin") {
    return (
      <div className="bg-destructive/10 text-destructive border border-destructive rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Access Restricted</h2>
        <p className="mb-4">
          Only club owners and authorized members can book venues. Please contact your club president or the
          administration.
        </p>
        <p className="text-sm">Current Role: {userRole || "Not logged in"}</p>
        {!user && (
          <p className="text-sm mt-2">
            <a href="/login" className="text-primary underline">Please log in as a club owner</a>
          </p>
        )}
      </div>
    )
  }

  if (submitError) {
    return (
      <div className="bg-card text-card-foreground border border-border rounded-lg p-8">
        <div className="bg-destructive/10 text-destructive border border-destructive rounded-lg p-4 mb-4">
          <p className="font-medium">{submitError}</p>
        </div>
        <Button onClick={() => setSubmitError("")} variant="outline" className="w-full rounded-lg border-2 hover:shadow-md transition-all">
          Try Again
        </Button>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="bg-card text-card-foreground border border-border rounded-lg p-8 text-center">
        <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Venue Booked Successfully!</h2>
        <p className="text-muted-foreground mb-6">
          Your venue booking request has been submitted. DSW will review and confirm within 24 hours.
        </p>
        <Button onClick={() => setSubmitted(false)} className="rounded-lg hover:shadow-md transition-all">Book Another Venue</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold mb-4">Select Date</h3>
        <Calendar onDateSelect={handleDateSelect} selectedDate={selectedDate} />
      </div>

      <div className="bg-card text-card-foreground border border-border rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Venue Booking Details</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Club</label>
            <select
              name="club"
              value={formData.club}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-background text-foreground border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select Your Club</option>
              {clubs.map((club) => (
                <option key={club.id} value={club.id}>
                  {club.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Venue</label>
            <select
              name="venueName"
              value={formData.venueName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-background text-foreground border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select Venue</option>
              {venues.map((venue) => (
                <option key={venue.id} value={venue.name}>
                  {venue.name} (Capacity: {venue.capacity})
                </option>
              ))}
            </select>
          </div>

          {formData.bookedDate && (
            <div className="bg-accent text-accent-foreground border border-border rounded-lg p-4">
              <p className="text-sm font-medium">
                Selected Date: <span className="font-bold">
                  {new Date(formData.bookedDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </p>
            </div>
          )}

          {/* Time Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Start Time</label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-background text-foreground border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">End Time</label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-background text-foreground border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Expected Attendees */}
          <div>
            <label className="block text-sm font-medium mb-2">Expected Attendees</label>
            <input
              type="number"
              name="expectedAttendees"
              value={formData.expectedAttendees}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-background text-foreground border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., 150"
            />
          </div>

          {/* Special Requirements */}
          <div>
            <label className="block text-sm font-medium mb-2">Special Requirements</label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 bg-background text-foreground border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Projector, Sound system, Tables, etc..."
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg focus:ring-2 focus:ring-primary/40 active:scale-[0.99] transition-all"
          >
            {isSubmitting ? "Submitting..." : "Submit Booking Request"}
          </Button>
        </form>
      </div>
    </div>
  )
}
