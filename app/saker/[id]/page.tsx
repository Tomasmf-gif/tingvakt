import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCase, getVotesForCase, getVoteResult } from '@/lib/stortinget'
import { formatDate } from '@/lib/utils'

export const revalidate = 1800

const STATUS_STEPS = [
  { key: 'mottatt', label: 'Fremmet' },
  { key: 'til_behandling', label: 'Komité' },
  { key: 'innstilling', label: 'Innstilling' },
  { key: 'plenum', label: 'Plenum' },
  { key: 'behandlet', label: 'Vedtatt' },
]

function getStepIndex(status: string): number {
  switch (status) {
    case 'varslet':
    case 'mottatt': return 0
    case 'til_behandling': return 2
    case 'behandlet': return 4
    case 'trukket':
    case 'bortfalt': return -1
    default: return 0
  }
}

const TYPE_LABEL: Record<string, string> = {
  lovsak: 'Lovsak',
  budsjett: 'Budsjett',
  alminneligsak: 'Alminnelig sak',
}

export default async function CaseDetailPage({ params }: { params: { id: string } }) {
  const [caseData, votes] = await Promise.all([
    getCase(params.id),
    getVotesForCase(params.id),
  ])

  if (!caseData) notFound()

  const stepIndex = getStepIndex(caseData.status)
  const isFailed = caseData.status === 'trukket' || caseData.status === 'bortfalt'

  // Get vote results for all votes (limit to first 5 votes to avoid too many requests)
  const votesWithResults = await Promise.all(
    votes.slice(0, 5).map(async (v) => {
      const results = await getVoteResult(v.id)
      return { ...v, results }
    })
  )

  // Party breakdown helper
  function buildPartyBreakdown(results: Awaited<ReturnType<typeof getVoteResult>>) {
    const parties: Record<string, { for: number; mot: number; absent: number }> = {}
    for (const r of results) {
      if (!parties[r.party]) parties[r.party] = { for: 0, mot: 0, absent: 0 }
      if (r.vote === 'for') parties[r.party].for++
      else if (r.vote === 'mot') parties[r.party].mot++
      else parties[r.party].absent++
    }
    return Object.entries(parties).sort((a, b) => b[1].for - a[1].for)
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <Link href="/saker" className="text-sm text-blue-600 hover:text-blue-800">← Alle saker</Link>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          {caseData.reference && (
            <span className="text-sm font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">{caseData.reference}</span>
          )}
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {TYPE_LABEL[caseData.type] || caseData.type}
          </span>
          {isFailed ? (
            <span className="px-2 py-1 text-sm font-semibold rounded bg-red-100 text-red-800">
              {caseData.status === 'trukket' ? 'Trukket' : 'Bortfalt'}
            </span>
          ) : caseData.status === 'behandlet' ? (
            <span className="px-2 py-1 text-sm font-semibold rounded bg-green-100 text-green-800">Vedtatt</span>
          ) : (
            <span className="px-2 py-1 text-sm font-semibold rounded bg-blue-100 text-blue-800">Til behandling</span>
          )}
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 leading-snug">{caseData.title}</h1>
        {caseData.committee && (
          <p className="text-gray-500 mt-2">{caseData.committee}</p>
        )}
        <p className="text-sm text-gray-400 mt-1">Sist oppdatert: {formatDate(caseData.lastUpdated)}</p>
      </div>

      {/* Status timeline */}
      {!isFailed && (
        <div className="mb-8 bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Saksgangen</h2>
          <div className="flex items-center gap-0">
            {STATUS_STEPS.map((step, i) => {
              const done = i <= stepIndex
              const current = i === stepIndex
              const isLast = i === STATUS_STEPS.length - 1
              return (
                <div key={step.key} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                      done
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'bg-white border-gray-300 text-gray-400'
                    } ${current ? 'ring-2 ring-green-300 ring-offset-1' : ''}`}>
                      {done ? '✓' : i + 1}
                    </div>
                    <span className={`text-xs mt-1 font-medium text-center ${done ? 'text-gray-900' : 'text-gray-400'}`}>
                      {step.label}
                    </span>
                  </div>
                  {!isLast && (
                    <div className={`h-0.5 flex-1 -mt-4 ${i < stepIndex ? 'bg-green-500' : 'bg-gray-200'}`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Topics */}
      {caseData.topics.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Emner</h2>
          <div className="flex flex-wrap gap-2">
            {caseData.topics.map((t, i) => (
              <span key={i} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">{t}</span>
            ))}
          </div>
        </div>
      )}

      {/* Votes */}
      {votes.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Voteringer ({votes.length})</h2>
          <div className="space-y-4">
            {votesWithResults.map(v => {
              const total = v.votesFor + v.votesAgainst
              const forPct = total > 0 ? Math.round((v.votesFor / total) * 100) : 0
              const partyBreakdown = buildPartyBreakdown(v.results)

              return (
                <div key={v.id} className="bg-white border border-gray-200 rounded-xl p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 text-xs font-bold rounded ${v.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {v.passed ? 'Vedtatt' : 'Falt'}
                        </span>
                        <span className="text-xs text-gray-400">{formatDate(v.date)}</span>
                      </div>
                      {v.topic && <p className="text-sm font-medium text-gray-800">{v.topic}</p>}
                    </div>
                    <Link href={`/voteringer/${v.id}`} className="text-xs text-blue-600 hover:text-blue-800 flex-shrink-0">
                      Detaljer →
                    </Link>
                  </div>

                  {/* Result bar */}
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-green-700 font-medium w-12">{v.votesFor} for</span>
                      <div className="flex-1 h-3 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className="h-full bg-green-500 transition-all"
                          style={{ width: `${forPct}%` }}
                        />
                      </div>
                      <span className="text-xs text-red-700 font-medium w-16 text-right">{v.votesAgainst} mot</span>
                    </div>
                  </div>

                  {/* Party breakdown */}
                  {partyBreakdown.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="text-gray-400 border-b border-gray-100">
                            <th className="text-left py-1 font-medium">Parti</th>
                            <th className="text-right py-1 font-medium text-green-700">For</th>
                            <th className="text-right py-1 font-medium text-red-700">Mot</th>
                            <th className="text-right py-1 font-medium text-gray-500">Ikke tilstede</th>
                          </tr>
                        </thead>
                        <tbody>
                          {partyBreakdown.map(([party, counts]) => (
                            <tr key={party} className="border-b border-gray-50 last:border-0">
                              <td className="py-1 font-medium text-gray-700">{party}</td>
                              <td className="py-1 text-right text-green-700">{counts.for || '—'}</td>
                              <td className="py-1 text-right text-red-700">{counts.mot || '—'}</td>
                              <td className="py-1 text-right text-gray-400">{counts.absent || '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )
            })}
            {votes.length > 5 && (
              <p className="text-sm text-gray-400 text-center">
                + {votes.length - 5} flere voteringer · Se dem via Stortinget.no
              </p>
            )}
          </div>
        </div>
      )}

      {/* No votes message */}
      {votes.length === 0 && caseData.status !== 'behandlet' && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center text-gray-500">
          <p>Ingen voteringer registrert for denne saken ennå.</p>
        </div>
      )}

      {/* External link */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <a
          href={`https://www.stortinget.no/no/Saker-og-publikasjoner/Saker/Sak/?p=${params.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Se på Stortinget.no →
        </a>
      </div>
    </div>
  )
}
