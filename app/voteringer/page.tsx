import Link from 'next/link'
import { getCurrentSessionId, getRecentVotes } from '@/lib/stortinget'
import { formatDate } from '@/lib/utils'

export const revalidate = 900

function groupByDate(items: { vote: any; caseTitle: string; caseId: string }[]) {
  const groups: Record<string, typeof items> = {}
  for (const item of items) {
    const key = item.vote.date.toISOString().split('T')[0]
    if (!groups[key]) groups[key] = []
    groups[key].push(item)
  }
  return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]))
}

export default async function VoteringerPage() {
  try {
  const sessionId = await getCurrentSessionId()
  const recentVotes = await getRecentVotes(sessionId, 60)
  const grouped = groupByDate(recentVotes.filter(({ vote }) => vote.votesFor > 0 || vote.votesAgainst > 0))

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Voteringer</h1>
        <p className="text-gray-500">Siste voteringer i sesjon {sessionId}</p>
      </div>

      {grouped.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p>Ingen voteringer funnet.</p>
        </div>
      )}

      <div className="space-y-8">
        {grouped.map(([dateKey, items]) => {
          const date = new Date(dateKey + 'T12:00:00Z')
          return (
            <div key={dateKey}>
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 pb-2 border-b border-gray-100">
                {formatDate(date)}
              </h2>
              <div className="space-y-2">
                {items.map(({ vote, caseTitle, caseId }) => {
                  const total = vote.votesFor + vote.votesAgainst
                  const forPct = total > 0 ? Math.round((vote.votesFor / total) * 100) : 0

                  return (
                    <Link
                      key={vote.id}
                      href={`/voteringer/${vote.id}`}
                      className="block bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-sm transition"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className={`px-2 py-0.5 text-xs font-bold rounded flex-shrink-0 ${
                              vote.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {vote.passed ? 'Vedtatt' : 'Falt'}
                            </span>
                            <span className="text-xs text-gray-500 truncate">{caseTitle}</span>
                          </div>
                          {vote.topic && (
                            <p className="text-sm font-medium text-gray-800 mb-2">{vote.topic}</p>
                          )}
                          {/* Mini result bar */}
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-green-700 font-medium w-12">{vote.votesFor} for</span>
                            <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                              <div
                                className={`h-full transition-all ${vote.passed ? 'bg-green-500' : 'bg-red-400'}`}
                                style={{ width: `${forPct}%` }}
                              />
                            </div>
                            <span className="text-xs text-red-700 font-medium w-14 text-right">{vote.votesAgainst} mot</span>
                          </div>
                        </div>
                        <span className="text-gray-300 flex-shrink-0">→</span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-400 text-center">
        Viser siste {recentVotes.length} voteringer · Data fra Stortingets åpne datatjeneste
      </div>
    </div>
  )
  } catch {
    return <div className="text-center py-16 text-gray-400 text-sm">Kunne ikke laste data. Prøv igjen om litt.</div>
  }
}
