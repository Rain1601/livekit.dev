#!/bin/bash
# Start only the frontend web
# Usage: ./scripts/start-web.sh

set -e

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

# Ensure web/.env.local symlink points to the root .env.local
if [ -f "$PROJECT_DIR/.env.local" ] && [ ! -L "$PROJECT_DIR/web/.env.local" ]; then
    ln -sf "../.env.local" "$PROJECT_DIR/web/.env.local"
    echo "Created symlink: web/.env.local -> ../.env.local"
fi

cd "$PROJECT_DIR/web"
echo "Starting frontend web at http://localhost:3002 ..."
pnpm dev
