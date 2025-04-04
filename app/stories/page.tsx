import ContentList from "@/components/content/content-list"
import ContentFilter from "@/components/content/content-filter"
import { getStories } from "@/lib/data"

export default function StoriesPage() {
  const stories = getStories()

  return (
    <div className="space-y-8">
      <div className="border-b border-border pb-6">
        <h1>Stories</h1>
        <p className="text-muted-foreground mt-2">Discover short stories from talented writers</p>
      </div>

      <ContentFilter />

      <ContentList items={stories} type="story" />
    </div>
  )
}

