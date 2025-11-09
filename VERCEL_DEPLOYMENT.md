# Vercel Deployment Guide

This guide will walk you through deploying Campus Connect to Vercel.

## Prerequisites

- A GitHub, GitLab, or Bitbucket account
- A Vercel account (sign up at [vercel.com](https://vercel.com))
- A Supabase project with the database schema set up

## Step 1: Prepare Your Repository

1. Make sure your code is committed to a Git repository (GitHub, GitLab, or Bitbucket)
2. Ensure all your changes are pushed to the remote repository

## Step 2: Set Up Supabase

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy your:
   - **Project URL** (this is your `VITE_SUPABASE_URL`)
   - **anon/public key** (this is your `VITE_SUPABASE_ANON_KEY`)

## Step 3: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **Add New Project**
3. Import your Git repository:
   - If your repo is on GitHub, GitLab, or Bitbucket, Vercel will detect it
   - Select your repository and click **Import**
4. Configure your project:
   - **Framework Preset**: Vite (should auto-detect)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (should auto-detect)
   - **Output Directory**: `dist` (should auto-detect)
   - **Install Command**: `npm install` (should auto-detect)
5. Add Environment Variables:
   - Click **Environment Variables**
   - Add the following:
     - **Name**: `VITE_SUPABASE_URL`
     - **Value**: Your Supabase project URL
     - **Name**: `VITE_SUPABASE_ANON_KEY`
     - **Value**: Your Supabase anon key
6. Click **Deploy**

### Option B: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Follow the prompts:
   - When asked for environment variables, add:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

5. For production deployment:
   ```bash
   vercel --prod
   ```

## Step 4: Configure Environment Variables

After deployment, you can add or update environment variables:

1. Go to your project on Vercel dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add or update:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Click **Save**
5. Redeploy your project for changes to take effect

## Step 5: Verify Deployment

1. Once deployment is complete, Vercel will provide you with a URL
2. Visit the URL and test the application
3. Make sure:
   - You can sign up/login
   - Projects and events load correctly
   - All features work as expected

## Troubleshooting

### Build Fails

- **TypeScript Errors**: Make sure all TypeScript errors are resolved locally before deploying
- **Missing Dependencies**: Run `npm install` locally to ensure `package-lock.json` is up to date
- **Environment Variables**: Ensure all required environment variables are set in Vercel

### Runtime Errors

- **Supabase Connection**: Verify your Supabase URL and anon key are correct
- **CORS Issues**: Check your Supabase project settings for allowed origins
- **Database Schema**: Ensure you've run the database schema SQL in your Supabase project

### Common Issues

1. **404 on Routes**: The `vercel.json` file includes rewrites to handle client-side routing
2. **Environment Variables Not Working**: Make sure variables are prefixed with `VITE_` for Vite to expose them
3. **Build Timeout**: Large builds might timeout; consider optimizing your bundle size

## Custom Domain

To add a custom domain:

1. Go to your project on Vercel dashboard
2. Navigate to **Settings** → **Domains**
3. Add your domain
4. Follow the DNS configuration instructions

## Continuous Deployment

Vercel automatically deploys:
- Every push to your main/master branch → Production
- Every push to other branches → Preview deployment

## Performance Optimization

Vercel automatically:
- Optimizes your assets
- Provides CDN distribution
- Enables caching headers (configured in `vercel.json`)

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Supabase Documentation](https://supabase.com/docs)

