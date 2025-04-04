"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { getCommentsByContentId } from "@/lib/data"
import CommentItem from "./comment-item"
import type { Comment } from "@/lib/types"

interface CommentSectionProps {
  contentId: string
}

export default function CommentSection({ contentId }: CommentSectionProps) {
  const { user } = useAuth()
  const [comment, setComment] = useState("")
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchComments() {
      try {
        setLoading(true)
        const fetchedComments = await getCommentsByContentId(contentId)
        setComments(fetchedComments)
      } catch (error) {
        console.error("Error fetching comments:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchComments()
  }, [contentId])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      alert("You must be logged in to comment")
      return
    }

    if (!comment.trim()) return

    // This would be replaced with Appwrite SDK in phase 2
    const newComment: Comment = {
      id: Date.now().toString(),
      contentId,
      author: {
        id: user.$id || "anonymous",
        name: user.name || "Anonymous",
        username: user.$id || "anonymous",
      },
      body: comment,
      createdAt: new Date().toISOString(),
    }

    setComments([newComment, ...comments])
    setComment("")
  }

  return (
    <section className="space-y-6">
      <h2>Comments ({comments.length})</h2>

      {user ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="form-textarea"
            rows={3}
          />

          <div className="flex justify-end">
            <button type="submit" className="btn btn-primary">
              Post Comment
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-muted p-4 rounded-sm text-center">
          <p className="mb-2">You need to be logged in to comment.</p>
          <div className="flex justify-center gap-4">
            <a href="/login" className="btn btn-primary">
              Log In
            </a>
            <a href="/register" className="btn btn-outline">
              Register
            </a>
          </div>
        </div>
      )}

      <div className="space-y-6 pt-4">
        {comments.length > 0 ? (
          comments.map((comment) => <CommentItem key={comment.id} comment={comment} />)
        ) : (
          <p className="text-muted-foreground text-center py-4">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </section>
  )
}
