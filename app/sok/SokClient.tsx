'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Case } from '@/lib/types'
import { formatShortDate, statusLabel } from '@/lib/utils'

interface Props {
  cases: Case[]
  initialQuery?: string
}

const STATUS_BADGE: Record<string, string> = {
  behandlet: 'bg-green-100 text-green-800',
  til_behandling: 'bg-blue-100 text-blue-800',
  mottatt: 'bg-gray-100 text-gray-700',
  varslet: 'bg-yellow-100 text-yellow-800',
  trukket: 'bg-red-100 text-red-700',
  bortfalt: 'bg-red-100 text-red-700',
}

const STATUS_ORDER = ['til_behandling', 'behandlet', 'mottatt', 'varslet', 'trukket', 'bortfalt']

export function SokClient({ cases, initialQuery = '' }: Props) {
  const [inputValue, setInputValue] = useState(initialQuery)
  const [query, setQuery] = useState(initialQuery)
  const inputRef = useRef<HTMLInputElement>(null)

  // Debounce: update query 300ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => setQuery(inputValue), 300)
    return () => clearTimeout(timer)
  }, [inputValue])

  // "/" keyboard shortcut to focus search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return cases
      .filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.shortTitle.toLowerCase().includes(q) ||
        c.reference.toLowerCase().includes(q) ||
        (c.committee || '').toLowerCase().includes(q) ||
        c.topics.some(t => t.toLowerCase().includes(q))
      )
      .sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime())
      .slice(0, 50)
  }, [cases, query])

  const grouped = useMemo(() => {
    const groups: Record<string, Case[]> = {}
    for (const c of results) {
      if (!groups[c.status]) groups[c.status] = []
      groups[c.status].push(c)
    }
    return groups
  }, [results])

  const groupOrder = STATUS_ORDER.filter(s => grouped[s]?.length > 0)

  return (
    <div>
      <div className="relative mb-6">
        <input
          ref={inputRef}
          type="search"
          placeholder="Skriv inn søkeord, f.eks. «skatt», «helse», «budsjett»..."
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          autoFocus
          className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 pr-20"
        />
        {!inputValue && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-300 border border-gray-200 rounded px-1.5 py-0.5 pointer-events-none">
            /
          </span>
        )}
        {inputValue && (
          <button
            onClick={() => { setInputValue(''); setQuery('') }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      {query && results.length > 0 && (
        <p className="text-sm text-gray-400 mb-4">
          {results.length}{results.length === 50 ? '+' : ''} resultater for &apos;{query}&apos;
        </p>
      )}

      {query && results.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-lg font-medium">Ingen saker funnet for &apos;{query}&apos;</p>
          <p className="text-sm mt-1">Prøv et annet søkeord</p>
        </div>
      )}

      {!query && (
        <div className="text-center py-16 text-gray-300">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-lg text-gray-400">Start å skrive for å søke</p>
          <p className="text-sm mt-1 text-gray-400">Søker i tittel, referanse, komité og emner</p>
          <p className="text-xs mt-3 text-gray-300">Trykk <kbd className="border border-gray-200 rounded px-1 py-0.5 text-gray-400">/</kbd> for å søke</p>
        </div>
      )}

      <div className="space-y-8">
        {groupOrder.map(status => (
          <div key={status}>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 pb-1 border-b border-gray-100">
              {statusLabel(status)} ({grouped[status].length})
            </h3>
            <div className="space-y-2">
              {grouped[status].map(c => (
                <Link
                  key={c.id}
                  href={`/saker/${c.id}`}
                  className="block bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-sm transition cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center flex-wrap gap-2 mb-1">
                        <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded ${STATUS_BADGE[c.status] || 'bg-gray-100 text-gray-600'}`}>
                          {statusLabel(c.status)}
                        </span>
                        <span className="text-xs text-gray-400">{formatShortDate(c.lastUpdated)}</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 leading-snug">
                        {highlight(c.shortTitle || c.title, query)}
                      </h3>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        {c.committee && (
                          <span className="text-xs text-gray-500">{c.committee}</span>
                        )}
                        {c.reference && (
                          <span className="text-xs text-gray-400">{c.reference}</span>
                        )}
                      </div>
                      {c.topics.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {c.topics.slice(0, 3).map((t, i) => (
                            <span key={i} className="px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="text-gray-300 flex-shrink-0">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function highlight(text: string, query: string): React.ReactNode {
  if (!query) return text
  const q = query.toLowerCase()
  const idx = text.toLowerCase().indexOf(q)
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-yellow-100 text-gray-900 rounded">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  )
}
