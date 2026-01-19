# ⚡ Quick Deployment Guide

## 🚀 Deploy in 3 Steps (15 minutes)

### Step 1: Deploy Backend to Railway (5 min)

1. Go to **[railway.app](https://railway.app)** and sign in with GitHub
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository
4. In Railway dashboard:
   - Click on the service
   - **Settings** → Set **Root Directory** to `backend`
   - **Variables** → Add environment variables:
     ```
     OPENROUTER_API_KEY=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
     AI_MODEL=tngtech/deepseek-r1t2-chimera:free
     CORS_ORIGINS=https://*.vercel.app
     ```
5. **Copy your Railway URL** (e.g., `https://studybuddy-production-abc.railway.app`)

---

### Step 2: Deploy Frontend to Vercel (5 min)

1. Go to **[vercel.com](https://vercel.com)** and sign in with GitHub
2. Click **"Add New"** → **"Project"**
3. Select your repository and click **"Import"**
4. Add environment variable:
   - Key: `VITE_API_URL`
   - Value: `https://your-railway-url.railway.app` (from Step 1)
5. Click **"Deploy"** and wait ~2 minutes
6. **Copy your Vercel URL** (e.g., `https://studybuddy.vercel.app`)

---

### Step 3: Update CORS (2 min)

1. Go back to **Railway dashboard**
2. Update the `CORS_ORIGINS` variable to:
   ```
   CORS_ORIGINS=https://your-vercel-url.vercel.app
   ```
3. Railway will automatically redeploy

---

## ✅ Done!

Your app is live at: **https://your-vercel-url.vercel.app**

Test it:
- Sign up / Continue as guest
- Try the Explain tab
- Generate a quiz

---

## 🐛 Troubleshooting

**"Failed to generate explanation"?**
- Check Railway logs for errors
- Verify API key is correct
- Make sure CORS includes your Vercel URL

**Backend not responding?**
- Wait 1-2 minutes for Railway to deploy
- Check Railway logs

**CORS errors in browser console?**
- Update CORS_ORIGINS in Railway with exact Vercel URL
- Wait for Railway to redeploy

---

## 📊 Free Tier Limits

- **Railway**: $5 credit/month (~500 hours runtime)
- **Vercel**: Unlimited personal projects
- **Convex**: 1GB storage, 1M function calls/month
- **OpenRouter**: Pay per use (~$0.001-0.01 per request)

**Estimated cost**: $0-5/month for hobby use

---

## 🎉 What's Next?

- Share your app with friends!
- Monitor usage in Railway/Vercel dashboards
- Add custom domain (both platforms support it)
- Set up analytics (Vercel Analytics is free)

Need help? Open an issue on GitHub!
