"use client"

import { useAuth } from "@/contexts/AuthContext"
import { Mail, Shield } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const { user } = useAuth()
  const router = useRouter()

  if (!user) {
    router.push("/login")
    return null
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
              .map((n: string) => n[0])
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
              Current Role:{" "}
              <span className="font-semibold capitalize">
                {user.role === "club_owner" ? "Club Owner" : "Student"}

              </span>
            </p>
          </div>
        </div>

        {/* Role Info (Read Only) */}
        <div className="p-4 border rounded-lg bg-muted/30">
          <h3 className="text-lg font-semibold mb-2">Account Role :</h3>
          {user.role === "club_owner" ? "Club Owner" : "Student"}
        </div>
      </div>
    </div>
  )
}
