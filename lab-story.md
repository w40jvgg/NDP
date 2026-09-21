# NDP V2.0 — Lab Story

Сквозной demo-сценарий показывает архитектуру без имитации production-инфраструктуры:

1. Аудиофрагмент поступает в ADNA DEMO.
2. DemoFingerprintEngine формирует детерминированный технический результат.
3. SimilarityPolicy применяет централизованные demo-пороги: SAME ≥ 0.90; DERIVATIVE ≥ 0.75; DIFFERENT < 0.75.
4. NDP-ID разрешается в NDT 1.0.
5. ProvenanceGraphService раскрывает источники и производные связи.
6. UsageEvent передаётся RoyaltyEngine.
7. RoyaltyEngine строит воспроизводимый breakdown.
8. DemoPaymentProvider возвращает `Payment Prepared · DEMO`; денежный перевод не выполняется.
