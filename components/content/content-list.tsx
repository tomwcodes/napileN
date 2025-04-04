import Link from "next/link"
import type { Content } from "@/lib/types"
import { ThumbsUp, MessageSquare } from "lucide-react"

interface ContentListProps {
  items: Content[]
  type: "poetry" | "story" | "blog" | "all"
}

export default function ContentList({ items, type }: ContentListProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No content found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {items.map((item) => (
        <div key={item.id} className="card">
          <div className="mb-2">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">{item.type}</span>
          </div>

          <Link
            href={`/${item.type === "poetry" ? "poetry" : item.type === "story" ? "stories" : "blog"}/${item.slug}`}
            className="hover:no-underline"
          >
            <h3 className="mb-2 hover:text-accent transition-colors">{item.title}</h3>
          </Link>

          <p className="text-muted-foreground mb-4 line-clamp-3">{item.excerpt}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href={`/profile/${item.author.username}`} className="text-sm font-medium">
                By {item.author.name}
              </Link>
              <span className="text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-muted-foreground">
                <ThumbsUp size={16} />
                <span className="text-sm">{item.likes}</span>
              </div>

              <div className="flex items-center gap-1 text-muted-foreground">
                <MessageSquare size={16} />
                <span className="text-sm">{item.comments.length}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

