# NDP V2.0 — Test Report

## PASS — automated

Команда: `npm run qa`

Проверено:

- JavaScript syntax: app/core/transition;
- ADNA boundary policy относительно значений из единого `core/config.js`;
- rights totals: 70+30, 50+50, invalid 101/90/negative;
- provenance graph cycle rejection;
- provenance configured max-depth rejection, включая новый ещё не сохранённый node;
- NDT 1.0 validation;
- RoyaltyEngine total preservation;
- local asset/link existence;
- duplicate HTML IDs;
- V2 core/document files;
- отсутствие дублирования исполняемых ADNA thresholds в `service/app.js`.

## PASS — HTTP static smoke

Локальный `python -m http.server` вернул HTTP 200 для:

- `/`;
- `/service/`;
- `/service/core/config.js`;
- `/transition.js`.

## Browser smoke test

Попытка запуска системного Chromium выполнена. В build-контейнере Chromium зависает даже на минимальном `data:` HTML, поэтому browser automation недоступна в этой среде. Статическая, domain и HTTP-проверка проекта проходит.

## Production tests still required

Реальный ADNA benchmark, malformed audio/decoder crash, server upload timeout/CPU/rate limits, SQL injection, server-side path traversal, real PostgreSQL migrations, CORS/CSP/HSTS и payment-provider integration относятся к production backend и не могут быть подтверждены статическим GitHub Pages demo.
