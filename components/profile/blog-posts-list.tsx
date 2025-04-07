import Link from "next/link"
import type { Content } from "@/lib/types"
import { Eye, EyeOff, ThumbsUp, MessageSquare } from "lucide-react"

interface BlogPostsListProps {
  items: Content[]
  isOwner: boolean
}

export default function BlogPostsList({ items, isOwner }: BlogPostsListProps) {
  if (items.length === 0) {
    return (
      <div className="py-2">
        <p className="text-muted-foreground">
          No blog posts yet.
        </p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-border">
      {items.map((item) => (
        <Link
          key={item.id}
          href={`/profile/${item.author.username}/blog/${item.slug}`}
          className="flex items-center justify-between py-3 px-3 hover:bg-muted/50 transition-colors hover:no-underline"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            {/* Replace "Blog" with Date */}
            <span className="text-xs uppercase tracking-wider text-muted-foreground min-w-16">
              {new Date(item.createdAt).toLocaleDateString()}
            </span>
            <span className="font-medium text-foreground truncate">{item.title}</span>
          </div>
          
          <div className="flex items-center gap-4 shrink-0">
            <div className="flex items-center gap-3">
              {/* Add Likes and Comments */}
              <div className="flex items-center gap-1 text-muted-foreground">
                <ThumbsUp size={14} />
                <span className="text-xs">{item.likes}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <MessageSquare size={14} />
                <span className="text-xs">{item.commentCount || 0}</span>
              </div>

              {/* Show visibility icon if user is the owner */}
              {isOwner && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  {item.visibility === "private" ? (
                    <EyeOff size={14} />
                  ) : (
                    <Eye size={14} />
                  )}
                </div>
              )}
              
              {/* Date removed from here */}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
