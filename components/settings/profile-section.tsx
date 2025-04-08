"use client";

import { useState } from "react";
import { Models } from "appwrite";
import { databases, DATABASES_ID, USER_PROFILES_COLLECTION_ID } from "@/lib/appwrite";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

interface ProfileSectionProps {
  user: Models.User<Models.Preferences>;
  userProfile: any;
}

export default function ProfileSection({ user, userProfile }: ProfileSectionProps) {
  const [displayName, setDisplayName] = useState(userProfile?.displayName || "");
  const [username, setUsername] = useState(userProfile?.username || "");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(userProfile?.avatarUrl || "/placeholder-user.jpg");
  const [isUploading, setIsUploading] = useState(false);

  // Mock function to check username uniqueness
  const checkUsernameUniqueness = async (username: string): Promise<boolean> => {
    // Simulate API call
    setIsCheckingUsername(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsCheckingUsername(false);
    
    // For demo purposes, let's say the username is unique if it's not "admin" or "test"
    return !["admin", "test"].includes(username.toLowerCase());
  };

  // Mock function to update profile
  const updateProfile = async () => {
    if (!userProfile) return;
    
    setIsUpdating(true);
    
    try {
      // Validate username
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
      
      // Simulate API call to update profile
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would update the document in Appwrite
      // await databases.updateDocument(
      //   DATABASES_ID,
      //   USER_PROFILES_COLLECTION_ID,
      //   userProfile.$id,
      //   {
      //     displayName,
      //     username,
      //   }
      // );
      
      toast({
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

  // Mock function to handle avatar upload
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    
    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you would upload the file to Appwrite Storage
      // const uploadResponse = await storage.createFile(
      //   BUCKET_ID,
      //   ID.unique(),
      //   file
      // );
      
      // Then update the user profile with the new avatar URL
      // const fileUrl = storage.getFileView(BUCKET_ID, uploadResponse.$id);
      // setAvatarUrl(fileUrl);
      
      // For demo, we'll use a URL constructor to create an object URL
      const objectUrl = URL.createObjectURL(file);
      setAvatarUrl(objectUrl);
      
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully.",
      });
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

  // Mock function to remove avatar
  const removeAvatar = async () => {
    setIsUploading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Reset to default avatar
      setAvatarUrl("/placeholder-user.jpg");
      
      toast({
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
        <CardTitle className="flex items-center gap-2">
          <span role="img" aria-label="Profile">🧍</span>
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
                  disabled={isUploading || avatarUrl === "/placeholder-user.jpg"}
                >
                  Remove
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Recommended: Square image, at least 400x400 pixels.
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
