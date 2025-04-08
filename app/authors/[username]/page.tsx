import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getUserByUsername, getUserContent } from "@/lib/data"
import AuthorProfile from "@/components/authors/author-profile"
import PublishedWorksList from "@/components/profile/published-works-list"

interface AuthorPageProps {
  params: {
    username: string
  }
}

// Generate metadata for the page
export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const user = await getUserByUsername(params.username)
  
  if (!user) {
    return {
      title: "Author Not Found",
    }
  }
  
  return {
    title: `${user.name} | Author Profile`,
    description: `View ${user.name}'s profile and published works.`,
  }
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const user = await getUserByUsername(params.username)
  
  if (!user) {
    notFound()
  }
  
  // Get user's published content
  const userContent = await getUserContent(user.id)
  
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <AuthorProfile author={user} />
        </div>
        
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-6">Published Works</h2>
          <PublishedWorksList items={userContent} />
        </div>
      </div>
    </div>
  )
}
