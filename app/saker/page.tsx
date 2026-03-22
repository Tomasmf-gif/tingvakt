import Link from 'next/link'
import { getCases, getCurrentSessionId, getCommittees } from '@/lib/stortinget'
import { formatShortDate, statusLabel } from '@/lib/utils'
import { SakerFilters } from './SakerFilters'

export const revalidate = 900

export default async function SakerPage({
  searchParams,
}: {
  searchParams: { status?: string; type?: string; committee?: string; q?: string; page?: string }
}) {
  const sessionId = await getCurrentSessionId()
  const [cases, committees] = await Promise.all([
    getCases(sessionId),
    getCommittees(sessionId),
  ])

  const statusFilter = searchParams.status || ''
  const typeFilter = searchParams.type || ''
  const committeeFilter = searchParams.committee || ''
  const query = (searchParams.q || '').toLowerCase()
  const page = parseInt(searchParams.page || '1', 10)
  const PER_PAGE = 30

  let filtered = cases
  if (statusFilter) filtered = filtered.filter(c => c.status === statusFilter)
  if (typeFilter) filtered = filtered.filter(c => c.type === typeFilter)
  if (committeeFilter) filtered = filtered.filter(c => c.committee === committeeFilter)
  if (query) filtered = filtered.filter(c =>
    c.title.toLowerCase().includes(query) ||
    c.shortTitle.toLowerCase().includes(query) ||
    c.reference.toLowerCase().includes(query)
  )

  filtered = filtered.sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime())

  const total = filtered.length
  const totalPages = Math.ceil(total / PER_PAGE)
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const STATUS_BADGE: Record<string, string> = {
    behandlet: 'bg-green-100 text-green-800',
    til_behandling: 'bg-blue-100 text-blue-800',
    mottatt: 'bg-gray-100 text-gray-700',
    varslet: 'bg-yellow-100 text-yellow-800',
    trukket: 'bg-red-100 text-red-700',
    bortfalt: 'bg-red-100 text-red-700',
  }

  const TYPE_LABEL: Record<string, string> = {
    lovsak: 'Lovsak',
    budsjett: 'Budsjett',
    alminneligsak: 'Alminnelig sak',
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Saker</h1>
        <p className="text-gray-500">Sesjon {sessionId} · {cases.length} saker totalt</p>
      </div>

      <SakerFilters
        committees={committees.map(c => c.name)}
        currentStatus={statusFilter}
        currentType={typeFilter}
        currentCommittee={committeeFilter}
        currentQuery={query}
      />

      <p className="text-sm text-gray-400 mb-4 mt-2">{total} saker</p>

      <div className="space-y-2">
        {paginated.map(c => (
          <Link
            key={c.id}
            href={`/saker/${c.id}`}
            className="block bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-sm transition"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center flex-wrap gap-2 mb-1">
                  <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded ${STATUS_BADGE[c.status] || 'bg-gray-100 text-gray-600'}`}>
                    {statusLabel(c.status)}
                  </span>
                  <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded">
                    {TYPE_LABEL[c.type] || c.type}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatShortDate(c.lastUpdated)}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 leading-snug truncate">
                  {c.shortTitle || c.title}
                </h3>
                <div className="flex items-center gap-3 mt-1">
                  {c.committee && (
                    <span className="text-xs text-gray-500">{c.committee}</span>
                  )}
                  {c.reference && (
                    <span className="text-xs text-gray-400">{c.reference}</span>
                  )}
                </div>
              </div>
              <span className="text-gray-300 flex-shrink-0">→</span>
            </div>
          </Link>
        ))}
      </div>

      {paginated.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">Ingen saker funnet</p>
          <p className="text-sm mt-1">Prøv å endre filtrene</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Side {page} av {totalPages}
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={{
                  pathname: '/saker',
                  query: { ...searchParams, page: page - 1 },
                }}
                className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:border-gray-300 transition"
              >
                ← Forrige
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={{
                  pathname: '/saker',
                  query: { ...searchParams, page: page + 1 },
                }}
                className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:border-gray-300 transition"
              >
                Neste →
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
