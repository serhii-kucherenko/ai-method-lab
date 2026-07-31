# Online Diff Studio — kill rounds

## Kill 1 — Vendor tools already diff
**Attack:** Rockwell/Siemens IDEs already compare versions.  
**Answer:** Survive as **MOC-ready evidence pack + dual baseline** (approved offline vs running online) across imported artifacts - not a full IDE. If we only wrap one vendor compare, kill.  
**Verdict:** answered conditional.

## Kill 2 — Isomorphic Change Freeze / Download Gate
**Attack:** Another OT desk with rename.  
**Answer:** Objects differ (program revisions + drift findings). Fail if IA is freeze calendar or download interlock only.  
**Verdict:** answered with fence.

## Kill 3 — Soft-sim can't touch live PLCs
**Attack:** Without live online read, product is fake.  
**Answer:** Honesty fence - import/export soft-sim is OK for method lab; refuse live write-back claims. If marketing implies live PLC control, kill.  
**Verdict:** answered with fence.

## Outcome
Survives as research candidate pending score. Park if ≤ C.
