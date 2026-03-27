export default function Loading() {
  return (
    <div className="max-w-4xl animate-pulse">
      <div className="h-4 bg-gray-100 rounded w-16 mb-8" />
      <div className="h-8 bg-gray-100 rounded w-56 mb-2" />
      <div className="h-4 bg-gray-50 rounded w-80 mb-8" />

      {/* Selectors */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="h-12 bg-gray-50 rounded-xl border border-gray-100" />
        <div className="h-12 bg-gray-50 rounded-xl border border-gray-100" />
      </div>

      {/* Headers */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="h-28 bg-gray-50 rounded-xl border border-gray-100" />
        <div className="h-28 bg-gray-50 rounded-xl border border-gray-100" />
      </div>

      {/* Table */}
      <div className="h-64 bg-gray-50 rounded-xl border border-gray-100 mb-6" />

      {/* Descriptions */}
      <div className="grid grid-cols-2 gap-4">
        <div className="h-24 bg-gray-50 rounded-xl border border-gray-100" />
        <div className="h-24 bg-gray-50 rounded-xl border border-gray-100" />
      </div>
    </div>
  )
}
