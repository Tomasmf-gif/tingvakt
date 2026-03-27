interface Props {
  status: string
  className?: string
}

const BADGE_STYLES: Record<string, string> = {
  behandlet: 'bg-green-50 text-green-700 border border-green-200',
  vedtatt: 'bg-green-50 text-green-700 border border-green-200',
  avvist: 'bg-red-50 text-red-700 border border-red-200',
  til_behandling: 'bg-blue-50 text-blue-700 border border-blue-200',
  mottatt: 'bg-blue-50 text-blue-700 border border-blue-200',
  varslet: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
  trukket: 'bg-gray-100 text-gray-500',
  bortfalt: 'bg-gray-100 text-gray-500',
}

const BADGE_LABELS: Record<string, string> = {
  behandlet: 'Vedtatt',
  til_behandling: 'Under behandling',
  mottatt: 'Mottatt',
  varslet: 'Varslet',
  trukket: 'Trukket tilbake',
  bortfalt: 'Bortfalt',
}

export function StatusBadge({ status, className = '' }: Props) {
  const cls = BADGE_STYLES[status] || 'bg-gray-50 text-gray-500 border border-gray-100'
  const label = BADGE_LABELS[status] || status
  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded ${cls} ${className}`}>
      {label}
    </span>
  )
}
