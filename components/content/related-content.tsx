import Link from "next/link"
import { getRelatedContent } from "@/lib/data"

interface RelatedContentProps {
  contentId: string
  type: string
}

export default async function RelatedContent({ contentId, type }: RelatedContentProps) {
  const relatedContent = await getRelatedContent(contentId, type, 3)

  if (relatedContent.length === 0) {
    return null
  }

  return (
    <section className="space-y-6">
      <h2>You May Also Like</h2>

      <div className="grid md:grid-cols-3 gap-6">
        {relatedContent.map((content) => (
        <Link
          key={content.id}
          href={`/${content.type === "poetry" ? "poetry" : content.type === "fiction" ? "fiction" : "articles"}/${content.slug}`} // Changed "story" to "fiction" and "stories" to "fiction"
          className="group hover:no-underline"
        >
            <div className="card h-full flex flex-col group-hover:border-accent">
              <div className="mb-2">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">{content.type}</span>
              </div>
              <h3 className="text-lg mb-2 group-hover:text-accent transition-colors">{content.title}</h3>
              <p className="text-muted-foreground mb-4 line-clamp-2 text-sm">{content.excerpt}</p>
              <div className="mt-auto">
                <span className="text-sm">By {content.author.name}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
