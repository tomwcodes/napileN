"use client"; // Add "use client" because we're using hooks like useState, useEffect, and useAuth

import { useState, useEffect } from "react";
import { Models } from "appwrite"; // Import Appwrite Models
import { useAuth } from "@/lib/auth-context"; // Import useAuth
import { Button } from "@/components/ui/button"; // Import Button
import Link from "next/link"; // Import Link
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Import Avatar components

// Define a simpler type for the expected user prop structure
interface ProfileUserData {
  $id: string;
  name: string; // Display name or username
  username: string;
  bio?: string;
  $createdAt: string;
}

interface UserProfileProps {
  user: ProfileUserData | null; // Use the simpler type, allow null
  avatarUrl: string; // Add avatarUrl prop
}

export default function UserProfile({ user, avatarUrl }: UserProfileProps) {
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
  // Data is now passed via props, remove internal fetching
  const joinedDate = user.$createdAt ? new Date(user.$createdAt).toLocaleDateString() : "N/A";
  const displayName = user.name; // Directly use prop
  const username = user.username; // Directly use prop

  // Get the currently authenticated user
  const { user: authUser, loading: authLoading } = useAuth();

  // Determine if the current user is viewing their own profile
  const isOwnProfile = !authLoading && authUser && user && authUser.$id === user.$id;

  return (
    <div className="space-y-6">
      <div className="flex flex-row gap-6 items-center">
        {/* Use Avatar component */}
        <Avatar className="w-24 h-24">
          <AvatarImage src={avatarUrl} alt={displayName || username || "User"} />
          <AvatarFallback className="text-3xl font-serif">
            {displayName ? displayName.charAt(0).toUpperCase() : "?"}
          </AvatarFallback>
        </Avatar>

        <div>
          {/* Display displayName prominently */}
          <h1 className="mb-1">{displayName}</h1>
          {/* Display username below with @ prefix */}
          <p className="text-sm text-muted-foreground">@{username || "..."}</p>
          {/* Moved Joined date here */}
          <div className="text-sm text-muted-foreground mt-1"> {/* Added margin top */}
            Joined: {joinedDate}
          </div>
        </div>
      </div>

      {/* Removed the separate div for Joined date */}

      {/* Conditionally render the Publish button */}
      {isOwnProfile && (
        <div className="mt-4"> {/* Add some margin top */}
          <Link href="/write" passHref>
            {/* Apply specific styling from stories page */}
            <Button className="text-white bg-red-900 px-4 py-2 rounded hover:bg-red-950 transition-colors">
              Publish
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
