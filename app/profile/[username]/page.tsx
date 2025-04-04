"use client" // Add "use client" because we need hooks

import { useEffect, useState } from "react"
import { notFound, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context" // Import useAuth
import { getUserContent } from "@/lib/data" // Now updated to use Appwrite
import ContentList from "@/components/content/content-list"
import UserProfile from "@/components/profile/user-profile"
import { Skeleton } from "@/components/ui/skeleton" // For loading state
import type { Content } from "@/lib/types"

interface ProfilePageProps {
  params: {
    username: string // This parameter now holds the User ID
  }
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const { user: authUser, loading: authLoading } = useAuth()
  const router = useRouter()
  const userIdFromParams = params.username // Rename for clarity
  const [userContent, setUserContent] = useState<Content[]>([])
  const [contentLoading, setContentLoading] = useState(true)

  // Fetch user content from Appwrite
  useEffect(() => {
    async function fetchUserContent() {
      if (authUser && authUser.$id === userIdFromParams) {
        try {
          setContentLoading(true)
          const content = await getUserContent(userIdFromParams)
          setUserContent(content)
        } catch (error) {
          console.error("Error fetching user content:", error)
        } finally {
          setContentLoading(false)
        }
      }
    }

    fetchUserContent()
  }, [authUser, userIdFromParams])

  useEffect(() => {
    // Wait until authentication status is resolved
    if (!authLoading) {
      if (!authUser) {
        // If user is not logged in (e.g., after logout), redirect to homepage
        router.push('/')
      } else if (authUser.$id !== userIdFromParams) {
        // If logged in user's ID doesn't match the profile ID, show not found
        notFound()
      }
      // If user is logged in and IDs match, render the profile (do nothing here)
    }
  }, [authLoading, authUser, userIdFromParams, router])

  // Show loading state while auth is resolving
  if (authLoading || !authUser || authUser.$id !== userIdFromParams) {
    return (
      <div className="space-y-8">
        {/* Skeleton for UserProfile */}
        <div className="flex items-center space-x-4">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        {/* Skeleton for ContentList */}
        <div className="border-t border-border pt-8">
          <Skeleton className="h-6 w-40 mb-6" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    )
  }

  // If loading is done and the user ID matches, render the profile
  return (
    <div className="space-y-8">
      {/* Pass the Appwrite user object to UserProfile */}
      <UserProfile user={authUser} />

      <div className="border-t border-border pt-8">
        <h2 className="mb-6">Published Works</h2>
        {contentLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : userContent.length > 0 ? (
          <ContentList items={userContent} type="all" />
        ) : (
          <p className="text-muted-foreground">No published works yet.</p>
        )}
      </div>
    </div>
  )
}
