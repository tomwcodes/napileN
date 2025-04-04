"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.email.trim() || !formData.password.trim()) {
      setError("Email and password are required")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      await login(formData.email, formData.password);
      router.push("/"); // Redirect to home on successful login
    } catch (err: any) { // Use 'any' or check type more specifically
      // Check if it's an Appwrite exception and use its message
      if (err?.message) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred during login.");
      }
      console.error("Login failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="mb-6 text-center">Log In</h1>

      {error && <div className="bg-red-50 border border-red-200 text-red-800 p-4 mb-6 rounded-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
            placeholder="your@email.com"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="form-input"
            placeholder="••••••••"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Log In"}
        </button>
      </form>

      <p className="mt-6 text-center text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-accent">
          Register
        </Link>
      </p>
    </div>
  )
}
