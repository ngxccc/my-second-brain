#!/bin/bash
git add .
git commit -m "brain dump: $(date '+%Y-%m-%d %H:%M %:z')"
git push origin main
echo "🧠 Brain synced successfully!"
