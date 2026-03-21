export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header skeleton */}
      <div className="border-b border-black/10">
        <div className="container-kiren py-6">
          <div className="flex items-center justify-between">
            <div className="h-7 w-20 bg-black/10 animate-pulse" />
            <div className="h-5 w-32 bg-black/10 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Progress skeleton */}
      <div className="border-b border-black/10">
        <div className="container-kiren py-4">
          <div className="flex items-center justify-center gap-4">
            <div className="h-5 w-16 bg-black/10 animate-pulse" />
            <div className="h-5 w-4 bg-black/5 animate-pulse" />
            <div className="h-5 w-12 bg-black/10 animate-pulse" />
            <div className="h-5 w-4 bg-black/5 animate-pulse" />
            <div className="h-5 w-20 bg-black/10 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="container-kiren py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <div className="h-8 w-48 bg-black/10 animate-pulse mb-8" />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="h-4 w-16 bg-black/10 animate-pulse mb-2" />
                <div className="h-12 w-full bg-black/5 animate-pulse" />
              </div>
              <div>
                <div className="h-4 w-20 bg-black/10 animate-pulse mb-2" />
                <div className="h-12 w-full bg-black/5 animate-pulse" />
              </div>
            </div>

            <div>
              <div className="h-4 w-20 bg-black/10 animate-pulse mb-2" />
              <div className="h-12 w-full bg-black/5 animate-pulse" />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <div className="h-4 w-12 bg-black/10 animate-pulse mb-2" />
                <div className="h-12 w-full bg-black/5 animate-pulse" />
              </div>
              <div>
                <div className="h-4 w-16 bg-black/10 animate-pulse mb-2" />
                <div className="h-12 w-full bg-black/5 animate-pulse" />
              </div>
            </div>

            <div className="h-14 w-full bg-black/20 animate-pulse mt-8" />
          </div>

          {/* Summary skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-black/[0.02] p-6 space-y-4">
              <div className="h-6 w-40 bg-black/10 animate-pulse mb-6" />
              
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-14 h-18 bg-black/10 animate-pulse" />
                  <div className="flex-1">
                    <div className="h-4 w-full bg-black/10 animate-pulse mb-2" />
                    <div className="h-4 w-20 bg-black/5 animate-pulse" />
                  </div>
                </div>
              ))}

              <div className="border-t border-black/10 pt-4 mt-4">
                <div className="flex justify-between mb-3">
                  <div className="h-4 w-16 bg-black/10 animate-pulse" />
                  <div className="h-4 w-24 bg-black/10 animate-pulse" />
                </div>
                <div className="flex justify-between">
                  <div className="h-6 w-12 bg-black/10 animate-pulse" />
                  <div className="h-6 w-28 bg-black/20 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
