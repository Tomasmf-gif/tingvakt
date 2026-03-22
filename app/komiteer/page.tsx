import Link from 'next/link'
import { getCommittees, getCurrentSessionId, getCases } from '@/lib/stortinget'

export const revalidate = 3600

const COMMITTEE_DESCRIPTIONS: Record<string, string> = {
  'Arbeids- og sosialkomiteen': 'Arbeidsliv, trygd, pensjon, sosiale tjenester',
  'Energi- og miljøkomiteen': 'Energi, klima, miljøvern, naturforvaltning',
  'Familie- og kulturkomiteen': 'Kultur, idrett, medier, kirke, familie, likestilling',
  'Finanskomiteen': 'Statsbudsjettet, skatter, avgifter, finansmarkedene',
  'Helse- og omsorgskomiteen': 'Helse, sykehus, folkehelse, omsorgstjenester',
  'Justiskomiteen': 'Rettsvesen, politi, strafferett, innvandring',
  'Kommunal- og forvaltningskomiteen': 'Kommuner, bolig, plan og bygning, innvandring',
  'Kontroll- og konstitusjonskomiteen': 'Kontroll av forvaltningen, Grunnloven',
  'Næringskomiteen': 'Næringsliv, fiskeri, landbruk, havbruk',
  'Transport- og kommunikasjonskomiteen': 'Samferdsel, vei, jernbane, luftfart, digital infrastruktur',
  'Utdannings- og forskningskomiteen': 'Skole, høyere utdanning, forskning, barnehager',
  'Utenriks- og forsvarskomiteen': 'Utenrikspolitikk, forsvar, bistand, NATO',
}

export default async function KomiteerPage() {
  const sessionId = await getCurrentSessionId()
  const [committees, cases] = await Promise.all([
    getCommittees(sessionId),
    getCases(sessionId),
  ])

  // Count active cases per committee
  const activeCasesByCommittee: Record<string, number> = {}
  const totalCasesByCommittee: Record<string, number> = {}
  for (const c of cases) {
    if (c.committee) {
      totalCasesByCommittee[c.committee] = (totalCasesByCommittee[c.committee] || 0) + 1
      if (c.status === 'til_behandling') {
        activeCasesByCommittee[c.committee] = (activeCasesByCommittee[c.committee] || 0) + 1
      }
    }
  }

  const sortedCommittees = [...committees].sort((a, b) => a.name.localeCompare(b.name, 'nb'))

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Komiteer</h1>
        <p className="text-gray-500">
          {committees.length} faste komiteer · Sesjon {sessionId}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedCommittees.map(c => {
          const active = activeCasesByCommittee[c.name] || 0
          const total = totalCasesByCommittee[c.name] || 0
          const desc = COMMITTEE_DESCRIPTIONS[c.name]

          return (
            <Link
              key={c.id}
              href={`/komiteer/${c.id}`}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 hover:shadow-sm transition"
            >
              <h3 className="font-bold text-gray-900 mb-2 leading-snug">{c.name}</h3>
              {desc && (
                <p className="text-xs text-gray-500 mb-3 leading-relaxed">{desc}</p>
              )}
              <div className="flex items-center gap-4 text-sm">
                {active > 0 && (
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                    <span className="text-blue-700 font-medium">{active} til behandling</span>
                  </div>
                )}
                {total > 0 && (
                  <span className="text-gray-400">{total} saker totalt</span>
                )}
                {total === 0 && active === 0 && (
                  <span className="text-gray-300 text-xs">Ingen saker registrert</span>
                )}
              </div>
            </Link>
          )
        })}
      </div>

      {committees.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p>Ingen komiteer funnet for sesjon {sessionId}.</p>
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-400">
          Klikk på en komité for å se saker som er til behandling.
        </p>
      </div>
    </div>
  )
}
