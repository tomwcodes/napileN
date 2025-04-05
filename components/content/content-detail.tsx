import Link from "next/link"
import type { Content } from "@/lib/types"
import ContentActions from "./content-actions"
import { MessageSquare } from "lucide-react"

interface ContentDetailProps {
  content: Content
}

export default function ContentDetail({ content }: ContentDetailProps) {
  return (
    <article className="space-y-6">
      <div className="mb-2">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">{content.type}</span>
      </div>

      <h1 className="mb-4">{content.title}</h1>

      <div className="flex items-center gap-2 text-muted-foreground">
        <Link href={`/profile/${content.author.username}`} className="font-medium text-accent">
          {content.author.name}
        </Link>
        <span className="text-sm">{new Date(content.createdAt).toLocaleDateString()}</span>
      </div>

      <div className="prose max-w-none py-6 whitespace-pre-line">{content.body}</div>

      <div className="flex items-center gap-4">
        <ContentActions content={content} />
        
        <div className="flex items-center gap-1 text-muted-foreground">
          <MessageSquare size={16} />
          <span>{content.commentCount || 0}</span>
        </div>
      </div>
    </article>
  )
}
