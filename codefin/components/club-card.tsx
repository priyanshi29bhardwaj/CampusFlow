import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface ClubCardProps {
  id: string
  name: string
  logo: string
  description?: string
  eventCount?: number
}

export function ClubCard({ id, name, logo, description, eventCount }: ClubCardProps) {
  return (
    <Link href={`/club/${id}`}>
      <div className="bg-card text-card-foreground border border-border rounded-lg p-6 hover:shadow-lg hover:border-primary transition-all duration-300 cursor-pointer h-full flex flex-col">
        {/* Logo */}
        <div className="w-24 h-24 mx-auto mb-4 bg-accent rounded-lg flex items-center justify-center">
          <img src={logo || "/placeholder.svg"} alt={name} className="w-20 h-20 object-contain" />
        </div>

        {/* Name */}
        <h3 className="text-xl font-bold text-center mb-2">{name}</h3>

        {/* Description */}
        {description && <p className="text-sm text-muted-foreground text-center mb-4">{description}</p>}

        {/* Event Count */}
        {eventCount !== undefined && (
          <p className="text-xs font-medium text-muted-foreground text-center mb-4">{eventCount} Active Events</p>
        )}

        {/* Button */}
        <div className="mt-auto flex items-center justify-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
          <span>View Events</span>
          <ArrowRight size={18} />
        </div>
      </div>
    </Link>
  )
}
