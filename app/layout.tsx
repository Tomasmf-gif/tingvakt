import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Tingvakt — Norsk politikk i klartekst',
  description: 'Følg med på hva Stortinget vedtar. Saker, voteringer og representanter — forklart på enkel norsk.',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nb">
      <body className={`${inter.variable} font-sans bg-white text-gray-900 antialiased`}>
        <Header />
        <main className="max-w-6xl mx-auto px-4 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
