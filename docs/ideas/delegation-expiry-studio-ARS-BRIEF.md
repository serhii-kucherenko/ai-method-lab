# Delegation Expiry Studio — ARS brief

Agent-safety wedge (BACKLOG prefer).  
Related: `docs/ideas/delegation-expiry-studio-RELATED-WORKS.json` (e.g. AC4A access control for agents; zero-trust MCP agent CLI).

## Job to be done

Platform leads need **temporary agent tool/delegation grants that expire on a clock** with an audit trail - not permanent scopes and not one-off bypass tickets.

## Unique claim vs prior lab products

| Prior | Difference |
|-------|------------|
| Tool Scope Studio | Bounds what tools exist - not time-boxed delegation |
| Bypass Audit Studio | Safety override expiry in OT - not agent tool grants |
| Selective Trust Studio | Judge escalate queues - not grant TTL |
| Agent Safety Studio | Structural monitors - not delegation clocks |

**Claim:** If we remove **time-boxed delegation grant → auto-expire → audit**, the remainder is a static ACL desk.

## Buyer / money
- Buyer: AI platform / security eng for agent fleets  
- Money: fleet seats + grant-event usage  
- Software-solvable: yes

## Falsifiers
1. Teams only use permanent IAM and never temporary grants  
2. Expiry without runtime enforcement is ignored → theater

## Recommendation
Score; queue behind Commitment Coverage + Online Diff climbs.
