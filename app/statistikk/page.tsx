import Link from 'next/link'
import { getCases, getCurrentSessionId, getCommittees } from '@/lib/stortinget'
import { statusLabel } from '@/lib/utils'

export const revalidate = 3600

const TYPE_LABEL: Record<string, string> = {
  lovsak: 'Lovsak',
  budsjett: 'Budsjett',
  alminneligsak: 'Alminnelig sak',
}

export default async function StatistikkPage() {
  try {
  const sessionId = await getCurrentSessionId()
  const [cases, committees] = await Promise.all([
    getCases(sessionId),
    getCommittees(sessionId),
  ])

  const total = cases.length

  // By status
  const byStatus: Record<string, number> = {}
  for (const c of cases) {
    byStatus[c.status] = (byStatus[c.status] || 0) + 1
  }
  const statusEntries = Object.entries(byStatus).sort((a, b) => b[1] - a[1])

  // By type
  const byType: Record<string, number> = {}
  for (const c of cases) {
    byType[c.type] = (byType[c.type] || 0) + 1
  }
  const typeEntries = Object.entries(byType).sort((a, b) => b[1] - a[1])

  // By committee — count all cases and active cases
  const committeeTotal: Record<string, number> = {}
  const committeeActive: Record<string, number> = {}
  for (const c of cases) {
    if (c.committee) {
      committeeTotal[c.committee] = (committeeTotal[c.committee] || 0) + 1
      if (c.status === 'til_behandling') {
        committeeActive[c.committee] = (committeeActive[c.committee] || 0) + 1
      }
    }
  }

  const activeCommittees = committees
    .filter(c => !c.name.toLowerCase().includes('korona') && !c.name.toLowerCase().includes('særskilt') && !c.name.toLowerCase().includes('fullmakt'))

  const committeeRanked = activeCommittees
    .map(c => ({
      name: c.name,
      total: committeeTotal[c.name] || 0,
      active: committeeActive[c.name] || 0,
    }))
    .sort((a, b) => b.total - a.total)

  const mostActiveCommittee = committeeRanked[0]

  // Treatment time: average days from created to behandlet (rough estimate from lastUpdated)
  const treated = cases.filter(c => c.status === 'behandlet')
  const treatedPct = total > 0 ? Math.round((treated.length / total) * 100) : 0
  const activePct = total > 0 ? Math.round(((byStatus['til_behandling'] || 0) / total) * 100) : 0

  // Status bar colors
  const STATUS_COLOR: Record<string, string> = {
    behandlet: '#22c55e',
    til_behandling: '#3b82f6',
    mottatt: '#9ca3af',
    varslet: '#eab308',
    trukket: '#ef4444',
    bortfalt: '#f97316',
  }

  const TYPE_COLOR: Record<string, string> = {
    lovsak: '#6366f1',
    budsjett: '#f59e0b',
    alminneligsak: '#64748b',
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <Link href="/" className="text-sm text-blue-600 hover:text-blue-800">← Hjem</Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Statistikk</h1>
        <p className="text-gray-500">Oversikt over Stortingets sesjon {sessionId}</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm text-center">
          <div className="text-3xl font-bold text-gray-900">{total}</div>
          <div className="text-xs text-gray-500 mt-1">saker totalt</div>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-green-700">{treated.length}</div>
          <div className="text-xs text-gray-500 mt-1">behandlet ({treatedPct}%)</div>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-blue-700">{byStatus['til_behandling'] || 0}</div>
          <div className="text-xs text-gray-500 mt-1">til behandling ({activePct}%)</div>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm text-center">
          <div className="text-3xl font-bold text-gray-700">{activeCommittees.length}</div>
          <div className="text-xs text-gray-500 mt-1">faste komiteer</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Cases by status */}
        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-gray-700 mb-5">Saker etter status</h2>
          <div className="space-y-3">
            {statusEntries.map(([status, count]) => {
              const pct = total > 0 ? Math.round((count / total) * 100) : 0
              return (
                <div key={status}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-700">{statusLabel(status)}</span>
                    <span className="text-xs text-gray-500">{count} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: STATUS_COLOR[status] || '#9ca3af' }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Cases by type */}
        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-gray-700 mb-5">Saker etter type</h2>
          <div className="space-y-3">
            {typeEntries.map(([type, count]) => {
              const pct = total > 0 ? Math.round((count / total) * 100) : 0
              return (
                <div key={type}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-700">{TYPE_LABEL[type] || type}</span>
                    <span className="text-xs text-gray-500">{count} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, backgroundColor: TYPE_COLOR[type] || '#9ca3af' }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Type donut-style bar */}
          <div className="mt-5 flex rounded-lg overflow-hidden h-4">
            {typeEntries.map(([type, count]) => {
              const pct = total > 0 ? (count / total) * 100 : 0
              if (pct < 1) return null
              return (
                <div
                  key={type}
                  className="h-full"
                  style={{ width: `${pct}%`, backgroundColor: TYPE_COLOR[type] || '#9ca3af' }}
                  title={`${TYPE_LABEL[type] || type}: ${count}`}
                />
              )
            })}
          </div>
        </div>
      </div>

      {/* Most active committee */}
      {mostActiveCommittee && (
        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm mb-8">
          <h2 className="text-sm font-bold text-gray-700 mb-1">Mest aktive komité</h2>
          <p className="text-2xl font-bold text-gray-900 mb-1">{mostActiveCommittee.name}</p>
          <p className="text-sm text-gray-500">
            {mostActiveCommittee.total} saker totalt
            {mostActiveCommittee.active > 0 && ` · ${mostActiveCommittee.active} til behandling`}
          </p>
        </div>
      )}

      {/* Committee breakdown */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
        <h2 className="text-sm font-bold text-gray-700 mb-5">Saker per komité</h2>
        <div className="space-y-3">
          {committeeRanked.filter(c => c.total > 0).map(c => {
            const pct = total > 0 ? Math.round((c.total / total) * 100) : 0
            const maxTotal = committeeRanked[0]?.total || 1
            const barPct = Math.round((c.total / maxTotal) * 100)
            return (
              <div key={c.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-700 truncate max-w-xs">{c.name}</span>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    {c.active > 0 && (
                      <span className="text-xs text-blue-600">{c.active} aktive</span>
                    )}
                    <span className="text-xs text-gray-500">{c.total}</span>
                  </div>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-400 rounded-full"
                    style={{ width: `${barPct}%` }}
                  />
                </div>
              </div>
            )
          })}
          {committeeRanked.filter(c => c.total === 0).length > 0 && (
            <p className="text-xs text-gray-400 pt-2">
              {committeeRanked.filter(c => c.total === 0).length} komiteer uten registrerte saker
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 text-xs text-gray-400 text-center">
        Data fra Stortingets åpne datatjeneste · Sesjon {sessionId}
      </div>
    </div>
  )
  } catch {
    return <div className="text-center py-16 text-gray-400">Kunne ikke laste statistikk. Prøv igjen senere.</div>
  }
}
