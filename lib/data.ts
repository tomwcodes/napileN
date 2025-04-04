import type { User, Content, Comment } from "./types";
import { databases, DATABASES_ID, CONTENT_COLLECTION_ID, USER_PROFILES_COLLECTION_ID } from "./appwrite";
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
      id: doc.authorId,
      name: doc.authorName,
      username: doc.authorId, // Using authorId as username for now
    },
    createdAt: doc.PublishedAt || doc.$createdAt,
    likes: 0, // Default value, could be updated later
    featured: false, // Default value, could be updated later
    comments: [], // Default empty array, could be fetched separately
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

// Get all blog content
export async function getBlogs(): Promise<Content[]> {
  try {
    const response = await databases.listDocuments(
      DATABASES_ID,
      CONTENT_COLLECTION_ID,
      [Query.equal("type", "blog")]
    );
    
    console.log("Raw Appwrite response for getBlogs:", JSON.stringify(response, null, 2)); // Added for debugging
    
    const mappedBlogs = response.documents.map(mapDocumentToContent);
    console.log("Mapped blogs:", JSON.stringify(mappedBlogs, null, 2)); // Added for debugging
    
    return mappedBlogs;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    console.error("Error details:", JSON.stringify(error, null, 2)); // Added for debugging
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
      [Query.equal("authorId", userId)]
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
    const requestedType = type === "stories" ? "story" : type;
    
    if (docType !== requestedType) {
      return null;
    }
    
    return mapDocumentToContent(document);
  } catch (error) {
    console.error("Error fetching content by slug:", error);
    return null;
  }
}

// Get comments by content ID (not implemented in Appwrite yet)
export async function getCommentsByContentId(contentId: string): Promise<Comment[]> {
  // Comments are not stored in a separate collection yet
  return [];
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
  authorId: string,
  authorName: string
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
        authorId,
        authorName,
        PublishedAt: new Date().toISOString()
      }
    );
    
    return mapDocumentToContent(response);
  } catch (error) {
    console.error("Error creating content:", error);
    return null;
  }
}
