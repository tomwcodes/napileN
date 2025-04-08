"use client"

import { useState, useEffect } from "react"
import { User } from "@/lib/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface AuthorProfileProps {
  author: User
}

export default function AuthorProfile({ author }: AuthorProfileProps) {
  // Format the joined date
  const joinedDate = author.createdAt ? new Date(author.createdAt).toLocaleDateString() : "N/A"

  return (
    <div className="space-y-6">
      <div className="flex flex-row gap-6 items-center">
        <div className="w-24 h-24 bg-muted rounded-full overflow-hidden">
          <Avatar className="h-full w-full">
            <AvatarImage src="/placeholder-user.jpg" alt={author.name} />
            <AvatarFallback className="text-3xl font-serif">
              {author.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        <div>
          <h1 className="mb-1">{author.name}</h1>
          <p className="text-sm text-muted-foreground">@{author.username}</p>
          <div className="text-sm text-muted-foreground mt-1">
            Joined: {joinedDate}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            Publications: {author.publicationCount}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <Link href={`/authors`} passHref>
          <Button variant="outline" className="text-sm">
            Back to Authors
          </Button>
        </Link>
      </div>
    </div>
  )
}
