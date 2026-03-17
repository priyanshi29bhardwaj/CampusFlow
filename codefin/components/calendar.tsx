"use client"

import { useEffect, useState } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import Swal from "sweetalert2"

interface BookingEvent {
  title: string
  start: string
  end: string
  color: string
  extendedProps: any
}

export default function VenueCalendar() {

  const [events, setEvents] = useState<BookingEvent[]>([])

  /* ================= LOAD BOOKINGS ================= */

  useEffect(() => {

    const fetchBookings = async () => {

      try {

        const res = await fetch("/api/venues/bookings")

        const data = await res.json()

        const formatted = data.map((booking: any) => {

          let color = "#f59e0b" // pending

          if (booking.status === "approved") color = "#22c55e"
          if (booking.status === "rejected") color = "#ef4444"

          return {
            title: `${booking.venue_name} (${booking.club_name})`,
            start: booking.booked_start,
            end: booking.booked_end,
            color,
            extendedProps: booking
          }

        })

        setEvents(formatted)

      } catch (err) {
        console.error("Calendar load error", err)
      }

    }

    fetchBookings()

  }, [])

  /* ================= EVENT CLICK ================= */

  const handleEventClick = (info: any) => {

    const booking = info.event.extendedProps

    Swal.fire({
      title: booking.venue_name,
      html: `
        <b>Club:</b> ${booking.club_name}<br/>
        <b>Attendees:</b> ${booking.expected_attendees}<br/>
        <b>Status:</b> ${booking.status}<br/>
        <b>Remarks:</b> ${booking.admin_remarks || "None"}
      `,
      icon: "info"
    })

  }

  return (

    <div className="bg-card border rounded-xl p-6">

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}

        initialView="dayGridMonth"

        height="auto"

        events={events}

        eventClick={handleEventClick}

        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay"
        }}

        dayMaxEvents={true}

        eventTimeFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: false
        }}

      />

    </div>

  )

}