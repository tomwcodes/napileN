export interface User {
  id: string
  name: string
  username: string
  email: string
  bio: string
  createdAt: string
  publicationCount: number
}

export interface Content {
  id: string
  title: string
  slug: string
  body: string
  excerpt: string
  type: "poetry" | "fiction" | "article" | "blog" // Added "blog" type
  author: {
    id: string
    name: string
    username: string
  }
  createdAt: string
  likes: number
  likedBy: string[]
  featured: boolean
  comments: Comment[]
  commentCount?: number
  visibility?: "public" | "private" // Added visibility field for blog posts
}

export interface Comment {
  id: string
  contentId: string
  author: {
    id: string
    name: string
    username: string
  }
  body: string
  createdAt: string
}

export interface SavedContent {
  id: string
  userId: string
  contentId: string
  savedAt: string
  content?: Content // Optional reference to the full content object
}
