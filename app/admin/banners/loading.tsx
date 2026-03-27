export default function BannersLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-24 bg-neutral-200 rounded" />
          <div className="h-4 w-32 bg-neutral-100 rounded mt-2" />
        </div>
        <div className="h-10 w-32 bg-neutral-200 rounded-lg" />
      </div>

      {/* Hero Section */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="h-6 w-48 bg-neutral-200 rounded mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="aspect-video bg-neutral-100 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Promo Section */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="h-6 w-48 bg-neutral-200 rounded mb-4" />
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-4 p-4 bg-neutral-50 rounded-lg">
              <div className="w-40 h-20 bg-neutral-200 rounded" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 bg-neutral-200 rounded" />
                <div className="h-3 w-48 bg-neutral-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
