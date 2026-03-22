# Tingvakt — Product Spec v1

## Overview
Norwegian legislative tracker. Plain-language politics for citizens.
Stack: Next.js 14 + Tailwind + Vercel + Claude API
Data: Stortinget open API (no auth, JSON)

## Pages (11 total)

### 1. Homepage `/`
- Latest votes feed (10 most recent)
- Each vote: title, date, passed/failed, count, AI summary
- Sidebar: latest polling bar chart + bloc breakdown
- Active bills section (currently in committee)

### 2. Bills `/saker`
- Full list for current session
- Filter: status (active/passed/rejected), type (lovsak/budsjett), committee
- Search by keyword
- Pagination

### 3. Bill detail `/sak/[id]`
- Title + document reference
- Status timeline: Fremmet → Komité → Innstilling → Plenum → Vedtatt
- AI summary in plain Norwegian
- Committee + rapporteur
- Vote result (bar + party grid)
- Links to stortinget.no documents

### 4. Votes `/voteringer`
- Chronological list grouped by date
- Filter: passed/failed/unanimous
- Party summary on each vote

### 5. Vote detail `/votering/[id]`
- Result bar (for/against)
- AI summary of what was voted on
- Party breakdown table
- Individual MP votes (expandable per party)

### 6. Parties `/partier`
- Latest polling bar chart
- Bloc breakdown (rød-grønn vs blå)
- Party cards: seats, polling %, % with government
- Party rebels section

### 7. Party detail `/parti/[id]`
- Leader, seats, polling
- 6-month polling trend chart
- MP list
- Latest party votes

### 8. MPs `/representanter`
- Grid of all 169 MPs with photos
- Filter by party, county
- Search by name
- "Din representant" — select county to see your MPs

### 9. MP detail `/representant/[id]`
- Photo, party, county
- Stats: party loyalty %, attendance %, total votes
- Committee memberships
- Recent votes
- Questions asked

### 10. Committees `/komiteer`
- List of 12 standing committees
- Members count + active bills count

### 11. Search `/sok`
- Search bills by keyword
- Results: title, status, committee, date

## Design
- Light background (#ffffff)
- Clean, minimal, lots of whitespace
- Inter font
- Accent green (passed), red (failed), blue (in progress)
- Mobile responsive

## Data sources
- Stortinget API: cases, votes, MPs, committees
- Polling: scrape from pollofpolls.no or NRK
- Claude API: bill summaries
- Future: Lovdata API (law diffs), partifinansiering (funding)

## Not in v1
- User accounts
- Alerts/notifications
- Law text diffs
- Money trail
- Historical trends
- Budget tracker
- Elections

## Safety & Legal

### Data licensing
- Stortinget API: NLOD — free, must credit
- Lovdata API: NLOD 2.0 — free for current laws, must credit
- SSB: CC BY 4.0 — free, must credit
- News RSS: headline + link only, never full articles

### Required attributions (in footer)
- "Data fra Stortingets åpne datatjeneste"
- "Lovdata — Norsk Lovtidend"
- "SSB — Statistisk sentralbyrå"

### AI summaries
- Label: "🤖 AI-generert sammendrag"
- Disclaimer: "Forenklet, kan inneholde unøyaktigheter. Les originaldokumentene."
- Never present as official text

### GDPR
- v1 no user data = no obligations
- MP data is public information
- Add privacy policy when user accounts come

### Political neutrality
- Present data, not opinions
- AI prompts must be neutral
- All parties shown equally

### Security
- API keys in env vars only
- HTTPS (Vercel default)
- Rate limit API routes
- No user data to protect in v1

## Additional Data Sources

### News (per bill)
- NRK RSS: nrk.no/toppsaker.rss
- Match bill keywords to headlines
- Show headline + link only
- Cache 1 hour

### Lovdata (current law text)
- api.lovdata.no
- Fetch law referenced in bill
- Show on bill detail
- v2: diff view
- Cache 24 hours

## Data Flow
- Stortinget API → lib/stortinget.ts → cache (in-memory Map) → Next.js server components
- Claude API → lib/ai.ts → cache forever
- News RSS → lib/news.ts → cache 1 hour
- Lovdata → lib/lovdata.ts → cache 24 hours
- Polling → lib/polling.ts → cache 6 hours

## File Structure
app/ — 11 pages (homepage, saker, voteringer, partier, representanter, komiteer, sok + detail pages)
lib/ — stortinget.ts, cache.ts, ai.ts, polling.ts, news.ts, lovdata.ts, types.ts, utils.ts, constants.ts
components/ — Header, Footer, VoteCard, CaseCard, PartyBar, VoteResultTable, StatusTimeline, MPCard, PollingChart, SearchBar
