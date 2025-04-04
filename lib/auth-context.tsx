"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { account } from "./appwrite"; // Import Appwrite account service
import { Models, AppwriteException, ID } from "appwrite"; // Import Appwrite types

// Define a type for the user object from Appwrite, picking relevant fields
// Or use Models.User directly if you need all fields
type AuthUser = Models.User<Models.Preferences> | null;

interface AuthContextType {
  user: AuthUser;
  loading: boolean; // Add loading state
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>; // Make logout async
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser>(null);
  const [loading, setLoading] = useState(true); // Start with loading true

  // Check for active Appwrite session on initial load
  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);
      try {
        const currentUser = await account.get();
        setUser(currentUser);
      } catch (error) {
        // No active session or error fetching session
        if (error instanceof AppwriteException && error.code !== 401) {
          // Log errors other than "Unauthorized" (which is expected if not logged in)
          console.error("Appwrite session check failed:", error);
        }
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await account.createEmailPasswordSession(email, password);
      const currentUser = await account.get(); // Fetch user data after login
      setUser(currentUser);
    } catch (error) {
      console.error("Appwrite login failed:", error);
      setUser(null); // Ensure user is null on failed login
      throw error; // Re-throw error to be handled by the caller (e.g., login form)
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      // Create the user account
      await account.create(ID.unique(), email, password, name);
      // Optionally log the user in immediately after registration
      await login(email, password);
      // Or just fetch the user data if login isn't desired right away
      // const newUser = await account.get();
      // setUser(newUser);
    } catch (error) {
      console.error("Appwrite registration failed:", error);
      setUser(null); // Ensure user is null on failed registration
      throw error; // Re-throw error to be handled by the caller
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await account.deleteSession("current");
      setUser(null);
    } catch (error) {
      console.error("Appwrite logout failed:", error);
      // Optionally handle logout errors, though usually it's safe to just clear the local state
      setUser(null);
      throw error; // Re-throw if needed
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}
