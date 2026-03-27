export default function Loading() {
  return (
    <div className="max-w-4xl animate-pulse">
      <div className="h-4 bg-gray-100 rounded w-16 mb-8" />
      <div className="h-8 bg-gray-100 rounded w-48 mb-2" />
      <div className="h-4 bg-gray-50 rounded w-64 mb-8" />

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-50 rounded-xl border border-gray-100" />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="h-48 bg-gray-50 rounded-xl border border-gray-100" />
        <div className="h-48 bg-gray-50 rounded-xl border border-gray-100" />
      </div>

      <div className="h-32 bg-gray-50 rounded-xl border border-gray-100 mb-8" />
      <div className="h-64 bg-gray-50 rounded-xl border border-gray-100" />
    </div>
  )
}
