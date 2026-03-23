export default function Loading() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="h-8 bg-gray-100 rounded w-48" />
      {[...Array(10)].map((_, i) => (
        <div key={i} className="h-20 bg-gray-50 rounded-lg border border-gray-100" />
      ))}
    </div>
  )
}
