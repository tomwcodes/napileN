import Link from "next/link"
import { getFeaturedContent } from "@/lib/data"

export default function FeaturedContent() {
  const featuredContent = getFeaturedContent()

  if (featuredContent.length === 0) {
    return null
  }

  const mainFeature = featuredContent[0]
  const otherFeatures = featuredContent.slice(1, 3)

  return (
    <section>
      <h2 className="mb-6">Featured</h2>

      <div className="grid md:grid-cols-2 gap-8">
        <Link
          href={`/${mainFeature.type === "poetry" ? "poetry" : mainFeature.type === "story" ? "stories" : "blog"}/${mainFeature.slug}`}
          className="group hover:no-underline"
        >
          <div className="card h-full flex flex-col group-hover:border-accent">
            <div className="mb-4">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">{mainFeature.type}</span>
            </div>
            <h3 className="mb-2 group-hover:text-accent transition-colors">{mainFeature.title}</h3>
            <p className="text-muted-foreground mb-4 line-clamp-3">{mainFeature.excerpt}</p>
            <div className="mt-auto flex items-center gap-2">
              <span className="text-sm font-medium">By {mainFeature.author.name}</span>
              <span className="text-xs text-muted-foreground">
                {new Date(mainFeature.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </Link>

        <div className="grid gap-6">
          {otherFeatures.map((feature) => (
            <Link
              key={feature.id}
              href={`/${feature.type === "poetry" ? "poetry" : feature.type === "story" ? "stories" : "blog"}/${feature.slug}`}
              className="group hover:no-underline"
            >
              <div className="card group-hover:border-accent">
                <div className="mb-2">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">{feature.type}</span>
                </div>
                <h4 className="mb-2 group-hover:text-accent transition-colors">{feature.title}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">By {feature.author.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(feature.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

