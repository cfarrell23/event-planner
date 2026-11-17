#!/bin/bash

# Load environment
set -a
[ -f .env.vercel ] && source .env.vercel
set +a

if [ -z "$VERCEL_TOKEN" ]; then
  echo "❌ Error: VERCEL_TOKEN not found in .env.vercel"
  echo "Please set your Vercel token at: https://vercel.com/account/tokens"
  exit 1
fi

echo "🚀 Event Planner - Vercel Deployment Helper"
echo ""
echo "Available commands:"
echo "  ./deploy.sh status    - Check deployment status"
echo "  ./deploy.sh logs      - View deployment logs"
echo "  ./deploy.sh push      - Push code and trigger deployment"
echo ""

if [ -z "$1" ]; then
  echo "No command specified. Running 'status'...\n"
  VERCEL_TOKEN=$VERCEL_TOKEN node check-deployment.js
  exit 0
fi

case "$1" in
  status)
    echo "Checking deployment status..."
    VERCEL_TOKEN=$VERCEL_TOKEN node check-deployment.js
    ;;
  logs)
    echo "To view deployment logs, visit:"
    echo "https://vercel.com/week-ahead1/event-planner"
    ;;
  push)
    echo "Pushing to GitHub main branch..."
    git push origin main
    echo ""
    echo "✅ Code pushed! Vercel will automatically rebuild."
    echo "Check status with: ./deploy.sh status"
    ;;
  *)
    echo "Unknown command: $1"
    echo "Use: status, logs, or push"
    exit 1
    ;;
esac
