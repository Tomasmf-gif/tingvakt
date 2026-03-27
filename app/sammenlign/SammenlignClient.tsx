'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Party } from '@/lib/types'

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
  'Pensjonistpartiet': 'PF',
}

const COALITION_PARTIES = ['Arbeiderpartiet']
const SUPPORT_PARTIES = ['Senterpartiet', 'Sosialistisk Venstreparti', 'Rødt', 'Miljøpartiet De Grønne']
const OPPOSITION_PARTIES = ['Høyre', 'Fremskrittspartiet', 'Venstre', 'Kristelig Folkeparti']

const PARTY_BLOC: Record<string, string> = {
  'Arbeiderpartiet': 'Rød-grønn',
  'Senterpartiet': 'Rød-grønn',
  'Sosialistisk Venstreparti': 'Rød-grønn',
  'Rødt': 'Rød-grønn',
  'Miljøpartiet De Grønne': 'Rød-grønn',
  'Høyre': 'Borgerlig',
  'Fremskrittspartiet': 'Borgerlig',
  'Kristelig Folkeparti': 'Borgerlig',
  'Venstre': 'Borgerlig',
}

const PARTY_DESC: Record<string, string> = {
  'Arbeiderpartiet': 'Sentrum-venstre arbeiderparti. Leder mindretallsregjering.',
  'Høyre': 'Sentrum-høyre konservativt parti. Største opposisjonsparti.',
  'Fremskrittspartiet': 'Høyrepopulistisk parti. Nest største opposisjonsparti.',
  'Senterpartiet': 'Sentrum/agrart parti. Støtter regjeringen.',
  'Sosialistisk Venstreparti': 'Sosialistisk venstreparti. Støtter regjeringen.',
  'Rødt': 'Ytterste venstre. Støtter regjeringen.',
  'Venstre': 'Liberalt sentrumsparti. Opposisjon.',
  'Kristelig Folkeparti': 'Kristendemokratisk parti. Opposisjon.',
  'Miljøpartiet De Grønne': 'Grønt parti. Støtter regjeringen.',
}

function govPosition(name: string): string {
  if (COALITION_PARTIES.includes(name)) return 'Regjering'
  if (SUPPORT_PARTIES.includes(name)) return 'Støtter regjeringen'
  if (OPPOSITION_PARTIES.includes(name)) return 'Opposisjon'
  return '—'
}

function govPositionClass(name: string): string {
  if (COALITION_PARTIES.includes(name)) return 'bg-red-50 text-red-700 border border-red-200'
  if (SUPPORT_PARTIES.includes(name)) return 'bg-orange-50 text-orange-700 border border-orange-200'
  return 'bg-gray-50 text-gray-600 border border-gray-200'
}

interface Props {
  parties: Party[]
}

export function SammenlignClient({ parties }: Props) {
  const sortedParties = [...parties].sort((a, b) => b.seats - a.seats)

  const [partyA, setPartyA] = useState(sortedParties[0]?.id || '')
  const [partyB, setPartyB] = useState(sortedParties[1]?.id || '')

  const pA = parties.find(p => p.id === partyA)
  const pB = parties.find(p => p.id === partyB)

  const TOTAL_SEATS = 169

  return (
    <div>
      {/* Party selectors */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Parti A</label>
          <select
            value={partyA}
            onChange={e => setPartyA(e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 bg-white shadow-sm"
          >
            {sortedParties.map(p => (
              <option key={p.id} value={p.id} disabled={p.id === partyB}>
                {PARTY_SHORT[p.name] || p.name} — {p.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Parti B</label>
          <select
            value={partyB}
            onChange={e => setPartyB(e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 bg-white shadow-sm"
          >
            {sortedParties.map(p => (
              <option key={p.id} value={p.id} disabled={p.id === partyA}>
                {PARTY_SHORT[p.name] || p.name} — {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {pA && pB && (
        <>
          {/* Side-by-side headers */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {[pA, pB].map((p, idx) => (
              <div
                key={p.id}
                className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-3 h-12 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                  <div>
                    <h2 className="font-bold text-gray-900 text-lg leading-tight">{p.name}</h2>
                    <p className="text-sm text-gray-400">{PARTY_SHORT[p.name] || p.id}</p>
                  </div>
                </div>
                <Link
                  href={`/partier/${p.id}`}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Se partiside →
                </Link>
              </div>
            ))}
          </div>

          {/* Comparison table */}
          <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/3">Egenskap</th>
                  <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <span style={{ color: pA.color }}>{PARTY_SHORT[pA.name] || pA.name}</span>
                  </th>
                  <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <span style={{ color: pB.color }}>{PARTY_SHORT[pB.name] || pB.name}</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {/* Seats */}
                <tr>
                  <td className="px-5 py-4 text-gray-600 font-medium">Mandater</td>
                  <td className="px-5 py-4 text-center">
                    <span className="text-2xl font-bold text-gray-900">{pA.seats}</span>
                    <span className="text-xs text-gray-400 ml-1">({Math.round((pA.seats / TOTAL_SEATS) * 100)}%)</span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="text-2xl font-bold text-gray-900">{pB.seats}</span>
                    <span className="text-xs text-gray-400 ml-1">({Math.round((pB.seats / TOTAL_SEATS) * 100)}%)</span>
                  </td>
                </tr>

                {/* Seat bars */}
                <tr className="bg-gray-50/50">
                  <td className="px-5 py-3 text-gray-400 text-xs">Andel av Stortinget</td>
                  <td className="px-5 py-3">
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${(pA.seats / TOTAL_SEATS) * 100}%`, backgroundColor: pA.color }}
                      />
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${(pB.seats / TOTAL_SEATS) * 100}%`, backgroundColor: pB.color }}
                      />
                    </div>
                  </td>
                </tr>

                {/* Bloc */}
                <tr>
                  <td className="px-5 py-4 text-gray-600 font-medium">Politisk blokk</td>
                  <td className="px-5 py-4 text-center">
                    <span className="text-sm text-gray-700">{PARTY_BLOC[pA.name] || '—'}</span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="text-sm text-gray-700">{PARTY_BLOC[pB.name] || '—'}</span>
                  </td>
                </tr>

                {/* Government position */}
                <tr>
                  <td className="px-5 py-4 text-gray-600 font-medium">Regjeringsposisjon</td>
                  <td className="px-5 py-4 text-center">
                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${govPositionClass(pA.name)}`}>
                      {govPosition(pA.name)}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${govPositionClass(pB.name)}`}>
                      {govPosition(pB.name)}
                    </span>
                  </td>
                </tr>

                {/* Same bloc? */}
                <tr className="bg-gray-50/50">
                  <td className="px-5 py-4 text-gray-600 font-medium">Samme politiske blokk?</td>
                  <td className="px-5 py-4 text-center" colSpan={2}>
                    {PARTY_BLOC[pA.name] && PARTY_BLOC[pA.name] === PARTY_BLOC[pB.name] ? (
                      <span className="inline-block px-3 py-1 text-xs font-semibold rounded bg-green-50 text-green-700 border border-green-200">
                        Ja — {PARTY_BLOC[pA.name]}
                      </span>
                    ) : (
                      <span className="inline-block px-3 py-1 text-xs font-semibold rounded bg-red-50 text-red-600 border border-red-200">
                        Nei — ulike blokker
                      </span>
                    )}
                  </td>
                </tr>

                {/* Voting alignment note */}
                <tr>
                  <td className="px-5 py-4 text-gray-600 font-medium">Stemmesamstemmighet</td>
                  <td className="px-5 py-4 text-center text-gray-400 text-xs" colSpan={2}>
                    Data ikke tilgjengelig for 2025-2026-sesjonen
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Description cards */}
          <div className="grid grid-cols-2 gap-4">
            {[pA, pB].map(p => (
              <div key={p.id} className="bg-gray-50 border border-gray-100 rounded-xl p-5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Om {PARTY_SHORT[p.name] || p.name}
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {PARTY_DESC[p.name] || p.name}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
