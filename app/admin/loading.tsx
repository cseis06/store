export default function AdminLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header */}
      <div>
        <div className="h-8 w-48 bg-neutral-200 rounded" />
        <div className="h-4 w-32 bg-neutral-100 rounded mt-2" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-neutral-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-neutral-100 rounded-lg" />
              <div className="h-3 w-20 bg-neutral-100 rounded" />
            </div>
            <div className="h-8 w-24 bg-neutral-200 rounded" />
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-neutral-200">
            <div className="w-10 h-10 bg-neutral-200 rounded-lg" />
            <div className="h-4 w-24 bg-neutral-100 rounded" />
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200">
          <div className="h-6 w-36 bg-neutral-200 rounded" />
        </div>
        <div className="divide-y divide-neutral-100">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="px-6 py-4 flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 w-32 bg-neutral-200 rounded" />
                <div className="h-3 w-24 bg-neutral-100 rounded" />
              </div>
              <div className="flex items-center gap-4">
                <div className="h-6 w-20 bg-neutral-100 rounded" />
                <div className="h-5 w-24 bg-neutral-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
