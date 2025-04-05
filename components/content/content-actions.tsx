"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import type { Content } from "@/lib/types"
import { ThumbsUp, Share2, Bookmark } from "lucide-react"
import { likeContent, unlikeContent } from "@/lib/data"

interface ContentActionsProps {
  content: Content
}

export default function ContentActions({ content }: ContentActionsProps) {
  const { user } = useAuth()
  const [likes, setLikes] = useState(content.likes)
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  // Check if the current user has already liked this content
  useEffect(() => {
    if (user && content.likedBy) {
      setIsLiked(content.likedBy.includes(user.$id))
    }
  }, [user, content.likedBy])

  const handleLike = async () => {
    if (!user) {
      alert("You must be logged in to like content")
      return
    }

    if (isUpdating) return // Prevent multiple clicks while updating

    setIsUpdating(true)

    try {
      if (isLiked) {
        // Unlike the content
        const success = await unlikeContent(content.id, user.$id)
        if (success) {
          setLikes(prev => Math.max(0, prev - 1))
          setIsLiked(false)
        }
      } else {
        // Like the content
        const success = await likeContent(content.id, user.$id)
        if (success) {
          setLikes(prev => prev + 1)
          setIsLiked(true)
        }
      }
    } catch (error) {
      console.error("Error updating like status:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleBookmark = () => {
    if (!user) {
      alert("You must be logged in to bookmark content")
      return
    }

    // This would be replaced with Appwrite SDK in phase 2
    setIsBookmarked(!isBookmarked)
  }

  const handleShare = () => {
    // This would be replaced with actual share functionality
    navigator.clipboard.writeText(window.location.href)
    alert("Link copied to clipboard")
  }

  return (
    <div className="flex items-center gap-6 py-4 border-t border-b border-border">
      <button
        onClick={handleLike}
        disabled={isUpdating}
        className={`flex items-center gap-2 ${isLiked ? "text-accent" : "text-muted-foreground"} ${isUpdating ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <ThumbsUp size={20} />
        <span>{likes}</span>
      </button>

      <button
        onClick={handleBookmark}
        className={`flex items-center gap-2 ${isBookmarked ? "text-accent" : "text-muted-foreground"}`}
      >
        <Bookmark size={20} />
        <span>Save</span>
      </button>

      <button onClick={handleShare} className="flex items-center gap-2 text-muted-foreground">
        <Share2 size={20} />
        <span>Share</span>
      </button>
    </div>
  )
}
