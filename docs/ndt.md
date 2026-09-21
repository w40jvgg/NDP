# NDT 1.0

NDT — машиночитаемый паспорт произведения и прав.

```text
ndt_version
ndt_standard
identity
music
integrity
rights
licenses
provenance
ai_policy
status
```

## Invariants

- `identity.ndp_id` обязателен.
- `identity.title` обязателен.
- `rights.splits[]` обязателен.
- сумма `rights.splits[].share` = 100%.
- доля каждого участника от 0 до 100.
- `ai_policy` хранится отдельно от общего текстового статуса лицензии.

В V2.0 преобразование legacy track → NDT выполняет `NDTFactory`, а валидацию — `NDTValidator`.
