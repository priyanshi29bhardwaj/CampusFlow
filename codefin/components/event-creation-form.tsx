"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, Upload } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { apiRequest } from "@/lib/api"

export function EventCreationForm() {
  const { user } = useAuth()
  const userRole = user?.role || "student"
  const userClubId = user?.clubId || ""

  const [formData, setFormData] = useState({
    eventName: "",
    club: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    venue: "",
    capacity: "",
    category: "",
    posterUrl: "",
    registrationFee: "",
    qrCodeFile: null as File | null,
  })

  const [submitted, setSubmitted] = useState(false)
  const [clubs, setClubs] = useState<Array<{ id: string; name: string }>>([])
  const [venues, setVenues] = useState<Array<{ id: string; name: string; capacity: number }>>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const categories = ["Workshop", "Seminar", "Conference", "Social", "Competition", "Exhibition", "Webinar"]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clubsRes, venuesRes] = await Promise.all([
          fetch("/api/clubs"),
          fetch("/api/venues"),
        ])

        if (clubsRes.ok) {
          const clubsData = await clubsRes.json()
          setClubs(clubsData)
          
          // If user is a club owner and has a club_id, pre-select it
          if (user?.role === "club_owner" && user.id) {
            // We need to get the user's club_id from the backend
            // For now, we'll let them select, but ideally we'd fetch their club_id
          }
        }

        if (venuesRes.ok) {
          const venuesData = await venuesRes.json()
          setVenues(venuesData)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({
        ...prev,
        qrCodeFile: file,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError("")
    setIsSubmitting(true)

    try {
      const selectedVenue = venues.find((v) => v.name === formData.venue)
      
      const startTime = new Date(`${formData.date}T${formData.startTime}`).toISOString()
      const endTime = new Date(`${formData.date}T${formData.endTime}`).toISOString()

      await apiRequest("/api/events", {
        method: "POST",
        body: JSON.stringify({
          name: formData.eventName,
          description: formData.description,
          venueId: selectedVenue?.id || null,
          startTime,
          endTime,
          capacity: parseInt(formData.capacity) || null,
          registrationFee: parseFloat(formData.registrationFee) || 0,
          paymentQrCode: formData.posterUrl || null,
          clubId: userRole === "admin" ? formData.club : userClubId,
        }),
      })

      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setFormData({
          eventName: "",
          club: "",
          description: "",
          date: "",
          startTime: "",
          endTime: "",
          venue: "",
          capacity: "",
          category: "",
          posterUrl: "",
          registrationFee: "",
          qrCodeFile: null,
        })
      }, 5000)
    } catch (error: any) {
      console.error("Event creation failed:", error)
      setSubmitError(error.message || "Failed to create event. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (userRole !== "club_owner" && userRole !== "admin") {
    return (
      <div className="bg-destructive/10 text-destructive border border-destructive rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Access Restricted</h2>
        <p className="mb-4">
          Only club owners and authorized members can create events. Please contact your club president or the
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
        <h2 className="text-2xl font-bold mb-2">Event Created Successfully!</h2>
        <p className="text-muted-foreground mb-6">
          Your event has been published and is now visible to students. You can manage it from your dashboard.
        </p>
        <Button onClick={() => setSubmitted(false)}>Create Another Event</Button>
      </div>
    )
  }

  return (
    <div className="bg-card text-card-foreground border border-border rounded-lg p-8">
      <h2 className="text-2xl font-bold mb-6">Create a New Event</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div>
          <label className="block text-sm font-medium mb-2">Event Name</label>
          <input
            type="text"
            name="eventName"
            value={formData.eventName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-background text-foreground border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Annual Tech Conference 2025"
          />
        </div>

        {/* Club and Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Club</label>
            {userRole === "admin" ? (
    <select
      name="club"
      value={formData.club}
      onChange={handleChange}
      required
      className="w-full px-4 py-2 bg-background text-foreground border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
    >
      <option value="">Select Club</option>
      {clubs.map((club) => (
        <option key={club.id} value={club.id}>
          {club.name}
        </option>
      ))}
    </select>
  ) : (
    <input
      type="text"
      value="Your Assigned Club"
      disabled
      className="w-full px-4 py-2 bg-muted text-muted-foreground border border-input rounded-lg"
    />
  )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-background text-foreground border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-4 py-2 bg-background text-foreground border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            placeholder="Describe your event..."
          />
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-background text-foreground border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
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

        {/* Venue and Capacity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Venue</label>
            <select
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-background text-foreground border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select Venue</option>
              {venues.map((venue) => (
                <option key={venue.id} value={venue.name}>
                  {venue.name} ({venue.capacity} capacity)
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Capacity</label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-background text-foreground border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="500"
            />
          </div>
        </div>

        {/* Poster URL */}
        <div>
          <label className="block text-sm font-medium mb-2">Poster URL (Optional)</label>
          <input
            type="url"
            name="posterUrl"
            value={formData.posterUrl}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-background text-foreground border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="https://example.com/poster.jpg"
          />
        </div>

        <div className="border-t border-border pt-6">
          <h3 className="text-lg font-semibold mb-4">Payment Information</h3>

          {/* Registration Fee */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Registration Fee (₹)</label>
            <input
              type="number"
              name="registrationFee"
              value={formData.registrationFee}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full px-4 py-2 bg-background text-foreground border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter fee amount (0 for free event)"
            />
            <p className="text-xs text-muted-foreground mt-1">Leave blank or enter 0 for free events</p>
          </div>

          {/* QR Code Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Payment QR Code (Optional)</label>
            <div className="flex items-center gap-4">
              <label className="flex-1 px-4 py-3 bg-background text-foreground border border-dashed border-border rounded-lg cursor-pointer hover:bg-muted transition-colors">
                <div className="flex items-center justify-center gap-2">
                  <Upload size={18} />
                  <span className="text-sm">
                    {formData.qrCodeFile ? formData.qrCodeFile.name : "Click to upload QR code"}
                  </span>
                </div>
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Upload a payment QR code image (PNG, JPG, etc.)</p>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg focus:ring-2 focus:ring-primary/40 active:scale-[0.99] transition-all"
        >
          {isSubmitting ? "Creating Event..." : "Create Event"}
        </Button>
      </form>
    </div>
  )
}
