import ContentList from "@/components/content/content-list"
import { getBlogs } from "@/lib/data"

export default function BlogPage() {
  const blogs = getBlogs()

  return (
    <div className="space-y-8">
      <div className="border-b border-border pb-6">
        <h1>Blog</h1>
        <p className="text-muted-foreground mt-2">Longform content from our community</p>
      </div>

      <ContentList items={blogs} type="blog" />
    </div>
  )
}

