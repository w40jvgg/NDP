# NDP — Mobile optimization QA

Implementation scope: sections 22–35 of the supplied mobile-first specification. Desktop business logic, view hierarchy, data model, routes and service workflows are unchanged.

## Implemented

- viewport-fit=cover and safe-area insets for header, drawers, content and bottom spacing;
- explicit mobile states covering 320, 360, 375, 390, 393, 412, 414 and 430 px through continuous responsive rules plus narrow-edge guards;
- iPhone/Android portrait and compact landscape rules using svh/dvh and safe areas;
- mobile typography: H1 32–36 px, H2 24–28 px, H3 19–21 px where applicable, body 15–16 px, controls 15–17 px, captions >=12 px for principal UI;
- 16 px mobile side padding and min-width:0/minmax(0,1fr) hardening;
- no page-level horizontal scrolling; data tables/code/tabs may scroll inside their own containers;
- principal touch targets >=44×44 px, with 48 px preferred buttons;
- common motion tokens: 120 / 180 / 240 / 380 ms and NDP easing curves;
- mobile decorative hero parallax disabled to keep native scrolling responsive;
- mobile eight-stage “Как работает” sequence uses direct finger tracking, velocity completion, edge resistance and continuation from the current gesture position;
- no artificial smooth-scroll engine; native browser scrolling remains authoritative;
- mobile menu/drawer transitions use transform + opacity and avoid layout animation;
- reduced-motion fallback removes decorative loops and complex swipe scene animation;
- synchronous short theme transition and initial theme application before CSS paint to avoid theme flash;
- responsive logo assets with srcset/sizes; high-resolution transition logo remains available for high-DPR devices;
- landing ↔ service navigation remains only on NDP logos and retains the dedicated 5-second brand transition.

## Source-level acceptance checks

- transition buttons between landing and service are absent;
- NDP logos carry data-ndp-transition links in both directions;
- mobile CSS/JS layers load after the base styles/scripts;
- no business-logic files were replaced; only presentation/motion guards and theme transition hooks were adjusted;
- JavaScript syntax and local asset references are checked before packaging.

## Real-device verification recommended

Frame pacing, Safari Dynamic Island/browser-toolbar behavior and high-refresh rendering should still be confirmed on physical iPhone/Android hardware because headless rendering is not a substitute for real mobile compositor behavior.

## Packaging validation result

Passed before archive creation:

- `node --check`: `script.js`, `mobile.js`, `transition.js`, `service/app.js`, `service/mobile.js`;
- all local `src` / stylesheet references in landing and service resolve to existing files;
- CSS brace-balance check passed for mobile and transition layers;
- landing contains exactly one cross-product transition link and it is the NDP brand/logo;
- service transition links are attached only to NDP brand/logo elements;
- `.service-link` and `.landing-return` transition buttons are absent;
- 5-second brand transition remains `TRANSITION_MS = 5000`;
- transition layer remains pure black;
- full transition logo remains 2508×2508 px, with responsive mobile derivative available.


## v10 — Vertical-only mobile navigation

- Removed all landing horizontal swipe handlers.
- “Как работает NDP” is controlled only by native vertical scroll in a sticky 420svh scene.
- Stage transitions use opacity + translateY + scale only.
- Landing flow cards are a vertical sequence; no horizontal carousel or scroll-snap.
- Architecture flow is vertical on phones.
- Service sidebar is tap/backdrop/close-button controlled; swipe-to-close removed.
- Service verification tabs are vertical and fully visible; no scrollable tab bar.
- Service “Как работает” progress is vertical; no sideways stage list.
- Dashboard table becomes vertical record cards on mobile.
- Code/fingerprint output wraps instead of requiring horizontal pan.
- Page-level horizontal overflow remains clipped.
