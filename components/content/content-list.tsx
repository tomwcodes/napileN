"use client"

import Link from "next/link"
import type { Content } from "@/lib/types"
import { ThumbsUp, MessageSquare } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

interface ContentListProps {
  items: Content[]
  type: "poetry" | "story" | "blog" | "all"
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
          href={`/${item.type === "poetry" ? "poetry" : item.type === "story" ? "stories" : "blog"}/${item.slug}`}
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
                <span className="text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleDateString()}</span>
                
                <div className="flex items-center gap-4">
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
                <span className="text-xs text-muted-foreground shrink-0">{new Date(item.createdAt).toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-center gap-4 shrink-0">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <ThumbsUp size={14} />
                  <span className="text-xs">{item.likes}</span>
                </div>

                <div className="flex items-center gap-1 text-muted-foreground">
                  <MessageSquare size={14} />
                  <span className="text-xs">{item.comments.length}</span>
                </div>
              </div>
            </>
          )}
        </Link>
      ))}
    </div>
  )
}
