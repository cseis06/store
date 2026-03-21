export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md">
        {/* Logo skeleton */}
        <div className="text-center mb-10">
          <div className="h-8 w-24 bg-black/10 animate-pulse mx-auto mb-8" />
          <div className="h-8 w-48 bg-black/10 animate-pulse mx-auto mb-2" />
          <div className="h-5 w-64 bg-black/5 animate-pulse mx-auto" />
        </div>

        {/* Form skeleton */}
        <div className="space-y-6">
          <div>
            <div className="h-4 w-16 bg-black/10 animate-pulse mb-2" />
            <div className="h-12 w-full bg-black/5 animate-pulse" />
          </div>
          <div>
            <div className="h-4 w-24 bg-black/10 animate-pulse mb-2" />
            <div className="h-12 w-full bg-black/5 animate-pulse" />
          </div>
          <div className="h-14 w-full bg-black/20 animate-pulse" />
        </div>
      </div>
    </div>
  )
}
