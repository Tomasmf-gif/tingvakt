export function formatDate(date: Date): string {
  return date.toLocaleDateString('nb-NO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatShortDate(date: Date): string {
  return date.toLocaleDateString('nb-NO', {
    day: 'numeric',
    month: 'short',
  })
}

export function relativeTime(date: Date): string {
  const diff = Date.now() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return 'i dag'
  if (days === 1) return 'i går'
  if (days < 7) return `${days} dager siden`
  if (days < 30) return `${Math.floor(days / 7)} uker siden`
  if (days < 365) return `${Math.floor(days / 30)} måneder siden`
  return `${Math.floor(days / 365)} år siden`
}

export function statusLabel(status: string): string {
  const map: Record<string, string> = {
    varslet: 'Varslet',
    mottatt: 'Mottatt',
    til_behandling: 'Til behandling',
    behandlet: 'Behandlet',
    trukket: 'Trukket',
    bortfalt: 'Bortfalt',
  }
  return map[status] || status
}

export function statusBadgeClass(status: string): string {
  switch (status) {
    case 'behandlet': return 'bg-green-50 text-green-700 border border-green-200'
    case 'til_behandling': return 'bg-blue-50 text-blue-700 border border-blue-200'
    case 'mottatt': return 'bg-gray-50 text-gray-600 border border-gray-200'
    case 'varslet': return 'bg-yellow-50 text-yellow-700 border border-yellow-200'
    case 'trukket': return 'bg-red-50 text-red-600 border border-red-200'
    case 'bortfalt': return 'bg-red-50 text-red-600 border border-red-200'
    default: return 'bg-gray-50 text-gray-500 border border-gray-100'
  }
}

export function statusColor(status: string): string {
  switch (status) {
    case 'behandlet': return 'text-passed'
    case 'til_behandling': return 'text-inprogress'
    case 'trukket':
    case 'bortfalt': return 'text-failed'
    default: return 'text-gray-500'
  }
}

// Official Norwegian party colors
const OFFICIAL_PARTY_COLORS: Record<string, string> = {
  // Full names
  'Arbeiderpartiet': '#d40014',
  'Høyre': '#0065f0',
  'Fremskrittspartiet': '#024c95',
  'Senterpartiet': '#00843d',
  'Sosialistisk Venstreparti': '#eb0036',
  'Venstre': '#007c5c',
  'Kristelig Folkeparti': '#f7a900',
  'Miljøpartiet De Grønne': '#4c9c2e',
  'Rødt': '#8b0000',
  'Pensjonistpartiet': '#ff8c00',
  // Short names / API IDs
  'A': '#d40014',
  'Ap': '#d40014',
  'H': '#0065f0',
  'FrP': '#024c95',
  'SP': '#00843d',
  'Sp': '#00843d',
  'SV': '#eb0036',
  'V': '#007c5c',
  'KrF': '#f7a900',
  'MDG': '#4c9c2e',
  'R': '#8b0000',
  'PF': '#ff8c00',
}

export function partyColor(party: string): string {
  return OFFICIAL_PARTY_COLORS[party] || '#666666'
}
