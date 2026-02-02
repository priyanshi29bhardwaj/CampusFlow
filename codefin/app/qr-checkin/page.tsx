import { QRCheckin } from "@/components/qr-checkin"

export default function QRCheckinPage() {
  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">QR Code Check-In</h1>
        <p className="text-muted-foreground">Scan attendee QR codes to mark them as checked in</p>
      </div>

      <QRCheckin />
    </div>
  )
}
