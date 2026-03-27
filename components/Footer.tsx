export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-gray-400">
          <div>
            <p className="font-semibold text-gray-600 mb-2">Tingvakt</p>
            <p className="leading-relaxed">Norsk politikk i klartekst. Uavhengig prosjekt — ikke tilknyttet Stortinget.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-500 mb-2">Data</p>
            <p className="mb-1">
              <a href="https://data.stortinget.no" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">
                Stortingets åpne datatjeneste
              </a>
            </p>
            <p className="mb-1">Lisens: Norsk lisens for offentlige data (NLOD)</p>
            <p>
              <a href="https://data.stortinget.no/dokumentasjon" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">
                API-dokumentasjon
              </a>
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-500 mb-2">Lenker</p>
            <p className="mb-1">
              <a href="https://www.stortinget.no" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">
                Stortinget.no
              </a>
            </p>
            <p className="mb-1">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">
                GitHub
              </a>
            </p>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-gray-200 text-xs text-gray-300 text-center">
          Data fra Stortingets åpne datatjeneste · NLOD-lisens
        </div>
      </div>
    </footer>
  )
}
