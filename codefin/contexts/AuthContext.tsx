"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"

type UserRole = "student" | "club_owner" | "admin" | null

interface User {
  id: string
  email: string
  name: string
  role: UserRole
  clubId?: string | null   // ✅ ADDED (important for club restrictions)
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  updateUser: (user: Partial<User>) => void
  signup: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    registrationNumber?: string
  ) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const router = useRouter()

  /* =========================
     LOAD SAVED SESSION
  ========================= */
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("user")
      const savedToken = localStorage.getItem("token")
      
      if (!savedToken) {
        setLoading(false)
        return
      }

      if (savedToken) setToken(savedToken)

      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser))
        } catch {
          localStorage.removeItem("user")
        }finally {
          setLoading(false)
}

      }
    }
  }, [])

  /* =========================
     LOGIN
  ========================= */
  const login = async (email: string, password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Login failed")
    }

    const userData: User = {
      id: data.user.id,
      email: data.user.email,
      name:
        `${data.user.first_name || ""} ${data.user.last_name || ""}`.trim() ||
        data.user.email.split("@")[0],
      role: data.user.role,
      clubId: data.user.club_id || null,   // ✅ STORES CLUB ID
    }

    setUser(userData)
    setToken(data.token)

    localStorage.setItem("user", JSON.stringify(userData))
    localStorage.setItem("token", data.token)

    router.push("/dashboard")
  }

  /* =========================
     SIGNUP
  ========================= */
  const signup = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    registrationNumber?: string
  ): Promise<void> => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
          registrationNumber,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Signup failed")
      }

      // Auto login after signup
      await login(email, password)
    } catch (error: any) {
      if (
        error.message.includes("Failed to fetch") ||
        error.message.includes("NetworkError")
      ) {
        throw new Error(
          "Cannot connect to server. Please make sure the backend is running on port 3001."
        )
      }
      throw error
    }
  }

  /* =========================
     LOGOUT
  ========================= */
  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    router.push("/login")
  }

  const updateUser = (updates: Partial<User>) => {
    if (!user) return
    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    localStorage.setItem("user", JSON.stringify(updatedUser))
  }

  return (
    <AuthContext.Provider
  value={{
    user,
    isAuthenticated: !!user && !!token,
    token,
    login,
    loading,
    logout,
    updateUser,
    signup,
  }}
>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}