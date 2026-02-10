"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { apiRequest } from "@/lib/api"

interface Registration {
  name: string
  email: string
  number_of_tickets: number
  total_amount: number
  payment_status: string
}

export default function EventRegistrationsPage() {
  const { id } = useParams()
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const data = await apiRequest(`/api/events/${id}/registrations`)
        setRegistrations(data)
      } catch (err: any) {
        setError(err.message || "Failed to load registrations")
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchRegistrations()
  }, [id])

  if (loading) return <p className="p-6">Loading registrations...</p>
  if (error) return <p className="p-6 text-red-500">{error}</p>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Event Registrations</h1>

      {registrations.length === 0 ? (
        <p>No registrations yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-border rounded-lg">
            <thead className="bg-muted">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Tickets</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Payment</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((r, index) => (
                <tr key={index} className="border-t border-border">
                  <td className="p-3">{r.name}</td>
                  <td className="p-3">{r.email}</td>
                  <td className="p-3">{r.number_of_tickets}</td>
                  <td className="p-3">₹{r.total_amount}</td>
                  <td className="p-3 capitalize">{r.payment_status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
