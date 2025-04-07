"use client"

import { useEffect, useState } from "react"
import { notFound } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { databases, DATABASES_ID, USER_BLOG_COLLECTION_ID, USER_PROFILES_COLLECTION_ID } from "@/lib/appwrite"
import { Query } from "appwrite"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"
import type { Content } from "@/lib/types"

interface BlogPostPageProps {
  params: {
    username: string
    slug: string
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const { user: authUser, loading: authLoading } = useAuth()
  const [blogPost, setBlogPost] = useState<Content | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBlogPost() {
      try {
        setLoading(true)
        
        // First, get the user ID from the username
        const userProfileResponse = await databases.listDocuments(
          DATABASES_ID,
          USER_PROFILES_COLLECTION_ID,
          [Query.equal("username", params.username)]
        );
        
        if (userProfileResponse.documents.length === 0) {
          setError("User not found")
          return
        }
        
        const userId = userProfileResponse.documents[0].userId
        
        // Check if the current user is the owner of the blog post
        const isOwner = authUser && authUser.$id === userId
        
        // Get the blog post
        const blogPostResponse = await databases.getDocument(
          DATABASES_ID,
          USER_BLOG_COLLECTION_ID,
          params.slug
        );
        
        // If the blog post is private and the current user is not the owner, return 404
        if (blogPostResponse.visibility === "private" && !isOwner) {
          setError("Blog post not found or is private")
          return
        }
        
        // Map the blog post to the Content type
        const post: Content = {
          id: blogPostResponse.$id,
          title: blogPostResponse.title,
          slug: blogPostResponse.$id,
          body: blogPostResponse.body,
          excerpt: blogPostResponse.body.substring(0, 150) + "...",
          type: "blog",
          author: {
            id: blogPostResponse.userId,
            name: blogPostResponse.username,
            username: blogPostResponse.username,
          },
          createdAt: blogPostResponse.createdAt || blogPostResponse.$createdAt,
          likes: 0,
          likedBy: [],
          featured: false,
          comments: [],
          commentCount: 0,
          visibility: blogPostResponse.visibility || "public",
        }
        
        setBlogPost(post)
      } catch (error) {
        console.error("Error fetching blog post:", error)
        setError("Blog post not found")
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading) {
      fetchBlogPost()
    }
  }, [authLoading, authUser, params.slug, params.username])

  // Show loading state
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-2 mb-8">
          <Skeleton className="h-6 w-24" />
        </div>
        <Skeleton className="h-10 w-3/4 mb-4" />
        <Skeleton className="h-4 w-48 mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    )
  }

  // Show error state
  if (error || !blogPost) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 mb-8">
          <Link href={`/profile/${params.username}`} className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
            <ArrowLeft size={16} />
            <span>Back to profile</span>
          </Link>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-sm">
          {error || "Blog post not found"}
        </div>
      </div>
    )
  }

  // Show blog post
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-2 mb-8">
        <Link href={`/profile/${params.username}`} className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
          <ArrowLeft size={16} />
          <span>Back to profile</span>
        </Link>
      </div>
      
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold">{blogPost.title}</h1>
          {blogPost.visibility === "private" && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <EyeOff size={16} />
              <span className="text-sm">Private</span>
            </div>
          )}
          {blogPost.visibility === "public" && authUser && authUser.$id === blogPost.author.id && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Eye size={16} />
              <span className="text-sm">Public</span>
            </div>
          )}
        </div>
        <p className="text-muted-foreground">
          By {blogPost.author.name} • {new Date(blogPost.createdAt).toLocaleDateString()}
        </p>
      </div>
      
      <div className="prose max-w-none">
        {blogPost.body.split('\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </div>
  )
}
