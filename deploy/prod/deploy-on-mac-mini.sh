#!/bin/bash
# Deploys one Vite SPA: / is the website and /admin/ is the management UI.
set -euo pipefail

VERIFIED_SHA="${1:-}"
SOURCE_DIR="${2:-}"
DEPLOY_ROOT="/Users/dongqiang/git-qq/family-book-admin-prod"
RELEASES="$DEPLOY_ROOT/releases"
CURRENT="$DEPLOY_ROOT/current"
NGINX_CONF="/opt/homebrew/etc/nginx/nginx.conf"
NGINX="/opt/homebrew/bin/nginx"
GIT="/usr/bin/git"

if [[ ! "$VERIFIED_SHA" =~ ^[0-9a-f]{40}$ || ! -d "$SOURCE_DIR/.git" ]]; then
  echo "Expected a CI-verified commit SHA and a Git checkout." >&2
  exit 2
fi
if [[ "$(/usr/bin/id -un)" != dongqiang ]]; then
  echo "The deployment runner must run as dongqiang." >&2
  exit 1
fi
if [[ "$($GIT -C "$SOURCE_DIR" rev-parse HEAD)" != "$VERIFIED_SHA" ]]; then
  echo "Runner checkout does not match the CI-verified commit." >&2
  exit 1
fi
if [[ ! -L "$CURRENT" || ! -d "$CURRENT" ]]; then
  echo "Production release link is missing: $CURRENT" >&2
  exit 1
fi
if ! /usr/bin/grep -Fq "root $CURRENT;" "$NGINX_CONF"; then
  echo "Nginx is not configured to serve the independent production directory." >&2
  exit 1
fi

PREVIOUS="$(/usr/bin/readlink "$CURRENT")"
PREVIOUS_SHA="$(/usr/bin/basename "$PREVIOUS")"
if [[ "$PREVIOUS_SHA" =~ ^[0-9a-f]{40}$ ]] && \
   ! "$GIT" -C "$SOURCE_DIR" merge-base --is-ancestor "$PREVIOUS_SHA" "$VERIFIED_SHA"; then
  echo "Refusing to roll production back from $PREVIOUS_SHA to $VERIFIED_SHA." >&2
  exit 1
fi

# Build in the Runner checkout; never run npm in the live developer tree.
export PATH="/Users/dongqiang/.nvm/versions/node/v24.14.0/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:$PATH"
cd "$SOURCE_DIR"
npm ci --no-audit --no-fund
npm run build
if [[ ! -s dist/index.html || ! -d dist/assets ]]; then
  echo "The frontend build is incomplete." >&2
  exit 1
fi

/bin/mkdir -p "$RELEASES"
RELEASE="$RELEASES/$VERIFIED_SHA"
STAGE=""
NEXT_LINK=""
cleanup() {
  if [[ -n "$STAGE" && -d "$STAGE" ]]; then /bin/rm -R -- "$STAGE"; fi
  if [[ -n "$NEXT_LINK" && -L "$NEXT_LINK" ]]; then /bin/rm -- "$NEXT_LINK"; fi
}
trap cleanup EXIT

if [[ ! -d "$RELEASE" ]]; then
  STAGE="$(/usr/bin/mktemp -d "$RELEASES/.staging.$VERIFIED_SHA.XXXXXX")"
  /usr/bin/ditto "$SOURCE_DIR/dist" "$STAGE"
  # Keep previously referenced hashed assets available while browsers refresh.
  if [[ -d "$CURRENT/assets" ]]; then
    /usr/bin/rsync -a --ignore-existing "$CURRENT/assets/" "$STAGE/assets/"
  fi
  /bin/mv "$STAGE" "$RELEASE"
  STAGE=""
fi

if [[ ! -s "$RELEASE/index.html" || ! -d "$RELEASE/assets" ]]; then
  echo "The release directory is incomplete: $RELEASE" >&2
  exit 1
fi

"$NGINX" -t
NEXT_LINK="$DEPLOY_ROOT/.current.$VERIFIED_SHA.$$"
/bin/ln -s "$RELEASE" "$NEXT_LINK"
/bin/mv -h -f "$NEXT_LINK" "$CURRENT"
NEXT_LINK=""

rollback() {
  echo "Site verification failed; restoring the previous release." >&2
  NEXT_LINK="$DEPLOY_ROOT/.current.rollback.$$"
  /bin/ln -s "$PREVIOUS" "$NEXT_LINK"
  /bin/mv -h -f "$NEXT_LINK" "$CURRENT"
  NEXT_LINK=""
  "$NGINX" -s reload || true
  exit 1
}

"$NGINX" -s reload || rollback
for route in / /admin/; do
  if ! /usr/bin/curl --fail --silent --show-error --max-time 5 \
      -o /dev/null "http://127.0.0.1:8081$route"; then
    rollback
  fi
done
echo "Website and admin are healthy at $VERIFIED_SHA"
