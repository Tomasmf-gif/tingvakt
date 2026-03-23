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
    case 'behandlet': return 'bg-green-100 text-green-800'
    case 'til_behandling': return 'bg-blue-100 text-blue-800'
    case 'mottatt': return 'bg-gray-100 text-gray-700'
    case 'bortfalt': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-700'
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
