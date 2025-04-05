import type { User, Content, Comment } from "./types";
import { databases, DATABASES_ID, CONTENT_COLLECTION_ID, USER_PROFILES_COLLECTION_ID } from "./appwrite";

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
    name: doc.username, // Using username as name for now
    username: doc.username,
    email: "", // Email not stored in user profiles collection
    bio: "", // Bio not stored in user profiles collection
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

// Get all story content
export async function getStories(): Promise<Content[]> {
  try {
    const response = await databases.listDocuments(
      DATABASES_ID,
      CONTENT_COLLECTION_ID,
      [Query.equal("type", "story")]
    );
    
    return response.documents.map(mapDocumentToContent);
  } catch (error) {
    console.error("Error fetching stories:", error);
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
    // Convert plural URL types ("stories", "articles") to singular DB types ("story", "article")
    let requestedType = type;
    if (type === "stories") {
      requestedType = "story";
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
    const dbType = type === "stories" ? "story" : type;
    
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
    const dbType = type === "stories" ? "story" : type;
    
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
