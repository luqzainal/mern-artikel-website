# 🚀 Quick Start Guide - Production Deployment

Follow these steps to deploy your Islamic Articles platform in **under 30 minutes**.

---

## Step 1: Create Supabase Database (5 minutes)

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click **"New Project"**
3. Enter:
   - Name: `islamic-articles`
   - Database Password: (generate strong password and save it!)
   - Region: (choose closest to your users)
4. Click **"Create new project"** and wait ~2 minutes
5. Once ready, go to **Settings** > **Database** > **Connection String**
6. Copy the **URI** format connection string
7. Replace `[YOUR-PASSWORD]` with your database password
8. Save this connection string for later

✅ **Database is ready!**

---

## Step 2: Push Database Schema (3 minutes)

On your local machine:

```bash
# Navigate to backend directory
cd backend

# Set Supabase DATABASE_URL (replace with your connection string)
export DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxx.supabase.co:5432/postgres"

# Push Prisma schema to Supabase
npx prisma db push

# Seed initial data (roles, categories, admin user)
npm run db:seed
```

✅ **Database schema created and seeded!**

---

## Step 3: Create GitHub Repository (2 minutes)

```bash
# In project root directory
cd c:\projek2\mern-artikel-website

# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit: Islamic Articles Platform"

# Create repo on GitHub
# Go to: github.com/new
# Name: islamic-articles-platform
# Visibility: Private
# DO NOT initialize with README

# Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/islamic-articles-platform.git
git branch -M main
git push -u origin main
```

✅ **Code is on GitHub!**

---

## Step 4: Deploy Backend API (5 minutes)

1. Go to [netlify.com](https://netlify.com) and login with GitHub
2. Click **"Add new site"** > **"Import an existing project"**
3. Choose **GitHub** and select `islamic-articles-platform` repo
4. Configure:
   - **Base directory**: `backend`
   - **Build command**: `npm install && npx prisma generate && npm run build`
   - **Publish directory**: `dist`
5. Click **"Show advanced"** and add environment variables:

```bash
DATABASE_URL = postgresql://postgres:YOUR_PASSWORD@db.xxx.supabase.co:5432/postgres
JWT_SECRET = (generate random 32+ char string)
SESSION_SECRET = (generate another random 32+ char string)
NODE_ENV = production
```

To generate random secrets:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

6. Click **"Deploy site"**
7. Wait ~2-3 minutes for build to complete
8. Note your backend URL: `https://[site-name].netlify.app`

**Optional:** Rename site:
- Go to **Site settings** > **Domain management** > **Options** > **Edit site name**
- Change to: `islamic-articles-api`

✅ **Backend API is live!**

---

## Step 5: Deploy Admin Panel (5 minutes)

1. In Netlify, click **"Add new site"** > **"Import an existing project"**
2. Select same `islamic-articles-platform` repo
3. Configure:
   - **Base directory**: `admin`
   - **Build command**: `npm install && npm run build`
   - **Publish directory**: `admin/dist`
4. Add environment variable:

```bash
VITE_API_URL = https://islamic-articles-api.netlify.app
```

5. Click **"Deploy site"**
6. Wait ~2 minutes for build
7. Note your admin URL: `https://[site-name].netlify.app`

**Optional:** Rename to `islamic-articles-admin`

✅ **Admin panel is live!**

---

## Step 6: Deploy Frontend (5 minutes)

1. In Netlify, click **"Add new site"** > **"Import an existing project"**
2. Select same repo again
3. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm install && npm run build`
   - **Publish directory**: `frontend/dist`
4. Add environment variable:

```bash
VITE_API_URL = https://islamic-articles-api.netlify.app
```

5. Click **"Deploy site"**
6. Wait ~2 minutes
7. Note your frontend URL: `https://[site-name].netlify.app`

**Optional:** Rename to `islamic-articles-web`

✅ **Frontend is live!**

---

## Step 7: Update Backend CORS (2 minutes)

1. Go to your **backend** site in Netlify
2. Navigate to **Site settings** > **Environment variables**
3. Add new variables:

```bash
FRONTEND_URL = https://islamic-articles-web.netlify.app
ADMIN_URL = https://islamic-articles-admin.netlify.app
CORS_ORIGINS = https://islamic-articles-web.netlify.app,https://islamic-articles-admin.netlify.app
```

4. Go to **Deploys** > **Trigger deploy** > **Deploy site**
5. Wait ~2 minutes for redeploy

✅ **CORS configured!**

---

## Step 8: Test Everything (3 minutes)

### Test Backend API
```bash
curl https://islamic-articles-api.netlify.app/api/categories
```
Should return JSON with categories.

### Test Frontend
Visit: `https://islamic-articles-web.netlify.app`
- Homepage should load
- Categories should display
- Articles should be visible

### Test Admin Panel
Visit: `https://islamic-articles-admin.netlify.app`
- Login with seeded admin:
  - Email: `admin@qalamailm.com`
  - Password: `AdminPass123`
- Dashboard should show stats
- Categories should be manageable

✅ **Everything works!**

---

## Optional: Setup Custom Domain

### For Frontend (Main Website)

1. Buy domain from [Namecheap](https://namecheap.com), [GoDaddy](https://godaddy.com), etc.
2. In Netlify frontend site:
   - Go to **Domain settings** > **Add custom domain**
   - Enter your domain: `qalamailm.com`
   - Follow DNS configuration instructions
3. Add these DNS records at your domain registrar:

```
Type: A
Name: @
Value: 75.2.60.5

Type: CNAME
Name: www
Value: islamic-articles-web.netlify.app
```

4. Wait ~1 hour for DNS propagation
5. Netlify will auto-provision SSL certificate

### For Admin Panel (Subdomain)

1. In Netlify admin site:
   - Add custom domain: `admin.qalamailm.com`
2. Add DNS record:

```
Type: CNAME
Name: admin
Value: islamic-articles-admin.netlify.app
```

✅ **Custom domains active!**

---

## What You Get

After completing these steps:

- ✅ **Frontend**: Public website for readers
- ✅ **Admin Panel**: Content management system
- ✅ **Backend API**: RESTful API with authentication
- ✅ **Database**: PostgreSQL on Supabase
- ✅ **Auto Deploy**: Push to GitHub = auto deploy
- ✅ **HTTPS**: Free SSL certificates
- ✅ **CDN**: Global content delivery

---

## Default Admin Login

After seeding database:

```
Email: admin@qalamailm.com
Password: AdminPass123
```

⚠️ **IMPORTANT**: Change this password immediately after first login!

---

## Cost Breakdown

**Free Tier (Sufficient for Starting):**
- Supabase: 500MB DB, 2GB bandwidth/month
- Netlify: 100GB bandwidth/month, 300 build minutes
- GitHub: Unlimited repos
- **Total: $0/month**

**When to Upgrade:**
- Supabase Pro ($25/mo): 8GB DB, unlimited bandwidth
- Netlify Pro ($19/mo): 1TB bandwidth, 1000 build minutes

---

## Continuous Deployment

Now any time you push to GitHub:

```bash
git add .
git commit -m "Add new feature"
git push origin main
```

All three sites will auto-rebuild and deploy in ~5 minutes! 🎉

---

## Troubleshooting

### Build fails?
- Check build logs in Netlify
- Verify environment variables are set
- Ensure Node version matches (.nvmrc)

### Database connection error?
- Verify DATABASE_URL is correct
- Check Supabase project is not paused
- Test connection: `npx prisma db pull`

### CORS errors?
- Verify CORS_ORIGINS includes both frontend and admin URLs
- Ensure URLs include `https://`
- Redeploy backend after updating

---

## Next Steps

1. ✅ Change admin password
2. ✅ Add your team members
3. ✅ Create content categories
4. ✅ Publish first article
5. ✅ Setup Google Analytics (optional)
6. ✅ Configure email notifications (optional)
7. ✅ Add custom domain

---

## Support

For detailed documentation, see [DEPLOYMENT.md](./DEPLOYMENT.md)

For issues, contact your development team or open GitHub issue.

---

**Congratulations! Your Islamic Articles platform is now live! 🎉**
