# Ryan Kurniawan & Partners · Nadia Difa Khairunnisa

A static bilingual law firm website and a distinct notarial practice experience. Plain HTML, CSS and JavaScript; no React, bundler, backend, analytics or runtime dependencies.

## Run

Run `npm run dev` here (Python 3 required). The server listens on port 4173. Serving the site does not require npm installation or a build.

## Deploy

GitHub Pages uses **GitHub Actions** as its source. `.github/workflows/deploy-pages.yml` publishes on every push to `main`, or by manual dispatch. Only public HTML, CSS, JavaScript and assets are uploaded; development files and tests are excluded. Relative URLs support project-site hosting. `i18n.js` is explicitly included in the artifact.

## Browser checks

```sh
npm ci
CHROMIUM_PATH=/usr/bin/chromium npm test
```

Start the server first. Override `BASE_URL` or `CHROMIUM_PATH` for another server/browser. The prepared cloud machine has system Chromium 154; browser execution may need supported command-sandbox escalation. If a browser is absent, install with `npx playwright install chromium` and set its executable path.

100 browser checks cover both routes/languages, image and Inter loading, responsive text visibility, navigation, separate hero assets, video playback/pause, chapter seeking, opening replay on refresh, skip/Escape/media failure, reduced motion, service selection, keyboard controls, bilingual enquiries and simulation progression/back/restart/route changes. Screenshots are saved to ignored `test-results/`.

## Two video narratives

- **RK:** `assets/rk-city-hero.mp4` is optimized from the user-uploaded `gemini_generated_video_b31eb4f0.mp4`. It has its own poster, emerald cinematic overlay and lower-frame shadow for readable copy.
- **Notary:** `assets/rk-hero.mp4` preserves the original journey clip from `tsk_5a2edf45585f7957fa1e17993332e740.mp4`. It now fills the hero width. Three chapter controls seek to real points in this clip, supporting the narrative “With you, at every step.”
- Both assets are muted H.264, 1280 × 720 with fast-start metadata and no audio stream. Poster images and explicit play/pause controls cover autoplay denial. Reduced-motion/data-saving preferences prevent automatic media loading/playback.
- The shutter-style opening uses the relevant practice's clip and **replays on every full page load/refresh**, including deep-link refreshes. Skip and Escape remain available. The opening has a bounded timeout and exits on media failure. Reduced-motion/data-saving visitors bypass it. Language changes and in-page service selection do not reload the page or replay the opening.

## Notary journey simulation

The notary header and identity belong to **Nadia Difa Khairunnisa, S.H., M.Kn.** The corporate site remains accessible from its footer.

Choose a service route, then use **Play this journey** to enter a three-checkpoint simulation:

1. Choose individual or business context.
2. Choose initial guidance or documents to discuss.
3. Review the derived briefing and optionally open WhatsApp with that context.

Back preserves choices. Play again resets them. Choose a different route returns focus to the selected service card. The progress bar represents actual simulation checkpoints, not legal readiness. This is a rehearsal, not a booking, legal assessment or document submission. The office confirms requirements, fees, attendance and appointments. No documents or personal identifiers are collected or stored. Direct enquiries remain available without playing the simulation. Static service content remains readable without JavaScript.

## Language and assets

- EN / ID translates headings, public copy, controls, accessibility labels, metadata, simulation feedback, summaries and enquiry messages. Selection is stored locally and carried via `?lang=id`. Edit the dictionary in `i18n.js` while preserving `data-i18n` keys. Proper names, credentials and addresses stay unchanged. Static no-JavaScript content is English.
- Local Inter fonts (400/500/600/700) include the SIL Open Font License in `assets/fonts/OFL.txt`.
- Bootstrap Icons include the MIT license in `assets/ICONS-LICENSE.txt`.
- The RK monogram and practice photography are generated assets; both videos were supplied by the user. The founder uses the original supplied photograph via a CSS crop.
- Biography and contact details come from supplied references. The user authorized Nadia's contact channels for both practices. No third-party client matters, awards or outcomes are claimed.

## Cloud setup

Tested installation/startup instructions are saved in the environment draft. Internet permissions are configured separately from scripts. The site layout is grounded in user-provided reference screenshots; live source access was restricted during development.
