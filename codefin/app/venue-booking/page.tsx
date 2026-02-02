import { VenueBookingForm } from "@/components/venue-booking-form"

export default function VenueBookingPage() {
  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Venue Booking</h1>
        <p className="text-muted-foreground">Reserve venues for your club events</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <VenueBookingForm />
        </div>

        {/* Sidebar Info */}
        <div className="space-y-4">
          <div className="bg-primary text-primary-foreground border border-border rounded-lg p-6">
            <h3 className="font-bold mb-2">Available Venues</h3>
            <ul className="text-sm space-y-2">
              <li>• SHARDA PAI AUDITORIUM (350)</li>
              <li>• VASANTI PAI AUDITORIUM (500)</li>
              <li>• TMA PAI AUDITORIUM (300)</li>
            </ul>
          </div>

          <div className="bg-card text-card-foreground border border-border rounded-lg p-6">
            <h3 className="font-bold mb-2">Process</h3>
            <ol className="text-sm space-y-2">
              <li>1. Select venue & date</li>
              <li>2. Fill booking details</li>
              <li>3. Submit for approval</li>
              <li>4. Get confirmation</li>
            </ol>
          </div>

          <div className="bg-destructive/10 text-destructive border border-border rounded-lg p-6">
            <h3 className="font-bold mb-2">Important</h3>
            <p className="text-xs">Book at least 7 days before your event. DSW approval is mandatory.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
