import { useState, useEffect } from "react";
import { Models, Query } from "appwrite"; // Import Appwrite Models
import { databases, DATABASES_ID, USER_PROFILES_COLLECTION_ID } from "@/lib/appwrite";

interface UserProfileProps {
  user: Models.User<Models.Preferences> | null; // Allow null user
}

export default function UserProfile({ user }: UserProfileProps) {
  // Handle null user case
  if (!user) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center text-3xl font-serif">
            ?
          </div>
          <div>
            <h1 className="mb-2">User Not Found</h1>
          </div>
        </div>
      </div>
    );
  }

  // Appwrite SDK typically returns ISO string for $createdAt
  const joinedDate = user.$createdAt ? new Date(user.$createdAt).toLocaleDateString() : "N/A";

  // Get username from user profile
  const [username, setUsername] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchUsername() {
      if (!user) return;
      
      try {
        const response = await databases.listDocuments(
          DATABASES_ID,
          USER_PROFILES_COLLECTION_ID,
          [Query.equal("userId", user.$id)]
        );
        
        if (response.documents.length > 0) {
          setUsername(response.documents[0].username);
        }
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    }
    
    fetchUsername();
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center text-3xl font-serif">
          {/* Use first letter of username for avatar, fallback if loading/null */}
          {username ? username.charAt(0).toUpperCase() : "?"}
        </div>

        <div>
          {/* Display username prominently */}
          <h1 className="mb-2">{username || "Loading..."}</h1>
          {/* Removed separate username display */}
        </div>
      </div>

      <div className="flex gap-6 text-sm">
        <div>
          {/* Use $createdAt */}
          <span className="font-medium">Joined:</span> {joinedDate}
        </div>
        {/* Publication count would come from a separate DB query later */}
      </div>
    </div>
  );
}
