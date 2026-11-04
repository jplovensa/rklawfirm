# Video narrative and notary simulation — QA

final result: passed

## Requested design

Replace only RK's hero media with the new user clip and cinematic overlay; preserve the original notary clip but make it wide, with an “every step of your journey” narrative. Replay the opening on refresh. Make the notary service experience a game simulation. Nadia’s independent identity and bilingual experience remain in place.

## Rendered evidence

Actual Chromium captures, density 1:

- `test-results/rk-city-hero.png`: 1440 × 1000, new RK bridge/city clip poster with emerald overlay and readable RK copy.
- `test-results/notary-wide-journey.png`: 1440 × 1000, original notary journey clip full width, narrative headline and three film chapters.
- `test-results/notary-wide-mobile-id.png`: 390 × 844, Indonesian full-width journey hero, visible headline, controls and chapter labels.
- `test-results/simulation-checkpoint-1.png`, `test-results/simulation-checkpoint-2.png`, `test-results/simulation-briefing.png`: 1440 × 1000, actual choice/checkpoint/result states.
- `test-results/simulation-mobile-id.png`: 390 × 844, Indonesian derived briefing, enquiry action, back and replay controls in the scrollable dialog.

Opened the desktop hero/briefing and mobile hero/briefing captures for visual review. Design differences from prior framed notary hero and single-screen planner are intentional user-directed changes.

## Findings and fixes

- An explicit film-chapter click did not initially load metadata when automatic motion was disabled, because the video retained `preload=none`. The click now opts into loading, seeks once metadata arrives, and plays. A browser interaction check verifies the actual selected timeline position.
- The floating back-to-top control could overlap RK’s lower-right film control at the page top. It is now hidden until the visitor scrolls down.
- Dialog close/focus checks wait for the native asynchronous close event before checking the selected route's restored focus.

No remaining actionable P0/P1/P2 issue in the reviewed states.

## Fidelity surfaces

Typography: local Inter retained; large light-weight journey copy and compact chapter labels maintain the personal notary identity. Indonesian headings are checked for actual visible text fragments, not document overflow alone. Layout: both heroes are full-width; Nadia’s warm header remains distinct from RK. The simulation has a checkpoint trail, actual progress, context-sensitive feedback and a derived briefing; desktop and mobile layouts are readable. Color: RK’s new daylight clip receives a darker emerald overlay and lower-frame shadow. Notary uses its original clip with forest/ivory identity and sage simulation surfaces. Assets: separate user-supplied clips and posters, no hotlinked media, audio removed, file sizes suitable for static hosting. Copy: all new narrative, checkpoint, feedback, result and controls are bilingual. The simulation states it is not a booking or legal assessment and never invents statutory document requirements.

## Validation

100 Playwright / Chromium checks passed; no normal-operation console/page errors. Verified refreshed opening playback, skip/Escape/failure fallback, motion-aware loading, actual separate hero sources, full-width notary media, chapter seeking, video pause/play, navigation, language persistence, long-text visibility, all service choices, keyboard selection, simulation branches, back/restart, summary/message derivation, change-route focus, mobile dialog width, and no-JavaScript service reading. Source MP4 metadata verified: both 1280 × 720 H.264; optimized site videos have no audio stream.

External WhatsApp messages were not sent. Safari/iOS-specific rendering remains untested; poster/manual-play fallbacks remain available. Publication status is verified separately through GitHub Actions.

## Latest update: colour headshot and notary WhatsApp

final result: passed

- Replaced the grayscale poster crop with `assets/ryan-cinematic.webp`, an AI-assisted colour headshot edit from the supplied founder reference. Warm natural skin tones, charcoal/emerald background, and restrained cinematic lighting. Removed the grayscale filter and old poster-crop positioning for this asset. The optimized 100KB WebP fits the existing founder frame.
- Added the notary-only floating WhatsApp link to `https://wa.me/6285156129839`, with a licensed WhatsApp icon, English/Indonesian accessible name, visible focus, a desktop label and a 56px mobile target. It opens a new tab; no external message was sent during testing.
- Reserved film-chapter width and moved the back-to-top control above the contact button to avoid overlapping controls. Native dialog top layers keep the floating link behind active modal flows.
- Visually inspected `test-results/colour-founder.png` (1440 × 1000) and `test-results/notary-whatsapp-mobile.png` (390 × 844). Additional desktop contact capture: `test-results/notary-whatsapp-desktop.png`. Density 1. Founder crop, skin colour, text rhythm, floating icon and chapter separation are readable. No P0/P1/P2 issue remains in these states.
- Final browser suite: 111 checks passed with no console/page errors. New coverage verifies the correct WhatsApp destination, new-tab behavior, bilingual accessible label, mobile touch size, chapter separation at desktop/mobile widths, absence of the floating link on the corporate page, loaded colour-headshot source and computed absence of grayscale. Existing video, refresh opening, language and simulation checks remain passing.

## Latest update: separate RK contact channels

final result: passed

RK now has a bilingual floating WhatsApp action to `https://wa.me/6281398880079`, matching the supplied 081398880079 number. Its top strip and enquiry section show +62 813 9888 0079 and `ryans.meet@gmail.com`. The misleading shared-contact notice was replaced with a direct-to-Ryan enquiry note. Notary HTML and all Nadia contact destinations remain unchanged. Both floating actions share the existing accessible design; RK’s video and back-to-top controls are spaced above the contact button.

Final suite: 118 Chromium checks passed, with no page/console errors. New checks verify RK’s contact destination, two new mailto links, absence of Nadia’s email from the corporate page, Indonesian accessible label, mobile touch size and separation from the video control. Existing notary destination checks remain passing. Reviewed the updated `test-results/index-desktop.png` capture; no actionable visual issue found. No external messages or emails were sent.
