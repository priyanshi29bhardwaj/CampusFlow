"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"

export default function AnalyticsPage() {
  const { token } = useAuth()
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    if (!token) return

    fetch("http://localhost:3001/api/analytics/club", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch((err) => console.error(err))
  }, [token])

  if (!data) return <div className="p-6">Loading analytics...</div>

  const upcomingEvent = data.upcomingEvents?.[0]

  const registered = upcomingEvent?.total_registrations || 0
  const capacity = upcomingEvent?.capacity || 0
  const seatsLeft = capacity - registered

  const pieData = [
    { name: "Registered", value: registered },
    { name: "Seats Left", value: seatsLeft > 0 ? seatsLeft : 0 },
  ]

  const COLORS = ["#6366f1", "#22c55e"]

  // 📊 Summary Calculations
  const totalEvents =
    (data.pastEvents?.length || 0) + (data.upcomingEvents?.length || 0)

  const totalRegistrations =
    data.pastEvents?.reduce(
      (sum: number, e: any) => sum + Number(e.total_registrations),
      0
    ) || 0

  const totalRevenue =
    data.pastEvents?.reduce(
      (sum: number, e: any) => sum + Number(e.total_revenue),
      0
    ) || 0

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">📊 Event Analytics</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* LEFT SIDE - CHARTS */}
        <div className="lg:col-span-3 space-y-10">

          {/* Registrations Chart */}
          <div>
            <h2 className="text-lg font-semibold mb-4">
              Registrations Per Event
            </h2>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.pastEvents}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total_registrations" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue Chart */}
          <div>
            <h2 className="text-lg font-semibold mb-4">
              Revenue Per Event
            </h2>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.pastEvents}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total_revenue" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div>
            <h2 className="text-lg font-semibold mb-4">
              Upcoming Event Capacity
            </h2>

            {upcomingEvent ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                  >
                    {pieData.map((entry: any, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground">
                No upcoming event available.
              </p>
            )}
          </div>
        </div>

        {/* RIGHT SIDE - SUMMARY PANEL */}
        <div className="space-y-6">

          <div className="bg-card border border-border rounded-lg p-5">
            <h3 className="text-sm text-muted-foreground">
              Total Events Organized
            </h3>
            <p className="text-3xl font-bold mt-2">{totalEvents}</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-5">
            <h3 className="text-sm text-muted-foreground">
              Total Registrations
            </h3>
            <p className="text-3xl font-bold mt-2">{totalRegistrations}</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-5">
            <h3 className="text-sm text-muted-foreground">
              Total Revenue
            </h3>
            <p className="text-3xl font-bold mt-2">
              ₹{totalRevenue}
            </p>
          </div>

          {upcomingEvent && (
            <>
              <div className="bg-card border border-border rounded-lg p-5">
                <h3 className="text-sm text-muted-foreground">
                  Seats Booked (Upcoming)
                </h3>
                <p className="text-3xl font-bold mt-2">{registered}</p>
              </div>

              <div className="bg-card border border-border rounded-lg p-5">
                <h3 className="text-sm text-muted-foreground">
                  Seats Vacant (Upcoming)
                </h3>
                <p className="text-3xl font-bold mt-2">{seatsLeft}</p>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  )
}
