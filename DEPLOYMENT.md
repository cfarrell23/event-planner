# 🎉 Event Planner - Vercel Deployment Guide

Your app is live and deployed to Vercel! Here's how to manage it from the terminal.

## ✅ Current Deployment Status

**URL:** https://event-planner-q8h07wpkq-week-ahead1.vercel.app  
**Status:** READY ✅  
**Last Deploy:** 11/17/2026, 11:43:03 AM

## 🚀 Quick Commands

### Check Deployment Status
```bash
./deploy.sh status
```
Shows the latest deployments and their status.

### View Deployment Logs
```bash
./deploy.sh logs
```
Opens your Vercel dashboard (requires browser).

### Push New Code
```bash
./deploy.sh push
```
Commits and pushes your code to GitHub main branch. Vercel automatically rebuilds and deploys.

## 🔑 Authentication

Your Vercel API token is stored in `.env.vercel` (do NOT commit this file).

If you need to regenerate the token:
1. Go to [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Create a new token
3. Update `.env.vercel` with the new token

## 📋 Manual Commands

If you prefer to use the scripts directly:

```bash
# Check deployment status
VERCEL_TOKEN=your_token_here node check-deployment.js

# Or use environment file
source .env.vercel
node check-deployment.js
```

## 🌐 Accessing Your App

Your app is available at:
- **Latest Deployment:** https://event-planner-q8h07wpkq-week-ahead1.vercel.app
- **Dashboard:** https://vercel.com/week-ahead1/event-planner

## ⚙️ Configuration

Your Vercel project settings:
- **Framework:** Next.js
- **Node Version:** 26.x
- **Region:** iad1 (N. Virginia)
- **Git Integration:** GitHub (automatic deployments on push to main)

## 🔧 Troubleshooting

**Token not working?**
- Regenerate at: https://vercel.com/account/tokens
- Update `.env.vercel`

**Deployment failed?**
- Check the dashboard: https://vercel.com/week-ahead1/event-planner
- View build logs in the Vercel UI

**Can't see recent changes?**
- Make sure you've pushed to GitHub main branch
- Wait a few seconds for Vercel to detect the push
- Run `./deploy.sh status` to check deployment progress

## 📚 Next Steps

1. **Set up environment variables** in Vercel:
   - Google OAuth credentials (for Sign in with Google)
   - NextAuth secret
   - API keys for event sources (optional)

2. **Configure custom domain** (optional):
   - In Vercel dashboard → Settings → Domains
   - Add your custom domain

3. **Enable observability**:
   - Set up Web Analytics
   - Configure error tracking

---

**Happy deploying! 🎊**
