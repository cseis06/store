export default function CollectionsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-32 bg-neutral-200 rounded" />
          <div className="h-4 w-24 bg-neutral-100 rounded mt-2" />
        </div>
        <div className="h-10 w-36 bg-neutral-200 rounded-lg" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
            <div className="aspect-video bg-neutral-100" />
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-neutral-200 rounded" />
                  <div className="h-3 w-20 bg-neutral-100 rounded" />
                </div>
                <div className="h-6 w-14 bg-neutral-100 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
