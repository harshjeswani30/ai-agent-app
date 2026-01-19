# StudyBuddy AI - Deployment Guide

This guide provides step-by-step instructions for deploying StudyBuddy AI to production.

## Prerequisites

- GitHub account
- Vercel account (for frontend)
- Render or Railway account (for Python backend)
- Convex account
- OpenRouter API key

## Step 1: Prepare Your Repository

1. Push your code to GitHub:
```bash
git add .
git commit -m "Complete StudyBuddy AI application"
git push origin main
```

## Step 2: Deploy Convex Backend

1. Install Convex CLI if not already installed:
```bash
npm install -g convex
```

2. Deploy Convex:
```bash
npx convex deploy
```

3. Note your Convex deployment URL (e.g., `https://xxx.convex.cloud`)

## Step 3: Deploy Python Backend

### Option A: Render

1. Go to [render.com](https://render.com) and sign in
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: studybuddy-api
   - **Root Directory**: `python-backend`
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: Free

5. Add environment variables:
   - `OPENROUTER_API_KEY`: Your OpenRouter API key
   - `PORT`: 8000 (auto-set by Render)

6. Click "Create Web Service"
7. Wait for deployment to complete
8. Note your backend URL (e.g., `https://studybuddy-api.onrender.com`)

### Option B: Railway

1. Go to [railway.app](https://railway.app) and sign in
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Configure:
   - Set root directory to `python-backend`
   - Add environment variable: `OPENROUTER_API_KEY`
5. Railway will auto-detect Python and deploy
6. Copy your deployment URL from the dashboard

## Step 4: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `.` (leave as default)
   - **Build Command**: `pnpm install && pnpm build`
   - **Output Directory**: `dist`

5. Add environment variables:
   - `VITE_CONVEX_URL`: Your Convex deployment URL
   - `VITE_PYTHON_API_URL`: Your Python backend URL

6. Click "Deploy"
7. Wait for deployment to complete
8. Your app will be live at your Vercel URL (e.g., `https://studybuddy-ai.vercel.app`)

## Step 5: Update CORS Settings

Update your Python backend to allow your frontend domain:

In `python-backend/main.py`, update CORS configuration:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-vercel-url.vercel.app",
        "http://localhost:5173"  # Keep for local development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Commit and push this change. Your backend will automatically redeploy.

## Step 6: Test Your Deployment

1. Visit your Vercel URL
2. Test each feature:
   - AI Explanations
   - Flashcards
   - Quiz
   - Study Schedule
3. Check that data is being saved to Convex

## Troubleshooting

### Frontend not connecting to backend

Check:
1. `VITE_PYTHON_API_URL` is set correctly in Vercel
2. CORS is configured correctly in Python backend
3. Backend is running (visit backend URL directly)

### Backend errors

Check:
1. `OPENROUTER_API_KEY` is set correctly
2. Check backend logs in Render/Railway dashboard
3. Verify requirements.txt includes all dependencies

### Convex connection issues

Check:
1. `VITE_CONVEX_URL` is set correctly
2. Run `npx convex deploy` to ensure functions are deployed
3. Check Convex dashboard for errors

## Monitoring

### Convex Dashboard
- Monitor function calls
- View database contents
- Check for errors

### Backend Dashboard (Render/Railway)
- View logs
- Monitor CPU/memory usage
- Check API response times

### Vercel Dashboard
- View deployment logs
- Monitor bandwidth usage
- Check build status

## Cost Estimates

- **Convex**: Free tier (includes 1M function calls/month)
- **Vercel**: Free tier (unlimited projects)
- **Render/Railway**: Free tier available
- **OpenRouter**: Free tier with Gemini model
- **Total**: $0/month for hobby projects

## Scaling

When you need to scale:

1. **Backend**: Upgrade to paid tier on Render/Railway
2. **Frontend**: Vercel scales automatically
3. **Convex**: Upgrade to Pro plan
4. **OpenRouter**: Consider paid models for better performance

## Production Checklist

- [ ] All environment variables set
- [ ] CORS configured correctly
- [ ] Backend health check responding
- [ ] Frontend can reach backend
- [ ] Convex functions deployed
- [ ] Test all features work end-to-end
- [ ] Error handling works
- [ ] Loading states display correctly
- [ ] Mobile responsive design verified

## Support

If you encounter issues:
1. Check backend logs
2. Check browser console for frontend errors
3. Verify all environment variables are set
4. Test with free OpenRouter models first

---

Congratulations! Your StudyBuddy AI application is now live! 🎉
