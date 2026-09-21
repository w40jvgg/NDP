# NDP V2.0 — Demo / Production matrix

| Компонент | V2.0 static build | Production target |
|---|---|---|
| Landing / Service UI | Работает | Работает без смены доменной модели |
| ADNA | `DemoFingerprintEngine` | Реальный versioned `FingerprintEngine` + benchmark |
| SimilarityPolicy | Работает, единый config | Та же policy через API/config |
| NDT 1.0 | Factory + validation + JSON/UI | Persisted versioned schema |
| Provenance | Graph service, cycle/max-depth checks | Repository + DB constraints/application validation |
| Royalty | Детерминированный расчёт + breakdown | Usage ingestion + persisted statements |
| Payment | `DemoPaymentProvider`, только `Payment Prepared` | SBP / Digital Ruble adapters после интеграции |
| Profiles / Library / Messages | Локальные demo-данные | Server repositories / auth |
| Storage | `LocalRepository` / localStorage | PostgreSQL repositories |
| Audit | Локальные audit events | Structured persistent audit/event log |
| Backup | `NDP Backup` import/export | Server-side backup/retention policy дополнительно |
| REST/MCP | Контракты, examples, HTTP adapter | Production API/MCP server |
| Upload security | Client size/type precheck | Signature/decode validation, timeout, CPU/rate limits, safe temp files |
| Auth | Локальная demo-сессия | Production identity/session system |
