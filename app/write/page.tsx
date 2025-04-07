"use client"

import type React from "react"

import { useState, useEffect } from "react" // Import useEffect
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { createContent, createBlogPost } from "@/lib/data" // Import createBlogPost function
import { databases, DATABASES_ID, USER_PROFILES_COLLECTION_ID } from "@/lib/appwrite"
import { Query } from "appwrite"

export default function WritePage() {
  const { user, loading } = useAuth() // Get loading state
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    category: "", // Default to empty string for placeholder
    visibility: "public" // Default visibility for blog posts
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

    if (!formData.title.trim() || !formData.body.trim() || !formData.category) { // Add category validation
      setError("Title, body, and category are required")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      // Get the user's username from the user profile
      const userProfileResponse = await databases.listDocuments(
        DATABASES_ID,
        USER_PROFILES_COLLECTION_ID,
        [Query.equal("userId", user.$id)]
      );
      
      // If user profile not found, use user ID as username
      const username = userProfileResponse.documents.length > 0 
        ? userProfileResponse.documents[0].username 
        : user.$id;
      
      let result;
      
      // If category is blog, use createBlogPost function
      if (formData.category === "blog") {
        result = await createBlogPost(
          formData.title,
          formData.body,
          user.$id,
          username,
          formData.visibility as "public" | "private"
        );
      } else {
        // For other categories, use the createContent function
        result = await createContent(
          formData.title,
          formData.body,
          formData.category,
          user.$id,
          user.name || "Anonymous",
          username
        );
      }

      if (!result) {
        throw new Error("Failed to create content")
      }

      // Redirect to the appropriate page based on category
      if (formData.category === "blog") {
        router.push(`/profile/${username}`); // Redirect to user profile for blog posts
      } else {
        router.push(`/${formData.category === "poetry" ? "poetry" : formData.category === "fiction" ? "fiction" : "articles"}`);
      }
    } catch (err) {
      setError("Failed to submit content. Please try again.")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Redirect if not logged in after loading is complete
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  // Optional: Show loading state
  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  // If loading is done and user exists, render the form.
  // If loading is done and user doesn't exist, the useEffect above will redirect.
  // If user is null but loading is true, the loading indicator is shown.
  // This check ensures we don't render the form briefly before redirecting.
  if (!user) {
    // This should ideally not be reached if loading is false due to the redirect,
    // but it's a safeguard. Could return null or a minimal loading/redirecting message.
    return null;
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
            <option value="" disabled>-- Select a category --</option> {/* Added placeholder */}
            <option value="poetry">Poetry</option>
            <option value="fiction">Fiction</option> {/* Changed value="story" to "fiction" and text "Short Story" to "Fiction" */}
            <option value="article">Article</option>
            <option value="blog">Blog</option>
          </select>
        </div>

        {/* Visibility toggle for blog posts */}
        {formData.category === "blog" && (
          <div className="form-group">
            <label htmlFor="visibility" className="form-label">
              Visibility
            </label>
            <select
              id="visibility"
              name="visibility"
              value={formData.visibility}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
            <p className="text-sm text-muted-foreground mt-1">
              {formData.visibility === "public" 
                ? "Anyone can view this blog post" 
                : "Only you can view this blog post"}
            </p>
          </div>
        )}

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
