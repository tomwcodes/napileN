import Link from "next/link"
import type { Content } from "@/lib/types"
import { ThumbsUp, MessageSquare } from "lucide-react"

interface PublishedWorksListProps {
  items: Content[]
  type?: "works" | "blog" // Filter by content type
}

export default function PublishedWorksList({ items, type = "works" }: PublishedWorksListProps) {
  // Filter items based on type
  const filteredItems = type === "works" 
    ? items.filter(item => item.type === "poetry" || item.type === "story")
    : items.filter(item => item.type === "blog")
  
  if (filteredItems.length === 0) {
    return (
      <div className="py-2">
        <p className="text-muted-foreground">
          {type === "works" ? "No published works yet." : "No blog posts yet."}
        </p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-border">
      {filteredItems.map((item) => (
        <Link
          key={item.id}
          href={`/${item.type === "poetry" ? "poetry" : item.type === "story" ? "stories" : "blog"}/${item.slug}`}
          className="flex items-center justify-between py-3 px-3 hover:bg-muted/50 transition-colors hover:no-underline"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="text-xs uppercase tracking-wider text-muted-foreground min-w-16">{item.type}</span>
            <span className="font-medium text-foreground truncate">{item.title}</span>
          </div>
          
          <div className="flex items-center gap-4 shrink-0">
            <span className="text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleDateString()}</span>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-muted-foreground">
                <ThumbsUp size={14} />
                <span className="text-xs">{item.likes}</span>
              </div>

              <div className="flex items-center gap-1 text-muted-foreground">
                <MessageSquare size={14} />
                <span className="text-xs">{item.comments.length}</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
