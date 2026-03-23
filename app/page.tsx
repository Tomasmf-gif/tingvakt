import Link from 'next/link'
import { getCases, getParties, getCurrentSessionId } from '@/lib/stortinget'
import { formatShortDate, statusLabel } from '@/lib/utils'

export const revalidate = 900 // 15 min cache

const PARTY_SHORT: Record<string, string> = {
  'Arbeiderpartiet': 'Ap',
  'Høyre': 'H',
  'Fremskrittspartiet': 'FrP',
  'Senterpartiet': 'Sp',
  'Sosialistisk Venstreparti': 'SV',
  'Rødt': 'R',
  'Venstre': 'V',
  'Kristelig Folkeparti': 'KrF',
  'Miljøpartiet De Grønne': 'MDG',
}

export default async function HomePage() {
  try {
  const sessionId = await getCurrentSessionId()
  const [cases, parties] = await Promise.all([
    getCases(sessionId),
    getParties(sessionId),
  ])

  const allActiveCases = cases
    .filter(c => c.status === 'til_behandling')
    .sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime())
  const activeCases = allActiveCases.slice(0, 12)
  const moreActiveCases = allActiveCases.length - activeCases.length

  const treatedCases = cases
    .filter(c => c.status === 'behandlet')
    .sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime())

  // Fall back to most recently updated cases if no treated ones found
  const allRecentCases = treatedCases.length > 0 ? treatedCases : [...cases].sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime())
  const recentCases = allRecentCases.slice(0, 12)
  const moreRecentCases = allRecentCases.length - recentCases.length

  const sortedParties = [...parties].sort((a, b) => b.seats - a.seats)
  const TOTAL_SEATS = 169
  const COALITION = ['Arbeiderpartiet', 'Senterpartiet']
  const coalitionSeats = parties
    .filter(p => COALITION.includes(p.name))
    .reduce((sum, p) => sum + (p.seats || 0), 0)
  const coalitionPct = (coalitionSeats / TOTAL_SEATS) * 100

  const stats = {
    total: cases.length,
    active: cases.filter(c => c.status === 'til_behandling').length,
    treated: cases.filter(c => c.status === 'behandlet').length,
    received: cases.filter(c => c.status === 'mottatt').length,
    announced: cases.filter(c => c.status === 'varslet').length,
  }

  const todayNorwegian = new Date().toLocaleDateString('nb-NO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div>
      {/* Hero */}
      <div className="bg-gray-50 -mx-4 px-4 py-8 mb-8 rounded-xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Følg med på hva Stortinget vedtar
        </h1>
        <p className="text-lg text-gray-500 mb-1">
          {cases.length} saker i sesjon {sessionId}
        </p>
        <p className="text-sm text-gray-400 capitalize">{todayNorwegian}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-10">
          {/* Recent decisions */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Siste vedtak
              </h2>
              <Link href="/saker?status=behandlet" className="text-xs text-blue-600 hover:text-blue-800">
                Se alle →
              </Link>
            </div>
            <div className="space-y-2">
              {recentCases.map(c => (
                <Link
                  key={c.id}
                  href={`/saker/${c.id}`}
                  className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="inline-block px-2 py-0.5 text-xs font-bold rounded bg-green-100 text-green-800">
                          Vedtatt
                        </span>
                        <span className="text-xs text-gray-400">
                          {formatShortDate(c.lastUpdated)}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 leading-snug truncate">
                        {c.shortTitle || c.title}
                      </h3>
                      {c.committee && (
                        <p className="text-sm text-gray-500 mt-0.5">{c.committee}</p>
                      )}
                    </div>
                    <span className="text-gray-300 flex-shrink-0">→</span>
                  </div>
                </Link>
              ))}
              {recentCases.length === 0 && (
                <p className="text-gray-400 text-sm py-4">Ingen vedtak funnet for denne sesjonen ennå.</p>
              )}
              {moreRecentCases > 0 && (
                <Link href="/saker?status=behandlet" className="block text-center text-xs text-blue-500 hover:text-blue-700 py-2">
                  og {moreRecentCases} til →
                </Link>
              )}
            </div>
          </section>

          {/* Active cases */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Til behandling
              </h2>
              <Link href="/saker?status=til_behandling" className="text-xs text-blue-600 hover:text-blue-800">
                Se alle →
              </Link>
            </div>
            <div className="space-y-2">
              {activeCases.map(c => (
                <Link
                  key={c.id}
                  href={`/saker/${c.id}`}
                  className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="inline-block px-2 py-0.5 text-xs font-bold rounded bg-blue-100 text-blue-800">
                          Til behandling
                        </span>
                        {c.reference && (
                          <span className="text-xs text-gray-400">{c.reference}</span>
                        )}
                        <span className="text-xs text-gray-400">
                          {formatShortDate(c.lastUpdated)}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 leading-snug truncate">
                        {c.shortTitle || c.title}
                      </h3>
                      {c.committee && (
                        <p className="text-sm text-gray-500 mt-0.5">{c.committee}</p>
                      )}
                    </div>
                    <span className="text-gray-300 flex-shrink-0">→</span>
                  </div>
                </Link>
              ))}
              {activeCases.length === 0 && (
                <p className="text-gray-400 text-sm py-4">Ingen saker til behandling akkurat nå.</p>
              )}
              {moreActiveCases > 0 && (
                <Link href="/saker?status=til_behandling" className="block text-center text-xs text-blue-500 hover:text-blue-700 py-2">
                  og {moreActiveCases} til →
                </Link>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Session stats */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              Sesjon {sessionId}
            </h2>
            <div className="text-3xl font-extrabold text-gray-900 mb-1">{stats.total}</div>
            <div className="text-sm text-gray-500 mb-4">saker totalt</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Til behandling</span>
                <span className="font-semibold text-blue-700">{stats.active}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Behandlet</span>
                <span className="font-semibold text-green-700">{stats.treated}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Mottatt</span>
                <span className="font-semibold text-gray-700">{stats.received}</span>
              </div>
              {stats.announced > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Varslet</span>
                  <span className="font-semibold text-yellow-700">{stats.announced}</span>
                </div>
              )}
            </div>
          </div>

          {/* Party seats */}
          {sortedParties.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Stortinget</h2>
                <Link href="/partier" className="text-xs text-blue-600 hover:text-blue-800">Alle partier →</Link>
              </div>

              {/* Combined seat bar with coalition divider */}
              <div className="relative flex rounded-md overflow-hidden h-3 mb-1">
                {sortedParties.map(p => {
                  const seats = p.seats || 0
                  const pct = (seats / TOTAL_SEATS) * 100
                  if (pct < 1) return null
                  return (
                    <div
                      key={p.id}
                      className="h-full"
                      style={{ width: `${pct}%`, backgroundColor: p.color }}
                      title={`${p.name}: ${seats}`}
                    />
                  )
                })}
                {/* Coalition/opposition divider */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-white/80"
                  style={{ left: `${coalitionPct}%` }}
                  title={`Regjering: ${coalitionSeats} mandater`}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mb-3">
                <span>Regjering ({coalitionSeats})</span>
                <span>Opposisjon ({TOTAL_SEATS - coalitionSeats})</span>
              </div>

              <div className="space-y-2">
                {sortedParties.slice(0, 9).map(p => {
                  const seats = p.seats || 0
                  const pct = (seats / TOTAL_SEATS) * 100
                  return (
                    <div key={p.id} className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                      <span className="text-xs text-gray-700 flex-1">{PARTY_SHORT[p.name] || p.name}</span>
                      <span className="text-xs font-semibold text-gray-700 w-6 text-right">{seats}</span>
                      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: p.color }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Quick links */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Snarveier</h2>
            <div className="space-y-2 text-sm">
              <Link href="/voteringer" className="flex items-center justify-between text-gray-700 hover:text-blue-600 transition">
                <span>Siste voteringer</span>
                <span className="text-gray-300">→</span>
              </Link>
              <Link href="/representanter" className="flex items-center justify-between text-gray-700 hover:text-blue-600 transition">
                <span>Finn din representant</span>
                <span className="text-gray-300">→</span>
              </Link>
              <Link href="/komiteer" className="flex items-center justify-between text-gray-700 hover:text-blue-600 transition">
                <span>Komiteer</span>
                <span className="text-gray-300">→</span>
              </Link>
              <Link href="/sok" className="flex items-center justify-between text-gray-700 hover:text-blue-600 transition">
                <span>Søk i saker</span>
                <span className="text-gray-300">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
  } catch {
    return <div className="text-center py-16 text-gray-400">Kunne ikke laste data. Prøv igjen senere.</div>
  }
}
