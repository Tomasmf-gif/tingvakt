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

export function statusColor(status: string): string {
  switch (status) {
    case 'behandlet': return 'text-passed'
    case 'til_behandling': return 'text-inprogress'
    case 'trukket':
    case 'bortfalt': return 'text-failed'
    default: return 'text-gray-500'
  }
}
