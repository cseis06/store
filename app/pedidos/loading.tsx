export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Header skeleton */}
      <div className="bg-black/[0.02] py-12 lg:py-16">
        <div className="container-kiren">
          <div className="h-10 w-48 bg-black/10 animate-pulse" />
          <div className="h-5 w-24 bg-black/10 animate-pulse mt-2" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="container-kiren py-12 lg:py-16">
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-black/10 overflow-hidden">
              {/* Header */}
              <div className="bg-black/[0.02] px-6 py-4 flex items-center justify-between">
                <div className="flex gap-6">
                  <div>
                    <div className="h-3 w-12 bg-black/10 animate-pulse mb-1" />
                    <div className="h-5 w-28 bg-black/20 animate-pulse" />
                  </div>
                  <div>
                    <div className="h-3 w-10 bg-black/10 animate-pulse mb-1" />
                    <div className="h-5 w-24 bg-black/10 animate-pulse" />
                  </div>
                  <div>
                    <div className="h-3 w-10 bg-black/10 animate-pulse mb-1" />
                    <div className="h-5 w-20 bg-black/10 animate-pulse" />
                  </div>
                </div>
                <div className="h-6 w-24 bg-black/10 animate-pulse" />
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex gap-4 mb-6">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="w-16 h-20 bg-black/5 animate-pulse" />
                  ))}
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-black/10">
                  <div className="h-4 w-48 bg-black/10 animate-pulse" />
                  <div className="h-4 w-24 bg-black/10 animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
