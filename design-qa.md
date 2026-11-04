# RK website design QA

final result: passed

## Source and intentional adaptations

Source visual truth: two Makes & Partners screenshots supplied by the user in the conversation: desktop home hero and scrolled asymmetric image grid. Each is 1920 × 1080 including macOS/browser chrome. The page content is approximately 1905 × 854 after excluding browser/OS chrome. Source screenshots are available inline in the conversation, not as downloadable local files. The supplied MP4 is the user-selected replacement hero media.

Reviewed the inline screenshots against rendered captures of the same header/hero and scrolled grid regions. This is a screenshot-led adaptation, not a live-source interaction clone. Emerald RK branding, Inter, the user video, RK monogram, practice descriptions rather than another firm's client matters, and a separate interactive notary journey are intentional user-directed differences. No claim is made about unseen source sections.

## Rendered evidence

- `test-results/screenshot-reference-desktop.png`: 1905 × 854 CSS pixels / image pixels, density 1, top scroll position, reduced-motion poster state. Matches the source content viewport after excluding browser chrome.
- `test-results/practice-mosaic.png`: same desktop size, scrolled photographic grid with compact navigation.
- `test-results/index-desktop.png`, `test-results/notary-desktop.png`: 1440 × 1100, density 1; full navigation and hero areas. Home video paused at 5s for repeatable visual review.
- `test-results/hero-mobile.png`: 390 × 844, density 1, poster fallback, no horizontal overflow.
- `test-results/notary-menu-desktop.png` and `test-results/notary-menu-mobile.png`: active service and associated detail/enquiry panel.

## Findings and corrections

- Initial image-loading assertion failed because the founder portrait now loads lazily below the hero. Updated the meaningful asset check to explicitly load and decode all images, retaining failure on missing or corrupt assets. Final check passes.
- Captures immediately after programmatic scrolling could precede the compact-header scroll update. A settled desktop capture checks the final state.
- No remaining P0/P1/P2 visual or functional issues found in the reviewed routes/states.

## Fidelity surfaces

- **Typography:** actual self-hosted Inter. Uppercase desktop navigation, restrained multi-line hero heading and readable practice descriptions follow the reference hierarchy. Source serif headline replaced deliberately per user request.
- **Layout:** full-width contact strip, rectangular white navigation, edge-to-edge hero, half-width tall image beside a 2×2 grid. Compact sticky navigation and mobile menu verified. Layout adapts to one-column practice panels on phones; no unsupported source-mobile fidelity claim.
- **Tokens:** emerald/white RK replaces source navy/gold. Flat rectangular structural elements and restrained image overlays follow the screenshots. Notary selector preserves clear active state and legible details.
- **Assets:** supplied hero video optimized without audio; poster extracted from the same media. RK logo is a generated transparent raster asset, used in the header and white over the hero. Practice photographs are generated replacements, not hotlinked source images. Founder uses the real supplied image.
- **Copy:** all practice content describes RK services and provided credentials; no Makes & Partners client matters, awards, case outcomes or firm identity copied.

## Functional validation

47 checks passed in Playwright / Chromium 154. Confirmed muted looping playback, pause/resume, absence of automatic video source under reduced motion, image decoding, Inter loading, every service selection and service-specific WhatsApp message, arrow/Home/End navigation, focus into details, reload/deep links, JavaScript-disabled fallback, mobile menu and Escape dismissal, responsive overflow, and no console/page errors. Checked widths 390, 768, 1024 and desktop captures at 1440/1905. Contact apps were not opened or messaged.

## Follow-up polish and limits

Safari/iOS-specific autoplay and rendering were not available for testing. Poster and manual playback controls cover autoplay denial. A standalone high-resolution founder photo would improve on the supplied poster crop. Live Makes & Partners access remains restricted, but it no longer blocks this screenshot-led adaptation. GitHub Pages hosting is configured by the repository owner; source push alone does not activate it.
