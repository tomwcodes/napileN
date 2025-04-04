import type { User } from "@/lib/types"

interface UserProfileProps {
  user: User
}

export default function UserProfile({ user }: UserProfileProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center text-3xl font-serif">
          {user.name.charAt(0)}
        </div>

        <div>
          <h1 className="mb-2">{user.name}</h1>
          <p className="text-muted-foreground">@{user.username}</p>

          {user.bio && <p className="mt-4 max-w-2xl">{user.bio}</p>}
        </div>
      </div>

      <div className="flex gap-6 text-sm">
        <div>
          <span className="font-medium">Joined:</span> {new Date(user.createdAt).toLocaleDateString()}
        </div>

        <div>
          <span className="font-medium">Publications:</span> {user.publicationCount}
        </div>
      </div>
    </div>
  )
}

