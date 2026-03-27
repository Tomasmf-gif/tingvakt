import Link from 'next/link'
import { getCases, getParties, getCurrentSessionId } from '@/lib/stortinget'
import { relativeTime, statusLabel, statusBadgeClass } from '@/lib/utils'

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

  // "Siste aktivitet" — last 10 cases regardless of date
  const sisteAktivitet = [...cases]
    .sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime())
    .slice(0, 10)

  const allActiveCases = cases
    .filter(c => c.status === 'til_behandling')
    .sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime())
  const activeCases = allActiveCases.slice(0, 10)
  const moreActiveCases = allActiveCases.length - activeCases.length

  const treatedCases = cases
    .filter(c => c.status === 'behandlet')
    .sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime())

  const allRecentCases = treatedCases.length > 0 ? treatedCases : [...cases].sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime())
  const recentCases = allRecentCases.slice(0, 10)
  const moreRecentCases = allRecentCases.length - recentCases.length

  const sortedParties = [...parties].sort((a, b) => b.seats - a.seats)
  const TOTAL_SEATS = 169
  const COALITION = ['Arbeiderpartiet']
  const coalitionSeats = parties
    .filter(p => COALITION.includes(p.name))
    .reduce((sum, p) => sum + (p.seats || 0), 0)
  const coalitionPct = (coalitionSeats / TOTAL_SEATS) * 100

  const stats = {
    total: cases.length,
    active: cases.filter(c => c.status === 'til_behandling').length,
    treated: cases.filter(c => c.status === 'behandlet').length,
    received: cases.filter(c => c.status === 'mottatt').length,
  }

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-50 to-white -mx-4 px-4 md:-mx-8 md:px-8 py-10 mb-8 border-b border-gray-100">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">
            Hold øye med Stortinget
          </h1>
          <p className="text-lg text-gray-500 mb-6">
            {cases.length} saker i sesjon {sessionId} — følg norsk politikk i sanntid.
          </p>
          {/* Search bar */}
          <form action="/sok" method="get" className="flex gap-2 max-w-lg">
            <input
              type="search"
              name="q"
              placeholder="Søk i saker, emner, komiteer..."
              className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 bg-white shadow-sm"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition shadow-sm flex-shrink-0"
            >
              Søk
            </button>
          </form>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-xs text-gray-500 mt-0.5">saker totalt</div>
        </div>
        <div className="bg-white border border-blue-100 rounded-xl p-4 shadow-sm">
          <div className="text-2xl font-bold text-blue-700">{stats.active}</div>
          <div className="text-xs text-gray-500 mt-0.5">til behandling</div>
        </div>
        <div className="bg-white border border-green-100 rounded-xl p-4 shadow-sm">
          <div className="text-2xl font-bold text-green-700">{stats.treated}</div>
          <div className="text-xs text-gray-500 mt-0.5">behandlet</div>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
          <div className="text-2xl font-bold text-gray-700">{stats.received}</div>
          <div className="text-xs text-gray-500 mt-0.5">mottatt</div>
        </div>
      </div>

      {/* Siste aktivitet — last 10 cases with relative time */}
      <section className="mb-10">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Siste aktivitet</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
          {sisteAktivitet.map(c => (
            <Link href={`/saker/${c.id}`} key={c.id}
              className="flex-shrink-0 w-52 bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md hover:border-gray-200 transition shadow-sm">
              <div className={`inline-block px-2 py-0.5 text-xs font-semibold rounded mb-2 ${statusBadgeClass(c.status)}`}>
                {statusLabel(c.status)}
              </div>
              <p className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug mb-1.5">{c.shortTitle || c.title}</p>
              <p className="text-xs text-gray-400">{relativeTime(c.lastUpdated)}</p>
            </Link>
          ))}
        </div>
      </section>

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
                  className="block bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md hover:border-gray-200 transition shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded ${statusBadgeClass(c.status)}`}>
                          {statusLabel(c.status)}
                        </span>
                        <span className="text-xs text-gray-400">
                          {relativeTime(c.lastUpdated)}
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
                  className="block bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md hover:border-gray-200 transition shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded bg-blue-50 text-blue-700 border border-blue-200">
                          Til behandling
                        </span>
                        {c.reference && (
                          <span className="text-xs text-gray-400">{c.reference}</span>
                        )}
                        <span className="text-xs text-gray-400">
                          {relativeTime(c.lastUpdated)}
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
          {/* Party seats */}
          {sortedParties.length > 0 && (
            <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Stortinget</h2>
                <Link href="/partier" className="text-xs text-blue-600 hover:text-blue-800">Alle partier →</Link>
              </div>

              {/* Combined seat bar */}
              <div className="flex rounded-md overflow-hidden h-3 mb-1">
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
              </div>
              <div className="flex justify-between text-xs text-gray-400 mb-4">
                <span>Regjering ({coalitionSeats})</span>
                <span>Opposisjon ({TOTAL_SEATS - coalitionSeats})</span>
              </div>

              <div className="space-y-2">
                {sortedParties.slice(0, 9).map(p => {
                  const seats = p.seats || 0
                  const pct = (seats / TOTAL_SEATS) * 100
                  return (
                    <Link key={p.id} href={`/partier/${p.id}`} className="flex items-center gap-2 hover:bg-gray-50 rounded px-1 py-0.5 transition -mx-1">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                      <span className="text-xs text-gray-700 flex-1">{PARTY_SHORT[p.name] || p.name}</span>
                      <span className="text-xs font-semibold text-gray-700 w-6 text-right">{seats}</span>
                      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: p.color }} />
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {/* Quick links */}
          <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Snarveier</h2>
            <div className="space-y-2 text-sm">
              {[
                { href: '/voteringer', label: 'Siste voteringer' },
                { href: '/representanter', label: 'Finn din representant' },
                { href: '/komiteer', label: 'Komiteer' },
                { href: '/statistikk', label: 'Statistikk' },
                { href: '/sammenlign', label: 'Sammenlign partier' },
                { href: '/sok', label: 'Søk i saker' },
              ].map(({ href, label }) => (
                <Link key={href} href={href} className="flex items-center justify-between text-gray-700 hover:text-blue-600 transition py-0.5">
                  <span>{label}</span>
                  <span className="text-gray-300">→</span>
                </Link>
              ))}
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
