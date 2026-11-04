# RK cinematic and bilingual update — design QA

final result: passed

## Design target and scope

The existing RK site and user-supplied Makes & Partners screenshots remain the baseline for the homepage header and layout. This iteration intentionally adds a cinematic opening, English/Bahasa Indonesia controls and a redesigned cinematic notary journey as requested. No pixel-identical source claim is made for the newly designed notary content. Existing RK emerald/ivory colors, local Inter, supplied video and actual founder photo are preserved.

## Rendered visual evidence

All captures are actual Chromium screenshots at deviceScaleFactor 1:

- `test-results/opening-film.png`: 1440 × 1000, first visit, modal opening film in progress with RK title and visible skip control.
- `test-results/notary-cinema-en.png`: 1440 × 1000, English hero, reduced-motion poster state, full header and language switch.
- `test-results/notary-explorer-en.png` and `test-results/notary-explorer-id.png`: 1440 × 1000, scrolled service explorer with active service and detail panel.
- `test-results/notary-cinema-mobile-id.png`: 390 × 844, Indonesian hero and mobile header.
- `test-results/notary-explorer-mobile-id.png`: 390 × 844, selected legalisation service, readable detail text and enquiry action; remaining content continues naturally below the viewport.

Opened and inspected the full desktop opening/hero, focused service explorer and mobile hero/detail captures. The longer Indonesian copy wraps without overflow or obstructing the language switch. Source mobile screenshots were not supplied, so mobile review uses responsive usability requirements rather than a source-fidelity claim.

## Findings and corrections

1. Initial legacy video assertions selected both opening and background videos after the new dialog was added. Updated them to target the hero specifically; added separate actual opening-film interaction tests.
2. Initial translation annotation left service names containing ampersands in English. Corrected text-node parsing and verified the translated service names and Indonesian WhatsApp message together.
3. Updated current-page language query on switching language, so switching back to English and reloading cannot restore an obsolete `?lang=id` preference.
4. Confirmed the notary hero CTA scrolls the services section to approximately 130px below the viewport top, clear of the compact sticky header. Service captures use the explorer itself to avoid intermediate scroll states.

No actionable P0/P1/P2 issue remains in the reviewed routes and states.

## Fidelity surfaces

- Typography: self-hosted Inter retained. Large light-weight cinematic headings, restrained uppercase captions, numbered service controls and readable body text maintain RK's visual hierarchy. Indonesian titles intentionally use additional lines on narrow screens.
- Layout: homepage structure retained; language controls fit the desktop and mobile header. Notary hero is full-width with a dark image treatment, followed by identity and service sections. Service menu and content sit side by side on desktop and stack on mobile.
- Colors: dark emerald, pale sage and ivory; strong readable contrast across film overlays and service panels. No simulated loading percentages or unnecessary loading claims.
- Assets: existing user-supplied video reused locally for opening and notary hero; no new third-party media dependency. Decorative motion is muted and optional. Logos, Inter and licensed icons load correctly.
- Content: public copy, headings, FAQ answers, legal descriptions, controls, metadata and relevant accessibility labels have explicit Indonesian translations. Proper names and official credentials remain intact. Selected-service enquiries use the active language.

## Functional evidence

73 Playwright / Chromium checks passed; no console/page errors in normal operation. Covered opening skip, Escape, once-per-session behavior across routes, media-failure escape, reduced-motion bypass, background video play/pause, responsive layouts, Inter/image loading, service selection and keyboard navigation, previous/next controls, translated enquiry text, language persistence on reload/cross-page navigation, switching back to English, no-JavaScript service reading and overflow checks in both languages. Checked widths 390, 768, 1024 and desktop at 1440.

The deployment artifact includes `i18n.js`. Scripts and workflow syntax checks passed. External WhatsApp messages were not sent. Safari/iOS-specific autoplay remains untested; poster/manual controls and bounded opening behavior cover autoplay denial. Live deployment status is checked separately from local browser validation.
