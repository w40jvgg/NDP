# NDP v13 — Mobile-first QA

## Scope

This build applies the mobile-first landing requirements from the supplied master prompt while preserving the existing desktop landing, service business logic, logo navigation and 5-second Landing ↔ Service transition.

The mobile interaction model is intentionally simple:

- vertical native scrolling;
- tap/click actions;
- no required horizontal swipe;
- no page-level horizontal scrolling;
- no off-canvas content that must be dragged sideways.

## Mobile architecture implemented

- Dedicated mobile composition layer instead of shrinking the desktop layout.
- Safe-area aware header/content using `env(safe-area-inset-*)`.
- Compact tap-only vertical navigation popover; no swipe-to-close drawer.
- Rebuilt mobile hero with one-column reading order and stacked CTAs.
- Provenance graph converted to a vertical tap-controlled path on phones.
- “Как работает NormalDance” rebuilt as native vertical scroll storytelling:
  - portrait devices with sufficient height use one sticky scene controlled by page scroll;
  - short screens, landscape and reduced-motion mode use a complete vertical fallback containing all 8 stages and their full explanatory text.
- Capability stack converted to a vertical editorial sequence.
- Wide interactive graph converted to a vertical tree on phones.
- Royalty and architecture flows converted to vertical pipelines.
- AI / technology blocks reflow to single-column mobile structures.
- Footer and final CTA use a dedicated vertical mobile layout.
- Transition screen has a portrait-specific composition while preserving the existing 5-second animated waveform/progress route transition.

## Horizontal interaction audit

Static scan of the dedicated landing mobile layer confirms no:

- `touchstart` / `touchmove` / `touchend` swipe navigation handlers;
- `clientX` / `deltaX` horizontal gesture logic;
- `scroll-snap-type: x`;
- mobile `overflow-x: auto` / `scroll` content tracks;
- horizontal swipe required to reach landing content.

The service business logic was not rebuilt. Its existing navigation remains tap-driven; the landing mobile rebuild does not introduce horizontal gestures into it.

## Automated viewport checks

Rendered and inspected with Chromium mobile/touch emulation using the actual NDP HTML/CSS/JS composition (inlined locally to avoid external navigation restrictions).

Portrait widths tested:

| Viewport | Page overflow | Touch target scan | Text overflow | Story mode |
|---|---:|---:|---:|---|
| 320×568 | none | no principal target <44 px | none | full vertical fallback |
| 360×800 | none | no principal target <44 px | none | vertical sticky story |
| 375×812 | none | no principal target <44 px | none | vertical sticky story |
| 390×844 | none | no principal target <44 px | none | vertical sticky story |
| 430×932 | none | no principal target <44 px | none | vertical sticky story |

For every portrait run, `documentElement.scrollWidth === clientWidth`.

The sticky story was programmatically sampled mid-sequence and reached stage `05`, confirming that vertical scroll progress updates the stage state.

A separate touch-enabled compact landscape run at 844×390 also completed with:

- no page-level horizontal overflow;
- no principal touch-target violations;
- short-height vertical fallback instead of sticky choreography.

## Header/theme verification

- Header fits at 320 px and 430 px without overlap.
- Principal header controls remain 44×44 px.
- Dark theme mobile header resolves to the dark background token.
- Light theme mobile header resolves to the light background token after the controlled theme transition.
- Theme button remains accessible on phone widths.
- Header background and dimensions remain stable while scrolling; no intentional height collapse is used.

## Text/layout verification

Automated checks report no detected text node whose scroll width exceeds its content box on the tested portrait sizes.

Specific long-content hardening includes:

- `min-width: 0` on nested grids;
- `minmax(0,1fr)` for responsive tracks;
- controlled wrapping for IDs/code values;
- wider mobile label allocation for long labels such as “Правообладатель”.

## Motion/performance design

- Native browser scrolling remains authoritative; no artificial smooth-scroll engine.
- Ordinary reveal effects use `transform` + `opacity`.
- Sticky story scroll work is activated only near the story and updates through one `requestAnimationFrame` cycle.
- IntersectionObserver is used for visibility/reveal orchestration where applicable.
- Decorative motion is reduced on mobile.
- `prefers-reduced-motion` disables sticky choreography and exposes the complete vertical content fallback.
- Persistent animation is not required for access to information.

## Transition invariant

- Landing ↔ Service remains logo-driven.
- `TRANSITION_MS = 5000` is unchanged.
- Existing animated waveform and progress logic remain functional.
- A portrait-specific transition layout is present in both landing and service documents so the transition is not a cropped desktop canvas on phones.

## Source/static validation

Passed:

- `node --check`:
  - `script.js`
  - `mobile.js`
  - `transition.js`
  - `service/app.js`
  - `service/mobile.js`
- CSS parse via `tinycss2` with zero parser errors:
  - `styles.css`
  - `mobile.css`
  - `transition.css`
  - `service/styles.css`
  - `service/mobile.css`
- no duplicate IDs in landing/service HTML;
- local stylesheet/script/image references resolve;
- no page-level horizontal swipe code found in the rebuilt landing mobile layer.

## Limitations of this QA environment

This build was visually exercised with Chromium mobile/touch emulation, not on physical iPhone/Android hardware. Therefore the following should still be verified before a production release on real devices:

- Safari iOS dynamic browser chrome / Dynamic Island compositor behavior;
- 60/120 Hz frame pacing on physical hardware;
- Samsung Internet-specific rendering;
- physical keyboard/IME interactions in the service;
- Lighthouse/Core Web Vitals using the deployed production URL.

No Lighthouse score is claimed in this report because Lighthouse is not installed in the current execution environment.
