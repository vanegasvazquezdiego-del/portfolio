#!/usr/bin/env bash
# Creates a Linux .desktop launcher that opens the portfolio as a standalone window.
# Usage: APP_URL="https://you.github.io/portfolio/" bash scripts/install-linux.sh
set -euo pipefail
APP_URL="${APP_URL:-http://localhost:4173/}"
APP_NAME="AlexDev Portfolio"
DESKTOP_FILE="$HOME/.local/share/applications/portfolio-dev.desktop"

# Prefer Chrome/Chromium/Edge if present
for bin in google-chrome chromium chromium-browser microsoft-edge; do
  if command -v "$bin" >/dev/null 2>&1; then BROWSER="$bin"; break; fi
done
BROWSER="${BROWSER:-xdg-open}"

mkdir -p "$(dirname "$DESKTOP_FILE")"
cat > "$DESKTOP_FILE" <<EOF
[Desktop Entry]
Name=$APP_NAME
Comment=Developer portfolio web app
Exec=$BROWSER --app=$APP_URL
Icon=applications-internet
Terminal=false
Type=Application
Categories=Development;
StartupWMClass=$APP_NAME
EOF
chmod +x "$DESKTOP_FILE"
update-desktop-database "$HOME/.local/share/applications" 2>/dev/null || true
echo "Created $DESKTOP_FILE → $APP_URL (via $BROWSER)"
