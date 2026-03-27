export default function OrdersLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div>
        <div className="h-8 w-24 bg-neutral-200 rounded" />
        <div className="h-4 w-32 bg-neutral-100 rounded mt-2" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="px-6 py-3 bg-neutral-50 border-b border-neutral-200">
          <div className="flex gap-6">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-3 w-16 bg-neutral-200 rounded" />
            ))}
          </div>
        </div>
        <div className="divide-y divide-neutral-100">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="px-6 py-4 flex items-center gap-6">
              <div className="h-4 w-28 bg-neutral-200 rounded" />
              <div className="space-y-1">
                <div className="h-4 w-32 bg-neutral-200 rounded" />
                <div className="h-3 w-40 bg-neutral-100 rounded" />
              </div>
              <div className="h-6 w-20 bg-neutral-100 rounded" />
              <div className="h-6 w-16 bg-neutral-100 rounded" />
              <div className="h-4 w-24 bg-neutral-200 rounded" />
              <div className="h-4 w-28 bg-neutral-100 rounded" />
              <div className="h-8 w-8 bg-neutral-100 rounded ml-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
