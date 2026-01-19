# Testing Checklist for Study Buddy AI

Use this checklist before submitting to ensure everything works properly.

## Pre-Deployment Testing

### Environment Setup
- [ ] Python 3.10+ installed
- [ ] Node.js 18+ and pnpm installed
- [ ] All dependencies installed (`pnpm install` and `pip install -r requirements.txt`)
- [ ] Environment variables configured
  - [ ] `.env.local` has VITE_CONVEX_URL
  - [ ] `.env.local` has VITE_PYTHON_API_URL
  - [ ] `python-backend/.env` has OPENROUTER_API_KEY
- [ ] Convex dev server running (`npx convex dev`)
- [ ] Python backend running (`python main.py`)
- [ ] Frontend dev server running (`pnpm dev`)

### Backend API Tests
- [ ] Python backend starts without errors
- [ ] API accessible at http://localhost:8000
- [ ] Health check endpoint works: `curl http://localhost:8000/`
- [ ] No CORS errors in browser console
- [ ] OpenRouter API key is valid

### Database Tests
- [ ] Convex dashboard shows tables:
  - [ ] studySessions
  - [ ] savedContent
  - [ ] quizResults
  - [ ] users
- [ ] Can view data in Convex dashboard
- [ ] Real-time updates working

### Frontend Feature Tests

#### 1. Landing Page
- [ ] Page loads without errors
- [ ] All sections visible
- [ ] Navigation buttons work
- [ ] Responsive on mobile
- [ ] Animations smooth

#### 2. Dashboard - Explain Tab
- [ ] Can enter topic
- [ ] Can select depth level
- [ ] Click "Explain Topic" button
- [ ] Loading state shows
- [ ] Explanation displays correctly
- [ ] Key points visible
- [ ] Examples visible
- [ ] "Save" button works
- [ ] Toast notification appears

#### 3. Dashboard - Flashcards Tab
- [ ] Can enter topic
- [ ] Can set count (1-20)
- [ ] Click "Generate Flashcards"
- [ ] Loading state shows
- [ ] Flashcards display
- [ ] Can flip cards (click to flip)
- [ ] Previous/Next navigation works
- [ ] Progress indicator shows (Card X of Y)
- [ ] "Save All" button works

#### 4. Dashboard - Quiz Tab
- [ ] Can enter topic
- [ ] Can select difficulty
- [ ] Can set question count
- [ ] Click "Generate Quiz"
- [ ] Loading state shows
- [ ] Questions display
- [ ] Can select answers
- [ ] Progress dots show current question
- [ ] Previous/Next navigation works
- [ ] "Submit Quiz" button enabled when all answered
- [ ] Results page shows:
  - [ ] Score percentage
  - [ ] Correct/incorrect indicators
  - [ ] Explanations for each question
- [ ] "Take Another Quiz" button works

#### 5. Dashboard - Schedule Tab
- [ ] Can add multiple topics
- [ ] Can remove topics
- [ ] Can set hours per day (1-12)
- [ ] Can set number of days (1-30)
- [ ] Click "Create Schedule"
- [ ] Loading state shows
- [ ] Schedule displays by day
- [ ] Study blocks show duration and focus area
- [ ] Study tips display
- [ ] "Save Schedule" button works

#### 6. Dashboard - Saved Tab
- [ ] Shows "No content" message initially
- [ ] After saving content, it appears here
- [ ] Can filter by type (All, Explained, Flashcards, Quiz, Schedule)
- [ ] Can toggle favorites (star icon)
- [ ] Can delete saved content (trash icon)
- [ ] Favorites section appears when items favorited
- [ ] Shows creation date

#### 7. Stats Display
- [ ] Study Sessions count shows
- [ ] Study Time (hours) shows
- [ ] Quiz Average shows
- [ ] Updates after completing activities

### Error Handling Tests
- [ ] Invalid topic (empty) shows error toast
- [ ] Invalid count shows error toast
- [ ] Python backend offline shows error toast
- [ ] Network errors handled gracefully
- [ ] No console errors

### Performance Tests
- [ ] Page loads in < 3 seconds
- [ ] AI responses in < 10 seconds
- [ ] Animations smooth (no jank)
- [ ] No memory leaks (check DevTools)

### Mobile Responsive Tests
- [ ] All pages work on mobile view
- [ ] Navigation responsive
- [ ] Cards stack properly
- [ ] Forms usable on mobile
- [ ] Tabs work on mobile

### Browser Compatibility
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari (if available)
- [ ] Edge

## Deployment Testing

### Python Backend Deployment
- [ ] Deployed successfully
- [ ] Environment variables set
- [ ] Health check endpoint works
- [ ] No errors in deployment logs
- [ ] CORS configured for frontend domain

### Frontend Deployment
- [ ] Build succeeds (`pnpm build`)
- [ ] Deployed successfully
- [ ] Environment variables set
- [ ] Site loads at deployment URL
- [ ] All features work on deployed version

### Convex Deployment
- [ ] `npx convex deploy` succeeds
- [ ] Functions deployed
- [ ] Database accessible
- [ ] Authentication works (if used)

### Integration Tests (Deployed)
- [ ] Frontend can reach Python backend
- [ ] Frontend can reach Convex
- [ ] Python backend can reach OpenRouter
- [ ] All features work end-to-end
- [ ] No CORS errors
- [ ] No console errors

## Documentation Checks
- [ ] README.md complete with:
  - [ ] Project description
  - [ ] Setup instructions
  - [ ] Tech stack
  - [ ] Features list
- [ ] DEPLOYMENT.md has deployment steps
- [ ] Environment variable examples provided
- [ ] Code comments where needed

## Submission Checklist

### Required Items
- [ ] Live deployed project URL
- [ ] Public GitHub repository link
- [ ] Loom video (1 minute)
  - [ ] Face visible
  - [ ] Live explanation of project
  - [ ] Explanation of how it was built
  - [ ] No voice over (live commentary)
- [ ] Resume uploaded (PDF format)

### Loom Video Content
- [ ] Introduction with face visible
- [ ] Demo of each feature:
  - [ ] AI Explanations
  - [ ] Flashcards
  - [ ] Quizzes
  - [ ] Study Schedules
  - [ ] Progress tracking
- [ ] Explanation of:
  - [ ] Pydantic AI agents
  - [ ] Tech stack
  - [ ] Key features
- [ ] Total length ≈ 1 minute

### GitHub Repository
- [ ] All code pushed
- [ ] README.md comprehensive
- [ ] .env.example files included
- [ ] .gitignore configured
- [ ] Requirements/dependencies listed
- [ ] License file (if required)

### Final Verification
- [ ] Test deployment URL one more time
- [ ] Verify GitHub repo is public
- [ ] Watch Loom video to ensure quality
- [ ] Ensure PDF resume is attached
- [ ] All submission fields filled out

---

## Troubleshooting Common Issues

### Python Backend Won't Start
- Check Python version: `python --version` (need 3.10+)
- Check dependencies: `pip list | grep pydantic-ai`
- Check .env file has OPENROUTER_API_KEY
- Check port 8000 isn't in use: `lsof -i :8000`

### Frontend Build Errors
- Check Node version: `node --version` (need 18+)
- Delete node_modules and reinstall: `rm -rf node_modules && pnpm install`
- Clear Vite cache: `rm -rf .vite`
- Check TypeScript errors: `npx tsc -b --noEmit`

### Convex Errors
- Ensure logged in: `npx convex dev`
- Check schema validation
- Clear and regenerate: `npx convex dev --once`
- Check Convex dashboard for errors

### OpenRouter API Issues
- Verify API key is valid at https://openrouter.ai/
- Check rate limits
- Try different model if current one fails
- Check API key has sufficient credits

### CORS Errors
- Update CORS origins in `python-backend/main.py`
- Ensure frontend domain is whitelisted
- Check browser DevTools Network tab for details

---

Good luck with your submission! 🎓
