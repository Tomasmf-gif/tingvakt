export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8 text-xs text-gray-400">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="font-medium text-gray-600 mb-1">Tingvakt — Norsk politikk i klartekst</p>
            <p>Tingvakt er et uavhengig prosjekt og er ikke tilknyttet Stortinget.</p>
          </div>
          <div>
            <p>Data fra Stortingets åpne datatjeneste (<a href="https://data.stortinget.no" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">data.stortinget.no</a>)</p>
            <p className="mt-1">Lisens: Norsk lisens for offentlige data (NLOD)</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
