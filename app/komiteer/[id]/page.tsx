import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCommittees, getCurrentSessionId, getCases } from '@/lib/stortinget'

export const revalidate = 3600

export default async function KomiteDetailPage({ params }: { params: { id: string } }) {
  const sessionId = await getCurrentSessionId()
  const [committees, cases] = await Promise.all([
    getCommittees(sessionId),
    getCases(sessionId),
  ])

  const committee = committees.find(c => c.id === params.id)
  if (!committee) notFound()

  const committeeCases = cases
    .filter(c => c.committee === committee.name)
    .sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime())

  const activeCases = committeeCases.filter(c => c.status === 'til_behandling')
  const treatedCases = committeeCases.filter(c => c.status === 'behandlet')

  const STATUS_BADGE: Record<string, string> = {
    behandlet: 'bg-green-100 text-green-800',
    til_behandling: 'bg-blue-100 text-blue-800',
    mottatt: 'bg-gray-100 text-gray-700',
    varslet: 'bg-yellow-100 text-yellow-800',
    trukket: 'bg-red-100 text-red-700',
    bortfalt: 'bg-red-100 text-red-700',
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <Link href="/komiteer" className="text-sm text-blue-600 hover:text-blue-800">← Komiteer</Link>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">{committee.name}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>{committeeCases.length} saker totalt</span>
          {activeCases.length > 0 && (
            <span className="text-blue-700 font-medium">{activeCases.length} til behandling</span>
          )}
          {treatedCases.length > 0 && (
            <span className="text-green-700 font-medium">{treatedCases.length} behandlet</span>
          )}
        </div>
      </div>

      {activeCases.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Til behandling</h2>
          <div className="space-y-2">
            {activeCases.map(c => (
              <Link
                key={c.id}
                href={`/saker/${c.id}`}
                className="block bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-sm transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded bg-blue-100 text-blue-800">
                        Til behandling
                      </span>
                      {c.reference && <span className="text-xs text-gray-400">{c.reference}</span>}
                    </div>
                    <h3 className="font-semibold text-gray-900 leading-snug truncate">{c.shortTitle || c.title}</h3>
                  </div>
                  <span className="text-gray-300 flex-shrink-0">→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {treatedCases.length > 0 && (
        <section>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Behandlede saker</h2>
          <div className="space-y-2">
            {treatedCases.slice(0, 20).map(c => (
              <Link
                key={c.id}
                href={`/saker/${c.id}`}
                className="block bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-sm transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded bg-green-100 text-green-800">
                        Behandlet
                      </span>
                      {c.reference && <span className="text-xs text-gray-400">{c.reference}</span>}
                    </div>
                    <h3 className="font-semibold text-gray-900 leading-snug truncate">{c.shortTitle || c.title}</h3>
                  </div>
                  <span className="text-gray-300 flex-shrink-0">→</span>
                </div>
              </Link>
            ))}
            {treatedCases.length > 20 && (
              <p className="text-sm text-gray-400 text-center pt-2">
                + {treatedCases.length - 20} til · <Link href={`/saker?committee=${encodeURIComponent(committee.name)}`} className="text-blue-600 hover:text-blue-800">Se alle</Link>
              </p>
            )}
          </div>
        </section>
      )}

      {committeeCases.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p>Ingen saker registrert for denne komiteen i sesjon {sessionId}.</p>
        </div>
      )}
    </div>
  )
}
