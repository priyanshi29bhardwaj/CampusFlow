"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import { apiRequest } from "@/lib/api"

interface EventRegistrationFormProps {
  eventId?: string
}

export function EventRegistrationForm({ eventId }: EventRegistrationFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    registrationNumber: "",
    department: "",
    eventId: eventId || "",
    numberOfTickets: "1",
    paymentMethod: "upi",
    transactionId: "",
  })

  const [submitted, setSubmitted] = useState(false)
  const [events, setEvents] = useState<Array<{ id: string; name: string; registration_fee: number }>>([])
  const [isLoading, setIsLoading] = useState(true)

  const departments = ["Computer Science", "Electronics", "Mechanical", "Civil", "Chemical", "Electrical", "Other"]

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events")
        if (response.ok) {
          const eventsData = await response.json()
          setEvents(eventsData)
        }
      } catch (error) {
        console.error("Error fetching events:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [])

  useEffect(() => {
    if (eventId) {
      setFormData((prev) => ({ ...prev, eventId }))
    }
  }, [eventId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await apiRequest(`/api/events/${formData.eventId}/register`, {
        method: "POST",
        body: JSON.stringify({
          numberOfTickets: parseInt(formData.numberOfTickets),
          paymentMethod: formData.paymentMethod,
          transactionId: formData.transactionId,
        }),
      })
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 5000)
    } catch (error: any) {
      console.error("Registration failed:", error)
      alert(error.message || "Registration failed. Please try again.")
    }
  }

  const selectedEvent = events.find((evt) => evt.id === formData.eventId)
  const totalFee = selectedEvent ? (selectedEvent.registration_fee || 0) * Number.parseInt(formData.numberOfTickets) : 0

  if (submitted) {
    return (
      <div className="bg-card text-card-foreground border border-border rounded-lg p-8 text-center">
        <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Registration Successful!</h2>
        <p className="text-muted-foreground mb-6">
          Confirmation has been sent to your email. Check your inbox for event details and venue information.
        </p>
        <Button onClick={() => setSubmitted(false)} className="rounded-lg hover:shadow-md transition-all">Register Another Event</Button>
      </div>
    )
  }

  return (
    <div className="bg-card text-card-foreground border border-border rounded-lg p-8">
      <h2 className="text-2xl font-bold mb-6">Register for an Event</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-background text-foreground border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="John"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-background text-foreground border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Doe"
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-background text-foreground border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="john@university.edu"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-background text-foreground border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>

        {/* Academic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Registration Number</label>
            <input
              type="text"
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-background text-foreground border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="2023001234"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-background text-foreground border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Event Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Select Event</label>
            <select
              name="eventId"
              value={formData.eventId}
              onChange={handleChange}
              required
              disabled={!!eventId || isLoading}
              className="w-full px-4 py-2 bg-background text-foreground border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            >
              <option value="">Choose an event...</option>
              {isLoading ? (
                <option>Loading events...</option>
              ) : (
                events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.name} {(event.registration_fee || 0) > 0 ? `(₹${event.registration_fee})` : "(Free)"}
                  </option>
                ))
              )}
            </select>
            {eventId && <p className="text-xs text-muted-foreground mt-1">Event pre-selected</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Number of Tickets</label>
            <select
              name="numberOfTickets"
              value={formData.numberOfTickets}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-background text-foreground border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
        </div>

        {totalFee > 0 && (
          <div className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold mb-4">Payment Information</h3>

            {/* Fee Display */}
            <div className="bg-accent/10 text-accent-foreground border border-accent rounded-lg p-4 mb-4">
              <p className="text-sm mb-2">
                Total Amount Due: <span className="font-bold text-lg">₹{totalFee}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                ₹{selectedEvent?.registration_fee || 0} × {formData.numberOfTickets} = ₹{totalFee}
              </p>
            </div>

            {/* Payment Method */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Payment Method</label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-background text-foreground border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="upi">UPI (PhonePe, Google Pay, etc.)</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="card">Credit/Debit Card</option>
                <option value="cash">Cash Payment</option>
              </select>
              <p className="text-xs text-muted-foreground mt-1">Select how you will pay for this event</p>
            </div>

            {/* Transaction ID */}
            <div>
              <label className="block text-sm font-medium mb-2">Transaction ID (for verification)</label>
              <input
                type="text"
                name="transactionId"
                value={formData.transactionId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-background text-foreground border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter UPI transaction ID or reference number"
              />
              <p className="text-xs text-muted-foreground mt-1">You will receive this after payment</p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button type="submit" className="w-full rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg focus:ring-2 focus:ring-primary/40 active:scale-[0.99] transition-all">
          {totalFee > 0 ? `Register & Pay ₹${totalFee}` : "Register for Event"}
        </Button>
      </form>
    </div>
  )
}
