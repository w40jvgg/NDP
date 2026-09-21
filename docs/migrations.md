# NDP V2.0 — migrations

## Local schema v1 → v2

Миграция выполняется `LocalRepository.migrateLegacy()` при запуске сервиса.

Перед изменением данных создаётся резервная копия в `ndp_v2_migration_backup`. Существующие legacy keys сохраняются, чтобы не ломать совместимость с текущей demo-версией.

Для записей треков V2 добавляет, если поля отсутствуют:

- `ndtVersion` → текущая версия NDT;
- `fingerprintVersion` → текущая версия ADNA;
- `provenance[]` → строится из legacy `parent`, если он был задан;
- `aiPolicy` → преобразуется из legacy `aiLicense`.

После успешной миграции записывается metadata schema version 2 и audit event `StorageMigrated`.

## PostgreSQL target

Production schema описана в `server/infrastructure/database/schema.sql`. Реальный migration runner в статическую GitHub Pages сборку не включён; его необходимо подключить вместе с production backend.
