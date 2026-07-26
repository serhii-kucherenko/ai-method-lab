# Comprehensive blueprint — Dengue Suit Studio

## Routes
`/`, `/pricing`, `/demo`, `/onboarding`, `/flows`, `/packs`, `/scenarios`, `/species`, `/populations`, `/compare`, `/scoreboard`, `/settings`, `/honesty`

## Flows (≥5)
1. Create risk pack  
2. Configure CMIP6 scenario  
3. Configure species/population overlay  
4. Run A/B compare  
5. Export + webhook  

## Anti-clone
No `/jobs` `/lifecycle` `/scenario` shells — use `/scenarios` as domain noun for climate runs, not desk template.

## Scorers
- A `cmip6_thermal_suitability`
- B `static_historical_baseline`

## Goldens
`ds-001` … `ds-030`
