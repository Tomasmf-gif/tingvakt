import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getMPs, getMP, getCurrentSessionId } from '@/lib/stortinget'
import { MPPhoto } from '@/components/MPPhoto'

export const revalidate = 86400

const PARTY_COLORS: Record<string, string> = {
  'Arbeiderpartiet': '#d42f2f',
  'Høyre': '#0065f0',
  'Fremskrittspartiet': '#024a8c',
  'Senterpartiet': '#2e8b4a',
  'Sosialistisk Venstreparti': '#eb3b47',
  'Rødt': '#8b0000',
  'Venstre': '#00807a',
  'Kristelig Folkeparti': '#f5c542',
  'Miljøpartiet De Grønne': '#6aab25',
}

function parseBirthYear(msDate: string): string {
  const match = msDate.match(/\/Date\((\d+)/)
  if (match) return String(new Date(parseInt(match[1])).getFullYear())
  return ''
}

function mapGender(kjoenn: any): string | null {
  if (kjoenn === 1 || kjoenn === 'K' || kjoenn === 'Kvinne' || kjoenn === 'kvinne') return 'Kvinne'
  if (kjoenn === 2 || kjoenn === 'M' || kjoenn === 'Mann' || kjoenn === 'mann') return 'Mann'
  return null
}

export default async function MPDetailPage({ params }: { params: { id: string } }) {
  const [personData, sessionId] = await Promise.all([
    getMP(params.id),
    getCurrentSessionId(),
  ])

  const mps = await getMPs('2025-2029')
  const mp = mps.find(m => m.id === params.id)

  if (!mp && !personData) notFound()

  const displayMP = mp || {
    id: params.id,
    firstName: personData?.fornavn || '',
    lastName: personData?.etternavn || '',
    party: personData?.parti?.navn || '',
    county: personData?.fylke?.navn || '',
    photoUrl: `/api/photo?id=${params.id}`,
  }

  const photoUrl = `/api/photo?id=${params.id}`
  const partyColor = PARTY_COLORS[displayMP.party] || '#666666'
  const genderLabel = mapGender(personData?.kjoenn)

  // Committee memberships from person data (available when API returns them)
  const committees: any[] = personData?.komitemedlemskap_liste || []

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <Link href="/representanter" className="text-sm text-blue-600 hover:text-blue-800">← Representanter</Link>
      </div>

      {/* Profile header */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 flex items-start gap-6">
        <MPPhoto
          src={photoUrl}
          name={`${displayMP.firstName} ${displayMP.lastName}`}
          className="w-24 h-24 rounded-full object-cover bg-gray-100 border-2 border-gray-100 flex-shrink-0"
          size={96}
        />
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">
            {displayMP.firstName} {displayMP.lastName}
          </h1>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            {displayMP.party && (
              <span className="flex items-center gap-1.5 px-2 py-1 text-sm font-semibold bg-gray-100 text-gray-700 rounded">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: partyColor }} />
                {displayMP.party}
              </span>
            )}
            {displayMP.county && (
              <span className="text-sm text-gray-500">{displayMP.county}</span>
            )}
          </div>
          <div className="flex items-center gap-4 mt-2 flex-wrap text-sm text-gray-400">
            {genderLabel && <span>{genderLabel}</span>}
            {personData?.foedselsdato && (
              <span>Født: {parseBirthYear(personData.foedselsdato)}</span>
            )}
            {mp && <span>Representant 2025–2029</span>}
          </div>
        </div>
      </div>

      {/* Committee memberships */}
      {committees.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Komitémedlemskap</h2>
          <div className="flex flex-wrap gap-2">
            {committees.map((c: any, i: number) => (
              <span key={i} className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-blue-50 text-blue-700 border border-blue-200 rounded-full">
                {c.komite?.navn || c.navn}
                {c.rolle && <span className="text-blue-500 text-xs">· {c.rolle}</span>}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Links */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Lenker</h2>
        <div className="flex gap-4 flex-wrap">
          <a
            href={`https://www.stortinget.no/no/Representanter-og-komiteer/Representantene/Representantfordeling/Representant/?perid=${params.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Profil på Stortinget.no →
          </a>
        </div>
      </div>
    </div>
  )
}
