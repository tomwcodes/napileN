import { Models } from "appwrite"; // Import Appwrite Models

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center text-3xl font-serif">
          {/* Use name, handle potential null/undefined */}
          {user.name ? user.name.charAt(0) : "?"}
        </div>

        <div>
          {/* Use name */}
          <h1 className="mb-2">{user.name || "Unnamed User"}</h1>
          {/* Username, bio, etc. are not standard Appwrite fields */}
          {/* You might fetch extended profile data from a separate Appwrite DB collection later */}
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
