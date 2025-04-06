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
            <h1 className="mb-1">User Not Found</h1>
            <p className="text-sm text-muted-foreground">@unknown</p>
          </div>
        </div>
      </div>
    );
  }

  // Appwrite SDK typically returns ISO string for $createdAt
  const joinedDate = user.$createdAt ? new Date(user.$createdAt).toLocaleDateString() : "N/A";

  // Get username and displayName from user profile
  const [username, setUsername] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchUserProfile() {
      if (!user) return;
      
      try {
        const response = await databases.listDocuments(
          DATABASES_ID,
          USER_PROFILES_COLLECTION_ID,
          [Query.equal("userId", user.$id)]
        );
        
        if (response.documents.length > 0) {
          const userProfile = response.documents[0];
          setUsername(userProfile.username);
          setDisplayName(userProfile.displayName || userProfile.username);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    }
    
    fetchUserProfile();
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="flex flex-row gap-6 items-center">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center text-3xl font-serif">
          {/* Use first letter of displayName for avatar, fallback if loading/null */}
          {displayName ? displayName.charAt(0).toUpperCase() : "?"}
        </div>

        <div>
          {/* Display displayName prominently */}
          <h1 className="mb-1">{displayName || "Loading..."}</h1>
          {/* Display username below with @ prefix */}
          <p className="text-sm text-muted-foreground">@{username || "..."}</p>
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
