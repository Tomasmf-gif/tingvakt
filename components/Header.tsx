import Link from 'next/link'

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-gray-900">
          TINGVAKT
        </Link>
        <nav className="flex gap-6 text-sm font-medium text-gray-600">
          <Link href="/saker" className="hover:text-gray-900 transition">Saker</Link>
          <Link href="/voteringer" className="hover:text-gray-900 transition">Voteringer</Link>
          <Link href="/partier" className="hover:text-gray-900 transition">Partier</Link>
          <Link href="/representanter" className="hover:text-gray-900 transition">Representanter</Link>
          <Link href="/sok" className="hover:text-gray-900 transition">🔍</Link>
        </nav>
      </div>
    </header>
  )
}
