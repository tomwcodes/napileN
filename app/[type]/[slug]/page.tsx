import { notFound } from "next/navigation"
import { getContentBySlug } from "@/lib/data"
import ContentDetail from "@/components/content/content-detail"
import CommentSection from "@/components/content/comment-section"
import RelatedContent from "@/components/content/related-content"

interface ContentPageProps {
  params: {
    type: string
    slug: string
  }
}

export default function ContentPage({ params }: ContentPageProps) {
  const { type, slug } = params

  // Validate content type
  if (!["poetry", "stories", "blog"].includes(type)) {
    notFound()
  }

  const content = getContentBySlug(type, slug)

  if (!content) {
    notFound()
  }

  return (
    <div className="max-w-2xl mx-auto space-y-12">
      <ContentDetail content={content} />

      <CommentSection contentId={content.id} />

      <div className="border-t border-border pt-8">
        <RelatedContent contentId={content.id} type={type} />
      </div>
    </div>
  )
}

