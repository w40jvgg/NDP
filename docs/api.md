# NDP API v1 — target contracts

## Compatibility routes

- `GET /oracle/stats`
- `POST /oracle/identify_file`
- `POST /oracle/identify`
- `POST /oracle/compare`
- `GET /registry/tracks/{isrc}`

## Versioned routes

- `POST /api/v1/adna/identify`
- `POST /api/v1/adna/compare`
- `GET /api/v1/registry/tracks/{id}`
- `GET /api/v1/rights/{id}`
- `GET /api/v1/graph/{id}`
- `POST /api/v1/royalties/calculate`

## Error envelope

```json
{
  "error": {
    "code": "INVALID_AUDIO",
    "message": "Не удалось обработать аудиофайл.",
    "request_id": "req_..."
  }
}
```

Stack trace, SQL, filesystem path и secrets не должны возвращаться клиенту.

## REST / MCP rule

REST и MCP должны вызывать один application/domain layer. Отдельная бизнес-логика для MCP не допускается.
