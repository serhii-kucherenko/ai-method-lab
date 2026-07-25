# Comprehensive blueprint — Persona Triage Studio

## Buyer story
An eval lead opens a persona pack, attaches conversation cases, runs style-aware vs idealized urgency scoring, and only locks the pack when disparity deltas are understood.

## Required routes
`/`, `/pricing`, `/demo`, `/onboarding`, `/flows`, `/personae`, `/conversations`, `/styles`, `/urgency`, `/compare`, `/scoreboard`, `/settings`, `/honesty`

## Flows (≥5)
1. Create persona pack + first persona  
2. Add conversation case with gold urgency  
3. Tune style axes and re-score  
4. Run A/B compare and read scoreboard  
5. Export pack + configure webhook  

## Platform must-haves
Auth, org/members, webhook HMAC, audit, export, search, pagination, rate limit, honesty fence, goldens, try.html.

## Anti-clone
No `/jobs` `/lifecycle` `/scenario` shells. Distinct clinical-eval IA.
