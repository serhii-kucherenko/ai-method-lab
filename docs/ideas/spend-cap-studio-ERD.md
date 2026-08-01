# Spend Cap Studio — ERD

Entities: Account, Cap, Meter, Charge, Breach, Override, Member, AuditEvent.  
Cap binds Account + period + amountUsd. Charge references Meter and Cap evaluation. Override grants temporary exceed. Breach records unapproved over-cap proceeds.
