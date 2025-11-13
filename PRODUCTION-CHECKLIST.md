# ✅ Production Deployment Checklist

Use this checklist to ensure everything is ready before going live.

---

## 📋 Pre-Deployment

### 1. Code Review
- [ ] All features working in development
- [ ] No console errors in browser
- [ ] No backend errors in logs
- [ ] All TypeScript errors fixed
- [ ] Code committed to GitHub

### 2. Environment Variables Prepared
- [ ] Generated strong JWT_SECRET (32+ characters)
- [ ] Generated strong SESSION_SECRET (32+ characters)
- [ ] Obtained Google OAuth credentials
- [ ] Noted Supabase DATABASE_URL
- [ ] Planned domain names (frontend, admin, API)

### 3. Accounts Created
- [ ] GitHub account ready
- [ ] Netlify account created
- [ ] Supabase account created
- [ ] Google Cloud Console access

---

## 🗄️ Database Setup (Supabase)

### Step 1: Create Project
- [ ] Created Supabase project
- [ ] Saved database password securely
- [ ] Noted project reference ID
- [ ] Copied DATABASE_URL connection string

### Step 2: Deploy Schema
- [ ] Ran `npx prisma db push` to Supabase
- [ ] Verified all tables created in Table Editor
- [ ] Ran `npm run db:seed` to populate initial data
- [ ] Confirmed roles, categories, tags exist
- [ ] Confirmed admin user exists

### Step 3: Configure Security
- [ ] Enabled Row Level Security (optional)
- [ ] Created database backup
- [ ] Configured connection pooling (if needed)

---

## 🔐 Authentication Setup

### Google OAuth
- [ ] Created OAuth 2.0 Client ID in Google Cloud Console
- [ ] Added authorized redirect URIs for production
- [ ] Added authorized JavaScript origins
- [ ] Saved Client ID and Client Secret
- [ ] Tested OAuth flow

---

## 🌐 GitHub Setup

### Repository
- [ ] Created GitHub repository
- [ ] Repository is private/public (as preferred)
- [ ] Added `.gitignore` configured correctly
- [ ] Committed all code
- [ ] Pushed to main branch
- [ ] Verified code is on GitHub

---

## 🚀 Netlify Deployment

### Backend API
- [ ] Imported project from GitHub
- [ ] Set base directory to `backend`
- [ ] Configured build command
- [ ] Set publish directory to `dist`
- [ ] Added all environment variables:
  - [ ] DATABASE_URL
  - [ ] JWT_SECRET
  - [ ] SESSION_SECRET
  - [ ] GOOGLE_CLIENT_ID
  - [ ] GOOGLE_CLIENT_SECRET
  - [ ] GOOGLE_CALLBACK_URL
  - [ ] NODE_ENV=production
  - [ ] FRONTEND_URL
  - [ ] ADMIN_URL
  - [ ] CORS_ORIGINS
- [ ] Deployment successful
- [ ] Renamed site to meaningful name (e.g., `islamic-articles-api`)
- [ ] Tested API health endpoint

### Frontend Website
- [ ] Imported project from GitHub
- [ ] Set base directory to `frontend`
- [ ] Configured build command
- [ ] Set publish directory to `frontend/dist`
- [ ] Added environment variables:
  - [ ] VITE_API_URL
- [ ] Deployment successful
- [ ] Renamed site (e.g., `islamic-articles-web`)
- [ ] Site loads correctly
- [ ] Articles display
- [ ] Categories work
- [ ] Navigation works

### Admin Panel
- [ ] Imported project from GitHub
- [ ] Set base directory to `admin`
- [ ] Configured build command
- [ ] Set publish directory to `admin/dist`
- [ ] Added environment variables:
  - [ ] VITE_API_URL
- [ ] Deployment successful
- [ ] Renamed site (e.g., `islamic-articles-admin`)
- [ ] Admin login page loads
- [ ] Can login with admin credentials
- [ ] Dashboard shows data
- [ ] All admin features work

---

## 🔄 Update CORS Configuration

- [ ] Updated backend FRONTEND_URL with deployed frontend URL
- [ ] Updated backend ADMIN_URL with deployed admin URL
- [ ] Updated backend CORS_ORIGINS with both URLs
- [ ] Redeployed backend
- [ ] Tested frontend API calls
- [ ] Tested admin API calls
- [ ] No CORS errors in browser console

---

## 🧪 Testing

### Backend API
- [ ] `/api/categories` returns data
- [ ] `/api/articles` returns data
- [ ] Authentication works
- [ ] CORS headers present
- [ ] Error handling works

### Frontend
- [ ] Homepage loads
- [ ] Categories display
- [ ] Articles display
- [ ] Article detail page works
- [ ] Search works
- [ ] Comments load
- [ ] Mobile responsive
- [ ] Images load correctly

### Admin Panel
- [ ] Login works
- [ ] Dashboard loads with real data
- [ ] Article creation works
- [ ] Article editing works
- [ ] Category management works
- [ ] Drag & drop works
- [ ] User management works
- [ ] Media upload works
- [ ] Review workflow works

---

## 🔒 Security

### Credentials
- [ ] Changed default admin password
- [ ] All secrets are random and strong
- [ ] No secrets in code repository
- [ ] All `.env` files in `.gitignore`
- [ ] Database password is strong

### Configuration
- [ ] HTTPS enabled (automatic with Netlify)
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Security headers configured
- [ ] File upload validation works

---

## 📊 Monitoring Setup (Optional)

- [ ] Setup Netlify Analytics
- [ ] Setup Supabase monitoring
- [ ] Configure error tracking (Sentry)
- [ ] Setup uptime monitoring
- [ ] Configure email alerts

---

## 🌍 Custom Domain (Optional)

### Frontend Domain
- [ ] Purchased domain
- [ ] Added domain in Netlify
- [ ] Configured DNS records
- [ ] SSL certificate provisioned
- [ ] Domain resolves correctly
- [ ] Redirects to HTTPS

### Admin Subdomain
- [ ] Added subdomain in Netlify
- [ ] Configured CNAME record
- [ ] SSL certificate provisioned
- [ ] Subdomain works

### Update Google OAuth
- [ ] Updated authorized redirect URIs with custom domain
- [ ] Updated authorized JavaScript origins
- [ ] Tested OAuth with custom domain

---

## 📝 Documentation

- [ ] Updated README with production URLs
- [ ] Documented environment variables
- [ ] Created admin user guide
- [ ] Noted database backup procedure
- [ ] Documented deployment process

---

## 🎉 Go Live

### Final Checks
- [ ] All features tested on production
- [ ] Performance is acceptable
- [ ] Mobile experience is good
- [ ] SEO meta tags configured
- [ ] Analytics working
- [ ] Error tracking working

### Announcement
- [ ] Announced to team
- [ ] Shared URLs with stakeholders
- [ ] Created initial content
- [ ] Invited admins/authors

---

## 📞 Support Plan

- [ ] Created issue tracking system
- [ ] Documented support process
- [ ] Setup monitoring alerts
- [ ] Planned backup schedule
- [ ] Created incident response plan

---

## 🔄 Continuous Deployment

Your site is now live with automatic deployments!

**To deploy updates:**
```bash
git add .
git commit -m "Your changes"
git push origin main
```

Netlify will automatically build and deploy all changes.

---

## 📊 Post-Launch Monitoring

### Week 1
- [ ] Monitor error rates
- [ ] Check database performance
- [ ] Review user feedback
- [ ] Fix critical bugs
- [ ] Optimize slow queries

### Month 1
- [ ] Review analytics
- [ ] Check bandwidth usage
- [ ] Assess database size
- [ ] Plan feature updates
- [ ] Consider upgrade plans if needed

---

## 💰 Cost Monitoring

### Free Tier Limits
- **Netlify**: 100GB bandwidth/month
- **Supabase**: 500MB database, 2GB bandwidth/month
- **Total**: $0/month

### Upgrade When:
- Bandwidth exceeds free tier
- Database size > 500MB
- Need 24/7 support
- Want custom backup schedule

---

## 🆘 Emergency Contacts

- **Netlify Support**: support@netlify.com
- **Supabase Support**: support@supabase.com
- **GitHub Issues**: [Your repo]/issues
- **Development Team**: [Your contact]

---

**Congratulations on your production deployment! 🎉**
