import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Tingvakt — Hold øye med Stortinget',
  description: 'Følg norsk politikk i sanntid. Saker, voteringer, partier og representanter fra Stortinget.',
  keywords: ['Stortinget', 'norsk politikk', 'voteringer', 'saker', 'representanter', 'komiteer'],
  openGraph: {
    title: 'Tingvakt — Hold øye med Stortinget',
    description: 'Følg norsk politikk i sanntid. Saker, voteringer, partier og representanter fra Stortinget.',
    type: 'website',
    locale: 'nb_NO',
  },
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nb">
      <body className={`${inter.variable} font-sans bg-white text-gray-900 antialiased`}>
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
