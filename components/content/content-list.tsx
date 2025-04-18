"use client"

import Link from "next/link"
import type { Content } from "@/lib/types"
import { ThumbsUp, MessageSquare } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

interface ContentListProps {
  items: Content[]
  type: "poetry" | "fiction" | "article" | "all" // Changed "story" to "fiction"
}

export default function ContentList({ items, type }: ContentListProps) {
  const isMobile = useIsMobile()

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No content found.</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-border">
      {items.map((item) => (
        <Link
          key={item.id}
          href={`/${item.type === "poetry" ? "poetry" : item.type === "fiction" ? "fiction" : "articles"}/${item.slug}`} // Changed "story" to "fiction" and "stories" to "fiction"
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 px-3 hover:bg-muted/50 transition-colors hover:no-underline"
        >
          {isMobile ? (
            <>
              <div className="flex items-center gap-2 overflow-hidden mb-2">
                <span className="font-medium text-foreground truncate">{item.title}</span>
                <span className="text-sm shrink-0">-</span>
                <span 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.location.href = `/profile/${item.author.username}`;
                  }} 
                  className="text-sm font-medium shrink-0 hover:underline cursor-pointer"
                >
                  {item.author.name}
                </span>
              </div>
              
              <div className="flex items-center justify-between w-full">
                {/* Date removed from mobile view */}
                <div className="flex items-center gap-4 ml-auto"> {/* Added ml-auto to push icons right */}
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <ThumbsUp size={14} />
                    <span className="text-xs">{item.likes}</span>
                  </div>

                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MessageSquare size={14} />
                    <span className="text-xs">{item.commentCount ?? 0}</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="font-medium text-foreground truncate">{item.title}</span>
                <span className="text-sm shrink-0">-</span>
                <span 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.location.href = `/profile/${item.author.username}`;
                  }} 
                  className="text-sm font-medium shrink-0 hover:underline cursor-pointer"
                >
                  {item.author.name}
                </span>
                {/* Date removed from desktop view */}
              </div>
              
              <div className="flex items-center gap-4 shrink-0">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <ThumbsUp size={14} />
                  <span className="text-xs">{item.likes}</span>
                </div>

                <div className="flex items-center gap-1 text-muted-foreground">
                  <MessageSquare size={14} />
                  <span className="text-xs">{item.commentCount ?? 0}</span>
                </div>
              </div>
            </>
          )}
        </Link>
      ))}
    </div>
  )
}
