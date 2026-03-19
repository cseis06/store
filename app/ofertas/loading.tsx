export default function OfertasLoading() {
  return (
    <div className="min-h-screen">
      {/* Banner skeleton */}
      <div className="bg-black py-16 lg:py-24">
        <div className="container-kiren">
          <div className="max-w-2xl space-y-4">
            <div className="h-6 w-32 bg-white/10 animate-pulse" />
            <div className="h-12 lg:h-16 w-72 bg-white/10 animate-pulse" />
            <div className="space-y-2">
              <div className="h-5 w-full max-w-lg bg-white/5 animate-pulse" />
              <div className="h-5 w-3/4 max-w-lg bg-white/5 animate-pulse" />
            </div>
            <div className="flex gap-6 pt-4">
              <div className="h-5 w-36 bg-white/5 animate-pulse" />
              <div className="h-5 w-28 bg-white/5 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Contenido skeleton */}
      <div className="container-kiren py-12 lg:py-16">
        {/* Toolbar */}
        <div className="flex justify-between items-center mb-8 pb-6 border-b border-black/10">
          <div className="h-5 w-32 bg-black/5 animate-pulse rounded" />
          <div className="h-10 w-48 bg-black/5 animate-pulse" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[3/4] bg-black/5 mb-4" />
              <div className="h-4 bg-black/5 rounded w-3/4 mb-2" />
              <div className="h-4 bg-black/5 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter skeleton */}
      <div className="bg-black/[0.02] py-16 lg:py-20">
        <div className="container-kiren">
          <div className="max-w-xl mx-auto text-center space-y-4">
            <div className="h-8 w-64 bg-black/5 animate-pulse mx-auto rounded" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-black/5 animate-pulse rounded" />
              <div className="h-4 w-3/4 bg-black/5 animate-pulse mx-auto rounded" />
            </div>
            <div className="flex gap-3 pt-4">
              <div className="flex-1 h-12 bg-black/5 animate-pulse" />
              <div className="h-12 w-32 bg-black/10 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}