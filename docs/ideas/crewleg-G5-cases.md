# crewleg — depth test outline (G5)

Named cases for a future smoke oracle. Research only.

## Table B / acclimation (1–12)

1. Day legal (A): 0800 / 2 seg / 13.5h → legal
2. Day over (B): 0800 / 2 / 14.1 → illegal
3. Seven segments (C): 0800 / 7 / 12 → illegal (11.5)
4. Unacclimated −30 (D): 0800 / 2 / 13.6 → illegal (13.5)
5. Night edge (E): 0200 / 1 / 9 → legal
6. Deadhead not segment (F)
7. 0400 band / 5 segs → max 9
8. 1700 / 6 segs → max 9
9. 2300 / 4 segs → max 9
10. Unacclimated night 0200 / 1 / 8.6 → legal (8.5? wait: 9−0.5=8.5; 8.6 illegal)
11. Boundary exact max minutes (14.0 legal; 14.0 + 1 min illegal)
12. Invalid report_local out of bands → reject input

## Rest (13–18)

13. Rest ok (G)
14. Rest short (H)
15. Rest ok FDP bad (I)
16. Rest exactly 10.0 → legal
17. Rest 9.99 → illegal
18. Missing prior_duty_end when rest required → reject

## Combined / cheat (19–25)

19. Concurrent pairing version conflict on lock
20. Theater clock cheat (use destination local to inflate max) → reject; must use last acclimated theater
21. Count deadhead as segment → reject
22. Augmented Table C claimed without facility → reject (v0 unaugmented only)
23. PIC +2h extension without consent flag → still illegal vs scheduled Table B
24. Cumulative flight time over weekly (stub fail-closed or out of scope flag)
25. Expert scenario: split report across DST — minutes math must hold

Fixtures encoded today: A–I. Remaining 10–25 stay paper until next ticks.
