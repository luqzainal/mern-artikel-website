# 🚀 Production Deployment Guide

This guide will help you deploy the MERN Islamic Articles Website to production using:
- **GitHub** - Source code repository
- **Netlify** - Hosting for Frontend & Admin (static sites) + Backend (serverless functions)
- **Supabase** - PostgreSQL database

---

## 📋 Prerequisites

Before starting, create accounts on:
1. [GitHub](https://github.com) - For code repository
2. [Netlify](https://www.netlify.com) - For hosting
3. [Supabase](https://supabase.com) - For database

---

## 1️⃣ Setup Supabase Database

### Step 1: Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click **"New Project"**
3. Fill in:
   - **Project Name**: `islamic-articles-db`
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose closest to your users
4. Click **"Create new project"** (takes ~2 minutes)

### Step 2: Get Database Connection String

1. In your Supabase project, go to **Settings** > **Database**
2. Under **Connection String**, copy the **URI** format:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```
3. Replace `[YOUR-PASSWORD]` with the password you set earlier
4. Save this connection string - you'll need it later

### Step 3: Setup Database Schema

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Copy the entire Prisma schema and we'll use Prisma to push it:

**OR use Prisma CLI locally:**

```bash
# In backend directory
cd backend

# Set your Supabase DATABASE_URL temporarily
export DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Push schema to Supabase
npx prisma db push

# Seed initial data
npm run db:seed
```

### Step 4: Verify Database

1. Go to **Table Editor** in Supabase
2. You should see tables: users, roles, categories, articles, etc.
3. Check the **roles** table has data (Admin, Author, Reviewer, etc.)

---

## 2️⃣ Setup GitHub Repository

### Step 1: Initialize Git (if not already done)

```bash
cd c:\projek2\mern-artikel-website

# Initialize git
git init

# Add all files
git add .

# First commit
git commit -m "Initial commit: MERN Islamic Articles Website"
```

### Step 2: Create GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Create new repository:
   - **Name**: `mern-islamic-articles`
   - **Visibility**: Private (recommended) or Public
   - **DO NOT** initialize with README, .gitignore, or license
3. Click **"Create repository"**

### Step 3: Push to GitHub

```bash
# Add GitHub remote
git remote add origin https://github.com/[YOUR-USERNAME]/mern-islamic-articles.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## 3️⃣ Deploy Backend to Netlify

### Step 1: Prepare Backend for Netlify Functions

Create `backend/netlify.toml`:

```toml
[build]
  command = "npm install && npx prisma generate && npm run build"
  functions = "netlify/functions"
  publish = "dist"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Step 2: Deploy Backend

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Click **"Add new site"** > **"Import an existing project"**
3. Choose **GitHub** and authorize Netlify
4. Select `mern-islamic-articles` repository
5. Configure build settings:
   - **Base directory**: `backend`
   - **Build command**: `npm install && npx prisma generate && npm run build`
   - **Publish directory**: `dist`
6. Click **"Show advanced"** > **"New variable"** and add:

```
DATABASE_URL = postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
JWT_SECRET = [GENERATE-32-CHAR-RANDOM-STRING]
SESSION_SECRET = [GENERATE-32-CHAR-RANDOM-STRING]
NODE_ENV = production
FRONTEND_URL = https://[YOUR-FRONTEND-SITE].netlify.app
ADMIN_URL = https://[YOUR-ADMIN-SITE].netlify.app
GOOGLE_CLIENT_ID = [YOUR-GOOGLE-CLIENT-ID]
GOOGLE_CLIENT_SECRET = [YOUR-GOOGLE-CLIENT-SECRET]
GOOGLE_CALLBACK_URL = https://[YOUR-BACKEND-SITE].netlify.app/api/auth/google/callback
```

7. Click **"Deploy site"**

### Step 3: Note Backend URL

After deployment completes, you'll get a URL like:
```
https://[random-name].netlify.app
```

You can change this to a custom subdomain:
- Go to **Site settings** > **Domain management**
- Click **"Options"** > **"Edit site name"**
- Change to something like: `islamic-articles-api`

---

## 4️⃣ Deploy Frontend to Netlify

### Step 1: Update Frontend API URL

Edit `frontend/src/config/api.ts` (or wherever API URL is configured):

```typescript
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://islamic-articles-api.netlify.app';
```

Create `frontend/.env.production`:

```
VITE_API_URL=https://islamic-articles-api.netlify.app
```

### Step 2: Deploy Frontend

1. In Netlify, click **"Add new site"** > **"Import an existing project"**
2. Select same `mern-islamic-articles` repository
3. Configure build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm install && npm run build`
   - **Publish directory**: `frontend/dist`
4. Click **"Show advanced"** > **"New variable"**:

```
VITE_API_URL = https://islamic-articles-api.netlify.app
```

5. Click **"Deploy site"**

### Step 3: Setup Custom Domain (Optional)

- Go to **Site settings** > **Domain management**
- Add custom domain like `qalamailm.com`
- Follow DNS configuration instructions

---

## 5️⃣ Deploy Admin Panel to Netlify

### Step 1: Update Admin API URL

Edit `admin/src/services/api.ts`:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://islamic-articles-api.netlify.app';
```

Create `admin/.env.production`:

```
VITE_API_URL=https://islamic-articles-api.netlify.app
```

### Step 2: Deploy Admin

1. In Netlify, click **"Add new site"** > **"Import an existing project"**
2. Select same repository
3. Configure build settings:
   - **Base directory**: `admin`
   - **Build command**: `npm install && npm run build`
   - **Publish directory**: `admin/dist`
4. Click **"Show advanced"** > **"New variable"**:

```
VITE_API_URL = https://islamic-articles-api.netlify.app
```

5. Click **"Deploy site"**

### Step 3: Name Admin Site

Change site name to: `islamic-articles-admin.netlify.app`

---

## 6️⃣ Update CORS Configuration

### Update Backend Environment Variables

In your backend Netlify site:

1. Go to **Site settings** > **Environment variables**
2. Update these variables:

```
FRONTEND_URL = https://[your-frontend-site].netlify.app
ADMIN_URL = https://[your-admin-site].netlify.app
CORS_ORIGINS = https://[frontend-site].netlify.app,https://[admin-site].netlify.app
```

3. Click **"Save"**
4. Go to **Deploys** > **Trigger deploy** > **Clear cache and deploy site**

---

## 7️⃣ Configure Google OAuth (Optional)

If using Google Login:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **APIs & Services** > **Credentials**
3. Edit your OAuth 2.0 Client ID
4. Add **Authorized redirect URIs**:
   ```
   https://islamic-articles-api.netlify.app/api/auth/google/callback
   ```
5. Add **Authorized JavaScript origins**:
   ```
   https://[your-frontend-site].netlify.app
   https://[your-admin-site].netlify.app
   ```
6. Save changes

---

## 8️⃣ Test Your Deployment

### Test Backend API

```bash
curl https://islamic-articles-api.netlify.app/api/health
```

Should return: `{"status": "ok"}`

### Test Frontend

Visit: `https://[your-frontend-site].netlify.app`

- Should load homepage
- Categories should display
- Articles should display

### Test Admin Panel

Visit: `https://[your-admin-site].netlify.app`

- Login page should load
- After login, dashboard should show real data from Supabase

---

## 9️⃣ Continuous Deployment

Now whenever you push to GitHub:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

Netlify will automatically:
1. Detect the push
2. Build all three projects
3. Deploy updates
4. Your sites are live in ~2-5 minutes

---

## 🔐 Security Checklist

- [ ] Change all default passwords
- [ ] Generate strong random JWT_SECRET (32+ characters)
- [ ] Enable Supabase Row Level Security (RLS)
- [ ] Setup Supabase backup schedule
- [ ] Add rate limiting on backend
- [ ] Enable HTTPS (automatic on Netlify)
- [ ] Configure Content Security Policy headers
- [ ] Review Netlify access logs regularly

---

## 📊 Monitoring

### Netlify Analytics
- Go to **Analytics** tab in each site
- Monitor traffic, bandwidth, build times

### Supabase Monitoring
- Dashboard > **Database** > **Usage**
- Monitor connection count, CPU, disk space

### Error Tracking (Optional)
Consider adding:
- [Sentry](https://sentry.io) for error tracking
- [LogRocket](https://logrocket.com) for session replay

---

## 🆘 Troubleshooting

### Build Fails on Netlify

**Check build logs:**
1. Go to **Deploys** tab
2. Click failed deploy
3. Read error messages

**Common issues:**
- Missing environment variables
- Prisma client not generated: Add `npx prisma generate` to build command
- Node version mismatch: Add `.nvmrc` file with `18` or `20`

### Database Connection Errors

1. Verify DATABASE_URL is correct
2. Check Supabase project is not paused (free tier pauses after 1 week inactivity)
3. Test connection from backend:
   ```bash
   npx prisma db pull
   ```

### CORS Errors

1. Update `CORS_ORIGINS` in backend environment variables
2. Include https:// in URLs
3. Redeploy backend after updating

---

## 💰 Cost Estimation

### Free Tier Limits

**Netlify (Free):**
- 100GB bandwidth/month
- 300 build minutes/month
- 3 sites (perfect for backend, admin, frontend)

**Supabase (Free):**
- 500MB database
- 2GB bandwidth/month
- 50MB file storage
- Project pauses after 1 week inactivity

**GitHub (Free):**
- Unlimited public/private repos
- 2,000 actions minutes/month

**Total Monthly Cost: $0** (for starter projects)

### Upgrade When Needed

When you exceed free limits:
- **Netlify Pro**: $19/month (1TB bandwidth)
- **Supabase Pro**: $25/month (8GB database, no pause)

---

## 📝 Next Steps

After deployment:
1. Setup custom domain
2. Configure SSL (auto with Netlify)
3. Setup email notifications
4. Add Google Analytics
5. Enable Supabase backups
6. Create admin user accounts
7. Add content moderation workflow

---

## 🎉 Congratulations!

Your MERN Islamic Articles Website is now live in production!

**Your URLs:**
- Frontend: `https://[your-frontend].netlify.app`
- Admin: `https://[your-admin].netlify.app`
- API: `https://[your-backend].netlify.app`

For support, open an issue on GitHub or contact the development team.
