"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

export default function WritePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    category: "poetry",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      setError("You must be logged in to submit content")
      return
    }

    if (!formData.title.trim() || !formData.body.trim()) {
      setError("Title and body are required")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      // This would be replaced with Appwrite SDK calls in phase 2
      console.log("Submitting content:", formData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirect to the appropriate page based on category
      router.push(`/${formData.category === "poetry" ? "poetry" : formData.category === "story" ? "stories" : "blog"}`)
    } catch (err) {
      setError("Failed to submit content. Please try again.")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h1 className="mb-4">Write Something New</h1>
        <p className="mb-6 text-muted-foreground">You need to be logged in to submit content.</p>
        <a href="/login" className="btn btn-primary">
          Log In
        </a>
        <span className="mx-2">or</span>
        <a href="/register" className="btn btn-outline">
          Register
        </a>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="mb-6">Write Something New</h1>

      {error && <div className="bg-red-50 border border-red-200 text-red-800 p-4 mb-6 rounded-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter a title for your work"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category" className="form-label">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="poetry">Poetry</option>
            <option value="story">Short Story</option>
            <option value="blog">Blog Post</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="body" className="form-label">
            Content
          </label>
          <textarea
            id="body"
            name="body"
            value={formData.body}
            onChange={handleChange}
            className="form-textarea"
            placeholder="Write your content here..."
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Publish"}
        </button>
      </form>
    </div>
  )
}

