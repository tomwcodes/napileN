import Link from "next/link"
import type { Comment } from "@/lib/types"

interface CommentItemProps {
  comment: Comment
}

export default function CommentItem({ comment }: CommentItemProps) {
  return (
    <div className="border-b border-border pb-6">
      <div className="flex items-center gap-2 mb-2">
        <Link href={`/profile/${comment.author.username}`} className="font-medium">
          {comment.author.name}
        </Link>
        <span className="text-xs text-muted-foreground">{new Date(comment.createdAt).toLocaleDateString()}</span>
      </div>

      <p className="whitespace-pre-line">{comment.body}</p>
    </div>
  )
}

