export default function Loading() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="h-8 bg-gray-100 rounded w-48" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-50 rounded-xl border border-gray-100" />
        ))}
      </div>
    </div>
  )
}
