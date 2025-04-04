import Link from "next/link";
import { Button } from "@/components/ui/button";
import LatestSubmissions from "@/components/home/latest-submissions";

export const revalidate = 0; // Force dynamic rendering and revalidation

export default function Home() {
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
            className="bg-red-700 hover:bg-red-800 text-white font-bold rounded-lg px-6 py-3"
          >
            Start Writing
          </Button>
        </Link>
      </section>
      {/* End Hero Section */}

      <div>
        <LatestSubmissions />
      </div>
    </div>
  )
}
