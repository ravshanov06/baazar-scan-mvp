# BazaarScan MVP - Deployment Guide

Once the project is connected to Vercel and Railway from GitHub, **pushing to `main` triggers automatic deploys**: Vercel builds and deploys the frontend (from `client/`), and Railway builds and deploys the backend (from `server/`). No extra steps needed.

## Prerequisites
- GitHub account
- Vercel account (free tier)
- Railway account (free tier)

## Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit - BazaarScan MVP"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/bazaar-scan-mvp.git
git push -u origin main
```

## Step 2: Deploy Backend to Railway

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your `bazaar-scan-mvp` repository
4. Railway will auto-detect Node.js

### Configure Backend:
- **Root Directory**: `server` (required — build/start commands in `railway.json` run from this folder)
- Build and start commands are read from repo `railway.json` (no need to set in dashboard)
- **Environment Variables** (set in Railway → Service → Variables):
  ```
  NODE_ENV=production
  PORT=3000
  DATABASE_URL=<auto-set when you add PostgreSQL>
  CORS_ORIGIN=https://your-frontend.vercel.app
  ```
  `CORS_ORIGIN` is optional but recommended so the API only accepts requests from your Vercel frontend.

### Add PostgreSQL Database:
1. Click "New" → "Database" → "Add PostgreSQL"
2. Railway will automatically set `DATABASE_URL`
3. Migrations run automatically during build (see `railway.json`: `npx prisma migrate deploy`)

### Get Backend URL:
- Go to "Settings" → "Generate Domain"
- Copy the URL (e.g., `https://your-app.up.railway.app`)

## Step 3: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Environment Variables:
```
VITE_API_URL=https://your-backend-url.up.railway.app
```

5. Click "Deploy"

## Step 4: Update Frontend API Calls

If you haven't already, update `client/src/` to use `import.meta.env.VITE_API_URL`:

```javascript
// In axios calls, replace '/api/...' with:
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
axios.get(`${API_URL}/api/shops/nearby?...`)
```

## Step 5: Test Production Deployment

1. Visit your Vercel URL
2. Test vendor registration
3. Test product submission
4. Test map and search functionality

## Troubleshooting

### CORS Issues
Add to `server/src/app.js`:
```javascript
app.use(cors({
  origin: 'https://your-frontend.vercel.app',
  credentials: true
}));
```

### Database Connection
- Verify `DATABASE_URL` in Railway
- Check Railway logs for connection errors

### Build Failures
- Check build logs in Vercel/Railway
- Verify all dependencies are in `package.json`

## Production Checklist

- [ ] Database is clean (no mock data)
- [ ] Railway: `DATABASE_URL`, `NODE_ENV`, `PORT`; optional `CORS_ORIGIN` (your Vercel URL)
- [ ] Vercel: `VITE_API_URL` set to your Railway backend URL
- [ ] Railway service Root Directory set to `server` (so `server/railway.json` is used)
- [ ] SSL certificates active (automatic on Vercel/Railway)
- [ ] Test all user flows in production

## Monitoring

### Railway:
- View logs in Railway dashboard
- Monitor database usage
- Check API response times

### Vercel:
- Analytics available in dashboard
- Monitor build times
- Check deployment logs

## Costs

**Free Tier Limits:**
- **Railway**: $5 free credit/month, ~500 hours
- **Vercel**: Unlimited deployments, 100GB bandwidth

Both platforms offer generous free tiers perfect for MVP testing!
