export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Banner skeleton */}
      <div className="relative h-[50vh] lg:h-[70vh] bg-black/5 animate-pulse">
        <div className="absolute inset-x-0 bottom-0">
          <div className="container-kiren pb-12 lg:pb-16">
            <div className="max-w-2xl">
              <div className="h-4 w-32 bg-white/20 mb-6" />
              <div className="h-8 w-40 bg-white/20 mb-4" />
              <div className="h-16 w-80 bg-white/20 mb-4" />
              <div className="h-6 w-64 bg-white/20" />
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar skeleton */}
      <div className="container-kiren py-12 lg:py-16">
        <div className="flex justify-between items-center mb-8 pb-6 border-b border-black/10">
          <div className="h-5 w-24 bg-black/10 animate-pulse" />
          <div className="h-10 w-40 bg-black/10 animate-pulse" />
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-[3/4] bg-black/5 animate-pulse" />
              <div className="h-4 w-3/4 bg-black/10 animate-pulse" />
              <div className="h-4 w-1/2 bg-black/10 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
