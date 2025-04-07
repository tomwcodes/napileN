'use client'

import { useState, useEffect } from 'react' // Import useEffect
import Link from 'next/link'
import { Heart, MessageCircle } from 'lucide-react' // Import icons
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Content } from '@/lib/types'

interface FeaturedContentProps {
  recentContent: Content[]
  mostPopularContent: Content[] // Renamed from mostReadContent
}

// Helper component to render a single content card
const ContentCard = ({ content }: { content: Content }) => {
  const [formattedDate, setFormattedDate] = useState<string | null>(null)

  useEffect(() => {
    // Format date client-side after hydration
    setFormattedDate(new Date(content.createdAt).toLocaleDateString())
  }, [content.createdAt]) // Re-run if createdAt changes (though unlikely for props)

  return (
    <Link
      href={`/${content.type === "poetry" ? "poetry" : content.type === "fiction" ? "fiction" : "articles"}/${content.slug}`} // Changed "story" to "fiction" and "stories" to "fiction"
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
            {/* Date removed */}
          </div>
          <div className="flex items-center gap-3"> {/* Group likes and comments */}
            <span className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5" />
              {content.likes}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-3.5 h-3.5" />
              {content.commentCount ?? 0}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  </Link>
  )
}

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

export default function FeaturedContent({ recentContent, mostPopularContent }: FeaturedContentProps) { // Destructure mostPopularContent
  const [activeTab, setActiveTab] = useState('recent') // Changed default state

  // Determine which content list to display based on the active tab
  const contentToDisplay = activeTab === 'recent' ? recentContent : mostPopularContent; // Updated condition

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold">Featured Content</h2>
          {/* View all link removed */}
        </div>

        <Tabs defaultValue="recent" value={activeTab} onValueChange={setActiveTab} className="w-full"> {/* Changed defaultValue */}
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="recent">Recent</TabsTrigger> {/* Changed value and text */}
            <TabsTrigger value="mostPopular">Most Popular</TabsTrigger>
          </TabsList>
          <TabsContent value="recent"> {/* Changed value */}
            <ContentGrid contentList={recentContent} />
          </TabsContent>
          <TabsContent value="mostPopular">
            {/* Now using the actual most popular content */}
            <ContentGrid contentList={mostPopularContent} />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
