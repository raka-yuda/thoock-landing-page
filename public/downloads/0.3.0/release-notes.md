Thoock 0.3.0 — Video review, Shutterstock exports, and more AI providers

A shared Beta release for Apple silicon macOS and Windows x64. Back up your workspace before updating: this release adds video records and upgrades the workspace schema. Reinstalling an older app does not undo a schema migration.

Create and review
- Import image and video batches through the file picker or native drag and drop. Videos stay in their original folders; Thoock prepares bounded previews and analysis frames locally.
- Browse videos in a responsive four-column library with preview, human-review, and metadata readiness indicators. Review full playback, quality, rights, and factual claims before approving footage.
- Use selected JPEG frames and timestamps for AI-assisted video metadata. Full videos and audio are not uploaded by this workflow. Source files remain external and need their own backup.
- Add Anthropic Claude and OpenRouter alongside OpenAI and Google Gemini for research, commercial briefs, image/editorial metadata, and video metadata. API keys and credits are required for provider requests. Selected models and provider-reported usage appear in the durable job history and logs.
- Use embedded capture dates and location hints as editorial helpers, then verify the facts yourself. GPS coordinates are suggestions and do not automatically establish a city or country.

Review once, export cleanly
- Prepare General metadata and separate Adobe Stock and Shutterstock categories in Review queue. Shutterstock can reuse General metadata or keep its own description and keywords.
- Export reviewed original images and submission CSVs for Shutterstock. Shutterstock does not accept AI-generated contributor images; AI-assisted editorial metadata is for real original photos and footage.
- Prepare CSV-only video exports using the original footage filenames; upload originals manually to the agency. Adobe's footage export here is commercial; editorial footage uses the Shutterstock flow.
- Adobe image packages contain upload images and metadata CSV, without the extra compliance report and manifest. Export completion offers Open folder.
- Confirm bulk image approval after reviewing the selected work; the confirmation records human checks together and validates the entire batch.

Reliability and security
- Keep provider keys in the operating-system vault with backend-only zeroizing memory caching, idle expiry, and invalidation when keys change. Backups still exclude key values.
- Use a consistent local signing certificate for the macOS bundle. This is not Apple Developer ID signing or notarization; OS trust prompts can still appear. Windows installers remain unsigned.
- Keep paid requests explicit, send requests only to fixed HTTPS API hosts, and avoid automatic retries. OpenRouter requests require structured-output support, deny training-data collection, and disable fallback routing; OpenRouter and its selected model host still process the request.
- Bound media processing, support cancellation and source-file relocation, preserve external video originals during Trash/reset, and retain rollback and backup controls.
- Correct the Windows FFmpeg Media Foundation build by explicitly enabling its D3D11 dependency. Preserve compiler diagnostics and use the same pinned Chromium browser for local and CI UI tests.
- Refresh TLS/ZIP dependencies and improve compact cards, navigation, selection actions, tooltips, and review layouts.

Installation
Close Thoock and install 0.3.0 over your previous version. Save a backup first. Provider keys and preferences remain on the same device; backups never transfer provider keys. Downloaded local models remain available. Updates still open an installer download in your browser and require manual installation. Older release downloads remain archived.

Verification limits
Automated native tests, mocked-provider browser tests, installer version/architecture checks, hashes, and archive validation do not replace live paid-model evaluation or installed-app tests on your own Windows/macOS device. No paid provider request is part of the automated test suite. Windows installation, upgrades, GPU/Media Foundation availability, and codec playback still require a real Windows desktop check.
