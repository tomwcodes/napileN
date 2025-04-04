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
    const isActive = pathname === href
    return `hover:text-red-700 ${
      isActive ? "font-bold text-red-700" : "text-slate-600"
    }`
  }

  // Helper function for mobile link classes
  const getMobileLinkClass = (href: string) => {
    const isActive = pathname === href
    return `py-2 hover:text-red-700 ${
      isActive ? "font-bold text-red-700" : "text-slate-600"
    }`
  }

  return (
    <header className="bg-white shadow-sm"> {/* White background, subtle shadow */}
      <div className="container mx-auto px-4 py-6"> {/* Increased vertical padding */}
        <div className="flex items-center justify-between">
          {/* Branding */}
          <Link href="/" className="text-2xl font-serif font-bold text-gray-800 hover:no-underline">
            Verses {/* Updated branding text */}
          </Link>

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={toggleMenu} aria-label="Toggle menu">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Navigation & Auth */}
          <div className="hidden md:flex items-center gap-10"> {/* Increased gap */}
            {/* Centered Navigation Links */}
            <nav className="flex items-center gap-8"> {/* Adjusted gap */}
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

            {/* Auth Links/Buttons */}
            {user ? (
              <div className="flex items-center gap-6"> {/* Adjusted gap */}
                {/* Use user.$id for the profile link */}
                <Link href={`/profile/${user.$id}`} className={getLinkClass(`/profile/${user.$id}`)}>
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className="text-slate-700 hover:text-red-700" /* Simple text link style */
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-6"> {/* Adjusted gap */}
                <Link
                  href="/login"
                  className="text-slate-700 hover:text-red-700" /* Simple text link style */
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="bg-red-700 text-white font-bold rounded-md px-4 py-2 text-sm hover:bg-red-800 transition-colors" /* Red button style */
                >
                  Sign up
                </Link>
              </div>
            )}
          </div> {/* Correctly closes the div started on line 56 */}
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pt-4 border-t border-gray-100 flex flex-col gap-2"> {/* Added top border, adjusted gap */}
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
                  className="text-left text-slate-700 hover:text-red-700 py-2 w-full" /* Simple text button style */
                >
                  Log Out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-3 pt-3"> {/* Adjusted gap and padding */}
                <Link
                  href="/login"
                  className="text-center text-slate-700 hover:text-red-700 py-2 border border-slate-300 rounded-md w-full" /* Simple bordered button */
                  onClick={toggleMenu}
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="bg-red-700 text-white text-center font-bold rounded-md px-4 py-2 text-sm hover:bg-red-800 transition-colors w-full" /* Red button style */
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
