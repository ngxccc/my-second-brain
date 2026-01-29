#!/bin/bash
git pull origin main
git add .
git commit -m "brain dump: $(date)"
git push origin main
echo "🧠 Brain synced successfully!"