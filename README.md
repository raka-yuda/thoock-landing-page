# Thoock landing page

A responsive Vite + React + TypeScript desktop product page. The design follows the emerald materials, Geist font, Lucide icons, and tactile controls used by Thoock Desktop.

```sh
npm install
npm run dev
```

The landing page runs at `http://localhost:3001` by default, alongside the payment service at `http://localhost:3000`. To choose another landing-page port, run `npm run dev -- --port 3002`. Vite reports an occupied port instead of silently switching to a different one.

```sh
npm run build
npm run preview
npm test
```

Browser tests use installed Google Chrome. The production site is static and builds into `dist/`.

## Releases

Installers live in `public/downloads/` and are copied into the production build. `public/releases/latest.json` (read by `src/releases.ts`) points to the supplied v0.3.0 macOS ARM64 DMG (with ZIP alternative) and Windows x64 setup executable. The hero leads to trial and paid license choices. The download section lists the desktop platforms, architecture, preview status, and file sizes for existing license holders. All installer links use the download attribute.

The latest `build-manifest.json` records file sizes, SHA-256 hashes, build provenance, and verification status. `SHA256SUMS.txt` is linked in the download panel. Stage releases with `npm run release:stage`; `npm run release:check` verifies every archived installer. See [release operations](docs/DESKTOP_RELEASES.md). The current macOS preview is signed with a local certificate and is not notarized; Windows is unsigned and runtime testing is pending. Minimum supported OS versions are not advertised without verified runtime support. If publishing multiple CPU architectures, add explicit labeled choices.

## Product imagery

Product images use the current native app captures supplied in `../thoock-desktop-app/docs/screenshots/app/`. The hero and changelog show the review queue; feature panels use opportunities, commercial briefs, and export preparation; the workspace section shows general settings. Captures show example workspace content, without making generation-quality claims.

Run `npm run assets:prepare` to regenerate the complete-window WebP images and their 480 px and 800 px variants. `scripts/prepare-assets.mjs` preserves every screenshot in full, including native title bars, sidebars, dialogs, and transparent margins. It only resizes and encodes, and produces separate 1920 px previews that load when a visitor enlarges a screen. It needs only the supplied PNGs, with no running desktop preview. Source screenshots remain unchanged; all shipped assets live in `public/`.

Self-hosted Geist and Lucide icons retain their license notices in `public/licenses/`. The original Thoock brand mark is preserved, with its existing Phosphor attribution. The original product and visual requirements are in [BRIEF.md](./BRIEF.md).

## Before publication

Confirm platform support requirements and public use of the reference imagery, and set the production domain and absolute social-preview metadata. Umami analytics is optional; there is no email collection or backend.

## Changelog

The dedicated `/changelog` page uses an editorial release layout with version permalinks, product imagery, and full notes. Each release links to its own versioned installers and checksums. The homepage links to it from navigation, the latest-version summary, and the footer. Vite builds `dist/changelog/index.html` so direct visits and refreshes work on static hosts with directory-index support.

Add desktop updates, newest first, in `src/changelog.ts`. Each entry owns its version, documented update date, build status, highlights, and full notes. Each release links to its own versioned installers and checksums. The download section reads its latest version and date from the same source. Keep installer availability in `public/releases/latest.json`; a documented developer update does not imply a public installer is available.

Micro interactions use short CSS transitions and viewport entrance animations. They follow the operating-system reduced-motion preference, including changes during a session, and leave content visible when JavaScript animation is unavailable.

## Feature showcase

The homepage tells three short visual stories: finding direction, creating and reviewing images, and finishing a package. Balanced groups of complete app windows carry the detail; there is no screen-by-screen onboarding text, simulated window chrome, autoplay, or replay control. Visitors can enlarge any screen for a detailed 1920 px preview.

`src/FeatureShowcase.tsx` owns the content and accessible preview dialog, and `src/features.css` keeps the image compositions responsive within the existing material system. Screenshots have accurate dimensions, lazy loading, asynchronous decoding, and mobile variants.
Page-load motion introduces the header, app mark, headline, copy, download actions, and screenshot layers in order. IntersectionObserver triggers one-time staggered entrances for the feature panels, workspace, downloads, FAQ, and changelog as they enter the viewport. `src/useEntranceMotion.ts` owns both sequences, preserves existing screenshot transforms, cleans up animations on unmount, and cancels immediately if reduced motion is enabled during the session. It does not intercept scrolling or leave hidden content behind.


## Performance audits

Audit the built site rather than the Vite development server. Development includes React debugging code, hot-module reload, and unminified module requests that are intentionally absent in production.

```sh
npm run build
npm run preview -- --port 4173
```

Open `http://localhost:4173` in a clean browser session and run Lighthouse there. Use the same device and throttling settings for comparisons. Do not clear existing browser storage if it contains work you need to keep.

The performance fix replaced the icon-library barrel import with supported per-icon imports, eliminating the 6.2 MB development payload. Critical hero content stays painted during entrance motion, its responsive image is discoverable through an HTML preload, and hidden image dialogs fetch their full-size preview only when opened.

After replacing source screenshots, run `npm run assets:optimize` to regenerate the 480 px and 800 px derivatives used by mobile and feature cards. Originals remain available for enlarged previews. Local Lighthouse reports go in the ignored `reports/` directory.

## First-paint rendering

The build now prerenders both pages through `src/entry-server.tsx`. `dist/index.html` and `dist/changelog/index.html` contain their actual content, navigation, FAQ, and download links. The build fails if either page loses its static content. Production hosting remains entirely static; no Node server is required.

The same rendering runs in the Vite development middleware, so the first screen is not an empty React container on port 3001 either. The small `src/main.tsx` bootstrap loads the React interactive chunk after the first frame or on an early interaction. An early button click is preserved and replayed once the handlers are ready. Native navigation, installer links, and FAQ disclosures work immediately.

Hydration-safe defaults avoid mismatches for appearance, platform detection, and reduced motion. CSS starts the initial entrance sequence with the HTML; React handles subsequent scroll reveals and interactive previews without replaying that initial entrance. The viewport declaration must precede responsive preloads, otherwise mobile browsers can fetch both desktop and mobile hero images.


The React application is split into a small first-paint bootstrap and a separately downloaded hydration chunk. `npm test` builds first and checks both development and production routes, no-JavaScript page content, early-click replay, hydration errors, reduced motion, installer integrity, and mobile image selection. Changelog links use the canonical `/changelog/` directory URL; preview redirects `/changelog` to it so the SPA fallback cannot return homepage HTML.

## CI and deployment

[GitHub Actions](.github/workflows/ci-cd.yml) follows the portfolio project's Docker/SSH deployment pattern, adapted to a static Vite site. Pull requests and pushes to `main` scan Git history for secrets and run dependency auditing, TypeScript/prerender checks, the complete Playwright suite with Chromium, and a Docker smoke test covering both pages, redirects, missing routes, and installer checksums.

The container serves prebuilt HTML with unprivileged Nginx on port 8080. Compose exposes it only on `127.0.0.1:3006`, leaving the portfolio's port 3005 available. Hashed JS/CSS receives immutable caching; HTML revalidates. Unknown routes return 404.

To configure delivery to your VM:

1. Install Docker with Compose v2 (supporting `up --wait`) on a Linux x64 VM. Give the deployment user Docker access and ownership of `/opt/thoock-landing-page/app`. Keep this directory separate from the portfolio.
2. Add GitHub repository or `production` environment secrets: `HOST`, `DEPLOY_USER`, `SSH_PRIVATE_KEY` (a dedicated deployment key), and `SSH_KNOWN_HOSTS` (the VM's host-key entry, verified through a trusted channel). No credential values belong in this repository.
3. Configure the VM's existing reverse proxy and TLS for the chosen domain, forwarding to `http://127.0.0.1:3006`.
4. Merge or push changes to `main`. After CI passes, the workflow automatically uploads and deploys the tested image. Pull requests and manual workflow runs execute checks without deploying. No deployment-enable variable is required.

`scripts/wait-for-http.sh` waits for the smoke-test container to serve its health endpoint, retrying connection resets, empty responses, and other startup errors within a bounded retry budget. `npm run test:readiness` checks immediate success, transient resets, and persistent failure using real HTTP connections.

CI uploads its tested Docker image, transfers it over SSH, and starts that exact commit-tagged image with Compose. Deployment waits for container health and reports failures; it does not stop the existing service before building or modify the portfolio's proxy. After a healthy deployment, cleanup retains the current image and the image used by the previous deployment for manual rollback. It only removes older commit-tagged `thoock-landing-page` images; images referenced by any running or stopped container are protected. Failed deployments do not clean up images. Cleanup never uses force or a host-wide prune, so portfolio and other application images are untouched. On a first deployment, one extra recent image is retained if available. Cleanup failures produce a warning without failing a healthy deployment. Local container verification uses `docker build -t thoock-landing-page:latest .` and `docker compose up -d --wait`.

## React page structure

`src/App.tsx` owns the shared header, footer, and entrance behavior. `src/pages/HomePage.tsx` and `src/pages/ChangelogPage.tsx` contain each route's content and show the native chrome already included in the app screenshots. The bootstrap fetches the current page and React runtime concurrently; visitors do not download the other page's JavaScript. The server entry still renders both routes into complete static HTML. The changelog uses responsive screenshot variants and accurate intrinsic dimensions for mobile loading.

`src/useAppearance.ts` subscribes React to the browser's appearance preference using `useSyncExternalStore`. System changes apply until a visitor chooses an explicit theme. Saved changes and clearing the preference in another tab synchronize the document and toggle label without a refresh. Its server snapshot keeps prerendered HTML and hydration consistent.

## Versioned desktop releases

Installers and their provenance live under `public/downloads/<version>/`. The archive index is `public/releases/index.json`; the homepage and optional desktop update checker use `public/releases/latest.json`. Previous installers remain available from the changelog, and original flat v0.1.0 download links remain valid. Deploy the whole `dist/` to retain all versions. See [release operations](docs/DESKTOP_RELEASES.md).

## Umami analytics

Use the same Umami instance as the portfolio, with a separate website for `thoock.ryuda.me`. Copy `.env.example` to `.env.production` and set `VITE_UMAMI_SCRIPT_URL` and `VITE_UMAMI_WEBSITE_ID` before building. Leave both empty to disable analytics. The deferred tracker is included on both production pages, with tracking restricted to `thoock.ryuda.me`; development visits are excluded. Hash-only navigation does not create extra pageviews.

For GitHub Actions/Docker deployment, set repository secrets `UMAMI_SCRIPT_URL` and `UMAMI_WEBSITE_ID`, matching the portfolio’s secret names, then rebuild/deploy. These are public tracking settings, not Umami login credentials. Docker passes them into Vite at build time; setting container runtime environment variables alone cannot change a static site.

In Umami, open **Events → desktop-download**. This uses [Umami’s native event attributes](https://docs.umami.is/docs/track-events). Properties include a readable `title`, `platform`, `architecture`, `version`, `format`, `source` (`hero`, `downloads`, or `changelog`), and `file`. Primary installers, ZIP alternatives, and historical versions are labelled. Navigation to the download section and checksum links do not count as installer downloads. Counts measure clicks that start downloads, not completed transfers or unique app installations. The readable event title is kept in tracking data without a native tooltip covering the button.

## License pricing and checkout

The homepage pricing section requests the payment service's public `GET /api/pricing` catalog in the browser. It accepts zero-price offers and reads `licenseTerms` for trial duration, activation timing, device limits and eligibility. Trial offers appear first, alongside paid licenses; prices, promotions, IDs and checkout URLs come from the service. The shared feature list explains research, briefs, generation/import, review, export and the local workspace. AI provider usage is explicitly separate.

The header and hero route visitors to license choices; the walkthrough is the secondary hero action. Free trials use **Start free trial**, and paid licenses use **Buy license**. Each action requires `checkoutAvailable` and a returned URL whose origin and `product` parameter match the catalog. A local simulated paid offer is labelled **Try test checkout**. The payment service handles license claims and payment; the landing page does not issue keys or handle credentials. Installers remain available for users who already have a trial or paid key.

Set `VITE_PAYMENT_BASE_URL` in `.env.local` (for example `http://localhost:3000`). When it is missing or blank, pricing and its navigation link are hidden, no pricing request is sent, and the hero/header lead to downloads. Restart Vite or rebuild after changing the setting. Configure the payment service's `LANDING_PAGE_URL` to the Vite origin (normally `http://localhost:3001`, or the custom port you chose). Playwright starts a separate test server on port 5173. For production, set the public HTTPS origin as the GitHub Actions repository variable `PAYMENT_BASE_URL`, then rebuild the image. The setting is public and embedded at build time. The payment service must allow `https://thoock.ryuda.me` as its landing origin.

Pricing is hidden when the service fails, returns an invalid or empty catalog, or takes longer than eight seconds. Navigation then leads to downloads; reload to check availability again. Disabled individual offers remain visible without checkout links. Simulation links are available only while viewing the landing page on localhost. The Umami events `trial-start` and `checkout-start` include only the public product ID and count clicks toward the service, not completed claims or purchases. Download events continue to measure installer clicks separately.

### Beta version labels

Both pages show one **Beta** badge beside the header logo for `0.x.x`, hiding it at major `1` and above. Homepage version labels remain numeric. Changelog entries retain their individual release badges. Keep numeric release versions, filenames, manifests, and update ordering unchanged. Previous installers remain archived.

## Videos

The homepage includes the full desktop tutorial with native controls, English captions, and an app poster. It does not autoplay or preload the MP4. Only the three selected final videos are kept in `public/videos/`: `thoock-tutorial.mp4`, `thoock-promo-vertical.mp4`, and `thoock-promo-landscape.mp4`, with their posters and captions. Experimental cuts, sound studies, rendering intermediates, and layout controls were removed. See [video assets](docs/VIDEOS.md).

## 0.3.0 release

The new release adds video review and CSV delivery, Shutterstock image exports, General and agency-specific metadata, verified editorial helpers, Anthropic Claude and OpenRouter, and native media-tool builds. Video originals remain external and need a separate backup. See the 0.3.0 changelog and versioned release notes for migration and runtime-test limits. Release staging records the actual macOS signing kind; local certificate signing is not Apple Developer ID signing or notarization.
