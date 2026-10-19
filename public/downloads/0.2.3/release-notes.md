Thoock 0.2.3 — Local workspace and Beta labels

Both macOS (Apple silicon) and Windows (x64) installers use the numeric version 0.2.3. Thoock displays a Beta badge while its major version is below 1; the label does not change release identifiers or update ordering.

- Remove the Demo data switch and sample workspace from the app. Thoock opens your local workspace directly, including on devices that previously saved a demo-mode preference.
- Remove demo-only command interception, status labels, and sample illustrations from the shipped application. Synthetic records and artwork remain only in automated-test fixtures.
- Show a Beta badge in the app header, About & updates, and website version displays for 0.x releases. The badge disappears automatically at major version 1 and above.
- Keep existing workspace files, provider credentials, preferences, and downloaded models. No workspace reset or migration is needed for this change.
- Retain the background-removal download corrections from 0.2.1 and 0.2.2. End-to-end Windows background-removal verification remains a separate runtime check.

Close Thoock and install this version over your previous installation. Update checks continue to open the installer download in your browser; automatic installation is deferred. Older release downloads remain available.

Apple silicon macOS and Windows x64 Beta installers. macOS is ad hoc signed and not notarized; Windows is unsigned. Background removal requires macOS 13.3 or later. Older installers do not roll back workspace data.
