import Link from 'next/link'
import { getParties, getCurrentSessionId, getMPs } from '@/lib/stortinget'

export const revalidate = 3600

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

// Current government: Støre cabinet (Ap minority, Sp left Jan 2025, still Ap-only as of 2025-2026)
const COALITION_PARTIES = ['Arbeiderpartiet']

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

const PARTY_DESCRIPTION: Record<string, string> = {
  'Arbeiderpartiet': 'Sentrum-venstre. Styrende parti i mindretallsregjering.',
  'Høyre': 'Sentrum-høyre. Største opposisjonsparti.',
  'Fremskrittspartiet': 'Høyrepopulistisk. Nest største parti.',
  'Senterpartiet': 'Sentrum/agrart. Støtter regjeringen.',
  'Sosialistisk Venstreparti': 'Sosialistisk venstre. Støtter regjeringen.',
  'Rødt': 'Ytterste venstre. Støtter regjeringen.',
  'Venstre': 'Sentrum/liberal. Opposisjon.',
  'Kristelig Folkeparti': 'Kristendemokratisk. Opposisjon.',
  'Miljøpartiet De Grønne': 'Grønn politikk. Støtter regjeringen.',
}

export default async function PartierPage() {
  try {
  const sessionId = await getCurrentSessionId()
  const [parties, mps] = await Promise.all([
    getParties(sessionId),
    getMPs('2025-2029'),
  ])

  const TOTAL_SEATS = 169
  const sortedParties = [...parties].sort((a, b) => b.seats - a.seats)

  // Build MP count per party from MPs list as backup
  const mpCountByParty: Record<string, number> = {}
  for (const mp of mps) {
    if (mp.party) mpCountByParty[mp.party] = (mpCountByParty[mp.party] || 0) + 1
  }

  const redGreenSeats = sortedParties
    .filter(p => PARTY_BLOC[p.name] === 'Rød-grønn')
    .reduce((sum, p) => sum + (p.seats || mpCountByParty[p.name] || 0), 0)

  const blueSeats = sortedParties
    .filter(p => PARTY_BLOC[p.name] === 'Borgerlig')
    .reduce((sum, p) => sum + (p.seats || mpCountByParty[p.name] || 0), 0)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Partier</h1>
        <p className="text-gray-500">Sesjon {sessionId} · 169 mandater</p>
      </div>

      {/* Bloc breakdown bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Blokkfordeling</h2>
        <div className="flex rounded-lg overflow-hidden h-8 mb-3">
          <div
            className="bg-red-500 flex items-center justify-center text-white text-xs font-bold"
            style={{ width: `${(redGreenSeats / TOTAL_SEATS) * 100}%` }}
          >
            {redGreenSeats}
          </div>
          <div
            className="bg-blue-500 flex items-center justify-center text-white text-xs font-bold"
            style={{ width: `${(blueSeats / TOTAL_SEATS) * 100}%` }}
          >
            {blueSeats}
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-gray-700">Rød-grønn: <strong>{redGreenSeats}</strong> mandater</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-gray-700">Borgerlig: <strong>{blueSeats}</strong> mandater</span>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2">Flertall: 85 mandater</p>
      </div>

      {/* All parties — seat bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Stortingssammensetning</h2>
        <div className="flex rounded-lg overflow-hidden h-10 mb-4">
          {sortedParties.map(p => {
            const seats = p.seats || mpCountByParty[p.name] || 0
            const pct = (seats / TOTAL_SEATS) * 100
            if (pct < 0.5) return null
            return (
              <div
                key={p.id}
                className="flex items-center justify-center text-white text-xs font-bold overflow-hidden"
                style={{ width: `${pct}%`, backgroundColor: p.color }}
                title={`${p.name}: ${seats}`}
              >
                {seats >= 6 ? PARTY_SHORT[p.name] || p.name : ''}
              </div>
            )
          })}
        </div>
        <div className="flex flex-wrap gap-3">
          {sortedParties.map(p => {
            const seats = p.seats || mpCountByParty[p.name] || 0
            return (
              <div key={p.id} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                <span className="text-xs text-gray-600">{PARTY_SHORT[p.name] || p.name} {seats}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Party cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedParties.map(p => {
          const seats = p.seats || mpCountByParty[p.name] || 0
          const seatPct = Math.round((seats / TOTAL_SEATS) * 100)
          const bloc = PARTY_BLOC[p.name]

          const isCoalition = COALITION_PARTIES.includes(p.name)
          return (
            <Link
              key={p.id}
              href={`/partier/${p.id}`}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 hover:shadow-sm transition cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-3 h-10 rounded-full flex-shrink-0"
                  style={{ backgroundColor: p.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-gray-900">{p.name}</h3>
                    {isCoalition && (
                      <span className="inline-block px-1.5 py-0.5 text-xs font-semibold bg-red-100 text-red-700 rounded">
                        Regjering
                      </span>
                    )}
                  </div>
                  {bloc && (
                    <span className="text-xs text-gray-400">{bloc}</span>
                  )}
                </div>
              </div>

              <div className="flex items-end justify-between mb-2">
                <div>
                  <span className="text-3xl font-extrabold text-gray-900">{seats}</span>
                  <span className="text-sm text-gray-400 ml-1">mandater</span>
                </div>
                <span className="text-sm text-gray-500">{seatPct}%</span>
              </div>

              {/* Seat bar */}
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-3">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${seatPct}%`, backgroundColor: p.color }}
                />
              </div>

              {PARTY_DESCRIPTION[p.name] && (
                <p className="text-xs text-gray-500 leading-relaxed">{PARTY_DESCRIPTION[p.name]}</p>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
  } catch {
    return <div className="text-center py-16 text-gray-400">Kunne ikke laste data. Prøv igjen senere.</div>
  }
}
