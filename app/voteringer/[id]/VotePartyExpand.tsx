'use client'

import { useState } from 'react'
import Link from 'next/link'

interface VoteResult {
  mpId: string
  mpName: string
  party: string
  county: string
  vote: 'for' | 'mot' | 'ikke_tilstede'
}

interface Props {
  partyRows: [string, { for: number; mot: number; absent: number; members: VoteResult[] }][]
}

export function VotePartyExpand({ partyRows }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <div className="space-y-2">
      {partyRows.map(([party, counts]) => (
        <div key={party} className="border border-gray-100 rounded-lg overflow-hidden">
          <button
            onClick={() => setExpanded(expanded === party ? null : party)}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition text-left"
          >
            <div className="flex items-center gap-3">
              <span className="font-medium text-gray-800 text-sm">{party}</span>
              <span className="text-xs text-green-700">{counts.for} for</span>
              <span className="text-xs text-red-700">{counts.mot} mot</span>
              {counts.absent > 0 && <span className="text-xs text-gray-400">{counts.absent} borte</span>}
            </div>
            <span className="text-gray-400 text-xs">{expanded === party ? '▲' : '▼'}</span>
          </button>

          {expanded === party && (
            <div className="border-t border-gray-100 px-4 py-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
                {counts.members.map(mp => (
                  <div key={mp.mpId} className="flex items-center gap-2 py-1">
                    <span className={`w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                      mp.vote === 'for'
                        ? 'bg-green-100 text-green-700'
                        : mp.vote === 'mot'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {mp.vote === 'for' ? '✓' : mp.vote === 'mot' ? '✗' : '—'}
                    </span>
                    <Link
                      href={`/representanter/${mp.mpId}`}
                      className="text-xs text-gray-700 hover:text-blue-600 transition"
                    >
                      {mp.mpName}
                    </Link>
                    <span className="text-xs text-gray-400 truncate">{mp.county}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
