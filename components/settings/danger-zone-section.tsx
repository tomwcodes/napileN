"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

export default function DangerZoneSection() {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { logout } = useAuth();

  // Mock function to delete user account
  const deleteUser = async () => {
    setIsDeleting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would call Appwrite to delete the user account
      // await account.deleteSession('current');
      // await account.delete();
      
      // Close dialog
      setIsDeleteDialogOpen(false);
      
      // Show success toast
      toast({
        title: "Account deleted",
        description: "Your account has been successfully deleted.",
      });
      
      // Log out the user
      await logout();
      
      // Redirect to home page
      router.push("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast({
        title: "Deletion failed",
        description: "There was an error deleting your account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card className="border-destructive/20">
        <CardHeader className="text-destructive">
          <CardTitle>
            Danger Zone
          </CardTitle>
          <CardDescription className="text-destructive/80">
            Irreversible actions that will affect your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border border-destructive/20 rounded-lg p-4">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <h3 className="font-medium">Delete Account</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                </div>
                <Button 
                  variant="destructive"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete your account?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. All your data, including profile information, 
              published content, and saved items will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm font-medium text-destructive">
              Please confirm that you understand the consequences of this action.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={deleteUser}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Yes, Delete My Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
