"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { databases, DATABASES_ID, USER_PROFILES_COLLECTION_ID } from "@/lib/appwrite"
import { User as UserProfile } from "@/lib/types"
import { Query } from "appwrite"
import { Menu, X, Search } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
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
  const { user, logout, loading } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<UserProfile[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isResultsOpen, setIsResultsOpen] = useState(false)
  const [username, setUsername] = useState<string | null>(null)
  const [displayName, setDisplayName] = useState<string | null>(null)
  const router = useRouter()
  const searchContainerRef = useRef<HTMLDivElement>(null)

  // Fetch user profile when user changes
  useEffect(() => {
    async function fetchUserProfile() {
      if (!user) {
        setUsername(null)
        setDisplayName(null)
        return
      }
      
      try {
        const response = await databases.listDocuments(
          DATABASES_ID,
          USER_PROFILES_COLLECTION_ID,
          [Query.equal("userId", user.$id)]
        )
        
        if (response.documents.length > 0) {
          const userProfile = response.documents[0]
          setUsername(userProfile.username)
          setDisplayName(userProfile.displayName || userProfile.username)
        } else {
          setUsername(user.$id)
          setDisplayName(user.$id)
        }
      } catch (error) {
        console.error("Error fetching user profile:", error)
        setUsername(user.$id)
        setDisplayName(user.$id)
      }
    }
    
    fetchUserProfile()
  }, [user])

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (displayName && displayName.length > 0) {
      return displayName[0].toUpperCase()
    } else if (username && username.length > 0) {
      return username[0].toUpperCase()
    }
    return "U"
  }

  // Toggle mobile menu
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  // Helper for link classes
  const getLinkClass = (href: string) => {
    const isActive = pathname === href || (href !== "/" && pathname?.startsWith(href))
    return `hover:text-red-900 ${isActive ? "font-bold text-red-900" : "text-gray-600"}`
  }

  // Helper for mobile link classes
  const getMobileLinkClass = (href: string) => {
    const isActive = pathname === href || (href !== "/" && pathname?.startsWith(href))
    return `py-2 hover:text-red-900 ${isActive ? "font-bold text-red-900" : "text-gray-600"}`
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-6">
        {/* Desktop Header */}
        <div className="hidden md:grid md:grid-cols-3 md:items-center">
          {/* Branding */}
          <div className="col-span-1">
            <Link href="/" className="text-2xl font-serif font-bold text-black hover:no-underline">
              Verses
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="col-span-1 flex justify-center items-center gap-8">
            <Link href="/" className={getLinkClass("/")}>Home</Link>
            <Link href="/poetry" className={getLinkClass("/poetry")}>Poetry</Link>
            <Link href="/fiction" className={getLinkClass("/fiction")}>Fiction</Link>
            <Link href="/articles" className={getLinkClass("/articles")}>Articles</Link>
            <Link href="/authors" className={getLinkClass("/authors")}>Authors</Link>
          </nav>

          {/* Auth Section */}
          <div className="col-span-1 flex justify-end items-center gap-6">
            {/* Search Bar */}
            <div ref={searchContainerRef} className="relative w-48">
              <form onSubmit={(e) => e.preventDefault()}>
                <input
                  type="text"
                  placeholder="search authors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input pl-10 py-1 w-full text-sm rounded-md border border-gray-300 focus:border-red-900 focus:ring-1 focus:ring-red-900"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
              </form>
            </div>
            
            {/* User Menu */}
            {loading ? (
              <div className="flex items-center gap-4">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-9 w-9 rounded-full" />
              </div>
            ) : user ? (
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
                  <DropdownMenuItem asChild className="focus:bg-gray-100 focus:text-gray-900 cursor-pointer">
                    <Link href={`/profile/${username || user.$id}`} className="flex w-full flex-col space-y-1 p-2">
                      <p className="text-sm font-medium leading-none">{displayName || 'User'}</p>
                      <p className="text-xs leading-none text-muted-foreground">@{username || '...'}</p>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer focus:bg-gray-100 focus:text-gray-900">
                    <Link href="/settings" className="flex w-full items-center justify-center">
                      <span>Account Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={logout} 
                    className="cursor-pointer text-center justify-center focus:bg-gray-100 focus:text-gray-900 hover:bg-gray-100 hover:text-gray-900"
                  >
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-red-900">
                  Log in
                </Link>
                <Link href="/register" className="bg-red-900 text-white font-bold rounded-md px-4 py-2 text-sm hover:bg-red-950 transition-colors">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between">
          <Link href="/" className="text-2xl font-serif font-bold text-black hover:no-underline">
            Verses
          </Link>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)} 
              className="p-1 text-gray-600 hover:text-red-900"
              aria-label="Toggle search"
            >
              <Search size={20} />
            </button>
            
            {loading ? (
              <Skeleton className="h-8 w-8 rounded-full" />
            ) : user ? (
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
                  <DropdownMenuItem asChild className="focus:bg-gray-100 focus:text-gray-900 cursor-pointer">
                    <Link href={`/profile/${username || user.$id}`} className="flex w-full flex-col space-y-1 p-2">
                      <p className="text-sm font-medium leading-none">{displayName || 'User'}</p>
                      <p className="text-xs leading-none text-muted-foreground">@{username || '...'}</p>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer focus:bg-gray-100 focus:text-gray-900">
                    <Link href="/settings" className="flex w-full items-center justify-center">
                      <span>Account Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={logout} 
                    className="cursor-pointer text-center justify-center focus:bg-gray-100 focus:text-gray-900 hover:bg-gray-100 hover:text-gray-900"
                  >
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null }
            
            <button onClick={toggleMenu} aria-label="Toggle menu" className="p-1">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div ref={searchContainerRef} className="md:hidden mt-4 pt-4 border-t border-gray-100 relative">
            <form onSubmit={(e) => e.preventDefault()}>
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
            <Link href="/fiction" className={getMobileLinkClass("/fiction")} onClick={toggleMenu}>
              Fiction
            </Link>
            <Link href="/articles" className={getMobileLinkClass("/articles")} onClick={toggleMenu}>
              Articles
            </Link>
            <Link href="/authors" className={getMobileLinkClass("/authors")} onClick={toggleMenu}>
              Authors
            </Link>
            
            {loading ? (
              <div className="flex flex-col gap-3 pt-3">
                <Skeleton className="h-10 w-full rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            ) : user ? (
              null // Removed Account Settings link as it's in the avatar dropdown
            ) : (
              <div className="flex flex-col gap-3 pt-3">
                <Link
                  href="/login"
                  className="text-center text-gray-700 hover:text-red-900 py-2 border border-gray-300 rounded-md w-full"
                  onClick={toggleMenu}
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="bg-red-900 text-white text-center font-bold rounded-md px-4 py-2 text-sm hover:bg-red-950 transition-colors w-full"
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
