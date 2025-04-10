"use client" // Add "use client" because we need hooks

import { useEffect, useState } from "react";
import { notFound, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context"; // Import useAuth
import { getUserContent, getSavedContent, getUserBlogPosts } from "@/lib/data"; // Import getUserBlogPosts
import ContentList from "@/components/content/content-list";
import PublishedWorksList from "@/components/profile/published-works-list"
import SavedContentList from "@/components/profile/saved-content-list";
import BlogPostsList from "@/components/profile/blog-posts-list";
import UserProfile from "@/components/profile/user-profile";
import { Skeleton } from "@/components/ui/skeleton"; // For loading state
import type { Content } from "@/lib/types";
import { account, databases, storage, DATABASES_ID, USER_PROFILES_COLLECTION_ID, PROFILE_PICTURES_BUCKET_ID } from "@/lib/appwrite"; // Import Appwrite services and constants, added storage and BUCKET_ID
import { Models, Query } from "appwrite"; // Import Appwrite Models and Query

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
  const [savedContent, setSavedContent] = useState<Content[]>([])
  const [blogPosts, setBlogPosts] = useState<Content[]>([])
  const [contentLoading, setContentLoading] = useState(true)
  const [savedContentLoading, setSavedContentLoading] = useState(true);
  const [blogLoading, setBlogLoading] = useState(true);
  const [profileUser, setProfileUser] = useState<any | null>(null); // Using 'any' temporarily for easier object construction
  const [profileLoading, setProfileLoading] = useState(true);
  const [avatarDisplayUrl, setAvatarDisplayUrl] = useState<string>("/placeholder-user.jpg"); // State for avatar URL

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
          setProfileUser(null);
          setAvatarDisplayUrl("/placeholder-user.jpg"); // Reset avatar on not found
        } else {
          const userProfile = userProfileResponse.documents[0];
          const userId = userProfile.userId;
          const avatarFileId = userProfile.avatarFileId || null;

          // Generate avatar URL immediately
          let currentAvatarUrl = "/placeholder-user.jpg";
          if (avatarFileId) {
            try {
              currentAvatarUrl = storage.getFileView(PROFILE_PICTURES_BUCKET_ID, avatarFileId).toString();
            } catch (urlError) {
              console.error("Error generating avatar URL on profile page:", urlError);
            }
          }
          setAvatarDisplayUrl(currentAvatarUrl);

          // Construct the profileUser object, including necessary fields for UserProfile component
          const constructedProfileUser = {
            $id: userId,
            name: userProfile.displayName || userProfile.username, // Prefer display name
            username: userProfile.username,
            bio: userProfile.bio || "", // Assuming bio exists in profile
            $createdAt: userProfile.$createdAt,
            // Add other fields expected by UserProfile component if necessary
          };

          setProfileUser(constructedProfileUser);
        } // <-- Corrected closing brace for the 'else' block
      } catch (error) {
        console.error("Error fetching profile user:", error);
        setProfileUser(null);
        setAvatarDisplayUrl("/placeholder-user.jpg"); // Reset avatar on error
      } finally {
        setProfileLoading(false);
      }
    }

    if (!authLoading) {
      fetchProfileUser();
    }
  }, [authLoading, authUser, usernameFromParams]); // Removed avatarDisplayUrl dependency here, URL is set within the effect

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

  // Fetch saved content from Appwrite
  useEffect(() => {
    async function fetchSavedContent() {
      try {
        if (!profileUser) {
          setSavedContentLoading(false)
          return;
        }
        
        setSavedContentLoading(true)
        const content = await getSavedContent(profileUser.$id)
        setSavedContent(content)
      } catch (error) {
        console.error("Error fetching saved content:", error)
      } finally {
        setSavedContentLoading(false)
      }
    }

    if (!profileLoading) {
      fetchSavedContent()
    }
  }, [profileLoading, profileUser])
  
  // Fetch blog posts from Appwrite
  useEffect(() => {
    async function fetchBlogPosts() {
      try {
        if (!profileUser) {
          setBlogLoading(false)
          return;
        }
        
        setBlogLoading(true)
        // Check if the current user is viewing their own profile
        const isOwner = authUser ? authUser.$id === profileUser.$id : false
        const posts = await getUserBlogPosts(profileUser.$id, isOwner)
        setBlogPosts(posts)
      } catch (error) {
        console.error("Error fetching blog posts:", error)
      } finally {
        setBlogLoading(false)
      }
    }

    if (!profileLoading) {
      fetchBlogPosts()
    }
  }, [profileLoading, profileUser, authUser])

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
      {/* Pass the profile user object and avatar URL to UserProfile */}
      <UserProfile user={profileUser} avatarUrl={avatarDisplayUrl} />

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

      {/* Saved Content Section */}
      <div className="border-t border-border pt-8">
        <h2 className="mb-6">Saved Content</h2>
        {savedContentLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : (
          <SavedContentList items={savedContent} />
        )}
      </div>

      {/* Blog Section */}
      <div className="border-t border-border pt-8">
        <h2 className="mb-6">Blog</h2>
        {blogLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : (
          <BlogPostsList 
            items={blogPosts} 
            isOwner={authUser ? authUser.$id === profileUser?.$id : false} 
          />
        )}
      </div>
    </div>
  )
}
