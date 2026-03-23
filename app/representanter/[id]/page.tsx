import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getMPs, getMP, getCommittees, getCurrentSessionId } from '@/lib/stortinget'
import { MPPhoto } from '@/components/MPPhoto'

export const revalidate = 86400

function parseBirthYear(msDate: string): string {
  const match = msDate.match(/\/Date\((\d+)/)
  if (match) return String(new Date(parseInt(match[1])).getFullYear())
  return ''
}

export default async function MPDetailPage({ params }: { params: { id: string } }) {
  const BASE = 'https://data.stortinget.no/eksport'
  const [personData, sessionId] = await Promise.all([
    getMP(params.id),
    getCurrentSessionId(),
  ])

  // Also get MPs list to find basic info
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

  // Get committee memberships from person data
  const committees = personData?.komitemedlemskap_liste || []

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
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            {displayMP.firstName} {displayMP.lastName}
          </h1>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            {displayMP.party && (
              <span className="px-2 py-1 text-sm font-semibold bg-gray-100 text-gray-700 rounded">
                {displayMP.party}
              </span>
            )}
            {displayMP.county && (
              <span className="text-sm text-gray-500">{displayMP.county}</span>
            )}
          </div>
          {personData?.kjoenn && (
            <p className="text-sm text-gray-400 mt-1">
              {personData.kjoenn === 'mann' ? 'Mann' : 'Kvinne'}
            </p>
          )}
          {personData?.foedselsdato && (
            <p className="text-sm text-gray-400 mt-0.5">
              Født: {parseBirthYear(personData.foedselsdato)}
            </p>
          )}
        </div>
      </div>

      {/* Committee memberships */}
      {committees.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Komitémedlemskap</h2>
          <div className="space-y-2">
            {committees.map((c: any, i: number) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm text-gray-800">{c.komite?.navn || c.navn}</span>
                {c.rolle && <span className="text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded">{c.rolle}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Links */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Lenker</h2>
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
