export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Header skeleton */}
      <div className="bg-black/[0.02] py-12 lg:py-16">
        <div className="container-kiren">
          <div className="h-5 w-32 bg-black/10 animate-pulse mb-4" />
          <div className="flex items-center justify-between">
            <div>
              <div className="h-10 w-48 bg-black/10 animate-pulse" />
              <div className="h-5 w-32 bg-black/10 animate-pulse mt-2" />
            </div>
            <div className="h-8 w-24 bg-black/10 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="container-kiren py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Products skeleton */}
          <div className="lg:col-span-2">
            <div className="h-6 w-24 bg-black/10 animate-pulse mb-6" />
            <div className="border border-black/10">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 p-4 border-b border-black/10 last:border-b-0">
                  <div className="w-20 h-24 bg-black/5 animate-pulse" />
                  <div className="flex-1">
                    <div className="h-5 w-full bg-black/10 animate-pulse mb-2" />
                    <div className="h-4 w-24 bg-black/5 animate-pulse" />
                  </div>
                  <div className="h-5 w-24 bg-black/10 animate-pulse" />
                </div>
              ))}
            </div>
          </div>

          {/* Summary skeleton */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-black/[0.02] p-6">
              <div className="h-6 w-20 bg-black/10 animate-pulse mb-4" />
              <div className="space-y-3">
                <div className="flex justify-between">
                  <div className="h-4 w-16 bg-black/10 animate-pulse" />
                  <div className="h-4 w-24 bg-black/10 animate-pulse" />
                </div>
                <div className="flex justify-between">
                  <div className="h-4 w-12 bg-black/10 animate-pulse" />
                  <div className="h-4 w-16 bg-black/10 animate-pulse" />
                </div>
              </div>
            </div>

            <div className="border border-black/10 p-6">
              <div className="h-6 w-16 bg-black/10 animate-pulse mb-4" />
              <div className="space-y-3">
                <div className="h-4 w-full bg-black/5 animate-pulse" />
                <div className="h-4 w-3/4 bg-black/5 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
