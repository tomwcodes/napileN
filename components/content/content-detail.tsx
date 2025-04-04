import Link from "next/link"
import type { Content } from "@/lib/types"
import ContentActions from "./content-actions"

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
        <Link href={`/profile/${content.author.username}`} className="font-medium text-foreground">
          {content.author.name}
        </Link>
        <span className="text-sm">{new Date(content.createdAt).toLocaleDateString()}</span>
      </div>

      <div className="prose max-w-none py-6 whitespace-pre-line">{content.body}</div>

      <ContentActions content={content} />
    </article>
  )
}
