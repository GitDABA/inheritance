# Netlify Deployment Checklist

## 1. Dependencies & Build
- [ ] Run `npm ci` to ensure clean dependency installation
- [ ] Verify all dependencies are up to date with `npm outdated`
- [ ] Test build locally with `npm run build`
- [ ] Check for TypeScript errors with `npm run type-check`
- [ ] Run linting with `npm run lint`
- [ ] Run tests with `npm test`

## 2. Environment Variables
- [ ] Run `./env.check.sh` to verify all required variables
- [ ] Configure environment variables in Netlify UI:
  - SUPABASE_URL
  - SUPABASE_ANON_KEY
  - NETLIFY_IDENTITY_URL
  - NETLIFY_AUTH_TOKEN
  - NEXT_PUBLIC_SUPABASE_URL
  - NEXT_PUBLIC_SUPABASE_ANON_KEY

## 3. Netlify Configuration
- [ ] Verify netlify.toml configuration:
  - Build command
  - Publish directory
  - Functions directory
  - Environment variables
  - Headers and redirects
  - Cache settings
- [ ] Check Netlify Identity settings
- [ ] Verify Supabase connection
- [ ] Test serverless functions locally

## 4. Performance & Security
- [ ] Run Lighthouse audit
- [ ] Check Content Security Policy
- [ ] Verify CORS settings
- [ ] Test API endpoints
- [ ] Validate authentication flow
- [ ] Check image optimization settings

## 5. Monitoring & Analytics
- [ ] Set up error tracking
- [ ] Configure performance monitoring
- [ ] Enable deploy notifications
- [ ] Set up status alerts

## 6. Deployment Process
- [ ] Test deployment preview
- [ ] Verify automatic builds
- [ ] Check branch deploy settings
- [ ] Test rollback capability

## 7. Post-Deployment
- [ ] Verify SSL/TLS configuration
- [ ] Test custom domain settings
- [ ] Check CDN caching
- [ ] Monitor initial performance
- [ ] Test user authentication
- [ ] Verify database connections

## Commands to Run

```bash
# 1. Clean install dependencies
npm ci

# 2. Check for outdated packages
npm outdated

# 3. Run type checking
npm run type-check

# 4. Run linting
npm run lint

# 5. Run tests
npm test

# 6. Check environment variables
./env.check.sh

# 7. Test build
npm run build

# 8. Test locally
npm run dev:all

# 9. Deploy to Netlify
git push origin main
```

## Common Issues & Solutions

1. Build Cache Issues
   - Clear Netlify cache and rebuild
   - Verify package-lock.json is committed
   - Check .npmrc configuration

2. Environment Variables
   - Double-check all required variables are set
   - Verify variable names match exactly
   - Check for missing NEXT_PUBLIC_ prefixes

3. Function Deployment
   - Verify function bundle size limits
   - Check for correct function directory structure
   - Test functions locally before deployment

4. Authentication Issues
   - Verify Netlify Identity configuration
   - Check redirect URLs
   - Test login flow locally

5. Database Connection
   - Verify Supabase connection strings
   - Test database queries locally
   - Check security rules
