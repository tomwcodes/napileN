import Link from "next/link"
import { getEditorsPicks } from "@/lib/data"

export default async function EditorsPicks() {
  const editorsPicks = await getEditorsPicks(5)

  return (
    <section>
      <h2 className="mb-6">Editor&apos;s Picks</h2>

      <div className="space-y-6">
        {editorsPicks.map((content) => (
          <Link
            key={content.id}
            href={`/${content.type === "poetry" ? "poetry" : content.type === "story" ? "stories" : "blog"}/${content.slug}`}
            className="group hover:no-underline"
          >
            <div className="card group-hover:border-accent">
              <div className="mb-2">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">{content.type}</span>
              </div>
              <h3 className="mb-2 group-hover:text-accent transition-colors">{content.title}</h3>
              <p className="text-muted-foreground mb-4 line-clamp-2">{content.excerpt}</p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">By {content.author.name}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(content.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-6 text-center">
        <Link href="/poetry" className="btn btn-outline">
          View All
        </Link>
      </div>
    </section>
  )
}
