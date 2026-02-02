"use client"

import { useEffect, useState } from "react"
import { Bell, X, Check } from "lucide-react"
import { apiRequest } from "@/lib/api"

interface Notification {
  id: string
  title: string
  message: string
  type: "event" | "booking" | "announcement" | "reminder"
  timestamp: string
  read: boolean
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [error, setError] = useState("")

  const fetchNotifications = async () => {
    try {
      setError("")
      const data = await apiRequest("/api/notifications")
      // Normalize timestamp
      const normalized = (data || []).map((n: any) => ({
        id: n.id,
        title: n.title,
        message: n.message,
        type: (n.type || "announcement") as Notification["type"],
        timestamp: new Date(n.timestamp).toLocaleString(),
        read: !!n.read,
      }))
      setNotifications(normalized)
    } catch (e: any) {
      setError(e.message || "Failed to load notifications")
    }
  }

  useEffect(() => {
    fetchNotifications()
    const id = setInterval(fetchNotifications, 10000) // poll every 10s
    return () => clearInterval(id)
  }, [])

  const markAsRead = async (id: string) => {
    try {
      await apiRequest(`/api/notifications/${id}/read`, { method: "PATCH" })
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
    } catch (e) {
      // quiet
    }
  }

  const removeNotificationLocal = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "event":
        return "bg-primary/10 text-primary"
      case "booking":
        return "bg-secondary/10 text-secondary"
      case "reminder":
        return "bg-accent/10 text-accent-foreground"
      case "announcement":
        return "bg-blue-500/10 text-blue-600"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Notifications</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
              : "All caught up!"}
          </p>
        </div>
        <div className="relative p-3 bg-card border border-border rounded-lg">
          <Bell className="text-primary" size={24} />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-white rounded-full flex items-center justify-center text-xs font-bold">
              {unreadCount}
            </span>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {error && (
          <div className="bg-destructive/10 text-destructive border border-destructive rounded-lg p-3 text-sm">
            {error}
          </div>
        )}
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-card text-card-foreground border border-border rounded-lg p-6 transition-all ${
                !notification.read ? "ring-2 ring-primary/30" : ""
              } hover:shadow-lg`}
            >
              <div className="flex items-start justify-between gap-4">
                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getTypeColor(
                        notification.type,
                      )}`}
                    >
                      {notification.type}
                    </span>
                    {!notification.read && <span className="w-2 h-2 bg-primary rounded-full" />}
                  </div>
                  <h3 className="font-bold text-lg mb-1">{notification.title}</h3>
                  <p className="text-muted-foreground text-sm mb-2">{notification.message}</p>
                  <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                      title="Mark as read"
                    >
                      <Check size={20} className="text-primary" />
                    </button>
                  )}
                  <button
                    onClick={() => removeNotificationLocal(notification.id)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                    title="Remove"
                  >
                    <X size={20} className="text-muted-foreground hover:text-foreground" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-card text-card-foreground border border-border rounded-lg">
            <Bell size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground mb-2">No notifications</p>
            <p className="text-sm text-muted-foreground">You're all caught up. Notifications will appear here.</p>
          </div>
        )}
      </div>

      {/* Notification Preferences */}
      <div className="mt-8 bg-card text-card-foreground border border-border rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-input" />
            <span className="text-sm">Email notifications for new events</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-input" />
            <span className="text-sm">Reminder notifications (1 hour before event)</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-input" />
            <span className="text-sm">Booking status updates</span>
          </label>
        </div>
      </div>
    </div>
  )
}
