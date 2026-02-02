"use client"

import { useState, useRef } from "react"
import { QrCode, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export function QRCheckin() {
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<string | null>(null)
  const [attendees, setAttendees] = useState<{ id: string; name: string; time: string }[]>([
    { id: "1", name: "John Doe", time: "2:15 PM" },
    { id: "2", name: "Jane Smith", time: "2:20 PM" },
    { id: "3", name: "Ahmed Khan", time: "2:25 PM" },
  ])
  const [capacity, setCapacity] = useState<number>(500)

  const videoRef = useRef<HTMLVideoElement>(null)

  const handleSimulateQRScan = () => {
    setScanResult("User123_Event_AI_Workshop_20250315")
    setTimeout(() => {
      setAttendees((prev) => [
        {
          id: String(prev.length + 1),
          name: "New Attendee",
          time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        },
        ...prev,
      ])
      setScanResult(null)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      {/* Scanner Section */}
      <div className="bg-card text-card-foreground border border-border rounded-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <QrCode size={28} className="text-primary" />
            QR Code Check-In System
          </h2>
          <Button
            onClick={() => setIsScanning(!isScanning)}
            className={isScanning ? "bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90"}
          >
            {isScanning ? "Stop Scanning" : "Start Scanning"}
          </Button>
        </div>

        {/* Camera Preview */}
        {isScanning ? (
          <div className="bg-black rounded-lg overflow-hidden mb-4">
            <div className="w-full h-80 flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
              <div className="text-center">
                <QrCode size={64} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Camera would open here in a real app</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-80 flex items-center justify-center bg-muted rounded-lg mb-4">
            <div className="text-center">
              <QrCode size={64} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Click "Start Scanning" to begin</p>
            </div>
          </div>
        )}

        {/* Simulate Scan Button */}
        <Button
          onClick={handleSimulateQRScan}
          disabled={!isScanning}
          className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
        >
          Simulate QR Scan (Demo)
        </Button>

        {/* Scan Result */}
        {scanResult && (
          <div className="mt-6 p-4 bg-primary/10 border border-primary rounded-lg flex items-start gap-4">
            <Check className="text-primary flex-shrink-0 mt-1" size={24} />
            <div>
              <p className="font-semibold text-primary">Check-in Successful!</p>
              <p className="text-sm text-muted-foreground mt-1">ID: {scanResult}</p>
            </div>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-primary text-primary-foreground border border-border rounded-lg p-6 text-center">
          <p className="text-sm opacity-90">Total Check-ins</p>
          <p className="text-4xl font-bold">{attendees.length}</p>
        </div>
        <div className="bg-secondary text-secondary-foreground border border-border rounded-lg p-6 text-center">
          <p className="text-sm opacity-90">Event Capacity</p>
          <div className="flex items-center justify-center gap-3">
            <input
              type="number"
              min={1}
              value={capacity}
              onChange={(e) => setCapacity(Math.max(1, Number(e.target.value || 1)))}
              className="w-28 px-3 py-2 rounded-lg bg-background text-foreground border border-border text-center"
            />
          </div>
        </div>
        <div className="bg-accent text-accent-foreground border border-border rounded-lg p-6 text-center">
          <p className="text-sm opacity-90">Occupancy Rate</p>
          <p className="text-4xl font-bold">{Math.round((attendees.length / Math.max(1, capacity)) * 100)}%</p>
        </div>
      </div>

      {/* Attendees List */}
      <div className="bg-card text-card-foreground border border-border rounded-lg p-8">
        <h3 className="text-2xl font-bold mb-6">Recent Check-ins</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold">Name</th>
                <th className="text-left py-3 px-4 font-semibold">Check-in Time</th>
                <th className="text-left py-3 px-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendees.map((attendee) => (
                <tr key={attendee.id} className="border-b border-border hover:bg-muted transition-colors">
                  <td className="py-3 px-4">{attendee.name}</td>
                  <td className="py-3 px-4">{attendee.time}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                      <Check size={14} />
                      Checked In
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
