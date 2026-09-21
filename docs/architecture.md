# NDP V2.0 Architecture

## Static/demo contour

```text
Landing
  ↓
NDP Signal Transition
  ↓
Service UI
  ↓
Application-compatible adapters
  ↓
Domain
  ├─ SimilarityPolicy / DemoFingerprintEngine
  ├─ NDTFactory / NDTValidator
  ├─ ProvenanceGraphService
  ├─ RoyaltyEngine
  └─ PaymentProvider
  ↓
LocalRepository
  ↓
localStorage
```

## Production target

```text
Web UI ─┐
REST API ├→ Application Services → Domain → Repositories → PostgreSQL
MCP Server┘                       ├→ FingerprintEngine
                                  └→ PaymentProvider
```

## Runtime modes

`service/runtime-config.js` содержит переключатель `demo/server`. В текущем GitHub Pages deployment используется `demo`. `ServerApi` подготовлен как HTTP adapter, но полноценный server-mode требует развернутого backend по контрактам `docs/api.md`.

## Data compatibility

V2.0 сохраняет legacy localStorage keys, выполняет migration до schema version 2 и предварительно создаёт backup `ndp_v2_migration_backup`.
