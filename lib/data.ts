import type { User, Content, Comment } from "./types"

// Mock users data
const users: User[] = [
  {
    id: "1",
    name: "Emily Dickinson",
    username: "emily",
    email: "emily@example.com",
    bio: "Poet and recluse from Amherst, Massachusetts. Known for her unconventional use of form and syntax.",
    createdAt: "2023-01-15T12:00:00Z",
    publicationCount: 5,
  },
  {
    id: "2",
    name: "Edgar Allan Poe",
    username: "edgar",
    email: "edgar@example.com",
    bio: "American writer, poet, editor, and literary critic. Best known for poetry and short stories, particularly his tales of mystery and the macabre.",
    createdAt: "2023-02-10T12:00:00Z",
    publicationCount: 3,
  },
  {
    id: "3",
    name: "Sylvia Plath",
    username: "sylvia",
    email: "sylvia@example.com",
    bio: "American poet, novelist, and short-story writer. Known for her confessional poetry and her novel The Bell Jar.",
    createdAt: "2023-03-05T12:00:00Z",
    publicationCount: 4,
  },
]

// Mock content data
const content: Content[] = [
  {
    id: "1",
    title: "Hope is the thing with feathers",
    slug: "hope-is-the-thing-with-feathers",
    body: "Hope is the thing with feathers\nThat perches in the soul,\nAnd sings the tune without the words,\nAnd never stops at all,\n\nAnd sweetest in the gale is heard;\nAnd sore must be the storm\nThat could abash the little bird\nThat kept so many warm.\n\nI've heard it in the chillest land,\nAnd on the strangest sea;\nYet, never, in extremity,\nIt asked a crumb of me.",
    excerpt:
      "Hope is the thing with feathers that perches in the soul, and sings the tune without the words, and never stops at all...",
    type: "poetry",
    author: {
      id: "1",
      name: "Emily Dickinson",
      username: "emily",
    },
    createdAt: "2023-06-15T14:30:00Z",
    likes: 42,
    featured: true,
    comments: [
      {
        id: "1",
        contentId: "1",
        author: {
          id: "2",
          name: "Edgar Allan Poe",
          username: "edgar",
        },
        body: "A beautiful expression of hope's resilience. The bird metaphor is particularly effective.",
        createdAt: "2023-06-16T10:15:00Z",
      },
      {
        id: "2",
        contentId: "1",
        author: {
          id: "3",
          name: "Sylvia Plath",
          username: "sylvia",
        },
        body: "I've always admired how Dickinson can express such profound emotions with such simple, yet precise language.",
        createdAt: "2023-06-17T09:45:00Z",
      },
    ],
  },
  {
    id: "2",
    title: "The Raven",
    slug: "the-raven",
    body: 'Once upon a midnight dreary, while I pondered, weak and weary,\nOver many a quaint and curious volume of forgotten lore—\nWhile I nodded, nearly napping, suddenly there came a tapping,\nAs of someone gently rapping, rapping at my chamber door.\n"\'Tis some visitor," I muttered, "tapping at my chamber door—\nOnly this and nothing more."',
    excerpt:
      "Once upon a midnight dreary, while I pondered, weak and weary, over many a quaint and curious volume of forgotten lore...",
    type: "poetry",
    author: {
      id: "2",
      name: "Edgar Allan Poe",
      username: "edgar",
    },
    createdAt: "2023-07-10T16:45:00Z",
    likes: 38,
    featured: true,
    comments: [
      {
        id: "3",
        contentId: "2",
        author: {
          id: "1",
          name: "Emily Dickinson",
          username: "emily",
        },
        body: "The rhythm and repetition create such a haunting atmosphere. Masterful work, Edgar.",
        createdAt: "2023-07-11T11:30:00Z",
      },
    ],
  },
  {
    id: "3",
    title: "Lady Lazarus",
    slug: "lady-lazarus",
    body: "I have done it again.\nOne year in every ten\nI manage it—\n\nA sort of walking miracle, my skin\nBright as a Nazi lampshade,\nMy right foot\n\nA paperweight,\nMy face a featureless, fine\nJew linen.",
    excerpt:
      "I have done it again. One year in every ten I manage it—A sort of walking miracle, my skin bright as a Nazi lampshade...",
    type: "poetry",
    author: {
      id: "3",
      name: "Sylvia Plath",
      username: "sylvia",
    },
    createdAt: "2023-08-05T13:20:00Z",
    likes: 29,
    featured: false,
    comments: [],
  },
  {
    id: "4",
    title: "The Tell-Tale Heart",
    slug: "the-tell-tale-heart",
    body: "TRUE!—nervous—very, very dreadfully nervous I had been and am; but why will you say that I am mad? The disease had sharpened my senses—not destroyed—not dulled them. Above all was the sense of hearing acute. I heard all things in the heaven and in the earth. I heard many things in hell. How, then, am I mad? Hearken! and observe how healthily—how calmly I can tell you the whole story.",
    excerpt:
      "TRUE!—nervous—very, very dreadfully nervous I had been and am; but why will you say that I am mad? The disease had sharpened my senses...",
    type: "story",
    author: {
      id: "2",
      name: "Edgar Allan Poe",
      username: "edgar",
    },
    createdAt: "2023-09-12T10:15:00Z",
    likes: 45,
    featured: true,
    comments: [
      {
        id: "4",
        contentId: "4",
        author: {
          id: "3",
          name: "Sylvia Plath",
          username: "sylvia",
        },
        body: "The unreliable narrator at its finest. The growing tension is palpable.",
        createdAt: "2023-09-13T14:25:00Z",
      },
    ],
  },
  {
    id: "5",
    title: "The Bell Jar: My Writing Process",
    slug: "bell-jar-writing-process",
    body: "When I began writing The Bell Jar, I wanted to explore the intersection of personal identity and societal expectations. The process was both therapeutic and challenging, as I drew from my own experiences while creating a narrative that would resonate with readers facing similar struggles.\n\nThe character of Esther Greenwood emerged as a vehicle for examining depression, ambition, and the limitations placed on women in the 1950s. While fiction, many elements of the story reflect the real pressures I encountered as a young woman pursuing a writing career in a male-dominated literary landscape.",
    excerpt:
      "When I began writing The Bell Jar, I wanted to explore the intersection of personal identity and societal expectations...",
    type: "blog",
    author: {
      id: "3",
      name: "Sylvia Plath",
      username: "sylvia",
    },
    createdAt: "2023-10-20T09:30:00Z",
    likes: 37,
    featured: false,
    comments: [
      {
        id: "5",
        contentId: "5",
        author: {
          id: "1",
          name: "Emily Dickinson",
          username: "emily",
        },
        body: "Thank you for sharing your process. It's fascinating to see how personal experience transforms into art that speaks to so many.",
        createdAt: "2023-10-21T16:40:00Z",
      },
    ],
  },
  {
    id: "6",
    title: "The Art of Seclusion",
    slug: "art-of-seclusion",
    body: "Many have wondered about my choice to rarely leave my home in later years. I've found that seclusion isn't about hiding from the world, but rather about creating a space where one can hear one's own thoughts clearly.\n\nIn the quiet of my room, with only the sounds of nature filtering through my window, I've discovered universes within myself that might have remained hidden had I been constantly engaged with society's demands and distractions.\n\nPoetry requires a certain stillness, a capacity to observe both the external world and the internal landscape with equal attention. My seclusion has been the garden in which my poems have grown.",
    excerpt:
      "Many have wondered about my choice to rarely leave my home in later years. I've found that seclusion isn't about hiding from the world...",
    type: "blog",
    author: {
      id: "1",
      name: "Emily Dickinson",
      username: "emily",
    },
    createdAt: "2023-11-05T11:20:00Z",
    likes: 31,
    featured: false,
    comments: [],
  },
]

// Helper functions to simulate database queries

export function getPoems(): Content[] {
  return content.filter((item) => item.type === "poetry")
}

export function getStories(): Content[] {
  return content.filter((item) => item.type === "story")
}

export function getBlogs(): Content[] {
  return content.filter((item) => item.type === "blog")
}

export function getFeaturedContent(): Content[] {
  return content
    .filter((item) => item.featured)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function getLatestContent(limit = 10): Content[] {
  return [...content].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, limit)
}

export function getEditorsPicks(limit = 5): Content[] {
  // In a real app, this would filter by an "editorsPick" field
  // For now, we'll just return the most liked content
  return [...content].sort((a, b) => b.likes - a.likes).slice(0, limit)
}

export function getUserByUsername(username: string): User | null {
  return users.find((user) => user.username === username) || null
}

export function getUserByEmail(email: string): User | null {
  return users.find((user) => user.email === email) || null
}

export function getUserContent(userId: string): Content[] {
  return content.filter((item) => item.author.id === userId)
}

export function getContentBySlug(type: string, slug: string): Content | null {
  return (
    content.find(
      (item) =>
        ((type === "poetry" && item.type === "poetry") ||
          (type === "stories" && item.type === "story") ||
          (type === "blog" && item.type === "blog")) &&
        item.slug === slug,
    ) || null
  )
}

export function getCommentsByContentId(contentId: string): Comment[] {
  const item = content.find((item) => item.id === contentId)
  return item ? item.comments : []
}

export function getRelatedContent(contentId: string, type: string, limit = 3): Content[] {
  // In a real app, this would use more sophisticated logic
  // For now, we'll just return other content of the same type
  return content
    .filter(
      (item) =>
        item.id !== contentId &&
        ((type === "poetry" && item.type === "poetry") ||
          (type === "stories" && item.type === "story") ||
          (type === "blog" && item.type === "blog")),
    )
    .slice(0, limit)
}

