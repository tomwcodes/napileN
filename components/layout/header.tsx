"use client"

import Link from "next/link"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Menu, X } from "lucide-react"

export default function Header() {
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <header className="border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-serif font-bold hover:no-underline">
            Verse
          </Link>

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={toggleMenu} aria-label="Toggle menu">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/poetry" className="hover:text-accent">
              Poetry
            </Link>
            <Link href="/stories" className="hover:text-accent">
              Stories
            </Link>
            <Link href="/blog" className="hover:text-accent">
              Blog
            </Link>
            <Link href="/write" className="hover:text-accent">
              Write
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                <Link href={`/profile/${user.username}`} className="hover:text-accent">
                  Profile
                </Link>
                <button onClick={logout} className="btn btn-outline">
                  Log Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="btn btn-outline">
                  Log In
                </Link>
                <Link href="/register" className="btn btn-primary">
                  Register
                </Link>
              </div>
            )}
          </nav>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 flex flex-col gap-4">
            <Link href="/poetry" className="hover:text-accent py-2">
              Poetry
            </Link>
            <Link href="/stories" className="hover:text-accent py-2">
              Stories
            </Link>
            <Link href="/blog" className="hover:text-accent py-2">
              Blog
            </Link>
            <Link href="/write" className="hover:text-accent py-2">
              Write
            </Link>

            {user ? (
              <>
                <Link href={`/profile/${user.username}`} className="hover:text-accent py-2">
                  Profile
                </Link>
                <button onClick={logout} className="btn btn-outline w-full">
                  Log Out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link href="/login" className="btn btn-outline w-full">
                  Log In
                </Link>
                <Link href="/register" className="btn btn-primary w-full">
                  Register
                </Link>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}

