import Link from "next/link"
import ContentList from "@/components/content/content-list"
import { getBlogs } from "@/lib/data"
import { Button } from "@/components/ui/button"

export default function BlogPage() {
  const blogs = getBlogs()

  return (
    <div className="space-y-8">
      <div className="border-b border-border pb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1>Blog</h1>
            <p className="text-muted-foreground mt-2">Longform content from our community</p>
          </div>
          <Link href="/write">
            <Button>Publish Blog Post</Button>
          </Link>
        </div>
      </div>

      <ContentList items={blogs} type="blog" />
    </div>
  )
}
