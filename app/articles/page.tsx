import Link from "next/link"
import ContentList from "@/components/content/content-list"
import { getArticles } from "@/lib/data"
import { Button } from "@/components/ui/button"

export const dynamic = 'force-dynamic'; // Opt out of static rendering

export default async function ArticlesPage() {
  const articles = await getArticles()

  return (
    <div className="space-y-8">
      <div className="border-b border-border pb-6">
        <div>
          <h1>Articles</h1>
          <p className="text-muted-foreground mt-2">Longform content from our community</p>
          <div className="mt-4">
            <Link href="/write">
              <Button className="text-white bg-red-900 px-4 py-2 rounded hover:bg-red-950 transition-colors">Publish Article</Button>
            </Link>
          </div>
        </div>
      </div>

      <ContentList items={articles} type="article" />
    </div>
  )
}
