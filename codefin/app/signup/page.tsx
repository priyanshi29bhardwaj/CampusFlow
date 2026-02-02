"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { User, Mail, Lock, GraduationCap, Users } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

function ClubSelectionField({ value, onChange, disabled }: { value: string; onChange: (value: string) => void; disabled: boolean }) {
  const [clubs, setClubs] = useState<Array<{ id: string; name: string }>>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await fetch("/api/clubs")
        if (response.ok) {
          const data = await response.json()
          setClubs(data)
        }
      } catch (error) {
        console.error("Error fetching clubs:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchClubs()
  }, [])

  return (
    <div>
      <label className="block text-sm font-medium mb-2">Select Your Club</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 bg-background text-foreground border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
        required
        disabled={disabled || isLoading}
      >
        <option value="">Choose a club...</option>
        {clubs.map((club) => (
          <option key={club.id} value={club.id}>
            {club.name}
          </option>
        ))}
      </select>
      {isLoading && <p className="text-xs text-muted-foreground mt-1">Loading clubs...</p>}
    </div>
  )
}

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    registrationNumber: "",
    role: "student" as "student" | "club_owner",
    club: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { signup } = useAuth()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("") // Clear error when user types
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    if (formData.role === "student" && !formData.registrationNumber) {
      setError("Registration number is required for students")
      return
    }

    if (formData.role === "club_owner" && !formData.club) {
      setError("Please select a club")
      return
    }

    setIsLoading(true)
    setError("")
    try {
      console.log("Attempting signup with:", {
        email: formData.email,
        role: formData.role,
        hasRegistrationNumber: !!formData.registrationNumber,
      })
      
      await signup(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName,
        formData.role === "student" ? formData.registrationNumber : undefined
      )
      // Navigation happens in the signup function
    } catch (error: any) {
      console.error("Signup failed:", error)
      const errorMsg = error.message || "Signup failed. Please try again."
      if (
        formData.role === "club_owner" &&
        errorMsg.toLowerCase().includes("registration number")
      ) {
        setError("This email is not approved as a club owner. Please contact admin.")
      } else {
        setError(errorMsg)
      }
       
      // If it's a connection error, provide helpful message
      if (errorMsg.includes("Failed to fetch") || errorMsg.includes("NetworkError") || errorMsg.includes("Cannot connect")) {
        setError("Cannot connect to server. Please make sure the backend server is running on port 3001. Check the terminal where you ran 'npm run dev' in the campusflow-backend folder.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <div className="px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">Campus Flow</h1>
          <Link href="/login" className="text-primary hover:underline font-medium">
            Sign In
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-card text-card-foreground border border-border rounded-lg p-8 space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Create Account</h2>
              <p className="text-muted-foreground">Join Campus Flow and manage events easily</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Message */}
              {error && (
                <div className="bg-destructive/10 text-destructive border border-destructive rounded-lg p-3 text-sm">
                  {error}
                </div>
              )}

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">I am a</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, role: "student", club: "" }))
                      setError("")
                    }}
                    className={`p-3 border-2 rounded-lg text-sm font-medium transition-all ${
                      formData.role === "student"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <GraduationCap size={18} />
                      <span>Student</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, role: "club_owner", registrationNumber: "" }))
                      setError("")
                    }}
                    className={`p-3 border-2 rounded-lg text-sm font-medium transition-all ${
                      formData.role === "club_owner"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Users size={18} />
                      <span>Club Owner</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name</label>
                  <div className="relative">
                    <User
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                      size={18}
                    />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 bg-background text-foreground border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      placeholder="John"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-background text-foreground border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    placeholder="Doe"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                    size={18}
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 bg-background text-foreground border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    placeholder="your@university.edu"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Registration Number (only for students) */}
              {formData.role === "student" && (
                <div>
                  <label className="block text-sm font-medium mb-2">Registration Number</label>
                  <div className="relative">
                    <GraduationCap
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                      size={18}
                    />
                    <input
                      type="text"
                      name="registrationNumber"
                      value={formData.registrationNumber}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 bg-background text-foreground border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      placeholder="2023001234"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
              )}

              {/* Club Selection (only for club owners) */}
              {formData.role === "club_owner" && (
                <ClubSelectionField
                  value={formData.club}
                  onChange={(value) => setFormData((prev) => ({ ...prev, club: value }))}
                  disabled={isLoading}
                />
              )}

              {/* Password */}
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                    size={18}
                  />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 bg-background text-foreground border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                    size={18}
                  />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 bg-background text-foreground border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Terms */}
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="w-4 h-4 rounded border-input" required disabled={isLoading} />
                <span>
                  I agree to the{" "}
                  <Link href="#" className="text-primary hover:underline">
                    Terms of Service
                  </Link>
                </span>
              </label>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-3 font-semibold"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
