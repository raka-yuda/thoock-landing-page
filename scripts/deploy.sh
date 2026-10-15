#!/usr/bin/env bash
set -euo pipefail

# Called from the deployment directory after CI uploads its tested image.
: "${THOOCK_IMAGE:?Set THOOCK_IMAGE to the tested image tag}"
: "${IMAGE_ARCHIVE:?Set IMAGE_ARCHIVE to the uploaded Docker archive}"
export THOOCK_IMAGE
export THOOCK_PORT="${THOOCK_PORT:-3006}"

docker load --input "$IMAGE_ARCHIVE"
docker compose -p thoock-landing-page up -d --wait --wait-timeout 90 --remove-orphans
rm -- "$IMAGE_ARCHIVE"
printf 'Thoock deployed: %s on localhost:%s\n' "$THOOCK_IMAGE" "$THOOCK_PORT"
