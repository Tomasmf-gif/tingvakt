export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="mb-8">
        <div className="h-8 bg-gray-100 rounded w-32 mb-2" />
        <div className="h-4 bg-gray-50 rounded w-56" />
      </div>
      {[...Array(3)].map((_, g) => (
        <div key={g} className="mb-8">
          <div className="h-3 bg-gray-100 rounded w-32 mb-3" />
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-50 rounded-xl border border-gray-100" />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
