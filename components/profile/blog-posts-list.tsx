import Link from "next/link"
import type { Content } from "@/lib/types"
import { Eye, EyeOff } from "lucide-react"

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
            <span className="text-xs uppercase tracking-wider text-muted-foreground min-w-16">Blog</span>
            <span className="font-medium text-foreground truncate">{item.title}</span>
          </div>
          
          <div className="flex items-center gap-4 shrink-0">
            <div className="flex items-center gap-3">
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
              
              {/* Show date */}
              <span className="text-xs text-muted-foreground">
                {new Date(item.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
