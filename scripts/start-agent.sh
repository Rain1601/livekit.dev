#!/bin/bash
# Start only the backend agent
# Usage: ./scripts/start-agent.sh [dev|start|console]

set -e

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
MODE="${1:-dev}"

cd "$PROJECT_DIR"
echo "Starting agent in $MODE mode..."
uv run python agent/agent.py "$MODE"
