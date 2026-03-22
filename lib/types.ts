export interface Case {
  id: string
  title: string
  shortTitle: string
  type: 'budsjett' | 'lovsak' | 'alminneligsak'
  status: 'varslet' | 'mottatt' | 'til_behandling' | 'behandlet' | 'trukket' | 'bortfalt'
  documentGroup: string
  committee?: string
  lastUpdated: Date
  reference: string
  topics: string[]
}

export interface Vote {
  id: string
  caseId: string
  topic: string
  passed: boolean
  method: string
  votesFor: number
  votesAgainst: number
  absent: number
  date: Date
}

export interface VoteResult {
  mpId: string
  mpName: string
  party: string
  county: string
  vote: 'for' | 'mot' | 'ikke_tilstede'
}

export interface MP {
  id: string
  firstName: string
  lastName: string
  party: string
  county: string
  photoUrl: string
}

export interface Party {
  id: string
  name: string
  seats: number
  color: string
  polling?: number
}

export interface Committee {
  id: string
  name: string
}
