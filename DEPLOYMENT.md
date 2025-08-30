# TruSight Deployment Guide

This guide will help you deploy TruSight to Vercel or any other hosting platform.

## 🚀 Deploy to Vercel (Recommended)

### 1. Prepare Your Repository

1. Push your code to GitHub
2. Ensure all dependencies are in `package.json`
3. Verify your build script works locally

### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your repository

### 3. Configure Environment Variables

In your Vercel project dashboard, go to Settings > Environment Variables and add:

```env
# News API Keys (Optional - app works with mock data if not provided)
NEXT_PUBLIC_GNEWS_API_KEY=your_gnews_api_key_here
NEXT_PUBLIC_NEWSAPI_KEY=your_newsapi_key_here
NEXT_PUBLIC_NEWSDATA_API_KEY=your_newsdata_api_key_here

# App Configuration
NEXT_PUBLIC_APP_NAME=TruSight
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### 4. Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Your app will be live at `https://your-project.vercel.app`

## 🌐 Deploy to Other Platforms

### Netlify

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Add environment variables in Netlify dashboard

### Railway

1. Connect your GitHub repository
2. Railway will auto-detect Next.js
3. Add environment variables in Railway dashboard
4. Deploy automatically

### DigitalOcean App Platform

1. Connect your GitHub repository
2. Select Node.js as runtime
3. Set build command: `npm run build`
4. Set run command: `npm start`
5. Add environment variables

## 🔑 Getting API Keys

### GNews API (Recommended - 100 requests/day free)
1. Visit [GNews](https://gnews.io/)
2. Sign up for a free account
3. Get your API key from the dashboard

### NewsAPI (Alternative - 100 requests/day free)
1. Visit [NewsAPI](https://newsapi.org/)
2. Sign up for a free account
3. Get your API key from the dashboard

### NewsData.io (Alternative - 200 requests/day free)
1. Visit [NewsData.io](https://newsdata.io/)
2. Sign up for a free account
3. Get your API key from the dashboard

## 📝 Environment Variables Reference

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_GNEWS_API_KEY` | GNews API key | No | Mock data used |
| `NEXT_PUBLIC_NEWSAPI_KEY` | NewsAPI key | No | Mock data used |
| `NEXT_PUBLIC_NEWSDATA_API_KEY` | NewsData.io API key | No | Mock data used |
| `NEXT_PUBLIC_APP_NAME` | Application name | No | "TruSight" |
| `NEXT_PUBLIC_APP_URL` | Application URL | No | Auto-detected |

## 🧪 Testing Before Deployment

### Local Build Test

```bash
# Install dependencies
npm install

# Build the application
npm run build

# Test production build
npm start
```

### Environment Variable Test

```bash
# Create .env.local file
cp .env.example .env.local

# Edit with your actual values
nano .env.local

# Test the build
npm run build
```

## 🔧 Build Configuration

### Next.js Configuration

Your `next.config.mjs` is already configured for production:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimized for production
  output: 'standalone',
  experimental: {
    optimizePackageImports: ['lucide-react']
  }
}
```

### Package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

## 📱 Performance Optimization

### Built-in Optimizations

- ✅ Image optimization with Next.js Image component
- ✅ Code splitting and lazy loading
- ✅ CSS optimization with Tailwind CSS
- ✅ Bundle analysis and tree shaking
- ✅ Static generation where possible

### Additional Optimizations

1. **Enable Compression** (Vercel does this automatically)
2. **CDN Configuration** (Vercel Edge Network)
3. **Caching Headers** (Configure in hosting platform)

## 🔒 Security Considerations

### Production Security

- ✅ API keys are client-side (required for news APIs)
- ✅ Input sanitization implemented
- ✅ XSS protection enabled
- ✅ Secure localStorage usage

### Additional Security (Optional)

1. **Rate Limiting**: Implement on your hosting platform
2. **CORS**: Configure if needed
3. **Content Security Policy**: Add CSP headers

## 📊 Monitoring and Analytics

### Vercel Analytics

Already integrated in your app:

```typescript
import { Analytics } from '@vercel/analytics/react'

// In your layout.tsx
<Analytics />
```

### Custom Analytics

Add Google Analytics or other services:

```typescript
// In your layout.tsx
<script
  async
  src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
/>
```

## 🚨 Troubleshooting

### Common Issues

1. **Build Fails**: Check Node.js version (18+ required)
2. **API Errors**: Verify environment variables are set
3. **Image Issues**: Check image URLs and CORS settings
4. **Performance**: Use Vercel Analytics to identify bottlenecks

### Debug Commands

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 📈 Post-Deployment

### Performance Monitoring

1. Use Vercel Analytics dashboard
2. Monitor Core Web Vitals
3. Check API response times
4. Monitor error rates

### Updates and Maintenance

1. **Automatic Deployments**: Enable in Vercel
2. **Environment Variables**: Update as needed
3. **Dependencies**: Keep updated with `npm update`
4. **Backups**: Your code is safe in GitHub

## 🎯 Next Steps

After successful deployment:

1. ✅ Test all features work correctly
2. ✅ Verify news APIs are functioning
3. ✅ Check mobile responsiveness
4. ✅ Monitor performance metrics
5. ✅ Set up custom domain (optional)
6. ✅ Configure analytics (optional)

## 🆘 Support

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Documentation**: [nextjs.org/docs](https://nextjs.org/docs)
- **GitHub Issues**: Create an issue in your repository
- **Community**: Use GitHub Discussions

---

**Happy Deploying! 🚀**
