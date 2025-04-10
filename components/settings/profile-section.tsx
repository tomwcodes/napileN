"use client";

import { useState, useEffect } from "react";
import { Models, ID, Query } from "appwrite";
import { databases, storage, DATABASES_ID, USER_PROFILES_COLLECTION_ID, PROFILE_PICTURES_BUCKET_ID } from "@/lib/appwrite";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

// Removed duplicate interface definition here

interface UserProfileDocument extends Models.Document {
  userId: string;
  displayName: string;
  username: string;
  avatarFileId?: string; // Store file ID instead of URL
}

interface ProfileSectionProps {
  user: Models.User<Models.Preferences>;
  userProfile: UserProfileDocument | null; // Expect the full document or null
}

export default function ProfileSection({ user, userProfile }: ProfileSectionProps) {
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("/placeholder-user.jpg"); // Display URL
  const [avatarFileId, setAvatarFileId] = useState<string | undefined>(undefined); // Stored File ID
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName || "");
      setUsername(userProfile.username || "");
      setAvatarFileId(userProfile.avatarFileId);
      if (userProfile.avatarFileId) {
        try {
          const url = storage.getFileView(PROFILE_PICTURES_BUCKET_ID, userProfile.avatarFileId);
          setAvatarUrl(url.toString());
        } catch (error) {
          console.error("Error getting avatar view URL:", error);
          setAvatarUrl("/placeholder-user.jpg"); // Fallback
        }
      } else {
        setAvatarUrl("/placeholder-user.jpg");
      }
    } else {
      // Handle case where profile might not exist yet (though settings page fetches it)
      setDisplayName("");
      setUsername("");
      setAvatarUrl("/placeholder-user.jpg");
      setAvatarFileId(undefined);
    }
  }, [userProfile]);


  // Function to check username uniqueness against the database
  const checkUsernameUniqueness = async (newUsername: string): Promise<boolean> => {
    if (!userProfile || newUsername === userProfile.username) return true; // No change or no profile yet

    setIsCheckingUsername(true);
    try {
      const response = await databases.listDocuments(
        DATABASES_ID,
        USER_PROFILES_COLLECTION_ID,
        [Query.equal("username", newUsername)]
      );
      return response.total === 0; // Unique if no documents found
    } catch (error) {
      console.error("Error checking username uniqueness:", error);
      toast({
        title: "Error checking username",
        description: "Could not verify username uniqueness. Please try again.",
        variant: "destructive",
      });
      return false; // Assume not unique on error
    } finally {
      setIsCheckingUsername(false);
    }
  }; // <-- Added missing closing brace for checkUsernameUniqueness

  // Function to update profile (display name, username)
  const updateProfile = async () => {
    if (!userProfile) {
       toast({
        title: "Profile not found",
        description: "Cannot update profile as it doesn't exist.",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);

    try {
      // Validate username uniqueness if changed
      if (username !== userProfile.username) {
        const isUnique = await checkUsernameUniqueness(username);
        if (!isUnique) {
          toast({
            title: "Username already taken",
            description: "Please choose a different username.",
            variant: "destructive",
          });
          setIsUpdating(false);
          return;
        }
      }

      // Update the document in Appwrite
      await databases.updateDocument(
        DATABASES_ID,
        USER_PROFILES_COLLECTION_ID,
        userProfile.$id,
        {
          displayName,
          username,
          // avatarFileId is updated separately in handleAvatarUpload/removeAvatar
        }
      );

      toast({ // Corrected toast call
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Function to handle avatar upload
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userProfile) return;

    // --- Client-side Validation ---
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPEG, PNG, GIF, or WEBP image.",
        variant: "destructive",
      });
      e.target.value = ""; // Reset file input
      return;
    }

    if (file.size > maxSizeInBytes) {
      toast({
        title: "File too large",
        description: `Please upload an image smaller than ${maxSizeInBytes / 1024 / 1024}MB.`,
        variant: "destructive",
      });
      e.target.value = ""; // Reset file input
      return;
    }
    // --- End Validation ---

    setIsUploading(true);
    const previousFileId = avatarFileId; // Store old ID for potential deletion

    try {
      // 1. Upload the new file to Appwrite Storage
      const uploadResponse = await storage.createFile(
        PROFILE_PICTURES_BUCKET_ID,
        ID.unique(), // Generate a unique ID for the file
        file
      );
      const newFileId = uploadResponse.$id;

      // 2. Update the user profile document with the new avatarFileId
      await databases.updateDocument(
        DATABASES_ID,
        USER_PROFILES_COLLECTION_ID,
        userProfile.$id,
        { avatarFileId: newFileId }
      );

      // 3. Update local state
      const newAvatarViewUrl = storage.getFileView(PROFILE_PICTURES_BUCKET_ID, newFileId);
      setAvatarUrl(newAvatarViewUrl.toString());
      setAvatarFileId(newFileId);

      toast({ // Corrected toast call
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully.",
      });

      // 4. Delete the previous avatar file (if one existed)
      if (previousFileId) {
        try {
          await storage.deleteFile(PROFILE_PICTURES_BUCKET_ID, previousFileId);
        } catch (deleteError) {
          // Log error but don't block success message for upload
          console.error("Error deleting previous avatar:", deleteError);
        }
      }

    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your avatar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Function to remove avatar
  const removeAvatar = async () => {
    if (!userProfile || !avatarFileId) return; // No profile or no avatar to remove

    setIsUploading(true);
    const fileIdToDelete = avatarFileId; // Store ID before clearing state

    try {
      // 1. Update the user profile document, setting avatarFileId to null
      await databases.updateDocument(
        DATABASES_ID,
        USER_PROFILES_COLLECTION_ID,
        userProfile.$id,
        { avatarFileId: null }
      );

      // 2. Delete the file from Appwrite Storage
      await storage.deleteFile(PROFILE_PICTURES_BUCKET_ID, fileIdToDelete);

      // 3. Update local state
      setAvatarUrl("/placeholder-user.jpg");
      setAvatarFileId(undefined);

      toast({ // Corrected toast call
        title: "Avatar removed",
        description: "Your profile picture has been removed.",
      });
    } catch (error) {
      console.error("Error removing avatar:", error);
      toast({
        title: "Action failed",
        description: "There was an error removing your avatar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Profile Information
        </CardTitle>
        <CardDescription>
          Update your profile information and how others see you on the platform.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar Section */}
        <div className="space-y-4">
          <Label>Profile Picture</Label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={avatarUrl} alt="Profile picture" />
              <AvatarFallback>
                {displayName ? displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  className="relative"
                  disabled={isUploading}
                >
                  {isUploading ? "Uploading..." : "Upload new image"}
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    disabled={isUploading}
                  />
                </Button>
                <Button
                  variant="outline"
                  onClick={removeAvatar}
                  disabled={isUploading || !avatarFileId} // Disable if no avatar ID
                >
                  Remove
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Allowed: JPG, PNG, GIF, WEBP. Max size: 5MB. Recommended: Square image.
              </p>
            </div>
          </div>
        </div>

        {/* Display Name */}
        <div className="space-y-2">
          <Label htmlFor="displayName">Display Name</Label>
          <Input
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your display name"
          />
        </div>

        {/* Username */}
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <div className="relative">
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your username"
              className="pr-12"
            />
            {isCheckingUsername && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            This will be used for your profile URL: example.com/profile/{username}
          </p>
        </div>

        {/* Save Button */}
        <Button
          onClick={updateProfile}
          disabled={isUpdating || isCheckingUsername}
          className="w-full sm:w-auto"
        >
          {isUpdating ? "Saving..." : "Save Changes"}
        </Button>
      </CardContent>
    </Card>
  );
}
