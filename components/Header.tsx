'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Header() {
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  const linkClass = (href: string) =>
    `px-3 py-1.5 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition ${
      isActive(href) ? 'bg-gray-100 text-gray-900 font-semibold' : 'text-gray-600'
    }`

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-lg font-extrabold text-gray-900 tracking-tight flex-shrink-0">
          TINGVAKT
        </Link>
        <nav className="flex items-center gap-1 text-sm font-medium overflow-x-auto scrollbar-none ml-4">
          <Link href="/saker" className={linkClass('/saker')}>Saker</Link>
          <Link href="/voteringer" className={linkClass('/voteringer')}>Voteringer</Link>
          <Link href="/partier" className={linkClass('/partier')}>Partier</Link>
          <Link href="/representanter" className={linkClass('/representanter')}>Representanter</Link>
          <Link href="/komiteer" className={linkClass('/komiteer')}>Komiteer</Link>
          <Link href="/sok" className={`${linkClass('/sok')} flex-shrink-0`} title="Søk">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </Link>
        </nav>
      </div>
    </header>
  )
}
