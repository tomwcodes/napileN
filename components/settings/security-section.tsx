"use client";

import { useState } from "react";
import { Models } from "appwrite";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

interface SecuritySectionProps {
  user: Models.User<Models.Preferences>;
}

export default function SecuritySection({ user }: SecuritySectionProps) {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock function to change password
  const handleChangePassword = async () => {
    // Validate inputs
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Missing fields",
        description: "Please fill in all password fields.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation must match.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Password too short",
        description: "New password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you would call Appwrite to update the password
      // await account.updatePassword(newPassword, currentPassword);
      
      // Reset form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsChangingPassword(false);
      
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });
    } catch (error) {
      console.error("Error changing password:", error);
      toast({
        title: "Update failed",
        description: "There was an error changing your password. Please check your current password and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span role="img" aria-label="Security">🔐</span>
          Security
        </CardTitle>
        <CardDescription>
          Manage your account security settings.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email (Read-only) */}
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            value={user.email}
            disabled
            readOnly
          />
          <p className="text-xs text-muted-foreground">
            Your email address is used for login and notifications.
          </p>
        </div>

        {/* Password Change Section */}
        {!isChangingPassword ? (
          <div>
            <Button 
              variant="outline" 
              onClick={() => setIsChangingPassword(true)}
            >
              Change Password
            </Button>
          </div>
        ) : (
          <div className="space-y-4 border rounded-lg p-4">
            <h3 className="font-medium">Change Password</h3>
            
            {/* Current Password */}
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your current password"
              />
            </div>
            
            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
              />
            </div>
            
            {/* Confirm New Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 pt-2">
              <Button 
                onClick={handleChangePassword} 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update Password"}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsChangingPassword(false);
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
