"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import type { Content } from "@/lib/types"
import { ThumbsUp, Share2, Bookmark } from "lucide-react"

interface ContentActionsProps {
  content: Content
}

export default function ContentActions({ content }: ContentActionsProps) {
  const { user } = useAuth()
  const [likes, setLikes] = useState(content.likes)
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)

  const handleLike = () => {
    if (!user) {
      alert("You must be logged in to like content")
      return
    }

    // This would be replaced with Appwrite SDK in phase 2
    if (isLiked) {
      setLikes(likes - 1)
      setIsLiked(false)
    } else {
      setLikes(likes + 1)
      setIsLiked(true)
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
        className={`flex items-center gap-2 ${isLiked ? "text-accent" : "text-muted-foreground"}`}
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

