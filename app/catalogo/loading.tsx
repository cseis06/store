export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Header skeleton */}
      <div className="bg-black/[0.02] py-16 lg:py-24">
        <div className="container-kiren text-center">
          <div className="h-12 w-48 bg-black/10 animate-pulse mx-auto mb-4" />
          <div className="h-6 w-80 bg-black/10 animate-pulse mx-auto" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="container-kiren py-12 lg:py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Filters skeleton (desktop) */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="space-y-8">
              <div className="h-6 w-20 bg-black/10 animate-pulse" />
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-5 w-32 bg-black/5 animate-pulse" />
                ))}
              </div>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-5 w-28 bg-black/5 animate-pulse" />
                ))}
              </div>
            </div>
          </aside>

          {/* Grid skeleton */}
          <div className="flex-1">
            <div className="hidden lg:block h-5 w-24 bg-black/10 animate-pulse mb-8" />
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-[3/4] bg-black/5 animate-pulse" />
                  <div className="h-4 w-3/4 bg-black/10 animate-pulse" />
                  <div className="h-4 w-1/2 bg-black/10 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
