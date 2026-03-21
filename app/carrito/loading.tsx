export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Header skeleton */}
      <div className="bg-black/[0.02] py-12 lg:py-16">
        <div className="container-kiren">
          <div className="h-10 w-32 bg-black/10 animate-pulse" />
          <div className="h-5 w-24 bg-black/10 animate-pulse mt-2" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="container-kiren py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Items skeleton */}
          <div className="lg:col-span-2 space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 py-6 border-b border-black/10">
                <div className="w-24 h-32 lg:w-28 lg:h-36 bg-black/5 animate-pulse" />
                <div className="flex-1 space-y-3">
                  <div className="h-5 w-3/4 bg-black/10 animate-pulse" />
                  <div className="h-4 w-1/4 bg-black/5 animate-pulse" />
                  <div className="h-10 w-32 bg-black/5 animate-pulse mt-4" />
                </div>
              </div>
            ))}
          </div>

          {/* Summary skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-black/[0.02] p-6 lg:p-8 space-y-4">
              <div className="h-6 w-40 bg-black/10 animate-pulse" />
              <div className="space-y-3 py-4">
                <div className="flex justify-between">
                  <div className="h-4 w-16 bg-black/5 animate-pulse" />
                  <div className="h-4 w-24 bg-black/5 animate-pulse" />
                </div>
                <div className="flex justify-between">
                  <div className="h-4 w-12 bg-black/5 animate-pulse" />
                  <div className="h-4 w-32 bg-black/5 animate-pulse" />
                </div>
              </div>
              <div className="border-t border-black/10 pt-4">
                <div className="flex justify-between">
                  <div className="h-6 w-12 bg-black/10 animate-pulse" />
                  <div className="h-6 w-28 bg-black/10 animate-pulse" />
                </div>
              </div>
              <div className="h-14 w-full bg-black/20 animate-pulse mt-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
