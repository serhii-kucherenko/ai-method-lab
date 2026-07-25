# ERD — Persona Triage Studio

## Aggregates
1. **Org** — members, webhook secret, API tokens  
2. **PersonaPack** — versioned pack of personae  
3. **Persona** — style axes + emotional/strategy tags  
4. **ConversationCase** — clinical content + gold urgency  
5. **UrgencyRun** — A/B scores + disparity delta  
6. **AuditEvent** — mutations  

## Relationships
Org 1—* PersonaPack 1—* Persona  
Org 1—* ConversationCase  
PersonaPack + ConversationCase → UrgencyRun  
Org 1—* AuditEvent  
