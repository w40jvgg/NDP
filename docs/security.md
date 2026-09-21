# Security / Privacy target

Static demo не загружает аудио на сервер. Production backend должен обеспечить:

- upload max 32 MiB по умолчанию;
- MIME + magic/signature validation;
- decoder validation;
- timeout и CPU limits;
- rate limits;
- безопасные temp files и удаление в `finally`/timeout/cancel;
- FFmpeg без `shell=true` и без shell-конкатенации пользовательских аргументов;
- CSP, HSTS, X-Content-Type-Options, Referrer-Policy;
- CORS deny-by-default;
- structured logs без аудио, полного ADNA и секретов;
- server-side auth/session hardening;
- PostgreSQL parameterized queries;
- request_id для ошибок и audit trail.
