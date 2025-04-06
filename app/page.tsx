import Link from "next/link";
import { Button } from "@/components/ui/button";
// import LatestSubmissions from "@/components/home/latest-submissions"; // Remove old import
import FeaturedContent from "@/components/home/featured-content"; // Import new component
import { getLatestContent, getMostPopularContent } from "@/lib/data"; // Import data fetching functions

export const revalidate = 0; // Force dynamic rendering and revalidation

export default async function Home() { // Make the component async
  // Fetch data for the new component
  const recentContent = await getLatestContent(9); // Fetch 9 items for a 3-col grid
  const mostPopularContent = await getMostPopularContent(9); // Fetch 9 most popular items
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-24 space-y-8">
        <h1 className="text-5xl font-bold font-serif text-gray-900 dark:text-gray-100">
          Share your words with the world.
        </h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl">
          The platform for publishing and discovering poetry and stories.
        </p>
        <Link href="/write">
          <Button
            size="lg"
            className="bg-red-900 hover:bg-red-950 text-white font-bold rounded-lg px-6 py-3 transition-colors"
          >
            Start Writing
          </Button>
        </Link>
      </section>
      {/* End Hero Section */}

      {/* Featured Content Section */}
      <FeaturedContent recentContent={recentContent} mostPopularContent={mostPopularContent} /> {/* Pass mostPopularContent */}
      {/* End Featured Content Section */}
    </div>
  )
}
