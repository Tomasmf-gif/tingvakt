'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { MP } from '@/lib/types'

const PARTY_COLORS: Record<string, string> = {
  'Arbeiderpartiet': '#d40014',
  'Høyre': '#0065f0',
  'Fremskrittspartiet': '#024c95',
  'Senterpartiet': '#00843d',
  'Sosialistisk Venstreparti': '#eb0036',
  'Rødt': '#8b0000',
  'Venstre': '#007c5c',
  'Kristelig Folkeparti': '#f7a900',
  'Miljøpartiet De Grønne': '#4c9c2e',
  'Pensjonistpartiet': '#ff8c00',
}

interface Props {
  mps: MP[]
  parties: string[]
  counties: string[]
  initialParty?: string
  initialCounty?: string
  initialQuery?: string
}

export function RepresentanterClient({ mps, parties, counties, initialParty = '', initialCounty = '', initialQuery = '' }: Props) {
  const [query, setQuery] = useState(initialQuery)
  const [partyFilter, setPartyFilter] = useState(initialParty)
  const [countyFilter, setCountyFilter] = useState(initialCounty)
  const [yourCounty, setYourCounty] = useState('')

  const filtered = useMemo(() => {
    let result = mps
    if (query) {
      const q = query.toLowerCase()
      result = result.filter(m =>
        `${m.firstName} ${m.lastName}`.toLowerCase().includes(q)
      )
    }
    if (partyFilter) result = result.filter(m => m.party === partyFilter)
    if (countyFilter) result = result.filter(m => m.county === countyFilter)
    return result
  }, [mps, query, partyFilter, countyFilter])

  const yourMPs = useMemo(() => {
    if (!yourCounty) return []
    return mps.filter(m => m.county === yourCounty)
  }, [mps, yourCounty])

  return (
    <div>
      {/* Din representant */}
      <div className="mb-8 bg-blue-50 border border-blue-200 rounded-xl p-5">
        <h2 className="text-sm font-bold text-blue-800 mb-3">Finn din representant</h2>
        <select
          value={yourCounty}
          onChange={e => setYourCounty(e.target.value)}
          className="px-3 py-2 text-sm border border-blue-200 rounded-lg focus:outline-none focus:border-blue-400 bg-white w-full sm:w-auto"
        >
          <option value="">Velg ditt fylke...</option>
          {counties.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {yourMPs.length > 0 && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {yourMPs.map(mp => (
              <Link
                key={mp.id}
                href={`/representanter/${mp.id}`}
                className="flex items-center gap-2 bg-white rounded-lg p-2 border border-blue-100 hover:border-blue-300 transition"
              >
                <img
                  src={mp.photoUrl}
                  alt={`${mp.firstName} ${mp.lastName}`}
                  className="w-10 h-10 rounded-full object-cover bg-gray-100 flex-shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(mp.firstName + ' ' + mp.lastName)}&size=40&background=e2e8f0&color=64748b`
                  }}
                />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-800 truncate">{mp.firstName} {mp.lastName}</p>
                  <p className="text-xs text-gray-500 truncate">{mp.party}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="search"
          placeholder="Søk etter navn..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 w-48"
        />
        <select
          value={partyFilter}
          onChange={e => setPartyFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 bg-white"
        >
          <option value="">Alle partier</option>
          {parties.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <select
          value={countyFilter}
          onChange={e => setCountyFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 bg-white"
        >
          <option value="">Alle fylker</option>
          {counties.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {(query || partyFilter || countyFilter) && (
          <button
            onClick={() => { setQuery(''); setPartyFilter(''); setCountyFilter('') }}
            className="px-3 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition"
          >
            Nullstill
          </button>
        )}
      </div>

      <p className="text-sm text-gray-400 mb-4">{filtered.length} representanter</p>

      {/* MP grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filtered.map(mp => {
          const partyColor = PARTY_COLORS[mp.party] || '#666666'
          return (
            <Link
              key={mp.id}
              href={`/representanter/${mp.id}`}
              className="group flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 hover:shadow-sm transition cursor-pointer h-52"
            >
              {/* Party color stripe */}
              <div className="h-1 w-full flex-shrink-0" style={{ backgroundColor: partyColor }} />
              <div className="flex flex-col items-center text-center p-4 pt-0 flex-1">
                <img
                  src={mp.photoUrl}
                  alt={`${mp.firstName} ${mp.lastName}`}
                  className="w-20 h-20 rounded-full object-cover object-top border-2 border-white shadow mx-auto mt-4 mb-2"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(mp.firstName + ' ' + mp.lastName)}&size=80&background=e2e8f0&color=64748b`
                  }}
                />
                <p className="text-xs font-semibold text-gray-900 leading-tight line-clamp-2">
                  {mp.firstName} {mp.lastName}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 truncate w-full">{mp.party}</p>
                <p className="text-xs text-gray-400 truncate w-full">{mp.county}</p>
              </div>
            </Link>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p>Ingen representanter funnet.</p>
        </div>
      )}
    </div>
  )
}
