"use client"

import { useEffect, useState } from "react"
import { apiRequest } from "@/lib/api"
import { Button } from "@/components/ui/button"

interface Booking {
  id: string
  venue_name: string
  club_name: string
  booked_start: string
  booked_end: string
  expected_attendees: number
  status: "pending" | "approved" | "rejected"
  admin_remarks?: string
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const fetchBookings = async () => {
    try {
      const data = await apiRequest("/api/venues/admin/bookings")
      setBookings(data)
    } catch (err) {
      console.error("Failed to load bookings", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const updateStatus = async (id: string, status: "approved" | "rejected") => {
    const remarks = prompt("Add admin remarks (optional)") || ""
    setUpdatingId(id)

    try {
      const updated = await apiRequest(`/api/venues/admin/bookings/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status, adminRemarks: remarks }),
      })

      // 🔥 Instant UI update without refetch
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status, admin_remarks: remarks } : b))
      )
    } catch (err) {
      alert("Failed to update status")
    } finally {
      setUpdatingId(null)
    }
  }

  if (loading) return <p className="p-6">Loading booking requests...</p>

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Venue Booking Approvals</h1>

      {bookings.length === 0 ? (
        <p className="text-muted-foreground">No booking requests found.</p>
      ) : (
        <div className="space-y-5">
          {bookings.map((b) => (
            <div key={b.id} className="border rounded-lg p-5 bg-card shadow-sm">
              <h3 className="text-lg font-semibold">{b.venue_name}</h3>
              <p className="text-sm text-muted-foreground">Club: {b.club_name}</p>

              <p className="text-sm mt-1">
                {new Date(b.booked_start).toLocaleString()} →{" "}
                {new Date(b.booked_end).toLocaleString()}
              </p>

              <p className="text-sm">Attendees: {b.expected_attendees || "N/A"}</p>

              <p className="text-sm mt-2">
                Status:{" "}
                <span
                  className={`font-bold capitalize ${
                    b.status === "approved"
                      ? "text-green-600"
                      : b.status === "rejected"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {b.status}
                </span>
              </p>

              {b.admin_remarks && (
                <p className="text-xs text-muted-foreground mt-1">
                  Admin Remarks: {b.admin_remarks}
                </p>
              )}

              {b.status === "pending" && (
                <div className="flex gap-3 mt-4">
                  <Button
                    disabled={updatingId === b.id}
                    onClick={() => updateStatus(b.id, "approved")}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {updatingId === b.id ? "Updating..." : "Approve"}
                  </Button>

                  <Button
                    disabled={updatingId === b.id}
                    onClick={() => updateStatus(b.id, "rejected")}
                    variant="destructive"
                  >
                    {updatingId === b.id ? "Updating..." : "Reject"}
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}