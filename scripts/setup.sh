#!/bin/bash
# Initial setup: install all dependencies and download models
# Usage: ./scripts/setup.sh

set -e

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "=== Installing backend dependencies ==="
cd "$PROJECT_DIR"
uv sync

echo ""
echo "=== Downloading agent models ==="
uv run python agent/agent.py download-files

echo ""
echo "=== Installing frontend dependencies ==="
cd "$PROJECT_DIR/web"
pnpm install

echo ""
echo "========================================="
echo "  Setup complete!"
echo "  Copy .env.example to .env.local and fill in your keys."
echo "  Then run: ./scripts/start-dev.sh"
echo "========================================="
