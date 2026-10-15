#!/usr/bin/env bash
set -euo pipefail

# Docker can publish its port before Nginx is listening. During that window,
# connections may reset or return an empty response, not just be refused.
# Retry only this idempotent readiness GET, with bounded retries and requests.
curl --fail --silent --show-error \
  --retry 30 --retry-all-errors --retry-delay 1 \
  --retry-max-time "${2:-60}" --connect-timeout 2 --max-time 5 \
  "${1:?Provide a readiness URL}"
