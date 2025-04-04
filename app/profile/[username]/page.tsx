import { notFound } from "next/navigation"
import { getUserByUsername, getUserContent } from "@/lib/data"
import ContentList from "@/components/content/content-list"
import UserProfile from "@/components/profile/user-profile"

interface ProfilePageProps {
  params: {
    username: string
  }
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const { username } = params
  const user = getUserByUsername(username)

  if (!user) {
    notFound()
  }

  const userContent = getUserContent(user.id)

  return (
    <div className="space-y-8">
      <UserProfile user={user} />

      <div className="border-t border-border pt-8">
        <h2 className="mb-6">Published Works</h2>

        {userContent.length > 0 ? (
          <ContentList items={userContent} type="all" />
        ) : (
          <p className="text-muted-foreground">No published works yet.</p>
        )}
      </div>
    </div>
  )
}

