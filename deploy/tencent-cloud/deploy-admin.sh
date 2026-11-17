#!/usr/bin/env bash
set -euo pipefail

SHA="${1:-}"
ROOT=/opt/family-book-admin
RELEASES="$ROOT/releases"
CURRENT="$ROOT/dist"
SOURCE="$ROOT/source"
REPOSITORY=git@github.com:family-books/family-book-admin.git
GITHUB_KEY=/root/.ssh/familybook_admin

if [[ ! "$SHA" =~ ^[0-9a-f]{40}$ || ! -f "$GITHUB_KEY" ]]; then
  echo "Expected a commit SHA and the admin GitHub deploy key." >&2
  exit 2
fi

mkdir -p "$RELEASES"
RELEASE="$RELEASES/$SHA"
if [[ ! -d "$RELEASE" ]]; then
  export GIT_SSH_COMMAND="ssh -i $GITHUB_KEY -o IdentitiesOnly=yes -o BatchMode=yes"
  if [[ ! -d "$SOURCE/.git" ]]; then
    git clone --filter=blob:none --no-checkout "$REPOSITORY" "$SOURCE"
  fi
  git -C "$SOURCE" fetch --prune origin "$SHA"
  git -C "$SOURCE" checkout --detach --force "$SHA"
  git -C "$SOURCE" clean -ffd

  cd "$SOURCE"
  export NODE_OPTIONS="--max-old-space-size=768"
  npm ci --no-audit --no-fund
  npm run build
  test -s dist/index.html
  test -d dist/assets

  STAGE="$(mktemp -d "$RELEASES/.staging.$SHA.XXXXXX")"
  trap 'rm -rf "$STAGE"' EXIT
  cp -a dist/. "$STAGE/"
  test -s "$STAGE/index.html"
  test -d "$STAGE/assets"
  PREVIOUS_DIR="$(readlink -f "$CURRENT" 2>/dev/null || true)"
  if [[ -d "$PREVIOUS_DIR/assets" ]]; then
    cp -an "$PREVIOUS_DIR/assets/." "$STAGE/assets/"
  fi
  mv "$STAGE" "$RELEASE"
  trap - EXIT
fi

test -s "$RELEASE/index.html"
test -d "$RELEASE/assets"
PREVIOUS="$(readlink -f "$CURRENT" 2>/dev/null || true)"
NEXT="$ROOT/.dist.$SHA.$$"
ln -s "$RELEASE" "$NEXT"
nginx -t
mv -Tf "$NEXT" "$CURRENT"

rollback() {
  echo "Frontend verification failed; rolling back." >&2
  if [[ -n "$PREVIOUS" && -d "$PREVIOUS" ]]; then
    ln -s "$PREVIOUS" "$NEXT"
    mv -Tf "$NEXT" "$CURRENT"
    systemctl reload nginx
  fi
  exit 1
}
trap 'rm -f "$NEXT"' EXIT

systemctl reload nginx
for path in / /admin/; do
  curl -fsS --max-time 8 --resolve myjiashu.cn:443:127.0.0.1 \
    "https://myjiashu.cn$path" >/dev/null || rollback
done
echo "Website and admin are healthy at $SHA"

find "$RELEASES" -mindepth 1 -maxdepth 1 -type d -printf '%T@ %p\n' |
  sort -nr | tail -n +6 | cut -d' ' -f2- |
  while IFS= read -r old; do
    [[ "$(readlink -f "$CURRENT")" == "$old" ]] || rm -rf -- "$old"
  done
