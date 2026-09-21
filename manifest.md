# NDP V2.0 — Product Manifest

NormalDance Protocol (NDP) — инфраструктурный слой музыкальных прав и происхождения контента.

Основная технологическая цепочка:

`AUDIO → ADNA → NDP-ID → NDT → RIGHTS GRAPH → USAGE → ROYALTY ENGINE → PAYMENT`

Человеческий слой:

`AUTHOR → PROFILE → LIBRARY → TRACK/SAMPLE → LICENSE → COLLABORATION → MESSAGES`

## Product truth

Текущая сборка V2.0 — функциональный статический demo-контур для GitHub Pages. Локально реализованы UI, доменные валидаторы, граф происхождения, детерминированный demo fingerprint engine, NDT 1.0, royalty calculation, профили, библиотека, сообщения, migration и NDP Backup.

Не подключены: production ADNA engine, серверная авторизация, PostgreSQL, реальные платёжные провайдеры и production REST/MCP backend. Эти компоненты представлены контрактами и adapters/skeleton.
