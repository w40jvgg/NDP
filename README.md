# NormalDance Protocol — NDP V2.0

NDP V2.0 развивает существующий лендинг и сервис без переписывания проекта с нуля. Сборка остаётся совместимой с GitHub Pages и одновременно вводит отдельный domain layer для ADNA, NDT, provenance и royalties.

## Запуск

```bash
python -m http.server 8080
```

Открыть `http://localhost:8080/`.

Для проверки без внешних зависимостей:

```bash
npm run qa
```

## Что реально работает в demo

- лендинг + branded signal/oscilloscope transition;
- вход, локальная регистрация и профиль;
- dashboard;
- ADNA DEMO с централизованной SimilarityPolicy;
- реестр и NDT 1.0;
- вертикальный provenance graph;
- регистрация произведения с валидацией rights = 100%;
- AI policy;
- RoyaltyEngine с детерминированным breakdown;
- DemoPaymentProvider со статусом `Payment Prepared`, без реального платежа;
- библиотека сэмплов;
- сообщения и публичные профили;
- API/MCP examples;
- dark/light theme;
- локальная schema migration;
- полный `NDP Backup` import/export;
- mobile layout без обязательных горизонтальных свайпов.

## Что не является production

- реальный perceptual ADNA engine;
- PostgreSQL runtime;
- server auth;
- production REST/MCP backend;
- СБП / цифровой рубль;
- юридическая квалификация совпадений.

Backend target и API contracts описаны в `server/` и `docs/`.

## V2 core

- `service/core/config.js` — версии, лимиты и единственный источник ADNA thresholds;
- `service/core/domain.js` — SimilarityPolicy, RightsValidator, NDT, graph, royalty, payment interfaces;
- `service/core/storage.js` — LocalRepository, migration, audit trail, NDP Backup;
- `service/core/api-demo.js` — локальный demo adapter;
- `service/core/api-client.js` — server HTTP adapter;
- `service/runtime-config.js` — переключатель demo/server deployment.

## Переход Landing ↔ Service

Сохранён фирменный осциллограф и реальная progress-анимация, но искусственная задержка сокращена до ~1.8 с. При `prefers-reduced-motion` сложное движение уменьшается.

## Документы

См. `manifest.md`, `glossary.md`, `lab-story.md`, `docs/adna.md`, `docs/ndt.md`, `docs/architecture.md`, `docs/api.md`, `docs/database.md`, `docs/security.md`.
