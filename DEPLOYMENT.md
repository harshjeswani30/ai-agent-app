# Deployment Guide - Study Buddy AI

## Overview

This guide covers deploying all three parts of the application:
1. Frontend (Vercel/Netlify)
2. Python Backend (Railway/Render)
3. Convex Backend (Automatic)

## Prerequisites

- GitHub repository
- Vercel/Netlify account
- Railway or Render account
- OpenRouter API key
- Convex account

## Step 1: Deploy Convex Backend

1. **Initialize Convex**
```bash
npx convex dev
```

2. **Deploy to production**
```bash
npx convex deploy
```

3. **Note your Convex URL**
   - Find it in the Convex dashboard
   - Format: `https://your-project.convex.cloud`

## Step 2: Deploy Python Backend

### Option A: Railway

1. **Create new project** on Railway
2. **Connect GitHub repo**
3. **Configure**:
   - Root directory: `/python-backend`
   - Build command: `pip install -r requirements.txt`
   - Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

4. **Add environment variables**:
   ```
   OPENROUTER_API_KEY=your_key_here
   PORT=8000
   ```

5. **Deploy** - Railway will provide a URL like `https://your-app.railway.app`

### Option B: Render

1. **Create Web Service** on Render
2. **Connect repository**
3. **Configure**:
   - Environment: Python
   - Root directory: `python-backend`
   - Build command: `pip install -r requirements.txt`
   - Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

4. **Add environment variables** in Render dashboard

5. **Deploy** - Get your service URL

## Step 3: Deploy Frontend

### Option A: Vercel

1. **Install Vercel CLI** (optional)
```bash
npm i -g vercel
```

2. **Connect to Vercel**
   - Go to vercel.com
   - Import your GitHub repository
   - Or use CLI: `vercel`

3. **Configure environment variables** in Vercel dashboard:
   ```
   VITE_CONVEX_URL=https://your-project.convex.cloud
   VITE_PYTHON_API_URL=https://your-python-backend.railway.app
   ```

4. **Build settings**:
   - Framework: Vite
   - Build command: `pnpm build`
   - Output directory: `dist`

5. **Deploy**

### Option B: Netlify

1. **Connect repository** on Netlify
2. **Configure**:
   - Build command: `pnpm build`
   - Publish directory: `dist`

3. **Environment variables**:
   ```
   VITE_CONVEX_URL=https://your-project.convex.cloud
   VITE_PYTHON_API_URL=https://your-python-backend.render.com
   ```

4. **Deploy**

## Step 4: Update CORS

Update `python-backend/main.py` with your frontend URL:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend.vercel.app"],  # Update this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Step 5: Test

1. Visit your deployed frontend URL
2. Test all features:
   - AI Explanations
   - Flashcards
   - Quizzes
   - Study Schedules
3. Check browser console for errors
4. Verify data saves to Convex

## Troubleshooting

### Python Backend Not Responding

- Check logs in Railway/Render dashboard
- Verify OpenRouter API key is set
- Ensure PORT environment variable is set

### Frontend CORS Errors

- Update CORS origins in `main.py`
- Redeploy Python backend after changes

### Convex Connection Issues

- Verify VITE_CONVEX_URL is correct
- Check Convex dashboard for deployment status
- Ensure all environment variables are set

### Build Failures

- Check Node.js version (18+)
- Verify all dependencies installed
- Review build logs for specific errors

## Environment Variables Checklist

### Frontend
- [ ] VITE_CONVEX_URL
- [ ] VITE_PYTHON_API_URL

### Python Backend
- [ ] OPENROUTER_API_KEY
- [ ] PORT

## Post-Deployment

1. **Test all features** thoroughly
2. **Record Loom video** showing:
   - Your face
   - Live walkthrough of features
   - Explanation of how it was built
3. **Update README** with:
   - Live deployment URL
   - Loom video link
   - GitHub repository link

## Monitoring

- **Convex**: Dashboard shows function calls, database size
- **Railway/Render**: Monitor logs and metrics
- **Vercel/Netlify**: Check analytics and build logs

## Scaling Considerations

- Add rate limiting (Convex rate-limiter component)
- Monitor OpenRouter usage
- Consider caching for frequent queries
- Add error tracking (e.g., Sentry)

---

**Need Help?** Check the main README or open an issue on GitHub.
