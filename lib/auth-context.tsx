"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "./types"
import { getUserByEmail } from "./data"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  // Check for saved user on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error("Failed to parse saved user", error)
        localStorage.removeItem("user")
      }
    }
  }, [])

  const login = async (email: string, password: string) => {
    // This would be replaced with Appwrite Auth in phase 2
    const user = getUserByEmail(email)

    if (!user) {
      throw new Error("Invalid email or password")
    }

    // Simulate password check (in real app, this would be done on the server)
    if (password !== "password") {
      throw new Error("Invalid email or password")
    }

    setUser(user)
    localStorage.setItem("user", JSON.stringify(user))
  }

  const register = async (name: string, email: string, password: string) => {
    // This would be replaced with Appwrite Auth in phase 2
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      username: email.split("@")[0],
      bio: "",
      createdAt: new Date().toISOString(),
      publicationCount: 0,
    }

    setUser(newUser)
    localStorage.setItem("user", JSON.stringify(newUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}

