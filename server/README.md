# NDP V2.0 Server Skeleton

Это архитектурный каркас production backend, а не запущенный backend. GitHub Pages его не исполняет.

Целевая структура сохранена заранее:

- `domain/`
- `application/`
- `infrastructure/database/`
- `infrastructure/fingerprint/`
- `infrastructure/payments/`
- `http/routes/`
- `http/controllers/`
- `http/middleware/`
- `storage/`
- `tests/`

`infrastructure/database/schema.sql` фиксирует стартовую PostgreSQL модель. Реализация server runtime должна следовать контрактам `../docs/api.md`, а не переносить бизнес-логику в route handlers.
