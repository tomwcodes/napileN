import type { User, Content, Comment, SavedContent } from "./types";
import { databases, DATABASES_ID, CONTENT_COLLECTION_ID, USER_PROFILES_COLLECTION_ID, SAVED_CONTENT_COLLECTION_ID, USER_BLOG_COLLECTION_ID } from "./appwrite";

// Define the Comments collection ID
export const COMMENTS_COLLECTION_ID = "67f123d0002c7cc677f8"; // Correct collection ID
import { Query, ID } from "appwrite";

// Helper function to convert Appwrite document to Content type
const mapDocumentToContent = (doc: any): Content => {
  return {
    id: doc.$id,
    title: doc.title,
    slug: doc.$id, // Using document ID as slug for now
    body: doc.body,
    excerpt: doc.body.substring(0, 150) + "...", // Generate excerpt from body
    type: doc.type,
    author: {
      id: doc.userId,
      name: doc.username, // Use authorName if available, otherwise use username
      username: doc.username, // Using username field from schema
    },
    createdAt: doc.PublishedAt || doc.$createdAt,
    likes: doc.likes || 0, // Use likes from document or default to 0
    likedBy: doc.likedBy || [], // Use likedBy from document or default to empty array
    featured: false, // Default value, could be updated later
    comments: [], // Default empty array, could be fetched separately
    commentCount: doc.commentCount || 0, // Use commentCount from document or default to 0
  };
};

// Helper function to convert Appwrite document to User type
const mapDocumentToUser = (doc: any): User => {
  return {
    id: doc.userId,
    name: doc.displayName || doc.username, // Use displayName, fallback to username
    username: doc.username,
    email: "", // Email not stored in user profiles collection
    bio: doc.bio || "", // Use bio if available
    createdAt: doc.$createdAt,
    publicationCount: 0, // Could be calculated separately
  };
};

// Get all poetry content
export async function getPoems(): Promise<Content[]> {
  try {
    const response = await databases.listDocuments(
      DATABASES_ID,
      CONTENT_COLLECTION_ID,
      [Query.equal("type", "poetry")]
    );
    
    return response.documents.map(mapDocumentToContent);
  } catch (error) {
    console.error("Error fetching poems:", error);
    return [];
  }
}

// Get all fiction content
export async function getFiction(): Promise<Content[]> {
  try {
    const response = await databases.listDocuments(
      DATABASES_ID,
      CONTENT_COLLECTION_ID,
      [Query.equal("type", "fiction")] // Update type query
    );
    
    return response.documents.map(mapDocumentToContent);
  } catch (error) {
    console.error("Error fetching fiction:", error); // Update error message
    return [];
  }
}

// Get all article content
export async function getArticles(): Promise<Content[]> {
  try {
    const response = await databases.listDocuments(
      DATABASES_ID,
      CONTENT_COLLECTION_ID,
      [Query.equal("type", "article")]
    );
    
    return response.documents.map(mapDocumentToContent);
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}

// Get featured content (currently not implemented in Appwrite)
export async function getFeaturedContent(): Promise<Content[]> {
  try {
    // For now, just return the latest content
    const response = await databases.listDocuments(
      DATABASES_ID,
      CONTENT_COLLECTION_ID,
      [Query.orderDesc("$createdAt"), Query.limit(5)]
    );
    
    return response.documents.map(mapDocumentToContent);
  } catch (error) {
    console.error("Error fetching featured content:", error);
    return [];
  }
}

// Get most popular content (sorted by likes)
export async function getMostPopularContent(limit = 10): Promise<Content[]> {
  try {
    const response = await databases.listDocuments(
      DATABASES_ID,
      CONTENT_COLLECTION_ID,
      [Query.orderDesc("likes"), Query.limit(limit)] // Sort by likes descending
    );

    return response.documents.map(mapDocumentToContent);
  } catch (error) {
    console.error("Error fetching most popular content:", error);
    return [];
  }
}

// Get latest content
export async function getLatestContent(limit = 10): Promise<Content[]> {
  try {
    const response = await databases.listDocuments(
      DATABASES_ID,
      CONTENT_COLLECTION_ID,
      [Query.orderDesc("$createdAt"), Query.limit(limit)]
    );
    
    return response.documents.map(mapDocumentToContent);
  } catch (error) {
    console.error("Error fetching latest content:", error);
    return [];
  }
}

// Get editor's picks (currently not implemented in Appwrite)
export async function getEditorsPicks(limit = 5): Promise<Content[]> {
  try {
    // For now, just return the latest content
    const response = await databases.listDocuments(
      DATABASES_ID,
      CONTENT_COLLECTION_ID,
      [Query.orderDesc("$createdAt"), Query.limit(limit)]
    );
    
    return response.documents.map(mapDocumentToContent);
  } catch (error) {
    console.error("Error fetching editor's picks:", error);
    return [];
  }
}

// Get user by username
export async function getUserByUsername(username: string): Promise<User | null> {
  try {
    const response = await databases.listDocuments(
      DATABASES_ID,
      USER_PROFILES_COLLECTION_ID,
      [Query.equal("username", username)]
    );
    
    if (response.documents.length === 0) {
      return null;
    }
    
    return mapDocumentToUser(response.documents[0]);
  } catch (error) {
    console.error("Error fetching user by username:", error);
    return null;
  }
}

// Get user by email (not implemented in Appwrite)
export async function getUserByEmail(email: string): Promise<User | null> {
  // Email is not stored in user profiles collection
  // This would require a different approach, possibly using Appwrite account service
  return null;
}

// Get all users
export async function getAllUsers(
  page: number = 1, 
  limit: number = 10, 
  sortBy: 'alphabetical' | 'popular' = 'alphabetical',
  searchQuery?: string
): Promise<{ users: User[], total: number }> {
  try {
    const queries = [];
    
    // Add search query if provided
    if (searchQuery && searchQuery.trim() !== '') {
      queries.push(Query.search('username', searchQuery));
    }
    
    // Add sorting
    if (sortBy === 'alphabetical') {
      queries.push(Query.orderAsc('username'));
    } else if (sortBy === 'popular') {
      queries.push(Query.orderDesc('publicationCount'));
    }
    
    // Add pagination
    queries.push(Query.limit(limit));
    queries.push(Query.offset((page - 1) * limit));
    
    const response = await databases.listDocuments(
      DATABASES_ID,
      USER_PROFILES_COLLECTION_ID,
      queries
    );
    
    return {
      users: response.documents.map(mapDocumentToUser),
      total: response.total
    };
  } catch (error) {
    console.error("Error fetching all users:", error);
    return { users: [], total: 0 };
  }
}

// Get content by user ID
export async function getUserContent(userId: string): Promise<Content[]> {
  try {
    const response = await databases.listDocuments(
      DATABASES_ID,
      CONTENT_COLLECTION_ID,
      [Query.equal("userId", userId)]
    );
    
    return response.documents.map(mapDocumentToContent);
  } catch (error) {
    console.error("Error fetching user content:", error);
    return [];
  }
}

// Get content by slug (using document ID as slug)
export async function getContentBySlug(type: string, slug: string): Promise<Content | null> {
  try {
    // Since we're using document ID as slug, we can directly fetch the document
    const document = await databases.getDocument(
      DATABASES_ID,
      CONTENT_COLLECTION_ID,
      slug
    );
    
    // Check if the document type matches the requested type
    const docType = document.type;
    // Convert plural URL types ("fiction", "articles") to singular DB types ("fiction", "article")
    let requestedType = type;
    if (type === "fiction") { // Changed "stories" to "fiction"
      requestedType = "fiction"; // Changed "story" to "fiction"
    } else if (type === "articles") {
      requestedType = "article";
    }

    if (docType !== requestedType) {
      return null;
    }
    
    return mapDocumentToContent(document);
  } catch (error) {
    console.error("Error fetching content by slug:", error);
    return null;
  }
}

// Helper function to convert Appwrite document to Comment type
const mapDocumentToComment = (doc: any): Comment => {
  return {
    id: doc.$id,
    contentId: doc.contentId,
    author: {
      id: doc.userId,
      name: doc.username || "Anonymous",
      username: doc.username || "anonymous",
    },
    body: doc.commentBody,
    createdAt: doc.createdAt || doc.$createdAt,
  };
};

// Get comments by content ID
export async function getCommentsByContentId(contentId: string): Promise<Comment[]> {
  try {
    const response = await databases.listDocuments(
      DATABASES_ID,
      COMMENTS_COLLECTION_ID,
      [
        Query.equal("contentId", contentId),
        Query.orderDesc("createdAt") // Show newest comments first
      ]
    );
    
    return response.documents.map(mapDocumentToComment);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
}

// Create a new comment
export async function createComment(
  contentId: string,
  userId: string,
  username: string,
  commentBody: string
): Promise<Comment | null> {
  try {
    // Create the comment document in Appwrite
    const now = new Date().toISOString();
    const response = await databases.createDocument(
      DATABASES_ID,
      COMMENTS_COLLECTION_ID,
      ID.unique(),
      {
        contentId,
        userId,
        username,
        commentBody,
        createdAt: now
      }
    );
    
    // Update the comment count in the content document
    await updateCommentCount(contentId);
    
    return mapDocumentToComment(response);
  } catch (error) {
    console.error("Error creating comment:", error);
    return null;
  }
}

// Update the comment count for a content item
async function updateCommentCount(contentId: string): Promise<void> {
  try {
    // Get the current content document
    const contentDoc = await databases.getDocument(
      DATABASES_ID,
      CONTENT_COLLECTION_ID,
      contentId
    );
    
    // Count the comments for this content
    const commentsResponse = await databases.listDocuments(
      DATABASES_ID,
      COMMENTS_COLLECTION_ID,
      [Query.equal("contentId", contentId)]
    );
    
    const commentCount = commentsResponse.total;
    
    // Update the content document with the new comment count
    await databases.updateDocument(
      DATABASES_ID,
      CONTENT_COLLECTION_ID,
      contentId,
      {
        commentCount: commentCount
      }
    );
  } catch (error) {
    console.error("Error updating comment count:", error);
  }
}

// Get related content
export async function getRelatedContent(contentId: string, type: string, limit = 3): Promise<Content[]> {
  try {
    // Convert type parameter to match database values
    const dbType = type === "fiction" ? "fiction" : type; // Changed "stories" to "fiction" and "story" to "fiction"
    
    // Get content of the same type, excluding the current content
    const response = await databases.listDocuments(
      DATABASES_ID,
      CONTENT_COLLECTION_ID,
      [
        Query.equal("type", dbType),
        Query.notEqual("$id", contentId),
        Query.limit(limit)
      ]
    );
    
    return response.documents.map(mapDocumentToContent);
  } catch (error) {
    console.error("Error fetching related content:", error);
    return [];
  }
}

// Create new content
export async function createContent(
  title: string,
  body: string,
  type: string,
  userId: string,
  username: string,
  authorUsername: string
): Promise<Content | null> {
  try {
    // Convert type parameter if needed
    const dbType = type === "fiction" ? "fiction" : type; // Changed "stories" to "fiction" and "story" to "fiction"
    
    // Create the document in Appwrite
    const response = await databases.createDocument(
      DATABASES_ID,
      CONTENT_COLLECTION_ID,
      ID.unique(),
      {
        title,
        body,
        type: dbType,
        userId: userId,
        username: authorUsername,
        PublishedAt: new Date().toISOString(),
        likes: 0,
        likedBy: []
      }
    );
    
    return mapDocumentToContent(response);
  } catch (error) {
    console.error("Error creating content:", error);
    return null;
  }
}

// Like content
export async function likeContent(contentId: string, userId: string): Promise<boolean> {
  try {
    // First, get the current document
    const document = await databases.getDocument(
      DATABASES_ID,
      CONTENT_COLLECTION_ID,
      contentId
    );
    
    // Get current likes and likedBy array
    const currentLikes = document.likes || 0;
    const likedBy = document.likedBy || [];
    
    // Check if user already liked this content
    if (likedBy.includes(userId)) {
      return false; // User already liked this content
    }
    
    // Add user to likedBy array and increment likes
    likedBy.push(userId);
    
    // Update the document
    await databases.updateDocument(
      DATABASES_ID,
      CONTENT_COLLECTION_ID,
      contentId,
      {
        likes: currentLikes + 1,
        likedBy: likedBy
      }
    );
    
    return true;
  } catch (error) {
    console.error("Error liking content:", error);
    return false;
  }
}

// Unlike content
export async function unlikeContent(contentId: string, userId: string): Promise<boolean> {
  try {
    // First, get the current document
    const document = await databases.getDocument(
      DATABASES_ID,
      CONTENT_COLLECTION_ID,
      contentId
    );
    
    // Get current likes and likedBy array
    const currentLikes = document.likes || 0;
    const likedBy = document.likedBy || [];
    
    // Check if user has liked this content
    if (!likedBy.includes(userId)) {
      return false; // User hasn't liked this content
    }
    
    // Remove user from likedBy array and decrement likes
    const updatedLikedBy = likedBy.filter((id: string) => id !== userId);
    
    // Update the document
    await databases.updateDocument(
      DATABASES_ID,
      CONTENT_COLLECTION_ID,
      contentId,
      {
        likes: Math.max(0, currentLikes - 1), // Ensure likes doesn't go below 0
        likedBy: updatedLikedBy
      }
    );
    
    return true;
  } catch (error) {
    console.error("Error unliking content:", error);
    return false;
  }
}

// Helper function to convert Appwrite document to SavedContent type
const mapDocumentToSavedContent = (doc: any): SavedContent => {
  return {
    id: doc.$id,
    userId: doc.userId,
    contentId: doc.contentId,
    savedAt: doc.savedAt || doc.$createdAt,
  };
};

// Check if content is saved by user
export async function isContentSaved(contentId: string, userId: string): Promise<boolean> {
  try {
    const response = await databases.listDocuments(
      DATABASES_ID,
      SAVED_CONTENT_COLLECTION_ID,
      [
        Query.equal("contentId", contentId),
        Query.equal("userId", userId)
      ]
    );
    
    return response.total > 0;
  } catch (error) {
    console.error("Error checking if content is saved:", error);
    return false;
  }
}

// Save content
export async function saveContent(contentId: string, userId: string): Promise<boolean> {
  try {
    // Check if already saved
    const isSaved = await isContentSaved(contentId, userId);
    if (isSaved) {
      return false; // Already saved
    }
    
    // Save the content
    const now = new Date().toISOString();
    await databases.createDocument(
      DATABASES_ID,
      SAVED_CONTENT_COLLECTION_ID,
      ID.unique(),
      {
        userId,
        contentId,
        savedAt: now
      }
    );
    
    return true;
  } catch (error) {
    console.error("Error saving content:", error);
    return false;
  }
}

// Unsave content
export async function unsaveContent(contentId: string, userId: string): Promise<boolean> {
  try {
    // Find the saved content document
    const response = await databases.listDocuments(
      DATABASES_ID,
      SAVED_CONTENT_COLLECTION_ID,
      [
        Query.equal("contentId", contentId),
        Query.equal("userId", userId)
      ]
    );
    
    if (response.total === 0) {
      return false; // Not saved
    }
    
    // Delete the saved content document
    const savedContentId = response.documents[0].$id;
    await databases.deleteDocument(
      DATABASES_ID,
      SAVED_CONTENT_COLLECTION_ID,
      savedContentId
    );
    
    return true;
  } catch (error) {
    console.error("Error unsaving content:", error);
    return false;
  }
}

// Toggle save status
export async function toggleSaveContent(contentId: string, userId: string): Promise<boolean> {
  try {
    const isSaved = await isContentSaved(contentId, userId);
    
    if (isSaved) {
      return await unsaveContent(contentId, userId);
    } else {
      return await saveContent(contentId, userId);
    }
  } catch (error) {
    console.error("Error toggling save status:", error);
    return false;
  }
}

// Get saved content for a user
export async function getSavedContent(userId: string): Promise<Content[]> {
  try {
    // Get saved content documents
    const savedResponse = await databases.listDocuments(
      DATABASES_ID,
      SAVED_CONTENT_COLLECTION_ID,
      [
        Query.equal("userId", userId),
        Query.orderDesc("savedAt")
      ]
    );
    
    if (savedResponse.total === 0) {
      return [];
    }
    
    // Get content IDs
    const contentIds = savedResponse.documents.map(doc => doc.contentId);
    
    // Get content documents
    const contentPromises = contentIds.map(id => 
      databases.getDocument(DATABASES_ID, CONTENT_COLLECTION_ID, id)
    );
    
    const contentDocs = await Promise.all(contentPromises);
    
    return contentDocs.map(mapDocumentToContent);
  } catch (error) {
    console.error("Error fetching saved content:", error);
    return [];
  }
}

// Helper function to convert Appwrite blog document to Content type
const mapBlogDocumentToContent = (doc: any): Content => {
  return {
    id: doc.$id,
    title: doc.title,
    slug: doc.$id, // Using document ID as slug for now
    body: doc.body,
    excerpt: doc.body.substring(0, 150) + "...", // Generate excerpt from body
    type: "blog",
    author: {
      id: doc.userId,
      name: doc.username, // Use username as name
      username: doc.username,
    },
    createdAt: doc.createdAt || doc.$createdAt,
    likes: 0, // Blogs don't have likes for now
    likedBy: [], // Blogs don't have likes for now
    featured: false, // Default value
    comments: [], // Default empty array
    commentCount: 0, // Blogs don't have comments for now
    visibility: doc.visibility || "public", // Default to public if not specified
  };
};

// Create a new blog post
export async function createBlogPost(
  title: string,
  body: string,
  userId: string,
  username: string,
  visibility: "public" | "private" = "public"
): Promise<Content | null> {
  try {
    // Create the blog document in Appwrite
    const now = new Date().toISOString();
    const response = await databases.createDocument(
      DATABASES_ID,
      USER_BLOG_COLLECTION_ID,
      ID.unique(),
      {
        title,
        body,
        userId,
        username,
        createdAt: now,
        visibility
      }
    );
    
    return mapBlogDocumentToContent(response);
  } catch (error) {
    console.error("Error creating blog post:", error);
    return null;
  }
}

// Get blog posts for a user
export async function getUserBlogPosts(
  userId: string, 
  isOwner: boolean = false
): Promise<Content[]> {
  try {
    // If viewing own profile, get all blog posts (public and private)
    // If viewing someone else's profile, get only public blog posts
    const queries = [
      Query.equal("userId", userId),
      Query.orderDesc("createdAt")
    ];
    
    if (!isOwner) {
      queries.push(Query.equal("visibility", "public"));
    }
    
    const response = await databases.listDocuments(
      DATABASES_ID,
      USER_BLOG_COLLECTION_ID,
      queries
    );
    
    return response.documents.map(mapBlogDocumentToContent);
  } catch (error) {
    console.error("Error fetching user blog posts:", error);
    return [];
  }
}
