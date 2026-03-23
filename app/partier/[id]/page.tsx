import Link from 'next/link'
import { getParties, getMPs, getCurrentSessionId, getCases } from '@/lib/stortinget'
import { notFound } from 'next/navigation'
import { MPPhoto } from '@/components/MPPhoto'

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

const PARTY_DESCRIPTION: Record<string, string> = {
  'Arbeiderpartiet': 'Sentrum-venstre arbeiderparti. Grunnlagt 1887. Største parti i Stortinget og leder mindretallsregjering (fra 2025).',
  'Høyre': 'Sentrum-høyre konservativt parti. Grunnlagt 1884. Nest største opposisjonsparti.',
  'Fremskrittspartiet': 'Høyrepopulistisk parti. Grunnlagt 1973. Største opposisjonsparti i 2025-2029.',
  'Senterpartiet': 'Sentrum/agrart parti. Grunnlagt 1920 (som Bondepartiet). Støtter regjeringen.',
  'Sosialistisk Venstreparti': 'Sosialistisk venstreparti. Grunnlagt 1975. Støtter regjeringen.',
  'Rødt': 'Ytterste venstre. Grunnlagt 2007. Støtter regjeringen.',
  'Venstre': 'Liberalt sentrumsparti. Grunnlagt 1884. Norges eldste parti. Opposisjon.',
  'Kristelig Folkeparti': 'Kristendemokratisk parti. Grunnlagt 1933. Opposisjon.',
  'Miljøpartiet De Grønne': 'Grønt parti. Grunnlagt 1988. Støtter regjeringen.',
}

export default async function PartiDetailPage({ params }: { params: { id: string } }) {
  const sessionId = await getCurrentSessionId()
  const [parties, mps, cases] = await Promise.all([
    getParties(sessionId),
    getMPs('2025-2029'),
    getCases(sessionId),
  ])

  const party = parties.find(p => p.id === params.id)
  if (!party) notFound()

  const partyMPs = mps.filter(m => m.party === party.name)
  const sakerFremmet = cases.filter(c =>
    c.proposers.some(p => p.toLowerCase().includes(party.name.toLowerCase().split(' ')[0]))
  ).length

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <Link href="/partier" className="text-sm text-blue-600 hover:text-blue-800">← Partier</Link>
      </div>

      {/* Party header */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div
            className="w-4 h-16 rounded-full flex-shrink-0"
            style={{ backgroundColor: party.color }}
          />
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">{party.name}</h1>
            <p className="text-gray-500 text-sm">
              {PARTY_SHORT[party.name]} · {party.seats} mandater
            </p>
          </div>
        </div>
        {PARTY_DESCRIPTION[party.name] && (
          <p className="text-sm text-gray-600 leading-relaxed">{PARTY_DESCRIPTION[party.name]}</p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-extrabold text-gray-900">{party.seats}</div>
          <div className="text-xs text-gray-500 mt-1">mandater</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-extrabold text-gray-900">{partyMPs.length}</div>
          <div className="text-xs text-gray-500 mt-1">representanter</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-extrabold text-gray-900">{sakerFremmet}</div>
          <div className="text-xs text-gray-500 mt-1">saker fremmet</div>
        </div>
      </div>

      {/* MPs */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
          Representanter ({partyMPs.length})
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {partyMPs.map(mp => (
            <Link
              key={mp.id}
              href={`/representanter/${mp.id}`}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition"
            >
              <MPPhoto
                src={mp.photoUrl}
                name={`${mp.firstName} ${mp.lastName}`}
                className="w-10 h-10 rounded-full object-cover bg-gray-100 flex-shrink-0"
                size={40}
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-800 leading-tight truncate">
                  {mp.firstName} {mp.lastName}
                </p>
                <p className="text-xs text-gray-400 truncate">{mp.county}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
