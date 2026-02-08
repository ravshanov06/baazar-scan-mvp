# Railway Deployment - Quick Start

## What You Need
- GitHub account with your code pushed
- Railway account (free tier)

## Step-by-Step Backend Deployment

### 1. Prepare Your Code
```bash
cd /home/mrmini/projects/bazaar-scan-mvp
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Deploy to Railway

**A. Create New Project**
- Go to https://railway.app
- Click "Start a New Project"
- Select "Deploy from GitHub repo"
- Choose `bazaar-scan-mvp`

**B. Configure Service**
After deployment starts:
- Click on the service card
- Go to Settings → Service
- **Root Directory**: `server`
- **Start Command**: `npm start`
- **Build Command**: `npm install && npx prisma generate && npx prisma migrate deploy`

**C. Add PostgreSQL**
- Click "New" in your project
- Select "Database" → "PostgreSQL"
- Railway auto-connects it to your service

**D. Generate Domain**
- Go to Settings → Networking
- Click "Generate Domain"
- Copy the URL (e.g., `https://your-app.up.railway.app`)

### 3. Update Vercel

**A. Add Environment Variable**
- Go to Vercel dashboard
- Select your project
- Settings → Environment Variables
- Add:
  - Name: `VITE_API_URL`
  - Value: `https://your-railway-url.up.railway.app`
  - Environments: All

**B. Redeploy**
- Deployments tab
- Click "..." → "Redeploy"

### 4. Test
Visit your Vercel URL and verify:
- Map loads
- Can register vendor
- Can add products
- Products appear on map

## Troubleshooting

**Backend won't start?**
- Check Railway logs
- Verify `DATABASE_URL` is set
- Check build command ran successfully

**Frontend still shows nothing?**
- Verify `VITE_API_URL` is set in Vercel
- Check browser console for errors
- Verify Railway backend is running

**CORS errors?**
Add to `server/src/app.js`:
```javascript
app.use(cors({
  origin: 'https://your-vercel-url.vercel.app',
  credentials: true
}));
```

## Costs
- Railway: $5 free credit/month
- Vercel: Free for hobby projects
- PostgreSQL on Railway: Included in free tier
