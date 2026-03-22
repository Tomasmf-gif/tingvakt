import Link from 'next/link'
import { getMPs } from '@/lib/stortinget'
import { RepresentanterClient } from './RepresentanterClient'

export const revalidate = 86400 // 24h — MP list changes rarely

export default async function RepresentanterPage({
  searchParams,
}: {
  searchParams: { party?: string; county?: string; q?: string }
}) {
  try {
  const mps = await getMPs('2025-2029')

  const parties = [...new Set(mps.map(m => m.party))].filter(Boolean).sort()
  const counties = [...new Set(mps.map(m => m.county))].filter(Boolean).sort()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Representanter</h1>
        <p className="text-gray-500">{mps.length} stortingsrepresentanter · Periode 2025–2029</p>
      </div>

      <RepresentanterClient
        mps={mps}
        parties={parties}
        counties={counties}
        initialParty={searchParams.party || ''}
        initialCounty={searchParams.county || ''}
        initialQuery={searchParams.q || ''}
      />
    </div>
  )
  } catch {
    return <div className="text-center py-16 text-gray-400">Kunne ikke laste data. Prøv igjen senere.</div>
  }
}
