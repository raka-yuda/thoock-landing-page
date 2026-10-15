# Thoock desktop landing page

Implementation-ready creative and product brief. Researched 14 October 2026.

## Objective

Build a responsive landing page whose primary purpose is to help visitors understand Thoock and download the desktop app for their computer. This is a desktop product page, not a hosted AI generator or SaaS signup funnel.

Use Vite, React, and TypeScript. Preserve Thoock's existing emerald identity, Geist typography, charcoal primary buttons, and restrained skeuomorphic materials. Take compositional inspiration from [HeyClicky](https://www.heyclicky.com/) without copying its branding, assets, blue controls, or product claims.

This document defines the implementation; no website implementation or publication is included in this brief.

## Product understanding

**Thoock is a local creative-production workspace for stock-image creators.** It connects research, commercial briefs, provider-backed image generation, human review, metadata, and Adobe-compatible export packages.

The main audience is independent Adobe Stock contributors and AI-assisted image creators who currently move between research chats, prompt documents, generation tools, folders, and spreadsheets. Lead with the connected workflow and tangible output rather than model novelty or earnings.

Core journey:

```text
Research opportunities
  -> write commercial briefs
  -> generate image candidates
  -> inspect and review
  -> prepare metadata
  -> export JPEG + CSV packages
```

Desktop positioning:

- A single-user workspace on the creator's computer, without a Thoock account.
- Local database, image library, export history, backups, and workspace migration.
- Bring your own provider keys; supported provider APIs may charge separately.
- Research and brief creation have local options. Provider-backed AI operations require a connection and configured credentials.
- Keys are stored in the operating-system credential vault.
- Generation requests require confirmation. Interrupted paid requests are not silently repeated.
- Final review and Adobe upload remain the creator's responsibility.

### Capabilities grounded in the desktop project

| Area | What exists | Visitor-facing message |
| --- | --- | --- |
| Research | Manual opportunities, AI-assisted research, explainable scoring, validated CSV import | Find topics worth exploring and keep the research organized. |
| Briefs | Manual and AI batches, buyer/use/scene/composition fields, editable prompts and metadata plans, CSV import | Give every image a commercial direction before generating. |
| Generation | SnapGen Nano Banana and Grok adapters, provider/model controls, confirmed single and bulk requests, durable history | Generate from your briefs with your own configured providers. |
| Recovery | Saved request IDs, read-only result checks, linked explicit retries and regeneration | Keep track of attempts and recover interrupted work. |
| Review | Image grid, original/current variants, nine human checks, AI disclosure review, metadata editing, bulk actions | Inspect the image, check the details, and decide what makes the cut. |
| Metadata | OpenAI/Gemini-assisted drafts, editable titles and keywords, validation | Prepare metadata alongside the image. |
| Exports | sRGB JPEG preparation, embedded metadata, Adobe CSV, manifest, compliance report, saved ZIPs | Package approved work for manual upload to Adobe Stock. |
| Workspace | Local storage, light/dark/system themes, backups, restore, relocation, migration, redacted logs | Keep your production workspace on your computer. |

Mention provider examples inside the workflow or FAQ, not as a prominent endorsement/logo strip. Provider and model availability depend on the user's account and configuration.

### Keep web-only features out of desktop marketing

The original web project also contains budgeting, cost comparisons, break-even calculations, selective upscaling, authentication, and other provider adapters. These are not evidence that Desktop ships those features. Do not advertise them on this landing page.

Do not promise automatic Adobe submission, acceptance, sales, royalties, collaboration, cloud sync, fully offline AI generation, automatic paid retries, or an Adobe partnership. Opportunity scores are research aids, not sales predictions. The desktop local image provider produces test patterns; it is not a usable free image-generation service.

## Creative direction

**Design read:** a download-focused desktop product page for independent stock-image creators, expressed as a calm emerald creative workbench with tactile controls and real application windows.

Design variance: 6/10. Motion intensity: 3/10. Visual density: 4/10.

### What to borrow from HeyClicky

The reference was inspected as a live page and a 1440 px desktop screenshot. Its opening uses a compact desktop-like header, a clear central product statement and download action, and small overlapping media windows around the main content. Physical window chrome and raised buttons make the page feel related to a desktop app.

Translate that into Thoock through:

- A compact top bar with a recognizable app mark and immediately visible download path.
- A central, readable hero with one clear promise and a real product preview.
- A restrained arrangement of supporting screenshot windows suggesting the connected workflow.
- Subtle depth, shallow bevels, and short shadows that match the app.
- A substantial preview below the opening message, followed by useful product explanation and FAQ.

Do not reproduce the scattered memes, stickers, fake operating-system status items, video thumbnails, or density of floating objects. Thoock should feel like a purposeful creative workspace. Use no invented testimonials, customer counts, or earnings statistics. Do not add a pricing section before commercial terms exist.

### Preserve the existing design system

| Token | Light | Dark |
| --- | --- | --- |
| Canvas | `#f4f8f5` | `#151e18` |
| Surface | `#fcfefd` | `#202a23` |
| Inset surface | `#f4f9f6` | `#17211b` |
| Main text | `#17231c` | `#e2ece5` |
| Muted text | `#66766c` | `#a3b6a9` |
| Accent | `#007f57` | `#77d7a9` |
| Border | `#dce5de` | `#3a4a3f` |

- Use the existing aperture app mark and Thoock wordmark treatment. Do not invent a new logo.
- Self-host Geist Variable. Use Geist Mono sparingly for genuine technical information or file extensions.
- Preserve 12 px control radii, 10 px compact radii, and 16 px panel radii. Reserve pill shapes for compact status controls.
- Default controls are 40 px high; use 44 px for primary download actions and touch targets.
- Primary buttons retain the app's charcoal face, restrained vertical bevel, top highlight, bottom edge, and short cast shadow. Derive exact material values from the source CSS.
- Secondary buttons and screenshot frames use subtly raised off-white/green surfaces. Fields and segmented-control trays are inset.
- Light comes from above. Pressed controls move down 1 px and compress their shadow.
- Use the existing 180 ms timing and `cubic-bezier(0.2, 0.8, 0.2, 1)` easing.
- Gradients describe physical material only. Avoid decorative mesh backgrounds, neon glows, glass panels, and gradient text.
- Use Lucide React for landing-page UI icons, following the updated user preference. Preserve the existing Thoock brand mark. No emoji feature icons or improvised SVG icon set.
- Follow system appearance initially; offer an accessible manual theme toggle and persist the choice. Screenshots retain their original colors in both themes.

Marketing typography can scale beyond the application's compact UI: hero roughly 56-72 px on desktop and 36-44 px on mobile; section titles 32-40 px; body 16-18 px. Keep natural wrapping and comfortable line heights.

## Page structure and suggested copy

### Navigation

Left: existing app mark and **Thoock**. Middle: **Workflow**, **Your workspace**, **FAQ**. Right: appearance control and **Download Thoock**, linking to the download section.

Keep the header quiet and compact. On mobile, retain the brand and download action; move secondary anchors into an accessible menu if they cannot fit. A sticky header must not obscure anchor headings.

### Hero: explain the outcome and make downloading easy

Headline: **Your stock-image workflow. All together.**

Supporting copy: **Research ideas, write commercial briefs, generate images, and prepare Adobe Stock packages in one desktop workspace.**

Primary action when a compatible installer is available: **Download for macOS** or **Download for Windows**. Provide the alternate platform nearby through **Other downloads**. Use **Download Thoock** in non-platform-specific navigation.

Supporting line: **Local workspace. Your own API keys. No Thoock account.**

Secondary action: **Explore the workflow**, linking directly to the product walkthrough. Do not introduce a competing signup, waitlist, or pricing action.

Composition: centered message with open space around the CTA, supported by a limited arrangement of two small app-window crops and a larger review-queue preview below. Keep the screenshot windows beneath the message and outside its reading area. The existing brand and the desktop reference justify this centered opening.

### Workflow: show how the pieces connect

Heading: **From the first idea to the final package.**

Body: **Keep the research, brief, image, and metadata connected as you move through production.**

Use a real screenshot viewer with five clearly labeled stages:

| Stage | Supporting copy | Preferred image |
| --- | --- | --- |
| Research | Save topics, explore opportunities, or bring in your research as CSV. | Opportunities |
| Brief | Define the buyer, use, scene, and composition. Edit every prompt before generating. | Brief editor |
| Generate | Choose your configured provider and settings, then confirm the request. | Generation confirmation |
| Review | Inspect image quality, complete human checks, and refine titles and keywords. | Review detail |
| Export | Prepare approved JPEGs, Adobe CSV metadata, and supporting reports in a ZIP. | Export package panel |

Selecting a stage changes the actual image and explanatory copy. It must work with keyboard and touch, expose selection accessibly, and never auto-advance. On mobile, use wrapped controls or an accessible horizontally scrollable stage list within the page width. Keep the stage labels visible and understandable without hover.

Do not surround every sentence with an identical feature card. Let the single preview and connected stage navigation carry the explanation.

### Local workspace: answer the practical objections

Heading: **Your workspace stays with you.**

Use an asymmetrical two-column section with a restrained settings or storage screenshot and a short group of concrete benefits:

- **On your computer.** Your library, briefs, and export history live in a local workspace.
- **Your providers, your keys.** Connect supported services and store credentials in the operating-system vault. Provider usage is billed separately by those services.
- **You confirm the requests.** Review generation requests before sending them. Recover interrupted attempts without silently generating again.
- **Made to keep.** Back up, restore, or move your workspace as your library grows.

Privacy clarification near the BYOK explanation: **Provider-backed actions send the relevant prompts or images to the service you configure.** Do not claim that all data always stays on-device.

### Download: the primary conversion destination

Heading: **Make room for your next batch.**

Body: **Bring your stock-image production into one desktop workspace.**

Show macOS and Windows options in a raised, compact download panel. Each available option needs a real installer URL, platform, architecture, supported operating-system versions, and an unambiguous download label. Show file size or release date only when populated from actual release data.

Keep provider-cost disclosure nearby: **Bring your own API keys. Provider usage may incur charges.** Do not claim that Thoock is free, paid, or open source until distribution terms are confirmed.

### FAQ

Use native `details`/`summary` or an accessible disclosure component, with concise answers:

1. **What is Thoock?** A desktop workspace for researching stock-image topics, writing briefs, generating candidates, reviewing images, and preparing Adobe-compatible export packages.
2. **Do I need a Thoock account?** No. Desktop is a single-user local workspace.
3. **Do I need my own API keys?** Yes for provider-backed features. Thoock supports configured text/research and image services; those providers may charge separately. Local research and brief tools are available without credentials.
4. **Does it work offline?** Local workspace tools do. Provider-backed research, generation, and metadata requests need an internet connection.
5. **Does Thoock upload to Adobe Stock?** No. It prepares files and metadata. You review the package and upload manually in Adobe Contributor Portal. Acceptance is decided by Adobe.
6. **Where are my files and keys stored?** Workspace data and images are stored locally; keys use the operating-system credential vault. Configured provider actions send relevant input to the selected service.
7. **Which computers are supported?** Desktop targets macOS and Windows. The download panel must show only tested, available release combinations and verified minimum requirements.

### Footer

App mark, name, a short descriptor, and verified project/support links if available. Do not invent social profiles, contact addresses, policy URLs, or a public documentation site. Keep download access available through the nearby download panel.

## Download availability and release truth

As of the reviewed desktop status document, Thoock is a functional v0.1 developer build. An ad hoc signed macOS ARM64 debug bundle has been verified. Signed public macOS/Windows installers, macOS notarization, installed Windows verification, and live provider checks remain release gates.

This is a content dependency, not a reason to abandon the download-focused layout:

- Before installer URLs exist, the hero action is **View download options**, linking to the download panel. Each unavailable platform visibly says **Download not available yet** with a short availability explanation.
- Never make an unavailable installer look downloadable, use `href="#"` as a fake download, link to a fabricated release filename, or serve the debug bundle as a public installer.
- Once verified URLs exist, enable platform-specific download links across hero and panel from the same central release configuration.
- Detect the operating-system family only as a convenience. Always expose both platform choices. Do not infer CPU architecture reliably from browser identification; make architecture choices explicit when needed.
- For mobile and unknown systems, use **View desktop downloads**. Do not suggest an iOS or Android app exists.
- Do not collect email or create a waitlist backend unless separately requested.

Central release data should include platform, architecture, availability, URL, minimum OS, optional file size, and verified release metadata. Display this as product information, not as raw configuration details.

## Screenshot and asset plan

Use the desktop project's documentation collection first:

`../thoock-desktop-app/docs/screenshots/`

The screenshot index explicitly says page captures originate from the existing web product and may contain private workspace data. Modal captures use sanitized fixture records. Treat all captures as references until checked for public use and current desktop accuracy.

| Source relative to that directory | Use | Caveat |
| --- | --- | --- |
| `pages/review-queue.png` | Candidate hero image and review-stage preview | Strong visual content, but includes web owner/live-mode controls and a development badge. Prefer a fresh desktop capture; crop irrelevant shell chrome only when the result remains accurate. |
| `pages/opportunities.png` | Research-stage preview | Check actual records for private content and web-only fields before publishing. |
| `modals/briefs-edit-detail.png` | Brief-stage preview | Sanitized fixture reference; check labels against current desktop implementation. |
| `modals/generation-confirm.png` | Generation-stage preview | Prefer this concrete confirmation state over the page labeled create. |
| `modals/review-detail.png` | Human-review explanation | Sanitized illustration, not proof of generated-image quality. Label it as demo content if used. |
| `pages/adobe-exports-prepare.png` | Crop of package contents | Full page is empty. A fresh populated desktop export capture would communicate the result better. |
| `pages/settings.png` | Workspace/provider section reference | Check for web-only cost settings and remove private identifiers through a fresh sanitized capture. |
| `pages/dashboard.png` | Material and layout reference only | Shows monthly budgets, costs, and owner controls absent from Desktop. Do not use as the desktop hero. |
| `pages/image-generation-create.png` | Reference only | The inspected capture actually shows History selected and a loading state. Do not use as the primary generation demonstration. |

Use the existing mark at `../thoock-desktop-app/public/thoock-icon.svg`. Font setup is documented in `../thoock-desktop-app/src/fonts.css`; preserve accompanying license notices when bundling fonts and icons.

For final implementation, copy selected approved assets into this project's own `public/` directory; do not depend on sibling filesystem paths at runtime. Keep originals untouched, produce WebP/AVIF derivatives with suitable fallback, and reserve image dimensions. Crop for focus, never edit out product limitations to imply unavailable functionality. Use new sanitized desktop captures where reference screenshots would misrepresent the app. Do not fabricate UI screenshots with HTML rectangles.

## Responsive behavior

- Constrain primary content to roughly 1120-1200 px, with fluid outer gutters. Allow the hero's screenshot composition a little more width on large displays.
- At 1024 px and above: full navigation, restrained supporting windows, readable central hero, wide screenshot viewer, and two-column workspace section.
- At 768-1023 px: reduce hero type and window offsets; use one supporting window at most. Keep controls and captions inside the content container.
- Below 768 px: one-column reading order, 20-24 px gutters, stacked download options, full-width primary CTA where useful, and no overlapping decorative windows. Show one clear preview rather than shrinking an entire collage.
- At 320 px: no page-level horizontal scroll, clipped controls, truncated essential labels, or overlapping heading text. Stage navigation may scroll inside its own labeled container.
- Keep images proportionally scaled. Important details should be available in an accessible enlarged view or a focused crop, rather than requiring users to read a 1600 px dashboard shrunk to phone width.
- Do not let sticky navigation or mobile controls cover content. Account for safe-area insets where needed.
- Check 320, 375, 390, 768, 1024, 1280, and 1440 px widths, plus landscape and 200% zoom.

## Implementation requirements

- **Stack:** Vite + React + TypeScript, static production output in `dist/`. No hosted app backend is required.
- **Styling:** native CSS with shared semantic custom properties derived from the existing app. Keep one token system and one component scale rather than introducing a competing visual framework.
- **Suggested components:** `Header`, `Hero`, `WorkflowPreview`, `WorkspaceSection`, `DownloadPanel`, `FAQ`, and `Footer`; shared `Button`, `WindowFrame`, and appearance controls.
- **Content:** keep platform release data separate from presentation. Keep copy and screenshot metadata easy to update without changing layout logic.
- **Interactions:** real anchors, functioning workflow selection, accessible FAQ, theme persistence, and working download links when available. A lightbox, if included, must support Escape, focus trapping, and focus restoration.
- **Motion:** tactile hover/press/selection feedback only, with optional short entrance reveals. No auto-playing carousel, scroll hijacking, infinite floating windows, or continuous mouse tracking. Honor reduced motion.
- **Accessibility:** semantic landmarks, one H1, skip link, visible focus, adequate contrast in both themes, descriptive alt text, 44 px touch targets, and keyboard-operable controls. Keep decorative window elements out of the accessibility tree.
- **Performance:** preload only the main hero asset, lazy-load lower previews, self-host fonts with `font-display: swap`, and avoid animation/video dependencies without a concrete need. Reserve media dimensions to prevent layout shift.
- **SEO:** title `Thoock | A desktop workspace for stock-image creators`; description grounded in research, briefs, generation, review, and export. Use an approved product screenshot for social sharing. Canonical URL and production metadata wait for the actual domain.
- **Privacy:** no analytics or tracking added by default. If measurement is requested later, the meaningful conversion is an actual available-installer click, not an unavailable download-panel visit.

## Acceptance criteria

1. Within the opening viewport, visitors understand what Thoock does, that it is a desktop app, and where to obtain it or check availability.
2. Thoock's actual logo, emerald tokens, Geist typography, charcoal buttons, and raised/inset materials are recognizable in both themes.
3. The connected production workflow is demonstrated with accurate, reviewed imagery, with demo content distinguished where necessary.
4. Downloads use verified release data and honest per-platform availability. No invented installers, OS requirements, release dates, commercial terms, or signup flows.
5. BYOK, provider charges, human review, and manual Adobe upload are explained clearly without overwhelming the hero.
6. Every visible action works with mouse, touch, and keyboard. No placeholder links or nonfunctional decorative controls.
7. The layout passes the viewport and zoom checks above without page overflow or inaccessible content. Reduced motion and both themes are checked.
8. Type checking and `npm run build` pass. Browser checks cover workflow selection, FAQ, theme persistence, and download states. Run Lighthouse on a production preview and investigate material accessibility, performance, or layout-shift findings.

## Research sources and precedence

Desktop implementation status and source take precedence over aspirations in the product brief. Desktop evidence takes precedence over web features when describing the downloadable app.

- [Desktop README](../thoock-desktop-app/README.md)
- [Desktop product brief](../thoock-desktop-app/docs/PRODUCT_BRIEF.md)
- [Desktop implementation status and release gates](../thoock-desktop-app/docs/IMPLEMENTATION_STATUS.md)
- [Desktop design system](../thoock-desktop-app/docs/DESIGN_SYSTEM.md)
- [Desktop materials and tokens](../thoock-desktop-app/src/App.css)
- [Desktop dark materials](../thoock-desktop-app/src/theme.css)
- [Desktop screenshot index](../thoock-desktop-app/docs/screenshots/README.md)
- [Desktop generation implementation](../thoock-desktop-app/src/features/generation.tsx)
- [Web product README](../thoock/README.md)
- [Web visual direction](../thoock/DESIGN.md)
- [HeyClicky composition reference](https://www.heyclicky.com/), inspected 14 October 2026

Before a public launch, supply verified installer links, architecture and minimum-OS support, distribution terms, approved screenshot selections, the production domain, and any public support or policy URLs. None of these missing release facts prevents implementing and reviewing the page locally.
