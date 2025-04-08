"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { databases, DATABASES_ID, USER_PROFILES_COLLECTION_ID } from "@/lib/appwrite";
import { Query } from "appwrite";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ProfileSection from "@/components/settings/profile-section";
import SecuritySection from "@/components/settings/security-section";
import DangerZoneSection from "@/components/settings/danger-zone-section";

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Redirect if not logged in
    if (!loading && !user) {
      router.push("/login");
    }

    // Fetch user profile data
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        const response = await databases.listDocuments(
          DATABASES_ID,
          USER_PROFILES_COLLECTION_ID,
          [Query.equal("userId", user.$id)]
        );
        
        if (response.documents.length > 0) {
          setUserProfile(response.documents[0]);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      fetchUserProfile();
    }
  }, [user, loading, router]);

  if (loading || isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center h-[50vh]">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account settings and preferences.
          </p>
        </div>
        
        <Separator />
        
        <div className="grid gap-6">
          <ProfileSection user={user} userProfile={userProfile} />
          <SecuritySection user={user} />
          <DangerZoneSection />
        </div>
      </div>
    </div>
  );
}
