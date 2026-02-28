#!/bin/bash
# Start both backend agent and frontend web in development mode
# Usage: ./scripts/start-dev.sh

set -e

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

# Ensure web/.env.local symlink points to the root .env.local
if [ -f "$PROJECT_DIR/.env.local" ] && [ ! -L "$PROJECT_DIR/web/.env.local" ]; then
    ln -sf "../.env.local" "$PROJECT_DIR/web/.env.local"
    echo "Created symlink: web/.env.local -> ../.env.local"
fi

cleanup() {
    echo ""
    echo "Shutting down..."
    kill $AGENT_PID $WEB_PID 2>/dev/null
    wait $AGENT_PID $WEB_PID 2>/dev/null
    echo "All services stopped."
}

trap cleanup EXIT INT TERM

# Start backend agent
echo "Starting backend agent..."
cd "$PROJECT_DIR"
uv run python agent/agent.py dev &
AGENT_PID=$!

# Start frontend web
echo "Starting frontend web..."
cd "$PROJECT_DIR/web"
pnpm dev &
WEB_PID=$!

echo ""
echo "========================================="
echo "  Backend Agent: running (dev mode)"
echo "  Frontend Web:  http://localhost:3002"
echo "  Press Ctrl+C to stop all services"
echo "========================================="
echo ""

wait
