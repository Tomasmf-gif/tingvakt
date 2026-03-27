import { getCases, getCurrentSessionId } from '@/lib/stortinget'
import { SokClient } from './SokClient'

export const revalidate = 900

export default async function SokPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  try {
  const sessionId = await getCurrentSessionId()
  const cases = await getCases(sessionId)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Søk</h1>
        <p className="text-gray-500">Søk blant {cases.length} saker i sesjon {sessionId}</p>
      </div>

      <SokClient cases={cases} initialQuery={searchParams.q || ''} />
    </div>
  )
  } catch {
    return <div className="text-center py-16 text-gray-400 text-sm">Kunne ikke laste data. Prøv igjen om litt.</div>
  }
}
