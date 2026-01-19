# 🚀 Deployment Guide - StudyBuddy AI

This guide will help you deploy your StudyBuddy AI application to production.

## 📋 Overview

Your application has **two components**:
1. **Frontend** (React + Vite + Convex) → Deploy to Vercel
2. **Backend** (Python FastAPI) → Deploy to Railway/Render

---

## 🐍 Part 1: Deploy Python Backend to Railway (Recommended)

### Steps:

1. **Go to [Railway.app](https://railway.app)**
   - Sign up with GitHub
   - Click "New Project"

2. **Deploy from GitHub**
   - Click "Deploy from GitHub repo"
   - Select your repository
   - Railway will auto-detect the Python backend

3. **Configure Root Directory**
   - Click on your service
   - Go to "Settings" → "Service Settings"
   - Set **Root Directory** to: `backend`
   - Click "Save"

4. **Set Environment Variables**
   - Go to "Variables" tab
   - Add these variables:
     ```
     OPENROUTER_API_KEY=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
     AI_MODEL=tngtech/deepseek-r1t2-chimera:free
     CORS_ORIGINS=http://localhost:5173,https://*.vercel.app
     PORT=8000
     ```

5. **Get Your Backend URL**
   - After deployment, Railway will give you a URL like: `https://studybuddy-backend-production.railway.app`
   - **Copy this URL** - you'll need it for frontend!

---

## 🌐 Part 2: Create API Configuration for Frontend

Run this command to create the API config:

```bash
mkdir -p src/config
cat > src/config/api.ts << 'EOF'
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const apiEndpoints = {
  chat: \`\${API_URL}/api/chat\`,
  quiz: \`\${API_URL}/api/quiz/generate\`,
  studyPlan: \`\${API_URL}/api/study-plan\`,
  subjects: \`\${API_URL}/api/subjects\`,
};
EOF
```

---

## 🚀 Part 3: Deploy Frontend to Vercel

### Prerequisites
- Backend URL from Step 1 (e.g., `https://your-app.railway.app`)

### Steps:

1. **Go to [Vercel.com](https://vercel.com)**
   - Sign up/Login with GitHub
   - Click "Add New..." → "Project"

2. **Import Repository**
   - Select your GitHub repository
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Vite
   - **Root Directory**: Leave as `.` (root)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)

4. **Add Environment Variables**
   - Click "Environment Variables"
   - Add:
     ```
     VITE_API_URL=https://your-backend-url.railway.app
     ```

5. **Deploy**
   - Click "Deploy"
   - Wait ~2-3 minutes
   - You'll get a URL like: `https://your-app.vercel.app`

6. **Update Backend CORS**
   - Go back to Railway
   - Update `CORS_ORIGINS` environment variable to include your Vercel URL:
     ```
     CORS_ORIGINS=https://your-app.vercel.app
     ```
   - Railway will auto-redeploy

---

## ✅ Verify Deployment

1. **Test Backend**
   ```bash
   curl https://your-backend-url.railway.app
   # Should return: {"status":"healthy","service":"StudyBuddy AI","version":"1.0.0"}
   ```

2. **Test Frontend**
   - Visit your Vercel URL
   - Try authentication
   - Test AI features

---

## 💰 Cost: FREE for both!

- **Railway**: $5 free credit/month (enough for this app)
- **Vercel**: Free for personal projects
- **Convex**: Free tier (generous limits)

---

## 🎉 You're Done!

Your app is now live!
