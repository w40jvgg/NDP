# NormalDance Protocol — Landing

Статический лендинг без внешних библиотек, CDN и сборщика. Основная версия дополнена scroll-storytelling: прокрутка не просто меняет секции, а последовательно показывает логику работы NormalDance.

## Запуск

Откройте `index.html` напрямую или запустите локальный сервер:

```bash
python -m http.server 8080
```

После этого откройте `http://localhost:8080`.

## Структура

- `index.html` — семантическая разметка лендинга и SVG-сцены;
- `styles.css` — дизайн-система, sticky/pinned storytelling, card stack, адаптивность, dark/light theme;
- `script.js` — тема, мобильная навигация, scroll-progress, управление 8 этапами сцены, reveal и интерактивные provenance-узлы;
- `assets/ndp-logo.png` — предоставленный логотип NDP / NormalDance Protocol, оптимизированный для веба.

## Scroll-storytelling

Центральная сцена проходит восемь состояний:

1. исходный трек;
2. цифровой паспорт прав NDT;
3. перцептивный отпечаток ADNA;
4. граф производных произведений;
5. событие использования;
6. расчёт долей;
7. каскадное распределение роялти;
8. подготовка выплаты.

Визуальный мотив один: waveform → fingerprint → connection line → rights graph → royalty flow.

После storytelling расположены:

- стек ключевых возможностей;
- интерактивный граф происхождения;
- поток роялти;
- слой прав для ИИ;
- технологическое ядро;
- последовательная архитектурная схема;
- финальный CTA перехода в сервис.

## Производительность и доступность

- нет тяжёлых frontend-фреймворков и WebGL;
- анимации основаны преимущественно на `transform`, `opacity` и SVG;
- scroll-handler работает через `requestAnimationFrame`;
- поддерживается `prefers-reduced-motion`;
- на мобильных pinned-сцена заменяется компактной визуализацией и последовательным текстовым резюме;
- нет горизонтального overflow на контрольных ширинах 320, 390, 768, 1024, 1440 и 1920 px;
- интерактивные SVG-узлы доступны с клавиатуры.

## Переход в сервис

Кнопки «Открыть сервис» и «Перейти в NormalDance» ведут в соседнюю папку `../normaldance-service/index.html`. При production-размещении замените относительный путь на фактический URL сервиса, если структура каталогов отличается.


## Обновление плавности scroll-story

- Используется логотип NDP из предоставленного PNG (`assets/ndp-logo.png`).
- Storytelling переведён с накопительного показа карточек на последовательный: предыдущая сцена сначала исчезает, затем проявляется следующая.
- Визуальный прогресс имеет отдельное сглаживание через `requestAnimationFrame`, поэтому колесо мыши и трекпад не вызывают резких скачков между состояниями.
- Граф происхождения сохраняется только как намеренно приглушённый контекст на этапах события, расчёта и роялти; остальные старые сцены не накладываются.


## 2026-09-21 — Brand wordmark update
Visible landing/service brand marks use the supplied horizontal NDP / NormalDance Protocol wordmark at increased display sizes. The 5-second transition icon remains unchanged.

## Transition v9
Экран перехода использует предоставленный пользователем референс без изменения композиции. Статическая шкала из изображения перекрывается и заменяется реальной шкалой загрузки 0→100%, синхронизированной с 5-секундным переходом Landing ↔ Service.

## Mobile v10 — vertical-only interaction

Mobile navigation no longer requires left/right swipes. Landing content is available through native vertical scrolling and tap only. The “Как работает NDP” scene is driven by vertical scroll, service tabs/progress are vertical, the mobile dashboard table becomes stacked record cards, and the service menu is tap/backdrop controlled without swipe-to-close.


## Transition v11 — live waveform

Экран перехода Landing ↔ Service использует предоставленную пользователем NDP-композицию 1774×887 как визуальную основу. Поверх изображения работает отдельный Canvas-осциллограф: цветные вертикальные полосы плавно меняют амплитуду и получают движущийся sweep-проход. Шкала загрузки перекрывает статические 78% исходного изображения и реально проходит 0→100% за время 5-секундного перехода; числовой процент обновляется синхронно. Остальной интерфейс и mobile-v10 навигация не изменены.

## 2026-09-21 — White logo v12

All visible NDP brand marks now use the supplied headphone/equalizer logo converted to pure white with a transparent alpha background. The legacy wordmark, mark, favicon and unused transition-logo assets were removed. The same white logo is used on the landing, service auth surfaces, sidebar and transition artwork. The v11 animated waveform/progress transition logic remains in place.

## 2026-09-21 — Mobile Rebuilt v13

The landing mobile experience was rebuilt as a dedicated vertical composition based on the supplied mobile-first master specification. Desktop layout and service business logic remain intact.

Key changes:

- vertical scroll + tap is the complete mobile interaction model;
- no required left/right swipes or horizontal content tracks;
- mobile header/menu rebuilt for safe areas and one-hand use;
- hero, provenance, capability, graph, royalty, AI, architecture, CTA and footer sections use mobile-specific reading order;
- “Как работает NormalDance” is a vertically driven sticky story with a complete static fallback for short landscape/reduced motion;
- wide graphs become vertical mobile paths instead of horizontally pannable diagrams;
- typography/spacing/touch targets were recalculated for phone viewports;
- portrait-specific Landing ↔ Service transition layout added while preserving the existing 5-second waveform/progress transition;
- automated layout checks performed at 320, 360, 375, 390 and 430 px plus compact touch landscape.

See `MOBILE_QA.md` for the exact QA scope and limitations.
