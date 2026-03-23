import { Case, Vote, VoteResult, MP, Party, Committee } from './types'

const BASE = 'https://data.stortinget.no/eksport'

const STATUS_MAP: Record<number, string> = {
  1: 'behandlet',
  2: 'til_behandling',
  3: 'mottatt',
  4: 'varslet',
  5: 'trukket',
  6: 'bortfalt',
}

const TYPE_MAP: Record<number, string> = {
  1: 'lovsak',
  2: 'alminneligsak',
  3: 'budsjett',
}

function mapStatus(s: any): string {
  if (typeof s === 'number') return STATUS_MAP[s] || 'mottatt'
  return s || 'mottatt'
}

function mapType(t: any): string {
  if (typeof t === 'number') return TYPE_MAP[t] || 'alminneligsak'
  return t || 'alminneligsak'
}

function parseDate(msDate: string | null): Date {
  if (!msDate) return new Date()
  const match = msDate.match(/\/Date\((\d+)([+-]\d+)?\)\//)
  if (match) return new Date(parseInt(match[1]))
  return new Date(msDate)
}

async function fetchJSON(endpoint: string, params: Record<string, string> = {}, retries = 3): Promise<any> {
  const url = new URL(`${BASE}/${endpoint}`)
  url.searchParams.set('format', 'json')
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))

  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await fetch(url.toString(), { next: { revalidate: 3600 } })
    if (res.ok) return res.json()
    if (res.status === 429 && attempt < retries) {
      await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt)))
      continue
    }
    throw new Error(`Stortinget API error: ${res.status}`)
  }
}

function mapCaseItem(s: any): Case {
  return {
    id: String(s.sak_id || s.id || ''),
    title: s.tittel || s.korttittel || 'Uten tittel',
    shortTitle: s.korttittel || s.tittel || '',
    type: mapType(s.type),
    status: mapStatus(s.status) as any,
    documentGroup: s.dokumentgruppe || '',
    committee: s.komite?.navn,
    lastUpdated: parseDate(s.sist_oppdatert_dato),
    reference: s.henvisning || '',
    topics: (s.emne_liste || []).map((e: any) => e.navn),
  }
}

export async function getSessions(): Promise<{ id: string; name: string }[]> {
  const data = await fetchJSON('sesjoner')
  return (data.sesjoner_liste || []).map((s: any) => ({
    id: s.id,
    name: s.id,
  }))
}

export async function getCurrentSessionId(): Promise<string> {
  return '2025-2026'
}

export async function getCases(sessionId: string): Promise<Case[]> {
  const data = await fetchJSON('saker', { sesjonid: sessionId })
  return (data.saker_liste || []).map(mapCaseItem)
}

export async function getCase(caseId: string): Promise<Case | null> {
  try {
    const data = await fetchJSON('sak', { sakid: caseId })
    // The sak endpoint may return the case directly or wrapped
    const s = (data.saker_liste && data.saker_liste.length > 0)
      ? data.saker_liste[0]
      : (data.tittel || data.id ? data : null)
    if (!s) return null
    return mapCaseItem(s)
  } catch {
    return null
  }
}

export async function getVotesForCase(caseId: string): Promise<Vote[]> {
  try {
    const data = await fetchJSON('voteringer', { sakid: caseId })
    return (data.sak_votering_liste || []).map((v: any) => ({
      id: v.votering_id,
      caseId,
      topic: v.votering_tema || '',
      passed: v.vedtatt === true,
      method: v.votering_metode || 'elektronisk',
      votesFor: v.antall_for || 0,
      votesAgainst: v.antall_mot || 0,
      absent: v.antall_ikke_tilstede || 0,
      date: parseDate(v.votering_tid || v.dato || null),
    }))
  } catch {
    return []
  }
}

export async function getVoteResult(voteId: string): Promise<VoteResult[]> {
  try {
    const data = await fetchJSON('voteringsresultat', { voteringid: voteId })
    return (data.voteringsresultat_liste || []).map((r: any) => ({
      mpId: r.representant?.id || '',
      mpName: `${r.representant?.fornavn || ''} ${r.representant?.etternavn || ''}`.trim(),
      party: r.representant?.parti?.navn || '',
      county: r.representant?.fylke?.navn || '',
      vote: r.votering as 'for' | 'mot' | 'ikke_tilstede',
    }))
  } catch {
    return []
  }
}

export async function getMPs(periodId: string): Promise<MP[]> {
  const data = await fetchJSON('representanter', { stortingsperiodeid: periodId })
  return (data.representanter_liste || []).map((r: any) => ({
    id: r.id,
    firstName: r.fornavn || '',
    lastName: r.etternavn || '',
    party: r.parti?.navn || '',
    county: r.fylke?.navn || '',
    photoUrl: `/api/photo?id=${r.id}`,
  }))
}

export async function getMP(personId: string): Promise<any | null> {
  try {
    const data = await fetchJSON('person', { personid: personId })
    return data
  } catch {
    return null
  }
}

export async function getParties(sessionId: string): Promise<Party[]> {
  const data = await fetchJSON('partier', { sesjonid: sessionId })
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
  return (data.partier_liste || []).map((p: any) => ({
    id: p.id,
    name: p.navn || '',
    seats: p.representert_antall || 0,
    color: PARTY_COLORS[p.navn] || '#666666',
  }))
}

export async function getCommittees(sessionId: string): Promise<Committee[]> {
  const data = await fetchJSON('komiteer', { sesjonid: sessionId })
  return (data.komiteer_liste || []).map((c: any) => ({
    id: c.id,
    name: c.navn || '',
  }))
}

export async function getCommitteeMembers(committeeId: string, sessionId: string): Promise<any[]> {
  try {
    const data = await fetchJSON('komitemedlemmer', { komiteid: committeeId, sesjonid: sessionId })
    return (data.komitemedlemmer_liste || [])
  } catch {
    return []
  }
}

// Get recent votes — fetches from treated cases; falls back to previous session if none found
export async function getRecentVotes(sessionId: string, limit = 50): Promise<{ vote: Vote; caseTitle: string; caseId: string }[]> {
  let cases = await getCases(sessionId)
  let treated = cases
    .filter(c => c.status === 'behandlet')
    .sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime())
    .slice(0, 25)

  // If no treated cases in current session, fall back to previous session
  if (treated.length === 0) {
    const prevCases = await getCases('2024-2025')
    treated = prevCases
      .filter(c => c.status === 'behandlet')
      .sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime())
      .slice(0, 25)
  }

  const results: { vote: Vote; caseTitle: string; caseId: string }[] = []

  for (const c of treated) {
    try {
      const votes = await getVotesForCase(c.id)
      for (const v of votes) {
        results.push({ vote: v, caseTitle: c.shortTitle || c.title, caseId: c.id })
      }
      if (results.length >= limit) break
    } catch {
      // skip
    }
    await new Promise(r => setTimeout(r, 100))
  }

  return results
    .sort((a, b) => b.vote.date.getTime() - a.vote.date.getTime())
    .slice(0, limit)
}
