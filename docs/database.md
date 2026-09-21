# PostgreSQL target model

Основные таблицы production-схемы:

- users
- tracks
- ndt_documents
- rights_splits
- licenses
- derivation_edges
- adna_fingerprints
- usage_events
- royalty_statements
- royalty_lines
- payment_instructions
- conversations
- messages
- library_assets
- audit_events

Ключевые ограничения: `rights_splits.share` 0..100; сумма splits = 100% проверяется transaction/domain layer; derivation edges не допускают циклов; version fields обязательны для NDT/ADNA/API migrations.
