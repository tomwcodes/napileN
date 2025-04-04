import Link from "next/link"
import ContentList from "@/components/content/content-list"
import ContentFilter from "@/components/content/content-filter"
import { getStories } from "@/lib/data"
import { Button } from "@/components/ui/button"

export const dynamic = 'force-dynamic'; // Opt out of static rendering

export default async function StoriesPage() {
  const stories = await getStories()

  return (
    <div className="space-y-8">
      <div className="border-b border-border pb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1>Stories</h1>
            <p className="text-muted-foreground mt-2">Discover short stories from talented writers</p>
          </div>
          <Link href="/write">
            <Button>Publish Story</Button>
          </Link>
        </div>
      </div>

      <ContentFilter />

      <ContentList items={stories} type="story" />
    </div>
  )
}
