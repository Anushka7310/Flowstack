# Deployment Guide

## Prerequisites

1. **MongoDB Atlas Account**
   - Create a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Whitelist your IP or allow access from anywhere (0.0.0.0/0) for development
   - Create a database user with read/write permissions
   - Get your connection string

2. **Vercel Account**
   - Sign up at [vercel.com](https://vercel.com)
   - Install Vercel CLI: `npm i -g vercel`

3. **GitHub Repository**
   - Push your code to GitHub
   - Repository should be public or you need Vercel Pro for private repos

## Local Development Setup

1. **Clone and Install**
   ```bash
   git clone <your-repo-url>
   cd healthcare-appointment-system
   npm install
   ```

2. **Environment Variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/healthcare?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-key-at-least-32-characters-long-change-this
   JWT_EXPIRES_IN=7d
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NODE_ENV=development
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

4. **Run Tests**
   ```bash
   npm test
   npm run test:coverage
   ```

## Production Deployment to Vercel

### Option 1: Vercel Dashboard (Recommended for First Deploy)

1. **Import Project**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

2. **Configure Environment Variables**
   Add these in Vercel dashboard under Settings → Environment Variables:
   
   ```
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=production-secret-min-32-chars
   JWT_EXPIRES_IN=7d
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   NODE_ENV=production
   ```

3. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy automatically
   - Get your production URL

### Option 2: Vercel CLI

1. **Login to Vercel**
   ```bash
   vercel login
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Set Environment Variables**
   ```bash
   vercel env add MONGODB_URI production
   vercel env add JWT_SECRET production
   vercel env add JWT_EXPIRES_IN production
   vercel env add NEXT_PUBLIC_APP_URL production
   ```

## GitHub Actions CI/CD Setup

1. **Add Secrets to GitHub**
   Go to your repository → Settings → Secrets and variables → Actions

   Add these secrets:
   ```
   MONGODB_URI
   JWT_SECRET
   NEXT_PUBLIC_APP_URL
   VERCEL_TOKEN (from vercel.com/account/tokens)
   VERCEL_ORG_ID (from .vercel/project.json after first deploy)
   VERCEL_PROJECT_ID (from .vercel/project.json after first deploy)
   ```

2. **Get Vercel IDs**
   ```bash
   vercel link
   cat .vercel/project.json
   ```

3. **Push to Main Branch**
   ```bash
   git push origin main
   ```

   GitHub Actions will:
   - Run linting
   - Run tests with coverage
   - Build the application
   - Deploy to Vercel (on main branch only)

## MongoDB Atlas Production Setup

1. **Create Production Database**
   - Use a separate cluster or database for production
   - Enable backup (recommended)
   - Set up monitoring alerts

2. **Security Best Practices**
   - Use strong passwords
   - Restrict IP access to Vercel IPs if possible
   - Enable audit logs (Atlas M10+ clusters)
   - Rotate credentials regularly

3. **Indexes**
   The application will create indexes automatically, but verify:
   ```javascript
   // In MongoDB Atlas → Collections → Indexes
   appointments: { providerId: 1, startTime: 1 }
   appointments: { patientId: 1, startTime: -1 }
   providers: { specialty: 1, isActive: 1 }
   patients: { email: 1 } (unique)
   ```

## Post-Deployment Checklist

- [ ] Test user registration (patient and provider)
- [ ] Test login functionality
- [ ] Test appointment creation
- [ ] Test appointment cancellation
- [ ] Verify JWT token expiration
- [ ] Check error handling (try invalid inputs)
- [ ] Test RBAC (patient can't access provider routes)
- [ ] Monitor MongoDB connection pool
- [ ] Set up error tracking (Sentry recommended)
- [ ] Configure custom domain (optional)

## Monitoring & Maintenance

1. **Vercel Analytics**
   - Enable in Vercel dashboard
   - Monitor performance metrics

2. **MongoDB Atlas Monitoring**
   - Check connection count
   - Monitor query performance
   - Set up alerts for high CPU/memory

3. **Error Tracking**
   - Integrate Sentry or similar
   - Monitor API error rates

4. **Logs**
   ```bash
   vercel logs <deployment-url>
   ```

## Scaling Considerations

1. **Database**
   - Start with M0 (free tier)
   - Upgrade to M10+ for production workloads
   - Consider read replicas for high traffic

2. **Vercel**
   - Free tier: 100GB bandwidth/month
   - Pro tier: Unlimited bandwidth
   - Enterprise: Custom limits

3. **Caching**
   - Implement Redis for session storage (future enhancement)
   - Use Vercel Edge caching for static content

## Troubleshooting

### Build Fails
- Check environment variables are set
- Verify MongoDB connection string format
- Check TypeScript errors: `npm run type-check`

### Runtime Errors
- Check Vercel logs: `vercel logs`
- Verify MongoDB Atlas IP whitelist
- Check JWT_SECRET is set correctly

### Tests Fail in CI
- Ensure test environment variables are set in GitHub Actions
- Check mongodb-memory-server compatibility

## Rollback

If deployment fails:
```bash
vercel rollback <deployment-url>
```

Or redeploy previous commit:
```bash
git revert HEAD
git push origin main
```

## Support

For issues:
1. Check Vercel deployment logs
2. Check MongoDB Atlas logs
3. Review GitHub Actions workflow runs
4. Check application error logs
