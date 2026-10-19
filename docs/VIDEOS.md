# Final video assets

The three MP4s in `public/videos/` are the selected research-first cut with the supplied toolbar activation click on both icon bumpers. They retain the approved screenshot composition, full native app windows, and original backing music. The tutorial has Kokoro `af_heart` narration and a quieter music bed. Both destination paths in export history are masked.

- `thoock-tutorial.mp4`: 1920 × 1080, approximately 2:28.
- `thoock-promo-vertical.mp4`: 1080 × 1920, approximately 0:44.
- `thoock-promo-landscape.mp4`: 1920 × 1080, approximately 0:44.

All are 24 fps H.264 with 48 kHz stereo AAC and fast-start metadata. Opening: 44 frames; closing: 48 frames. The supplied sound is delayed 474 ms so its audible onset matches the icon press. Captions and chapters include the opening offset. `manifest.json` records SHA-256 hashes. Posters show app footage, not the bumper.

The homepage uses native video controls, a poster, `preload="none"`, inline playback, and English closed captions. Playback is user-initiated. All three files remain directly available under `/videos/`; the promos are retained for marketing use. The old comparison pages, experimental cuts, sound samples, and temporary rendering scripts have been removed.

Sources: native Thoock screenshots and existing brand mark, locally synthesized instrumental backing, and the toolbar click supplied by the project owner. Voice implementation: https://github.com/thewh1teagle/kokoro-onnx; model: https://huggingface.co/hexgrad/Kokoro-82M.
