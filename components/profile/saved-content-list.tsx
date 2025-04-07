import Link from "next/link"
import type { Content } from "@/lib/types"
import { ThumbsUp, MessageSquare, Bookmark } from "lucide-react"

interface SavedContentListProps {
  items: Content[]
}

export default function SavedContentList({ items }: SavedContentListProps) {
  if (items.length === 0) {
    return (
      <div className="py-2">
        <p className="text-muted-foreground">
          No saved content yet.
        </p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-border">
      {items.map((item) => (
        <Link
          key={item.id}
          href={`/${item.type === "poetry" ? "poetry" : item.type === "fiction" ? "fiction" : "articles"}/${item.slug}`}
          className="flex items-center justify-between py-3 px-3 hover:bg-muted/50 transition-colors hover:no-underline"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="text-xs uppercase tracking-wider text-muted-foreground min-w-16">{item.type}</span>
            <span className="text-xs text-muted-foreground">by {item.author.name}</span>
            <span className="font-medium text-foreground truncate">{item.title}</span>
          </div>
          
          <div className="flex items-center gap-4 shrink-0">
            {/* Date removed */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-muted-foreground">
                <ThumbsUp size={14} />
                <span className="text-xs">{item.likes}</span>
              </div>

              <div className="flex items-center gap-1 text-muted-foreground">
                <MessageSquare size={14} />
                <span className="text-xs">{item.commentCount || 0}</span>
              </div>

              <div className="flex items-center gap-1 text-accent">
                <Bookmark size={14} />
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
