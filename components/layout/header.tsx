"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react" // Added useRef
import { usePathname, useRouter } from "next/navigation" // Added useRouter
import { useAuth } from "@/lib/auth-context"
import { databases, DATABASES_ID, USER_PROFILES_COLLECTION_ID } from "@/lib/appwrite"
import { User as UserProfile } from "@/lib/types" // Import User type
import { Query } from "appwrite"
import { Menu, X, User, LogOut, Search } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Header() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<UserProfile[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isResultsOpen, setIsResultsOpen] = useState(false) // Control results dropdown visibility
  const [username, setUsername] = useState<string | null>(null)
  const router = useRouter() // Initialize router
  const searchContainerRef = useRef<HTMLDivElement>(null); // Ref for click outside detection

  // Debounce search term
  useEffect(() => {
    setIsResultsOpen(searchTerm.length > 0); // Open results if there's a term

    if (searchTerm.trim().length === 0) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const debounceTimer = setTimeout(() => {
      handleSearch(searchTerm.trim());
    }, 500); // 500ms debounce

    return () => clearTimeout(debounceTimer); // Cleanup timer on unmount or term change
  }, [searchTerm]);

  // Click outside handler for search results
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsResultsOpen(false); // Close results if click is outside
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchContainerRef]);


  // Function to perform the search
  const handleSearch = async (term: string) => {
    if (!term) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    try {
      const response = await databases.listDocuments(
        DATABASES_ID,
        USER_PROFILES_COLLECTION_ID,
        [Query.search("username", term), Query.limit(5)] // Search username, limit results
      );
      // Assuming the document structure matches UserProfile or has a username field
      // Map response documents to UserProfile structure if necessary
      const profiles = response.documents.map(doc => ({
        id: doc.$id, // Assuming $id is the user profile document ID
        // Map other fields based on your USER_PROFILES_COLLECTION structure
        username: doc.username,
        name: doc.name || doc.username, // Fallback name
        userId: doc.userId, // Assuming you store the auth user ID
        // Add other fields as needed, potentially fetching full user data if required
        // For simplicity, we might only need username and ID for linking
        email: '', // Placeholder
        bio: '', // Placeholder
        createdAt: doc.$createdAt, // Placeholder
        publicationCount: 0 // Placeholder
      })) as UserProfile[]; // Cast might be needed depending on exact structure
      setSearchResults(profiles);
    } catch (error) {
      console.error("Error searching users:", error);
      setSearchResults([]); // Clear results on error
    } finally {
      setIsSearching(false);
    }
  };

  // Fetch the user's username when the user changes
  useEffect(() => {
    async function fetchUsername() {
      if (!user) {
        setUsername(null)
        return
      }
      
      try {
        const response = await databases.listDocuments(
          DATABASES_ID,
          USER_PROFILES_COLLECTION_ID,
          [Query.equal("userId", user.$id)]
        )
        
        if (response.documents.length > 0) {
          setUsername(response.documents[0].username)
        } else {
          // Fallback to user ID if no username is found
          setUsername(user.$id)
        }
      } catch (error) {
        console.error("Error fetching username:", error)
        // Fallback to user ID if there's an error
        setUsername(user.$id)
      }
    }
    
    fetchUsername()
  }, [user])
  
  // Function to get user initials for avatar fallback
  const getUserInitials = () => {
    // Use the fetched username if available, otherwise default
    if (username && username.length > 0) {
      return username[0].toUpperCase();
    }
    // Fallback if username is not yet loaded or empty
    return "U"; 
  }

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  // Helper function for link classes
  const getLinkClass = (href: string) => {
    const isActive = pathname === href || (href !== "/" && pathname?.startsWith(href)); // Handle nested routes for active state
    return `hover:text-red-900 ${ // Use red-900 for hover
      isActive ? "font-bold text-red-900" : "text-gray-600" // Use gray-600 and red-900
    }`
  }

  // Helper function for mobile link classes
  const getMobileLinkClass = (href: string) => {
    const isActive = pathname === href || (href !== "/" && pathname?.startsWith(href));
    return `py-2 hover:text-red-900 ${ // Use red-900 for hover
      isActive ? "font-bold text-red-900" : "text-gray-600" // Use gray-600 and red-900
    }`
  }

  return (
    <header className="bg-white shadow-sm"> {/* White background, subtle shadow */}
      <div className="container mx-auto px-4 py-6"> {/* Increased vertical padding */}
        {/* Desktop Header Layout - Grid */}
        <div className="hidden md:grid md:grid-cols-3 md:items-center">
          {/* Branding - Column 1 */}
          <div className="col-span-1">
            <Link href="/" className="text-2xl font-serif font-bold text-black hover:no-underline"> {/* Black branding */}
              Verses
            </Link>
          </div>

          {/* Centered Navigation Links - Column 2 */}
          <nav className="col-span-1 flex justify-center items-center gap-8"> {/* Center links */}
            <Link href="/" className={getLinkClass("/")}>
              Home
            </Link>
            <Link href="/poetry" className={getLinkClass("/poetry")}>
              Poetry
            </Link>
            <Link href="/stories" className={getLinkClass("/stories")}>
              Stories
            </Link>
            <Link href="/articles" className={getLinkClass("/articles")}>
              Articles
            </Link>
          </nav>

          {/* Auth Links/Buttons - Column 3 */}
          <div className="col-span-1 flex justify-end items-center gap-6">
            {/* Desktop Search Bar & Results */}
            <div ref={searchContainerRef} className="relative w-48"> {/* Added ref */}
              <form onSubmit={(e) => e.preventDefault()} >
                <input
                  type="text"
                placeholder="search authors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input pl-10 py-1 w-full text-sm rounded-md border border-gray-300 focus:border-red-900 focus:ring-1 focus:ring-red-900"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
              </form>
              {/* Search Results Dropdown */}
              {isResultsOpen && (
                 <div className="absolute z-10 top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {isSearching && <div className="p-2 text-sm text-gray-500">Searching...</div>}
                  {!isSearching && searchResults.length === 0 && searchTerm.length > 0 && (
                    <div className="p-2 text-sm text-gray-500">No authors found.</div>
                  )}
                  {!isSearching && searchResults.map((profile) => (
                    <Link
                      key={profile.id}
                      href={`/profile/${profile.username}`}
                      className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        setIsResultsOpen(false); // Close on selection
                        setSearchTerm(""); // Optional: Clear search term on selection
                      }}
                    >
                      {profile.username}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-red-900 focus:ring-offset-2">
                    <Avatar className="h-9 w-9 cursor-pointer hover:opacity-80 transition-opacity">
                      <AvatarImage src={user.prefs?.avatarUrl || "/placeholder-user.jpg"} alt={user.name || "User"} />
                      <AvatarFallback className="bg-red-900 text-white">{getUserInitials()}</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      {/* Display fetched username */}
                      <p className="text-sm font-medium leading-none">{username || 'User'}</p> 
                      {/* Optional: Add email if needed */}
                      {/* <p className="text-xs leading-none text-muted-foreground">{user.email}</p> */}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={`/profile/${username || user.$id}`} className="cursor-pointer flex w-full items-center">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="cursor-pointer flex items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-red-900" /* Adjusted text color */
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="bg-red-900 text-white font-bold rounded-md px-4 py-2 text-sm hover:bg-red-950 transition-colors" /* Adjusted red color */
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Header Layout - Flex */}
        <div className="md:hidden flex items-center justify-between">
          {/* Branding */}
          <Link href="/" className="text-2xl font-serif font-bold text-black hover:no-underline">
            Verses
          </Link>
          
          {/* Mobile right side controls */}
          <div className="flex items-center gap-3">
            {/* Mobile Search Icon/Button */}
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)} 
              className="p-1 text-gray-600 hover:text-red-900"
              aria-label="Toggle search"
            >
              <Search size={20} />
            </button>
            
            {/* User Avatar (if logged in) */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-red-900 focus:ring-offset-2">
                    <Avatar className="h-8 w-8 cursor-pointer hover:opacity-80 transition-opacity">
                      <AvatarImage src={user.prefs?.avatarUrl || "/placeholder-user.jpg"} alt={user.name || "User"} />
                      <AvatarFallback className="bg-red-900 text-white text-xs">{getUserInitials()}</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                 <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      {/* Display fetched username */}
                      <p className="text-sm font-medium leading-none">{username || 'User'}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={`/profile/${username || user.$id}`} className="cursor-pointer flex w-full items-center">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="cursor-pointer flex items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
            {/* Mobile menu button */}
            <button onClick={toggleMenu} aria-label="Toggle menu" className="p-1">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar & Results - Collapsible */}
        {isSearchOpen && (
          <div ref={searchContainerRef} className="md:hidden mt-4 pt-4 border-t border-gray-100 relative"> {/* Added ref */}
            <form onSubmit={(e) => e.preventDefault()} >
              <input
                type="text"
                placeholder="search authors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10 py-2 w-full text-sm rounded-md border border-gray-300 focus:border-red-900 focus:ring-1 focus:ring-red-900"
                autoFocus
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            </form>
             {/* Mobile Search Results Dropdown */}
             {isResultsOpen && (
               <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {isSearching && <div className="p-2 text-sm text-gray-500">Searching...</div>}
                {!isSearching && searchResults.length === 0 && searchTerm.length > 0 && (
                  <div className="p-2 text-sm text-gray-500">No authors found.</div>
                )}
                {!isSearching && searchResults.map((profile) => (
                  <Link
                    key={profile.id}
                    href={`/profile/${profile.username}`}
                    className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      setIsResultsOpen(false); // Close on selection
                      setIsSearchOpen(false); // Close mobile search bar too
                      setSearchTerm(""); // Optional: Clear search term
                    }}
                  >
                    {profile.username}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pt-4 border-t border-gray-100 flex flex-col gap-2">
            <Link href="/" className={getMobileLinkClass("/")} onClick={toggleMenu}>
              Home
            </Link>
            <Link href="/poetry" className={getMobileLinkClass("/poetry")} onClick={toggleMenu}>
              Poetry
            </Link>
            <Link href="/stories" className={getMobileLinkClass("/stories")} onClick={toggleMenu}>
              Stories
            </Link>
            <Link href="/articles" className={getMobileLinkClass("/articles")} onClick={toggleMenu}>
              Articles
            </Link>

            {user ? (
              // Removed the username display from here
              <div className="pt-3 border-t border-gray-100 mt-2">
                {/* Placeholder div to maintain structure if needed, or remove entirely */}
              </div>
            ) : (
              <div className="flex flex-col gap-3 pt-3">
                <Link
                  href="/login"
                  className="text-center text-gray-700 hover:text-red-900 py-2 border border-gray-300 rounded-md w-full" /* Adjusted colors */
                  onClick={toggleMenu}
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="bg-red-900 text-white text-center font-bold rounded-md px-4 py-2 text-sm hover:bg-red-950 transition-colors w-full" /* Adjusted colors */
                  onClick={toggleMenu}
                >
                  Sign up
                </Link>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}
