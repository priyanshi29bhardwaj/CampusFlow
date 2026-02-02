"use client"

import { useAuth } from "@/contexts/AuthContext"
import { Settings, User, Bell, Shield } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
  const { user } = useAuth()
  const router = useRouter()

  if (!user) {
    router.push("/login")
    return null
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <Settings size={32} />
        Settings
      </h1>

      <div className="space-y-6">
        {/* Account Settings */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <User size={20} />
            Account Settings
          </h2>
          <p className="text-muted-foreground">Manage your account information and preferences.</p>
        </div>

        {/* Notifications Settings */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Bell size={20} />
            Notification Preferences
          </h2>
          <p className="text-muted-foreground">Configure how you receive notifications.</p>
        </div>

        {/* Privacy Settings */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Shield size={20} />
            Privacy & Security
          </h2>
          <p className="text-muted-foreground">Manage your privacy and security settings.</p>
        </div>
      </div>
    </div>
  )
}

