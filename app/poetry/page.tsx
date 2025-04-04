import ContentList from "@/components/content/content-list"
import ContentFilter from "@/components/content/content-filter"
import { getPoems } from "@/lib/data"

export default function PoetryPage() {
  const poems = getPoems()

  return (
    <div className="space-y-8">
      <div className="border-b border-border pb-6">
        <h1>Poetry</h1>
        <p className="text-muted-foreground mt-2">Explore poems from writers around the world</p>
      </div>

      <ContentFilter />

      <ContentList items={poems} type="poetry" />
    </div>
  )
}

