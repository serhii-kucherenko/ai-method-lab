# Service Credit Studio — ERD

Aggregates: Contract, Incident, CreditDraft, Window, Exclusion, Forecast, AuditEvent, Member.

Relations: Contract 1-* Incident; Contract 1-* Window; Incident *-* Exclusion; Forecast references Contract + Incidents; CreditDraft from Forecast.
