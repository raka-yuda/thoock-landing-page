# Thoock landing page

A responsive Vite + React + TypeScript desktop product page. The design follows the emerald materials, Geist font, Lucide icons, and tactile controls used by Thoock Desktop.

```sh
npm install
npm run dev
```

```sh
npm run build
npm run preview
npm test
```

Browser tests use installed Google Chrome. The production site is static and builds into `dist/`.

## Releases

Installers live in `public/downloads/` and are copied into the production build. `public/releases/latest.json` (read by `src/releases.ts`) points to the supplied v0.2.0 macOS ARM64 DMG (with ZIP alternative) and Windows x64 setup executable. The hero selects the operating-system family; architecture, preview status, and file sizes remain visible. Mobile visitors see the desktop download options. All installer links use the download attribute.

The latest `build-manifest.json` records file sizes, SHA-256 hashes, build provenance, and verification status. `SHA256SUMS.txt` is linked in the download panel. Stage releases with `npm run release:stage`; `npm run release:check` verifies every archived installer. See [release operations](docs/DESKTOP_RELEASES.md). The current macOS preview is ad hoc signed and not notarized; Windows is unsigned and runtime testing is pending. Minimum supported OS versions are not advertised without verified runtime support. If publishing multiple CPU architectures, add explicit labeled choices.

## Product imagery

The hero uses a crop of the existing review queue from the desktop documentation collection. The brief editor uses a sanitized modal reference. Research, generation, review, export, and settings screenshots were captured from the actual Desktop browser preview using its read-only demo data. Illustrated demo assets are labeled as examples, not generation-quality claims.

`scripts/prepare-assets.mjs` records asset provenance and can regenerate the images when the sibling desktop project is available at `../thoock-desktop-app`, with its browser preview serving on port 1421. It is a development utility; the site itself has no dependency on sibling folders or servers. All shipped assets live in `public/`. Original screenshots are unchanged.

Self-hosted Geist and Lucide icons retain their license notices in `public/licenses/`. The original Thoock brand mark is preserved, with its existing Phosphor attribution. The original product and visual requirements are in [BRIEF.md](./BRIEF.md).

## Before publication

Confirm platform support requirements and public use of the reference imagery, and set the production domain and absolute social-preview metadata. There is no analytics, email collection, or backend.

## Changelog

The dedicated `/changelog` page uses an editorial release layout with version permalinks, product imagery, and full notes. Each release links to its own versioned installers and checksums. The homepage links to it from navigation, the latest-version summary, and the footer. Vite builds `dist/changelog/index.html` so direct visits and refreshes work on static hosts with directory-index support.

Add desktop updates, newest first, in `src/changelog.ts`. Each entry owns its version, documented update date, build status, highlights, and full notes. Each release links to its own versioned installers and checksums. The download section reads its latest version and date from the same source. Keep installer availability in `public/releases/latest.json`; a documented developer update does not imply a public installer is available.

Micro interactions use short CSS transitions and viewport entrance animations. They follow the operating-system reduced-motion preference, including changes during a session, and leave content visible when JavaScript animation is unavailable.

## Feature showcase

The homepage feature board groups planning, production/review, and delivery into three visual stories. Visitors can enlarge the actual product screenshots. Panels reveal once on scroll and have subtle hover feedback; there is no timed playback or replay control. The component lives in `src/FeatureShowcase.tsx`, with responsive materials in `src/features.css`. Its selected screenshot is the single source of truth for the native dialog; the accessible title and image commit before focus moves, and closing releases the full-size image.

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

The same rendering runs in the Vite development middleware, so the first screen is not an empty React container on port 5173 either. The small `src/main.tsx` bootstrap loads the React interactive chunk after the first frame or on an early interaction. An early button click is preserved and replayed once the handlers are ready. Native navigation, installer links, and FAQ disclosures work immediately.

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

CI uploads its tested Docker image, transfers it over SSH, and starts that exact commit-tagged image with Compose. Deployment waits for container health and reports failures; it does not stop the existing service before building or modify the portfolio's proxy. Existing images remain available for a manual rollback. Local container verification uses `docker build -t thoock-landing-page:latest .` and `docker compose up -d --wait`.

## React page structure

`src/App.tsx` owns the shared header, footer, and entrance behavior. `src/pages/HomePage.tsx` and `src/pages/ChangelogPage.tsx` contain each route's content, sharing the window material through `src/components/WindowFrame.tsx`. The bootstrap fetches the current page and React runtime concurrently; visitors do not download the other page's JavaScript. The server entry still renders both routes into complete static HTML. The changelog uses responsive screenshot variants and accurate intrinsic dimensions for mobile loading.

`src/useAppearance.ts` subscribes React to the browser's appearance preference using `useSyncExternalStore`. System changes apply until a visitor chooses an explicit theme. Saved changes and clearing the preference in another tab synchronize the document and toggle label without a refresh. Its server snapshot keeps prerendered HTML and hydration consistent.

## Versioned desktop releases

Installers and their provenance live under `public/downloads/<version>/`. The archive index is `public/releases/index.json`; the homepage and optional desktop update checker use `public/releases/latest.json`. Previous installers remain available from the changelog, and original flat v0.1.0 download links remain valid. Deploy the whole `dist/` to retain all versions. See [release operations](docs/DESKTOP_RELEASES.md).

## Umami analytics

Use the same Umami instance as the portfolio, with a separate website for `thoock.ryuda.me`. Copy `.env.example` to `.env.production` and set `VITE_UMAMI_SCRIPT_URL` and `VITE_UMAMI_WEBSITE_ID` before building. Leave both empty to disable analytics. The deferred tracker is included on both production pages, with tracking restricted to `thoock.ryuda.me`; development visits are excluded. Hash-only navigation does not create extra pageviews.

For GitHub Actions/Docker deployment, set repository secrets `UMAMI_SCRIPT_URL` and `UMAMI_WEBSITE_ID`, matching the portfolio’s secret names, then rebuild/deploy. These are public tracking settings, not Umami login credentials. Docker passes them into Vite at build time; setting container runtime environment variables alone cannot change a static site.

In Umami, open **Events → desktop-download**. This uses [Umami’s native event attributes](https://docs.umami.is/docs/track-events). Properties include a readable `title`, `platform`, `architecture`, `version`, `format`, `source` (`hero`, `downloads`, or `changelog`), and `file`. Primary installers, ZIP alternatives, and historical versions are labelled. Navigation to the download section and checksum links do not count as installer downloads. Counts measure clicks that start downloads, not completed transfers or unique app installations. Titles also appear on link hover.
