"use client"

"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation" // Import usePathname
import { useAuth } from "@/lib/auth-context"
import { Menu, X } from "lucide-react"

export default function Header() {
  const pathname = usePathname() // Get current path
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
          <div className="col-span-1 flex justify-end items-center gap-6"> {/* Align right */}
            {user ? (
              <>
                <Link href={`/profile/${user.$id}`} className={getLinkClass(`/profile/${user.$id}`)}>
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className="text-gray-700 hover:text-red-900" /* Adjusted text color */
                >
                  Log Out
                </button>
              </>
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
              <>
                {/* Use user.$id for the profile link */}
                <Link href={`/profile/${user.$id}`} className={getMobileLinkClass(`/profile/${user.$id}`)} onClick={toggleMenu}>
                  Profile
                </Link>
                <button
                  onClick={() => { logout(); toggleMenu(); }}
                  className="text-left text-gray-700 hover:text-red-900 py-2 w-full" /* Adjusted colors */
                >
                  Log Out
                </button>
              </>
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
