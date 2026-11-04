# Ryan Kurniawan & Partners

Static RK law firm website and dedicated notarial services page. Plain HTML, CSS and JavaScript; no React, bundler, backend or runtime dependencies.

## Run

Run `npm run dev` from this directory (Python 3 required). The server listens on port 4173. Serving the site itself does not require npm dependencies or a build.

## GitHub Pages

In repository **Settings → Pages → Build and deployment**, choose **GitHub Actions** as the source. The `Deploy RK website to GitHub Pages` workflow runs on every push to `main` and can also be run manually from the Actions tab. It uploads only the public HTML, CSS, JavaScript and assets; development files and tests are excluded. Relative URLs support project-site hosting. GitHub Pages must be enabled before the workflow can deploy. Successful deployment exposes the actual site URL in the workflow environment output.

## Browser tests

```sh
npm ci
CHROMIUM_PATH=/usr/bin/chromium npm test
```

Start the server before testing. Set `BASE_URL` for another server address and `CHROMIUM_PATH` for another Chromium executable. If needed, install a Playwright browser using `npx playwright install chromium`, then set `CHROMIUM_PATH` to its executable. The prepared cloud environment has system Chromium 154 installed; browser execution requires supported sandbox escalation.

47 browser checks cover both pages, loaded images, local Inter fonts, responsive widths, navigation, service menu selection and keyboard behavior, enquiry text, direct service links, JavaScript-disabled fallback, video playback, pause/resume, reduced motion and console errors. Screenshots are saved to ignored `test-results/`.

## Design and assets

- The layout adapts the user-supplied Makes & Partners desktop screenshots: emerald contact strip, white sticky navigation, full-bleed media hero and an asymmetric photographic practice grid. It is a screenshot-led RK adaptation, not a verified copy of unseen parts or interactions of the live source.
- The hero uses the user's supplied MP4, re-encoded to H.264 (1280 × 720), without audio, with fast-start metadata. The 10-second video loops silently where autoplay is supported. It has a pause/play control and a poster fallback. Reduced-motion and data-saving users receive the poster until they choose to play. No video source is loaded automatically in reduced-motion mode.
- The RK monogram and decorative practice photography are generated design assets. The hero video is user supplied. The original founder photograph is displayed through a CSS crop from the supplied poster; no generated face is used.
- Inter is self-hosted at 400/500/600/700 weights; SIL Open Font License included in `assets/fonts/OFL.txt`.
- Bootstrap Icons are included under the MIT license in `assets/ICONS-LICENSE.txt`.
- Biography and notary identity/contact details derive from supplied references. The user authorized Nadia's email/WhatsApp for both RK and notary enquiries. Confirm current appointments and service descriptions before publishing.
- Notary cards act as an accessible single-selection menu. Selection updates the details and prefilled WhatsApp enquiry. Arrow keys, Home/End, panel labels and deep links work. All service details remain available without JavaScript.
- Enquiries open WhatsApp or an email client. The site does not store or submit personal information to a backend.

## Cloud setup

The environment draft has tested `install_script` and `start_skill` instructions. Internet access is controlled separately by environment settings, never by a shell script. Custom domain additions for `makeslaw.com` and `www.makeslaw.com` were saved for optional further live-source inspection. The current design is grounded in screenshots provided directly by the user.
