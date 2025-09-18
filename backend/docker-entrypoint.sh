#!/bin/sh
set -e

# Ensure data directory exists if using SQLite path under /data
if [ -n "$DATABASE_URL" ] && echo "$DATABASE_URL" | grep -E '^sqlite:/{2,3}/' >/dev/null 2>&1; then
  mkdir -p /data
fi

# Initialize database and seed sample data (idempotent)
python /app/start.py || true

# Start the FastAPI app
exec uvicorn main:app --host 0.0.0.0 --port 8000
