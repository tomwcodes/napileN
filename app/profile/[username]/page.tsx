"use client" // Add "use client" because we need hooks

import { useEffect, useState } from "react"
import { notFound, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context" // Import useAuth
import { getUserContent } from "@/lib/data" // Now updated to use Appwrite
import ContentList from "@/components/content/content-list"
import PublishedWorksList from "@/components/profile/published-works-list"
import UserProfile from "@/components/profile/user-profile"
import { Skeleton } from "@/components/ui/skeleton" // For loading state
import type { Content } from "@/lib/types"
import { account, databases, DATABASES_ID, USER_PROFILES_COLLECTION_ID } from "@/lib/appwrite" // Import Appwrite services and constants
import { Models, Query } from "appwrite" // Import Appwrite Models and Query

interface ProfilePageProps {
  params: {
    username: string // This parameter now holds the User ID
  }
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const { user: authUser, loading: authLoading } = useAuth()
  const router = useRouter()
  const usernameFromParams = params.username // This is now actually the username
  const [userContent, setUserContent] = useState<Content[]>([])
  const [contentLoading, setContentLoading] = useState(true)
  const [profileUser, setProfileUser] = useState<Models.User<Models.Preferences> | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)

  // Fetch profile user data
  useEffect(() => {
    async function fetchProfileUser() {
      try {
        setProfileLoading(true)
        
        // Get user profile by username
        const userProfileResponse = await databases.listDocuments(
          DATABASES_ID,
          USER_PROFILES_COLLECTION_ID,
          [Query.equal("username", usernameFromParams)]
        );
        
        if (userProfileResponse.documents.length === 0) {
          // No user found with this username
          setProfileUser(null)
        } else {
          const userProfile = userProfileResponse.documents[0];
          const userId = userProfile.userId;
          
          // If the profile is for the current user, use the auth context data
          if (authUser && authUser.$id === userId) {
            setProfileUser(authUser)
          } else {
            // For other users, create a mock user object
            const mockUser = {
              $id: userId,
              name: userProfile.username, // Use username as name if no name is available
              $createdAt: userProfile.$createdAt,
            } as unknown as Models.User<Models.Preferences>;
            
            setProfileUser(mockUser);
          }
        }
      } catch (error) {
        console.error("Error fetching profile user:", error)
        setProfileUser(null)
      } finally {
        setProfileLoading(false)
      }
    }

    if (!authLoading) {
      fetchProfileUser()
    }
  }, [authLoading, authUser, usernameFromParams])

  // Fetch user content from Appwrite
  useEffect(() => {
    async function fetchUserContent() {
      try {
        if (!profileUser) {
          setContentLoading(false)
          return;
        }
        
        setContentLoading(true)
        const content = await getUserContent(profileUser.$id)
        setUserContent(content)
      } catch (error) {
        console.error("Error fetching user content:", error)
      } finally {
        setContentLoading(false)
      }
    }

    if (!profileLoading) {
      fetchUserContent()
    }
  }, [profileLoading, profileUser])

  // Show loading state while data is being fetched
  if (authLoading || profileLoading) {
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

  // If loading is done and we still don't have a profile user or content, show not found page
  if (!profileLoading && !contentLoading && !profileUser && userContent.length === 0) {
    notFound()
  }

  // If loading is done and profile user is found, render the profile
  return (
    <div className="space-y-8">
      {/* Pass the profile user object to UserProfile */}
      <UserProfile user={profileUser} />

      {/* Published Content Section */}
      <div className="border-t border-border pt-8">
        <h2 className="mb-6">Published Content</h2>
        {contentLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : (
          // Pass all userContent without filtering by type here
          <PublishedWorksList items={userContent} />
        )}
      </div>

      {/* Blog Section */}
      <div className="border-t border-border pt-8">
        <h2 className="mb-6">Blog</h2>
        <p className="text-muted-foreground">Coming soon.</p>
      </div>
    </div>
  )
}
