"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Calendar, Plus, MapPin, FileText, QrCode, Bell, ChevronDown, Menu, X } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { BarChart3 } from "lucide-react"


export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()
  const { user } = useAuth()

  const allMenuItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      roles: ["student", "club_owner", "admin"], // Everyone can see dashboard
    },
    {
      label: "Register for Events",
      href: "/register-events",
      icon: Calendar,
      roles: ["student"], // Only students
    },
    {
      label: "Create an Event",
      href: "/create-event",
      icon: Plus,
      roles: ["club_owner", "admin"], // Only club owners
    },
    {
      label: "Analytics",
      href: "/dashboard/analytics",
      icon: BarChart3,
      roles: ["club_owner"]
    },
    {
      label: "Venue Booking",
      href: "/venue-booking",
      icon: MapPin,
      roles: ["club_owner", "admin"], // Only club owners
    },
    {
      label: "Proposal Letter to DSW",
      href: "/proposal-letter",
      icon: FileText,
      roles: ["club_owner", "admin"], // Only club owners
    },
    {
      label: "QR Code Check-In",
      href: "/qr-checkin",
      icon: QrCode,
      roles: ["student", "club_owner", "admin"], // Everyone
    },
    {
      label: "Notifications",
      href: "/notifications",
      icon: Bell,
      roles: ["student", "club_owner", "admin"], // Everyone
    },
  ]

  // Filter menu items based on user role
  const menuItems = allMenuItems.filter((item) => {
    if (!user) return false // Hide all if not logged in
    return item.roles.includes(user.role || "student")
  })

  const isActive = (href: string) => pathname === href

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed md:hidden top-4 left-4 z-40 p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen bg-sidebar text-sidebar-foreground transition-all duration-300 z-30 ${
          isOpen ? "w-64" : "w-20"
        } ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between">
          <h1 className={`font-bold text-xl ${!isOpen && "hidden"}`}>Campus Flow</h1>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="hidden md:block p-2 hover:bg-sidebar-accent rounded-lg transition-colors"
          >
            <ChevronDown size={20} className={`transition-transform ${!isOpen && "rotate-180"}`} />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-3 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <Icon size={20} className="flex-shrink-0" />
                <span className={`whitespace-nowrap ${!isOpen && "hidden"}`}>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="text-xs text-sidebar-foreground/60">{isOpen && <p>© 2025 Campus Flow</p>}</div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setIsMobileOpen(false)} />
      )}
    </>
  )
}
