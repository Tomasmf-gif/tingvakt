import Link from 'next/link'
import { getParties, getCurrentSessionId } from '@/lib/stortinget'
import { SammenlignClient } from './SammenlignClient'

export const revalidate = 3600

export default async function SammenlignPage() {
  try {
  const sessionId = await getCurrentSessionId()
  const parties = await getParties(sessionId)

  const activeParties = parties.filter(p => p.seats > 0)

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <Link href="/" className="text-sm text-blue-600 hover:text-blue-800">← Hjem</Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sammenlign partier</h1>
        <p className="text-gray-500">Velg to partier for å sammenligne mandater og politisk posisjon.</p>
      </div>

      <SammenlignClient parties={activeParties} />
    </div>
  )
  } catch {
    return <div className="text-center py-16 text-gray-400">Kunne ikke laste partidata. Prøv igjen senere.</div>
  }
}
