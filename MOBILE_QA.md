# NDP V2.0 — Mobile QA

## Целевые ширины

320, 360, 375, 390, 393, 414, 430, 768, 1024, 1280, 1440, 1920 px.

Особый приоритет: iPhone 16 Pro.

## Правила V2

- обязательных horizontal swipe нет;
- mobile navigation — tap + vertical scroll;
- таблица dashboard на mobile преобразуется CSS/JS существующей mobile-системой;
- How it works steps — вертикальный список;
- provenance graph — вертикальная цепочка;
- verify tabs — вертикальная сетка;
- новые AI policy/runtime/backup blocks не создают horizontal scroll;
- code examples используют wrap на mobile;
- длинные NDP-ID/ADNA допускают word-break.

## Automated checks

`npm run qa` проверяет синтаксис, domain invariants, локальные ссылки, duplicate IDs и central threshold policy.

Headless Chromium в текущем build-контейнере зависает даже на минимальном `data:` документе, поэтому browser-level viewport smoke test в этой среде автоматически не выполнен. Это ограничение среды тестирования, а не обнаруженный дефект проекта. Перед production deployment рекомендуется прогнать DevTools/Playwright на перечисленных viewport.
