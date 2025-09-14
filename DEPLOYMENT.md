# 🚀 Deployment Guide

## Quick Deploy Options

### 1. Frontend Deployment (Vercel - Recommended)

#### Using Vercel CLI:
```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to client directory
cd client

# Deploy
vercel

# Follow the prompts:
# - Project name: ai-image-enhancer
# - Framework: React
# - Build command: npm run build
# - Output directory: dist
```

#### Using Vercel Dashboard:
1. Go to [vercel.com](https://vercel.com)
2. Import from GitHub: `ujwalaswar23-afk/ImageEnhance`
3. Set root directory to `client`
4. Build command: `npm run build`
5. Output directory: `dist`

### 2. Backend Deployment (Railway - Recommended)

#### Using Railway:
1. Go to [railway.app](https://railway.app)
2. Connect GitHub repository
3. Set root directory to `server`
4. Add environment variables:
   ```
   PORT=3001
   NODE_ENV=production
   GEMINI_API_KEY=your_api_key_here
   CORS_ORIGIN=https://your-frontend-domain.vercel.app
   ```

### 3. Alternative Deployment Options

#### Frontend Alternatives:
- **Netlify**: Drag & drop the `client/dist` folder
- **GitHub Pages**: Use `gh-pages` branch
- **Firebase Hosting**: Use Firebase CLI

#### Backend Alternatives:
- **Heroku**: Create `Procfile` with `web: node index.js`
- **DigitalOcean App Platform**
- **AWS Elastic Beanstalk**

## Environment Variables for Production

### Frontend (.env)
```env
VITE_API_URL=https://your-backend-url.railway.app
```

### Backend (.env)
```env
PORT=3001
NODE_ENV=production
GEMINI_API_KEY=your_google_gemini_api_key
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

## Build Commands

### Frontend:
```bash
cd client
npm install
npm run build
```

### Backend:
```bash
cd server
npm install
npm start
```

## Post-Deployment Checklist

✅ Frontend accessible via HTTPS  
✅ Backend API responding to health checks  
✅ CORS configured for frontend domain  
✅ Environment variables set correctly  
✅ Image upload/download working  
✅ Google Gemini API integration active  
✅ Mobile responsiveness verified  

## Monitoring & Analytics

- Add Google Analytics to track usage
- Set up error monitoring with Sentry
- Monitor API usage and response times
- Set up uptime monitoring

## Performance Optimization

- Enable CDN for static assets
- Implement image compression
- Add Redis for caching processed images
- Set up database for user sessions (optional)

---

🎉 **Your AI Image Enhancer is ready for the world!**