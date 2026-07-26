# Comprehensive blueprint — Blood Loss Studio

## Routes
`/`, `/pricing`, `/demo`, `/onboarding`, `/flows`, `/packs`, `/births`, `/methods`, `/assays`, `/compare`, `/scoreboard`, `/settings`, `/honesty`

## Flows (≥5)
1. Create birth pack  
2. Configure weighed-swab method  
3. Configure calculated-loss assay  
4. Run A/B compare  
5. Export + webhook  

## Anti-clone
No `/jobs` `/lifecycle` `/scenario` desk shells — use packs / births / methods / assays as domain nouns.

## Scorers
- A `weighed_swab_measured`
- B `haemoglobin_calculated`

## Goldens
`bl-001` … `bl-030`
