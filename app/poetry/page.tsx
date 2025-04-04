import Link from "next/link"
import ContentList from "@/components/content/content-list"
import ContentFilter from "@/components/content/content-filter"
import { getPoems } from "@/lib/data"
import { Button } from "@/components/ui/button"

export const dynamic = 'force-dynamic'; // Opt out of static rendering

export default async function PoetryPage() {
  const poems = await getPoems()

  return (
    <div className="space-y-8">
      <div className="border-b border-border pb-6">
        <div>
          <h1>Poetry</h1>
          <p className="text-muted-foreground mt-2">Explore poems from writers around the world</p>
          <div className="mt-4">
            <Link href="/write">
              <Button className="text-white bg-red-900 px-4 py-2 rounded hover:bg-red-950 transition-colors">Publish Poem</Button>
            </Link>
          </div>
        </div>
      </div>

      <ContentFilter />

      <ContentList items={poems} type="poetry" />
    </div>
  )
}
