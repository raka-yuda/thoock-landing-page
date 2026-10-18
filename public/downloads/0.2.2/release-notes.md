Thoock 0.2.2 — Background-removal download save fix

Both macOS (Apple silicon) and Windows (x64) installers use version 0.2.2. This patch addresses a second failure at the end of the Windows background-removal runtime download, after the disk-space check corrected in 0.2.1.

- Download the runtime into a fresh destination inside a temporary staging folder instead of replacing an archive file that the installer still holds open. This removes a Windows file-replacement conflict that can produce “Could not save the downloaded file” after downloading finishes.
- Keep size and SHA-256 verification before saving or extracting the runtime. Clean staging files after success or failure and reuse an already verified model on retry.
- Include a safe system error number and error kind if the final save still fails, without exposing local file paths.
- Add regression coverage for the runtime destination contract, real verified file saving, failed-download cleanup, and safe save-error diagnostics. Native Windows installation and inference still need verification on Windows; host tests are not a substitute.

Close Thoock and install 0.2.2 over the previous version, then retry the download from Settings → Image tools. You do not need to remove a successfully downloaded model first. If saving still fails, report the error kind and system error number shown in the message.

Apple silicon macOS and Windows x64 preview installers. macOS is ad hoc signed and not notarized; Windows is unsigned. Background removal requires macOS 13.3 or later. Workspace data, vault keys, preferences, and downloaded models remain separate from the installer. Older installers remain archived; returning to an older installer does not roll back workspace data.
