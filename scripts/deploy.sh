#!/usr/bin/env bash
set -euo pipefail

# Called from the deployment directory after CI uploads its tested image.
: "${THOOCK_IMAGE:?Set THOOCK_IMAGE to the tested image tag}"
: "${IMAGE_ARCHIVE:?Set IMAGE_ARCHIVE to the uploaded Docker archive}"
export THOOCK_IMAGE
export THOOCK_PORT="${THOOCK_PORT:-3006}"

# Keep the image that actually ran before this deployment as the rollback.
previous_image=""
previous_container="$(docker compose -p thoock-landing-page ps -q web)"
if [[ -n "$previous_container" ]]; then
  previous_image="$(docker inspect --format '{{.Image}}' "$previous_container")"
fi

docker load --input "$IMAGE_ARCHIVE"
docker compose -p thoock-landing-page up -d --wait --wait-timeout 90 --remove-orphans
rm -- "$IMAGE_ARCHIVE"
printf 'Thoock deployed: %s on localhost:%s\n' "$THOOCK_IMAGE" "$THOOCK_PORT"

cleanup_images() {
  local current_image container image reference repository tag fallback_image=""
  local protected_images candidates
  current_image="$(docker image inspect --format '{{.Id}}' "$THOOCK_IMAGE")" || return 1
  protected_images="$current_image $previous_image"
  # Protect images referenced by any container, including stopped containers.
  local containers
  containers="$(docker ps -aq)" || return 1
  for container in $containers; do
    image="$(docker inspect --format '{{.Image}}' "$container")" || return 1
    protected_images="$protected_images $image"
  done
  # Docker lists newest images first. Only commit-tagged Thoock images qualify.
  candidates="$(docker image ls --no-trunc --format '{{.Repository}}:{{.Tag}} {{.ID}}' thoock-landing-page)" || return 1
  while read -r reference image; do
    repository="${reference%:*}"
    tag="${reference##*:}"
    [[ "$repository" == "thoock-landing-page" && "$tag" =~ ^[0-9a-f]{40}$ ]] || continue
    case " $protected_images " in *" $image "*) continue ;; esac
    # On a first deployment, retain one additional recent image if available.
    if [[ -z "$previous_image" && -z "$fallback_image" ]]; then
      fallback_image="$image"
      protected_images="$protected_images $image"
      continue
    fi
    # Never force removal. Docker also protects containers created during cleanup.
    if ! docker image rm "$reference"; then
      printf 'Warning: retained image %s (in use or removal failed).\n' "$reference" >&2
    fi
  done <<< "$candidates"
}

# Cleanup must not turn a healthy deployment into a failed deployment.
if ! cleanup_images; then
  printf 'Warning: image cleanup skipped; deployment is healthy.\n' >&2
fi
