#!/bin/bash
# Start only the frontend web
# Usage: ./scripts/start-web.sh

set -e

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

cd "$PROJECT_DIR/web"
echo "Starting frontend web at http://localhost:3001 ..."
/usr/local/bin/pnpm dev
