import LatestSubmissions from "@/components/home/latest-submissions"

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="text-center py-12 border-b border-border">
        <h1 className="mb-4">Welcome to Verse</h1>
        <p className="max-w-2xl mx-auto text-muted-foreground">
          A minimalist platform for publishing and reading poems and stories. Share your creative writing with the world
          or discover new voices.
        </p>
      </section>

      <div>
        <LatestSubmissions />
      </div>
    </div>
  )
}
