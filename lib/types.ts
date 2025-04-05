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
  type: "poetry" | "story" | "article"
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
