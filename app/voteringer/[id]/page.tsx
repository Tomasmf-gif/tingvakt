import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getVoteResult } from '@/lib/stortinget'
import { VotePartyExpand } from './VotePartyExpand'

export const revalidate = 3600

export default async function VoteDetailPage({ params }: { params: { id: string } }) {
  let results
  try {
    results = await getVoteResult(params.id)
  } catch {
    notFound()
  }

  if (!results || results.length === 0) {
    return (
      <div className="max-w-4xl">
        <Link href="/voteringer" className="text-sm text-blue-600 hover:text-blue-800">← Voteringer</Link>
        <div className="mt-8 text-center py-16 text-gray-400">
          <p className="text-lg">Ingen stemmedata tilgjengelig</p>
          <p className="text-sm mt-1">Stortinget lagrer individuelle stemmedata fra 2011–2012.</p>
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
        <div className="flex items-center gap-3 mb-3">
          <span className={`px-3 py-1 text-sm font-bold rounded ${passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {passed ? 'Vedtatt' : 'Falt'}
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900">Votering {params.id}</h1>
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
                <th className="text-left py-2 font-medium">Parti</th>
                <th className="text-right py-2 font-medium text-green-700">For</th>
                <th className="text-right py-2 font-medium text-red-700">Mot</th>
                <th className="text-right py-2 font-medium text-gray-400">Ikke tilstede</th>
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
                    <td className="py-2 font-medium text-gray-800">{party}</td>
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
