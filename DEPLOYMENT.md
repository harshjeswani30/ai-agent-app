# StudyBuddy AI - Deployment Guide

## Backend Deployment (Python/FastAPI)

### Render
1. Create account at https://render.com
2. New Web Service → Connect GitHub repo
3. Configure:
   - Root Directory: `backend`
   - Build: `pip install -r requirements.txt`
   - Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Add environment variables:
   - OPENROUTER_API_KEY
   - CORS_ORIGINS (include Vercel URL)
5. Deploy and copy URL

## Frontend Deployment (Vercel)

1. Visit https://vercel.com
2. Import GitHub repository
3. Framework: Vite
4. Add env vars:
   - VITE_CONVEX_URL
   - VITE_BACKEND_URL (from Render)
5. Deploy

## Update CORS

Update backend `CORS_ORIGINS` to include Vercel URL after deployment.

## Test
- Visit Vercel URL
- Authenticate
- Chat with AI
- Generate quiz
