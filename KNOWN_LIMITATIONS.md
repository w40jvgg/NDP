# NDP V2.0 — известные ограничения

Эта поставка является полноценной статической demo-сборкой и архитектурным контуром V2.0, но не выдаёт незавершённые интеграции за production.

1. ADNA использует `DemoFingerprintEngine`; реальный DSP/perceptual fingerprint engine и доказательный benchmark не включены.
2. GitHub Pages не выполняет backend. `ServerApi`, REST/MCP contracts и server skeleton подготовлены, но требуют отдельного runtime.
3. PostgreSQL schema является production target; текущие пользовательские данные сохраняются локально через `LocalRepository`.
4. СБП и цифровой рубль представлены только интерфейсами payment provider. Реальных денежных операций нет.
5. Полная server-side upload security (magic bytes, decoder sandbox, rate/CPU limits, temp lifecycle) требует backend.
6. Browser screenshot/E2E suite не был выполнен в build-контейнере: системный Chromium зависает даже на минимальном headless HTML. Выполнены syntax/domain/static/link/HTTP smoke tests; ручной visual regression остаётся deployment gate.
7. Значения ADNA similarity являются техническими demo-результатами и не являются юридической квалификацией нарушения авторских прав.
