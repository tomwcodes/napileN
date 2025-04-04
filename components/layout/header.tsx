"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Menu, X, User, LogOut } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Header() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  // Function to get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user || !user.name) return "U"
    return user.name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
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
            <Link href="/blog" className={getLinkClass("/blog")}>
              Blog
            </Link>
          </nav>

          {/* Auth Links/Buttons - Column 3 */}
          <div className="col-span-1 flex justify-end items-center gap-6">
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
                  <DropdownMenuItem asChild>
                    <Link href={`/profile/${user.$id}`} className="cursor-pointer flex w-full">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="cursor-pointer">
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
           <Link href="/" className="text-2xl font-serif font-bold text-black hover:no-underline"> {/* Black branding */}
             Verses
           </Link>
           {/* Mobile menu button */}
           <button onClick={toggleMenu} aria-label="Toggle menu">
             {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
           </button>
         </div>

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
            <Link href="/blog" className={getMobileLinkClass("/blog")} onClick={toggleMenu}>
              Blog
            </Link>

            {user ? (
              <div className="pt-3 border-t border-gray-100 mt-2">
                <div className="flex items-center gap-3 py-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.prefs?.avatarUrl || "/placeholder-user.jpg"} alt={user.name || "User"} />
                    <AvatarFallback className="bg-red-900 text-white text-xs">{getUserInitials()}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{user.name}</span>
                </div>
                <Link 
                  href={`/profile/${user.$id}`} 
                  className="flex items-center gap-2 text-gray-700 hover:text-red-900 py-2 w-full"
                  onClick={toggleMenu}
                >
                  <User className="h-4 w-4" />
                  Profile
                </Link>
                <button
                  onClick={() => { logout(); toggleMenu(); }}
                  className="flex items-center gap-2 text-left text-gray-700 hover:text-red-900 py-2 w-full"
                >
                  <LogOut className="h-4 w-4" />
                  Log Out
                </button>
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
