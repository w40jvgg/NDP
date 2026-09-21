# NDP Service V2.0

Статический service contour NormalDance Protocol. По умолчанию работает в `demo` mode и хранит пользовательские данные локально.

## Demo login

- `demo@normaldance.ru`
- `demo2026`

## Domain rules

- ADNA demo thresholds берутся только из `core/config.js`: SAME ≥ 0.90, DERIVATIVE ≥ 0.75, DIFFERENT < 0.75.
- Результат ADNA — техническая оценка сходства, не юридический verdict.
- NDT schema: 1.0.
- rights splits должны составлять 100%.
- provenance graph запрещает циклы и имеет max depth = 10.
- RoyaltyEngine отделён от PaymentProvider.
- DemoPaymentProvider не выполняет денежный перевод.

## Runtime modes

`runtime-config.js`:

```js
window.NDP_RUNTIME = {
  mode: 'demo',
  apiBaseUrl: ''
};
```

`server` mode требует развернутого backend по `../docs/api.md`. `core/api-client.js` содержит HTTP adapter; GitHub Pages backend не исполняет.

## Storage migration

Legacy localStorage сохраняется. При первом запуске V2 создаётся migration backup и записи получают version/provenance/AI policy metadata без удаления пользовательских данных.
