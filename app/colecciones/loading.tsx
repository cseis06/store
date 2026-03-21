export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Header skeleton */}
      <div className="bg-black/[0.02] py-16 lg:py-24">
        <div className="container-kiren text-center">
          <div className="h-12 w-64 bg-black/10 animate-pulse mx-auto mb-4" />
          <div className="h-6 w-80 bg-black/10 animate-pulse mx-auto" />
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="container-kiren py-12 lg:py-16">
        {/* Featured collections skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="aspect-[4/5] lg:aspect-[3/4] bg-black/5 animate-pulse"
            />
          ))}
        </div>

        {/* Regular collections skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="aspect-[3/4] bg-black/5 animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
