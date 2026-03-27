export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="mb-8">
        <div className="h-8 bg-gray-100 rounded w-24 mb-2" />
        <div className="h-4 bg-gray-50 rounded w-48" />
      </div>
      <div className="flex flex-wrap gap-3 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-9 bg-gray-100 rounded-lg w-32" />
        ))}
      </div>
      <div className="space-y-2">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-50 rounded-xl border border-gray-100" />
        ))}
      </div>
    </div>
  )
}
