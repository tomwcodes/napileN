"use client" // Add "use client" because we need hooks

import { useEffect } from "react"
import { notFound, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context" // Import useAuth
import { getUserContent } from "@/lib/data" // Keep for now, needs Appwrite update later
import ContentList from "@/components/content/content-list"
import UserProfile from "@/components/profile/user-profile"
import { Skeleton } from "@/components/ui/skeleton" // For loading state

interface ProfilePageProps {
  params: {
    username: string // This parameter now holds the User ID
  }
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const { user: authUser, loading: authLoading } = useAuth()
  const router = useRouter()
  const userIdFromParams = params.username // Rename for clarity

  // Placeholder for user content - replace with Appwrite DB query later
  // For now, assume it fetches based on the ID from params
  const userContent = getUserContent(userIdFromParams)

  useEffect(() => {
    // Redirect if loading finishes and user is not logged in or ID doesn't match
    if (!authLoading && (!authUser || authUser.$id !== userIdFromParams)) {
      // Option 1: Redirect to login if not logged in
      // if (!authUser) {
      //   router.push('/login');
      //   return;
      // }
      // Option 2: Show not found for non-matching IDs or not logged in
      notFound()
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
        {/* This part needs real data from Appwrite DB later */}
        {userContent.length > 0 ? (
          <ContentList items={userContent} type="all" />
        ) : (
          <p className="text-muted-foreground">No published works yet.</p>
        )}
      </div>
    </div>
  )
}
