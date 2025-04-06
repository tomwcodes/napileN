"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { getCommentsByContentId, createComment } from "@/lib/data"
import { databases, DATABASES_ID, USER_PROFILES_COLLECTION_ID } from "@/lib/appwrite"
import { Query } from "appwrite"
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
  const [username, setUsername] = useState<string | null>(null)
  
  // Fetch the user's username when the user changes
  useEffect(() => {
    async function fetchUsername() {
      if (!user) {
        setUsername(null)
        return
      }
      
      try {
        const response = await databases.listDocuments(
          DATABASES_ID,
          USER_PROFILES_COLLECTION_ID,
          [Query.equal("userId", user.$id)]
        )
        
        if (response.documents.length > 0) {
          setUsername(response.documents[0].username)
        } else {
          // Fallback to user ID if no username is found
          setUsername(user.$id)
        }
      } catch (error) {
        console.error("Error fetching username:", error)
        // Fallback to user ID if there's an error
        setUsername(user.$id)
      }
    }
    
    fetchUsername()
  }, [user])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      alert("You must be logged in to comment")
      return
    }

    if (!comment.trim()) return

    setLoading(true)
    try {
      const newComment = await createComment(
        contentId,
        user.$id,
        username || user.$id,
        comment.trim()
      )

      if (newComment) {
        setComments([newComment, ...comments])
        setComment("")
      }
    } catch (error) {
      console.error("Error creating comment:", error)
      alert("Failed to post comment. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="space-y-6">
      <div>
        <h2>Comments ({comments.length})</h2>
        {loading && comments.length === 0 ? (
          <p className="text-muted-foreground mt-2">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-muted-foreground mt-2">No comments yet. Be the first to comment!</p>
        ) : null}
      </div>

      <div className="space-y-6 mt-6">
        {comments.length > 0 && (
          comments.map((comment) => <CommentItem key={comment.id} comment={comment} />)
        )}
      </div>

      {user ? (
        <form onSubmit={handleSubmit} className="mt-6 mb-2 w-full max-w-2xl">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="border px-4 py-2 rounded w-full mb-2"
            rows={3}
          />

          <div>
            <button 
              type="submit" 
              disabled={loading}
              className={`bg-red-900 text-white px-4 py-2 rounded hover:bg-red-950 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-muted p-4 rounded-sm text-center mt-6 mb-2">
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
    </section>
  )
}
