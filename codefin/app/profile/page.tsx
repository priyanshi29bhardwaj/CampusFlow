"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { User, Mail, Shield, Save } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const router = useRouter()
  const [role, setRole] = useState<"student" | "club_owner">(user?.role === "club_owner" ? "club_owner" : "student")
  const [isSaving, setIsSaving] = useState(false)

  if (!user) {
    router.push("/login")
    return null
  }

  const handleSaveRole = async () => {
    setIsSaving(true)
    try {
      updateUser({ role })
      // Show success message or redirect
      setTimeout(() => {
        setIsSaving(false)
        router.push("/dashboard")
      }, 500)
    } catch (error) {
      console.error("Failed to update role:", error)
      setIsSaving(false)
    }
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <div className="bg-card border border-border rounded-lg p-6 space-y-6">
        {/* User Info */}
        <div className="flex items-center gap-4 pb-6 border-b border-border">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-2xl">
            {user.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-muted-foreground flex items-center gap-2 mt-1">
              <Mail size={16} />
              {user.email}
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
              <Shield size={16} />
              Current Role: <span className="font-semibold capitalize">{user.role}</span>
            </p>
          </div>
        </div>

        {/* Role Selection */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <User size={20} />
            Select Your Role
          </h3>
          <p className="text-muted-foreground">
            Choose your role to access relevant features. Club Owners can create events and book venues.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setRole("student")}
              className={`p-6 border-2 rounded-lg text-left transition-all ${
                role === "student"
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-lg">Student</h4>
                {role === "student" && (
                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Register for events, view notifications, and check in with QR codes.
              </p>
            </button>

            <button
              onClick={() => setRole("club_owner")}
              className={`p-6 border-2 rounded-lg text-left transition-all ${
                role === "club_owner"
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-lg">Club Owner</h4>
                {role === "club_owner" && (
                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Create events, book venues, generate proposal letters, and manage your club.
              </p>
            </button>
          </div>

          <Button
            onClick={handleSaveRole}
            disabled={isSaving || role === user.role}
            className="w-full md:w-auto"
          >
            <Save size={18} className="mr-2" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  )
}

