"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    firstName: "", // Added
    lastName: "", // Added
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Updated validation to include firstName and lastName
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.username.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError("All fields are required")
      return
    }

    // Validate username format (alphanumeric and underscores only)
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(formData.username)) {
      setError("Username can only contain letters, numbers, and underscores")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      // Pass firstName and lastName to the register function
      await register(
        formData.firstName,
        formData.lastName,
        formData.username,
        formData.email,
        formData.password
      );
      // The register function in AuthContext now handles login automatically
      router.push("/"); // Redirect to home on successful registration + login
    } catch (err: any) { // Use 'any' or check type more specifically
      // Check for specific Appwrite error messages
      if (err?.message) {
        if (err.message.includes("A user with the same id, email, or phone already exists")) {
          setError("This email is already registered.");
        } else if (err.message.includes("Username is already taken")) {
           setError("Username is already taken. Please choose another one."); // Keep existing username message
        }
        else {
          setError(err.message); // Use the original message for other errors
        }
      } else {
        setError("An unexpected error occurred during registration.");
      }
      console.error("Registration failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="mb-6 text-center">Create an Account</h1>

      {error && <div className="bg-red-50 border border-red-200 text-red-800 p-4 mb-6 rounded-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Added First Name and Last Name fields */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="form-group">
            <label htmlFor="firstName" className="form-label">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="form-input"
              placeholder="John"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName" className="form-label">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="form-input"
              placeholder="Doe"
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="form-input"
            placeholder="username123"
            required
          />
          <p className="text-xs text-muted-foreground mt-1">
            Only letters, numbers, and underscores allowed
          </p>
        </div>

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

        <div className="form-group">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="form-input"
            placeholder="••••••••"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Register"}
        </button>
      </form>

      <p className="mt-6 text-center text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-accent">
          Log In
        </Link>
      </p>
    </div>
  )
}
