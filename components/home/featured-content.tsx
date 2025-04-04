'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart, MessageCircle } from 'lucide-react' // Import icons
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Content } from '@/lib/types'

interface FeaturedContentProps {
  recentContent: Content[]
  mostReadContent: Content[] // Placeholder, will use recent content for now
}

// Helper component to render a single content card
const ContentCard = ({ content }: { content: Content }) => (
  <Link
    href={`/${content.type === "poetry" ? "poetry" : content.type === "story" ? "stories" : "articles"}/${content.slug}`}
    className="group block hover:no-underline"
  >
    <Card className="group-hover:border-primary transition-colors h-full flex flex-col">
      <CardHeader>
        <span className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{content.type}</span>
        <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">{content.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{content.excerpt}</p>
        <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto pt-2"> {/* Use justify-between and mt-auto pt-2 */}
          <div className="flex items-center gap-2"> {/* Group author and date */}
            <span>By {content.author.name}</span>
            <span>·</span>
            <span>{new Date(content.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-3"> {/* Group likes and comments */}
            <span className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5" />
              {content.likes}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-3.5 h-3.5" />
              {content.comments?.length || 0} {/* Use optional chaining and default to 0 */}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  </Link>
)

// Helper component to render the list of content cards
const ContentGrid = ({ contentList }: { contentList: Content[] }) => {
  if (!contentList || contentList.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No featured content yet.</p>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {contentList.map((content) => (
        <ContentCard key={content.id} content={content} />
      ))}
    </div>
  )
}

export default function FeaturedContent({ recentContent, mostReadContent }: FeaturedContentProps) {
  // Note: Using recentContent for mostReadContent as a placeholder
  const [activeTab, setActiveTab] = useState('recent')

  // TODO: Replace mostReadContent with actual data when available
  const contentToDisplay = activeTab === 'recent' ? recentContent : mostReadContent;

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold">Featured Content</h2>
          {/* View all link removed */}
        </div>

        <Tabs defaultValue="recent" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="mostRead">Most Read</TabsTrigger>
          </TabsList>
          <TabsContent value="recent">
            <ContentGrid contentList={recentContent} />
          </TabsContent>
          <TabsContent value="mostRead">
            {/* Using recentContent as placeholder for mostRead */}
            <ContentGrid contentList={mostReadContent} />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
