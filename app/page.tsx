import Link from 'next/link'
import { getCases, getCurrentSessionId } from '@/lib/stortinget'
import { formatShortDate, statusLabel } from '@/lib/utils'

export const revalidate = 900 // 15 min cache

export default async function HomePage() {
  const sessionId = await getCurrentSessionId()
  const cases = await getCases(sessionId)

  const activeCases = cases
    .filter(c => c.status === 'til_behandling')
    .sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime())
    .slice(0, 10)

  const recentCases = cases
    .filter(c => c.status === 'behandlet')
    .sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime())
    .slice(0, 10)

  return (
    <div>
      {/* Hero */}
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
          Følg med på hva Stortinget vedtar
        </h1>
        <p className="text-lg text-gray-500">
          Norsk politikk i klartekst · Sesjon {sessionId}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main column */}
        <div className="lg:col-span-2">
          {/* Recent decisions */}
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
            Siste vedtak
          </h2>
          <div className="space-y-3">
            {recentCases.map(c => (
              <Link
                key={c.id}
                href={`/saker/${c.id}`}
                className="block bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-block px-2 py-0.5 text-xs font-bold rounded bg-green-100 text-green-800">
                        Vedtatt
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatShortDate(c.lastUpdated)}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 leading-snug">{c.shortTitle || c.title}</h3>
                    {c.committee && (
                      <p className="text-sm text-gray-500 mt-1">{c.committee}</p>
                    )}
                  </div>
                  <span className="text-gray-300">→</span>
                </div>
              </Link>
            ))}
          </div>

          {recentCases.length === 0 && (
            <p className="text-gray-400 text-sm">Ingen vedtak funnet for denne sesjonen ennå.</p>
          )}

          {/* Active cases */}
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 mt-12">
            Aktive saker
          </h2>
          <div className="space-y-3">
            {activeCases.map(c => (
              <Link
                key={c.id}
                href={`/saker/${c.id}`}
                className="block bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-block px-2 py-0.5 text-xs font-bold rounded bg-blue-100 text-blue-800">
                        {statusLabel(c.status)}
                      </span>
                      {c.reference && (
                        <span className="text-xs text-gray-400">{c.reference}</span>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 leading-snug">{c.shortTitle || c.title}</h3>
                    {c.committee && (
                      <p className="text-sm text-gray-500 mt-1">{c.committee}</p>
                    )}
                  </div>
                  <span className="text-gray-300">→</span>
                </div>
              </Link>
            ))}
          </div>

          <Link href="/saker" className="inline-block mt-6 text-sm font-medium text-blue-600 hover:text-blue-800">
            Se alle saker →
          </Link>
        </div>

        {/* Sidebar */}
        <div>
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
            Stortinget
          </h2>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-3">Sesjon {sessionId}</p>
            <p className="text-2xl font-bold text-gray-900">{cases.length}</p>
            <p className="text-sm text-gray-500">saker totalt</p>
            <div className="mt-3 space-y-1 text-sm">
              <p className="text-gray-600">
                <span className="font-medium">{cases.filter(c => c.status === 'til_behandling').length}</span> til behandling
              </p>
              <p className="text-gray-600">
                <span className="font-medium">{cases.filter(c => c.status === 'behandlet').length}</span> behandlet
              </p>
            </div>
          </div>

          <div className="mt-6">
            <Link href="/partier" className="text-sm font-medium text-blue-600 hover:text-blue-800">
              Se partioversikt →
            </Link>
          </div>
          <div className="mt-2">
            <Link href="/representanter" className="text-sm font-medium text-blue-600 hover:text-blue-800">
              Finn din representant →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
