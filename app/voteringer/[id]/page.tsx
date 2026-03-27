import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getVoteResult, getVoteById } from '@/lib/stortinget'
import { VotePartyExpand } from './VotePartyExpand'

export const revalidate = 3600

const PARTY_COLORS: Record<string, string> = {
  'A': '#d40014',
  'H': '#0065f0',
  'FrP': '#024c95',
  'SP': '#00843d',
  'SV': '#eb0036',
  'R': '#8b0000',
  'V': '#007c5c',
  'KrF': '#f7a900',
  'MDG': '#4c9c2e',
  'PF': '#ff8c00',
}

const PARTY_SHORT: Record<string, string> = {
  'A': 'Ap', 'H': 'H', 'FrP': 'FrP', 'SP': 'Sp', 'SV': 'SV',
  'R': 'R', 'V': 'V', 'KrF': 'KrF', 'MDG': 'MDG',
}

export default async function VoteDetailPage({ params }: { params: { id: string } }) {
  let results
  let voteMeta
  try {
    ;[results, voteMeta] = await Promise.all([
      getVoteResult(params.id),
      getVoteById(params.id),
    ])
  } catch {
    notFound()
  }

  if (!results || results.length === 0) {
    const votesFor = voteMeta?.votesFor ?? 0
    const votesAgainst = voteMeta?.votesAgainst ?? 0
    const passed = voteMeta?.passed ?? false
    const caseId = voteMeta?.caseId
    const total = votesFor + votesAgainst
    const forPct = total > 0 ? Math.round((votesFor / total) * 100) : 0

    return (
      <div className="max-w-4xl">
        <div className="mb-6">
          <Link href="/voteringer" className="text-sm text-blue-600 hover:text-blue-800">← Voteringer</Link>
        </div>
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
            <span className="text-green-700">{votesFor} For</span>
            <span className="text-gray-400 mx-2">·</span>
            <span className="text-red-700">{votesAgainst} Mot</span>
            <span className="text-gray-400 mx-2">·</span>
            <span className={passed ? 'text-green-700' : 'text-red-700'}>{passed ? 'Vedtatt' : 'Falt'}</span>
          </h1>
          <p className="text-sm text-gray-400">Votering {params.id}</p>
        </div>
        {total > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Resultat</h2>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-lg font-bold text-green-700">{votesFor}</span>
              <span className="text-sm text-gray-400">for</span>
              <div className="flex-1 h-6 rounded-lg bg-gray-100 overflow-hidden flex">
                <div className="h-full bg-green-500 transition-all" style={{ width: `${forPct}%` }} />
                <div className="h-full bg-red-400 transition-all" style={{ width: `${100 - forPct}%` }} />
              </div>
              <span className="text-sm text-gray-400">mot</span>
              <span className="text-lg font-bold text-red-700">{votesAgainst}</span>
            </div>
          </div>
        )}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <p className="text-amber-800 font-medium">Partifordeling ikke tilgjengelig for denne voteringen ennå.</p>
          {caseId && (
            <Link href={`/saker/${caseId}`} className="mt-3 inline-block text-sm text-blue-600 hover:text-blue-800">
              Se saken →
            </Link>
          )}
        </div>
      </div>
    )
  }

  const totalFor = results.filter(r => r.vote === 'for').length
  const totalMot = results.filter(r => r.vote === 'mot').length
  const totalAbsent = results.filter(r => r.vote === 'ikke_tilstede').length
  const total = totalFor + totalMot
  const forPct = total > 0 ? Math.round((totalFor / total) * 100) : 0
  const passed = totalFor > totalMot

  // Build party breakdown
  const partyMap: Record<string, { for: number; mot: number; absent: number; members: typeof results }> = {}
  for (const r of results) {
    if (!partyMap[r.party]) partyMap[r.party] = { for: 0, mot: 0, absent: 0, members: [] }
    if (r.vote === 'for') partyMap[r.party].for++
    else if (r.vote === 'mot') partyMap[r.party].mot++
    else partyMap[r.party].absent++
    partyMap[r.party].members.push(r)
  }

  const partyRows = Object.entries(partyMap)
    .sort((a, b) => b[1].for - a[1].for)

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <Link href="/voteringer" className="text-sm text-blue-600 hover:text-blue-800">← Voteringer</Link>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
          <span className="text-green-700">{totalFor} For</span>
          <span className="text-gray-400 mx-2">·</span>
          <span className="text-red-700">{totalMot} Mot</span>
          <span className="text-gray-400 mx-2">·</span>
          <span className={passed ? 'text-green-700' : 'text-red-700'}>{passed ? 'Vedtatt' : 'Falt'}</span>
        </h1>
        <p className="text-sm text-gray-400">Votering {params.id}</p>
      </div>

      {/* Result bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Resultat</h2>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-lg font-bold text-green-700">{totalFor}</span>
          <span className="text-sm text-gray-400">for</span>
          <div className="flex-1 h-6 rounded-lg bg-gray-100 overflow-hidden flex">
            <div
              className="h-full bg-green-500 transition-all"
              style={{ width: `${forPct}%` }}
            />
            <div
              className="h-full bg-red-400 transition-all"
              style={{ width: `${100 - forPct}%` }}
            />
          </div>
          <span className="text-sm text-gray-400">mot</span>
          <span className="text-lg font-bold text-red-700">{totalMot}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-400 mt-2">
          <span>{forPct}% for</span>
          <span>{totalAbsent} ikke tilstede</span>
          <span>{results.length} representanter</span>
        </div>
      </div>

      {/* Party breakdown table */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Partifordeling</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 border-b border-gray-100">
                <th className="text-left py-2 font-medium" colSpan={2}>Parti</th>
                <th className="text-right py-2 font-medium text-green-700">For</th>
                <th className="text-right py-2 font-medium text-red-700">Mot</th>
                <th className="text-right py-2 font-medium text-gray-400">Ikke møtt</th>
                <th className="text-right py-2 font-medium">Samstemthet</th>
              </tr>
            </thead>
            <tbody>
              {partyRows.map(([party, counts]) => {
                const partyTotal = counts.for + counts.mot
                const partyForPct = partyTotal > 0 ? Math.round((counts.for / partyTotal) * 100) : 0
                const majority = counts.for >= counts.mot ? 'for' : 'mot'
                const majorityPct = partyTotal > 0
                  ? Math.round((Math.max(counts.for, counts.mot) / partyTotal) * 100)
                  : 0

                return (
                  <tr key={party} className="border-b border-gray-50 last:border-0">
                    <td className="py-2 pr-2 w-3">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PARTY_COLORS[party] || '#666666' }} />
                    </td>
                    <td className="py-2 font-medium text-gray-800">{PARTY_SHORT[party] || party}</td>
                    <td className="py-2 text-right text-green-700 font-medium">{counts.for || '—'}</td>
                    <td className="py-2 text-right text-red-700 font-medium">{counts.mot || '—'}</td>
                    <td className="py-2 text-right text-gray-400">{counts.absent || '—'}</td>
                    <td className="py-2 text-right">
                      <span className={`text-xs font-medium ${
                        majority === 'for' ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {majorityPct}% {majority}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expandable individual MP votes */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Individuelle stemmer</h2>
        <VotePartyExpand partyRows={partyRows} />
      </div>
    </div>
  )
}
