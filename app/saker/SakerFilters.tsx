'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

interface Props {
  committees: string[]
  currentStatus: string
  currentType: string
  currentCommittee: string
  currentQuery: string
}

export function SakerFilters({ committees, currentStatus, currentType, currentCommittee, currentQuery }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const update = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    params.delete('page')
    router.push(`/saker?${params.toString()}`)
  }, [router, searchParams])

  return (
    <div className="flex flex-wrap gap-3 mb-4">
      <input
        type="search"
        placeholder="Søk i saker..."
        defaultValue={currentQuery}
        onChange={e => update('q', e.target.value)}
        className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 w-48"
      />
      <select
        value={currentStatus}
        onChange={e => update('status', e.target.value)}
        className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 bg-white"
      >
        <option value="">Alle statuser</option>
        <option value="til_behandling">Til behandling</option>
        <option value="behandlet">Behandlet</option>
        <option value="mottatt">Mottatt</option>
        <option value="varslet">Varslet</option>
        <option value="trukket">Trukket</option>
        <option value="bortfalt">Bortfalt</option>
      </select>
      <select
        value={currentType}
        onChange={e => update('type', e.target.value)}
        className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 bg-white"
      >
        <option value="">Alle typer</option>
        <option value="lovsak">Lovsak</option>
        <option value="budsjett">Budsjett</option>
        <option value="alminneligsak">Alminnelig sak</option>
      </select>
      <select
        value={currentCommittee}
        onChange={e => update('committee', e.target.value)}
        className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 bg-white"
      >
        <option value="">Alle komiteer</option>
        {committees
          .filter(c => !c.toLowerCase().includes('korona') && !c.toLowerCase().includes('særskilt'))
          .map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
      </select>
      {(currentStatus || currentType || currentCommittee || currentQuery) && (
        <button
          onClick={() => router.push('/saker')}
          className="px-3 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition"
        >
          Nullstill
        </button>
      )}
    </div>
  )
}
