# Online Diff Studio — ARS brief

Idea-first OT/ICS wedge (BACKLOG prefer OT).  
Related: `docs/ideas/online-diff-studio-RELATED-WORKS.json` (weak bibliographic neighbors - treat as context only).  
Not a Ladder Bomb / Change Freeze / Download Gate clone.

## Job to be done

OT engineers need to see **what changed between the last approved offline program and what is running online** before the next production window - a diff they can attach to MOC, not a full formal bomb-finder.

## Unique claim

| Prior | Difference |
|-------|------------|
| Ladder Bomb Studio | Formal bomb/trigger synthesis - not day-to-day online↔offline diff |
| Change Freeze Studio | Freeze holds - not program content diff |
| Download Gate Studio | Interlock before download - not continuous drift view |
| Bypass Audit | Temporary override expiry - different object |

**Claim:** If we remove **online↔approved offline program diff → attachable MOC evidence**, the rest is a generic file compare desk.

## Buyer / money
- Buyer: OT / ICS controls engineers + change owners  
- Money: plant/site seats + diff-run usage  
- Software-solvable: yes (import/export artifacts + diff UI; honesty: soft-sim, not live PLC write)

## Falsifiers
1. Plants refuse any offline export path → no data  
2. Diff noise overwhelms signal without vendor-specific parsers → trust death

## Recommendation
Score under biz-rubric-v2. Prefer as next OT candidate while Commitment Coverage waits for climb arming.
