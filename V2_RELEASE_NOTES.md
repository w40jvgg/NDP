# NormalDance Protocol — V2.0 Release Notes

## Сохранено из предыдущей версии

Лендинг, сервис, локальная регистрация/вход, dashboard, ADNA demo, реестр, мастер регистрации произведения, royalty demo, библиотека, сообщения, три разных диалога и публичных профиля, API/MCP экран, dark/light themes, mobile vertical layout, GitHub Pages compatibility и фирменный signal/oscilloscope transition сохранены и развиты, а не заменены новым проектом.

## Главное в V2.0

- Вынесен V2 core: config, domain, repositories/adapters.
- ADNA policy централизована; demo и production terminology разделены.
- Формализован NDT 1.0, проверяется сумма rights splits = 100%.
- Provenance стал first-class графом с cycle и max-depth validation.
- RoyaltyEngine отделён от PaymentProvider и выдаёт объяснимый breakdown.
- Demo payment показывает только `Payment Prepared · DEMO`.
- Добавлены granular AI policy, вертикальный provenance graph и NDT JSON view.
- Добавлены audit events, migration schema v1→v2 и `NDP Backup` import/export.
- Подготовлены `DemoApi` и `ServerApi`, versioned API contracts и backend skeleton.
- Переход Landing ↔ Service сохранён, но сокращён до короткого branded transition вместо искусственной долгой загрузки.
- Mobile сохраняет весь существенный контент через vertical scroll, без обязательных horizontal swipes.
- Добавлены архитектурная, API, ADNA, NDT, DB, security, migration и QA документация.

## Migration

При первом запуске `LocalRepository` создаёт pre-migration backup и дополняет старые треки V2-полями без удаления legacy keys. См. `docs/migrations.md`.

## QA result

`npm run qa` проходит: JavaScript syntax, domain tests, ADNA policy boundaries, rights invariants, graph cycles/max depth, NDT validation, royalty total preservation, local references и duplicate IDs.

Дополнительно статический проект запущен через локальный HTTP server: `/`, `/service/`, `/service/core/config.js` и `/transition.js` отвечают HTTP 200.

Browser visual automation остаётся deployment gate из-за неисправности headless Chromium в build environment; это отражено в отчётах, а не скрыто.

## Запуск и deployment

Локально: `python -m http.server 8080`, затем открыть `http://localhost:8080/`.

GitHub Pages: публиковать содержимое корня проекта как static site. Все локальные ассеты и переходы используют относительные пути. Для production server mode задать runtime API base URL и развернуть backend по `docs/api.md` / `server/README.md`.
