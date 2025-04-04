import Link from "next/link"
import ContentList from "@/components/content/content-list"
import ContentFilter from "@/components/content/content-filter"
import { getPoems } from "@/lib/data"
import { Button } from "@/components/ui/button"

export default function PoetryPage() {
  const poems = getPoems()

  return (
    <div className="space-y-8">
      <div className="border-b border-border pb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1>Poetry</h1>
            <p className="text-muted-foreground mt-2">Explore poems from writers around the world</p>
          </div>
          <Link href="/write">
            <Button>Publish Poem</Button>
          </Link>
        </div>
      </div>

      <ContentFilter />

      <ContentList items={poems} type="poetry" />
    </div>
  )
}
