# Tingvakt — Roadmap & Fix List

## Current State (March 2026)

Tech: Next.js 14, Tailwind v3, Stortinget open API
Session: 2025-2026 (hardcoded — 411 cases)
Deployed: localhost only, not on Vercel yet

---

## 🔴 Known Bugs

### Data
- **Voteringer detail** — party breakdown shows "Ingen stemmedata" for some votes. The `voteringsresultat` endpoint works for older sessions (2023-2024) but not 2025-2026 — cases too new, no votes recorded yet. Workaround: show vote details from what we have (passed/failed, counts) + "Ingen partifordeling ennå" message.
- **Voteringer -1 counts** — some votes still show 0/0 for/mot. These are procedural votes (romertall I, II) with no individual tallies. Filter these out or show "Prosedurevotering" label.
- **Party seats** — some parties may show wrong seat count depending on API response for 2025-2026. Verify Ap=53, FrP=47, H=24 etc.

### UI
- **"Denne uken" widget** — may not appear if all cases are older than 7 days (session started Oct 2025, many cases are from early session). Fix: show "Siste 30 dager" or last 10 updated cases instead.
- **Søk** — "/" keyboard shortcut may not work due to Next.js routing intercepting it
- **Komiteer filter** — "Den særskilte komité for å behandle..." and korona committee still showing in dropdowns

---

## 🟡 Missing Features

### High value
1. **Saker — full text summary** — The API doesn't return bill summaries. Could scrape `stortinget.no/saker/{id}` or link directly. Add "Les mer på Stortinget.no →" prominently on saker detail.
2. **Votering partifordeling** — works for 2023-2024 votes but not current session. Show historical voting pattern per party on saker detail page using older data.
3. **Representant stemmehistorikk** — No `personstemmer` endpoint exists. Can't show per-MP vote history. Alternative: show their committee memberships + link to Stortinget profile.
4. **"Nye saker i dag"** — poll API for cases added/updated today and highlight them
5. **RSS/oppdateringer** — let users follow specific topics or committees (email/push later)

### Medium value
6. **Parti vs parti sammenligning** — side-by-side stats for two parties
7. **Komité-detalj forbedring** — show active saker per komité (works via filtering getCases by committee name)
8. **Tidslinje-visning på saker** — show progression of a bill from fremmet → komité → innstilling → vedtak
9. **Statistikk-side** — total vedtak, gjennomsnittlig behandlingstid, mest aktive komité
10. **Mobiloptimalisering** — header nav overflows on small screens

### Low value / future
- Mørk modus
- Notifikasjon ved nye saker i din komité
- Brukerkonto / favoritter
- Norsk + Engelsk språkvalg

---

## 🟢 API Capabilities (confirmed working)

| Endpoint | Works | Notes |
|---|---|---|
| `saker?sesjonid=` | ✅ | 411 cases in 2025-2026 |
| `voteringer?sakid=` | ✅ | Returns votes per case |
| `voteringsresultat?voteringid=` | ✅ | 169 individual MP votes, works for 2023-2024 |
| `representanter?stortingsperiodeid=` | ✅ | 169 MPs, 2025-2029 period |
| `personbilde?personid=` | ✅ | Proxied via /api/photo |
| `partier?sesjonid=` | ✅ | Party seats data |
| `komiteer?sesjonid=` | ✅ | Committee list |
| `komitemedlemmer?komiteid=` | ✅ | Members per committee |
| `fylker` | ✅ | All counties |
| `stortingsperioder` | ✅ | Parliamentary periods |
| `personstemmer` | ❌ | 404 — no per-MP vote history |
| `dagensagenda` | ❌ | 404 — no today's schedule |
| `moteplan` | ❌ | 404 — no meeting plan |
| `taler` | ❌ | 404 — no speeches |

---

## 🚀 Next Claude Code batches

### Batch A — Bug fixes
- Fix "Denne uken" to show last 30 days or last 10 updated
- Filter procedural votes (0/0 counts) from voteringer list
- Fix inactive committees from all dropdowns
- Fix voteringsdetalj empty state message

### Batch B — Design overhaul
- Full visual redesign using Uiverse.io components
- Better typography, more visual hierarchy
- Mobile responsive nav (hamburger menu)
- Add proper page transitions

### Batch C — New features
- Saker detail: add full link to stortinget.no with prominent CTA
- Komité detail: filter and show active saker
- Statistikk page: session overview with charts
- Sammenligningsside: two parties side by side

### Deploy
- Set up Vercel deployment
- Add domain (tingvakt.no?)
- SEO meta tags
- og:image for social sharing
