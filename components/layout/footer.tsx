"use client" // Add this directive for useState/useEffect

import Link from "next/link"
import { useState, useEffect } from "react"

export default function Footer() {
  const [currentYear, setCurrentYear] = useState<number | null>(null)

  useEffect(() => {
    // Set the year only on the client-side after hydration
    setCurrentYear(new Date().getFullYear())
  }, []) // Empty dependency array ensures this runs only once on the client

  return (
    <footer className="border-t border-border py-8 mt-12">
      <div className="container mx-auto px-4">
        {/* Removed grid layout to allow full-width centering */}
        <div className="mb-8"> {/* Added margin-bottom for spacing */}
          {/* Kept text-center to center the content within the container */}
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">Verse</h3>
            <p className="text-muted-foreground">The platform for publishing and discovering poetry and fiction.</p> {/* Changed stories to fiction */}
          </div>

          {/* <div>
            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/articles" className="text-muted-foreground hover:text-accent">
                  Articles
                </Link>
              </li>
              <li>
                <Link href="/poetry" className="text-muted-foreground hover:text-accent">
                  Poetry
                </Link>
              </li>
              <li>
                <Link href="/stories" className="text-muted-foreground hover:text-accent">
                  Stories
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-accent">
                  Blog
                </Link>
              </li>
            </ul>
          </div> */}

          {/* <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-accent">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-accent">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/guidelines" className="text-muted-foreground hover:text-accent">
                  Community Guidelines
                </Link>
              </li>
            </ul>
          </div> */}
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground space-y-2"> {/* Added space-y-2 */}
          <Link href="/submission-policy" className="text-sm hover:text-accent">
            Submission Policy
          </Link>
          {/* Render the year only when the state is set */}
          <p className="text-sm">&copy; {currentYear ?? new Date().getFullYear()} Verse. All rights reserved.</p> {/* Added text-sm */}
          {/* Added fallback for initial render/SSR, though useEffect should handle it */}
        </div>
      </div>
    </footer>
  )
}
