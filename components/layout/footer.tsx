import Link from "next/link"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Verse</h3>
            <p className="text-muted-foreground">The platform for publishing and discovering poetry and stories.</p>
          </div>

          {/* <div>
            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-accent">
                  Home
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

        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; {currentYear} Verse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
