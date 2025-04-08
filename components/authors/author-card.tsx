"use client"

import Link from "next/link"
import { User } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface AuthorCardProps {
  author: User
}

export default function AuthorCard({ author }: AuthorCardProps) {
  return (
    <Link href={`/profile/${author.username}`} className="block hover:no-underline">
      <Card className="h-full transition-all hover:shadow-md">
        <CardContent className="p-4 flex flex-col items-center text-center">
          <div className="mb-4 mt-2">
            <Avatar className="h-24 w-24">
              {/* If we had avatar URLs, we would use them here */}
              <AvatarImage src="/placeholder-user.jpg" alt={author.name} />
              <AvatarFallback className="text-2xl">
                {author.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-1">{author.name}</h3>
            <p className="text-sm text-muted-foreground mb-2">@{author.username}</p>
            
            <div className="text-sm text-muted-foreground">
              <p>Publications: {author.publicationCount}</p>
              <p className="mt-1">Joined: {new Date(author.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
