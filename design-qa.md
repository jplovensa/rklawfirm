# Independent notary practice and motion update

final result: passed

## Design intent

The user requested distinction from the approved corporate design: a different opening motion, Nadia’s name in the notary header, an immersive design and a distinct UX. A later upload selected the supplied video for the hero. The two video uploads have identical SHA-256 values; the existing optimized video is reused. The corporate page retains its layout, content, RK identity and full-bleed hero. The notary practice uses a warm editorial layout, personal wordmark, framed video and guided visit planner.

## Rendered evidence

Actual Chromium screenshots, device scale factor 1:

- `test-results/opening-shutter.png`: 1440 × 1000, corporate opening at approximately 1.7 seconds. Aperture reveal, staged typography and film push are visible; skip remains available.
- `test-results/notary-independent-desktop.png`: 1440 × 1000, English, reduced-motion poster state. Personal header, warm ivory/forest palette, editorial headline and framed supplied video.
- `test-results/notary-purpose-menu.png`: desktop outcome choices and service details.
- `test-results/notary-visit-planner.png`: desktop planner with service summary, radio choices and enquiry action.
- `test-results/notary-independent-mobile.png`: 390 × 844, Indonesian, final corrected headline and mobile personal header.
- `test-results/notary-planner-mobile-id.png`: 390 × 844, Indonesian visit planner.

Opened the desktop hero/planner and mobile headline captures and inspected the relevant states. This is an intentional redesign from the prior notary screen, not a pixel-identical adaptation of another firm's page.

## Findings and fixes

- P2: Indonesian word “Dipertimbangkan” extended beyond the narrow hero column while the section's overflow hid the excess. Reduced the mobile secondary heading scale and added line-fragment visibility assertions, beyond document-overflow checks. Captured the corrected 390px view again; full words are visible.
- Visit-planning buttons are hidden in static HTML and enabled only when their dialog behavior is available. No-JavaScript visitors retain the full service content and direct enquiry links.
- Personal notary branding replaces RK in the notary header and opening. Footer has the notary identity and an explicit return to the corporate site.

No remaining P0/P1/P2 issue in the reviewed routes and states.

## Visual surfaces

Typography: local Inter retained; lighter editorial headlines and small uppercase captions distinguish the personal practice. Indonesian headline uses a smaller secondary scale on phones. Layout: split video composition on desktop, stacked on mobile, personal navigation, purpose choices and a two-column desktop planner. Color: warm ivory, sage and forest green scoped to the notary page. Assets: supplied video and poster reused; existing RK identity retained on the corporate page; standard licensed close icon added. Copy: services and visit information remain bilingual, with no invented notary qualifications or mandatory document lists. Planner asks non-identifying choices only and says final requirements/fees must be confirmed with the office.

## Validation

87 browser checks passed, with no normal-operation page/console errors. Coverage includes both pages and languages, video controls, opening skip/Escape/session behavior, media-failure fallback, reduced-motion bypass, responsive layout, actual translated-text visibility, service selection, keyboard movement, translated service enquiries, previous/next controls, Nadia header identity, no RK logo in that header, visit planner opening/closing, service context, individual/business and document-readiness message values, focus restoration, mobile planner width, language persistence and no-JavaScript reading.

JavaScript syntax and whitespace checks passed. No external messages were sent. Safari/iOS rendering remains untested; poster and manual-play controls cover autoplay restrictions. Deployment status is checked separately from these local results.
