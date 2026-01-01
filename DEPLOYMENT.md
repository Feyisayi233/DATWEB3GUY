# Deployment Guide for Vercel

This guide will help you deploy your Web3 Airdrop Tracker to Vercel.

## Prerequisites Checklist

- [ ] GitHub repository created and code pushed
- [ ] Vercel account created (sign up at vercel.com)
- [ ] PostgreSQL database ready (Vercel Postgres recommended)

---

## Step 1: Create Vercel Postgres Database

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Storage"** in the sidebar
3. Click **"Create Database"**
4. Select **"Postgres"**
5. Fill in:
   - **Database Name**: `web3-airdrop-db` (or your choice)
   - **Region**: Choose closest to you
6. Click **"Create"**
7. Wait 1-2 minutes for provisioning
8. Click **"View Database"** → Copy the **"Connection String"** (starts with `postgres://...`)
   - **SAVE THIS - You'll need it in Step 3!**

---

## Step 2: Generate NEXTAUTH_SECRET

Run this command in your terminal:

```bash
openssl rand -base64 32
```

Copy the output - you'll need it in Step 3.

---

## Step 3: Deploy to Vercel

### 3.1 Import Your Repository

1. In Vercel Dashboard, click **"Add New..."** → **"Project"**
2. Find your GitHub repository and click **"Import"**
3. Click **"Import"** again

### 3.2 Configure Project

1. **Framework Preset**: Next.js (auto-detected) ✓
2. **Root Directory**: `./` (leave as is) ✓
3. **Build Command**: `npm run build` (already configured) ✓
4. **Output Directory**: `.next` (leave as is) ✓
5. **Install Command**: `npm install` (leave as is) ✓

### 3.3 Add Environment Variables

**IMPORTANT**: Add these variables BEFORE clicking Deploy!

Click **"Environment Variables"** and add each one:

#### Variable 1: DATABASE_URL
- **Key**: `DATABASE_URL`
- **Value**: Your Postgres connection string from Step 1
- **Environment**: Select all three (Production, Preview, Development)
- Click **"Save"**

#### Variable 2: NEXTAUTH_URL
- **Key**: `NEXTAUTH_URL`
- **Value**: `https://your-project-name.vercel.app` (replace with your actual project name)
- **Environment**: Select all three
- Click **"Save"**

#### Variable 3: NEXTAUTH_SECRET
- **Key**: `NEXTAUTH_SECRET`
- **Value**: The secret you generated in Step 2
- **Environment**: Select all three
- Click **"Save"**

#### Variable 4: SMTP_HOST
- **Key**: `SMTP_HOST`
- **Value**: `smtp.gmail.com` (or your SMTP provider)
- **Environment**: Select all three
- Click **"Save"**

#### Variable 5: SMTP_PORT
- **Key**: `SMTP_PORT`
- **Value**: `587`
- **Environment**: Select all three
- Click **"Save"**

#### Variable 6: SMTP_SECURE
- **Key**: `SMTP_SECURE`
- **Value**: `false`
- **Environment**: Select all three
- Click **"Save"**

#### Variable 7: SMTP_USER
- **Key**: `SMTP_USER`
- **Value**: Your email (e.g., `your-email@gmail.com`)
- **Environment**: Select all three
- Click **"Save"**

#### Variable 8: SMTP_PASS
- **Key**: `SMTP_PASS`
- **Value**: Your email app password (see Gmail setup below)
- **Environment**: Select all three
- Click **"Save"**

#### Variable 9: NEXT_PUBLIC_BASE_URL
- **Key**: `NEXT_PUBLIC_BASE_URL`
- **Value**: `https://your-project-name.vercel.app` (same as NEXTAUTH_URL)
- **Environment**: Select all three
- Click **"Save"**

### 3.4 Deploy

1. Scroll down and click **"Deploy"**
2. Wait 2-5 minutes for the build to complete
3. You'll see **"Building..."** then **"Ready"**
4. Click **"Visit"** to see your deployed site!

---

## Step 4: Update Environment Variables with Actual URL

After deployment, you'll get a URL like `https://your-project-name.vercel.app`

1. Go to **Project Settings** → **Environment Variables**
2. Update `NEXTAUTH_URL` to your actual URL
3. Update `NEXT_PUBLIC_BASE_URL` to your actual URL
4. Go to **Deployments** → Click **"..."** on latest → **"Redeploy"**

---

## Step 5: Set Up Database

### Option A: Using Vercel CLI (Recommended)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login:
```bash
vercel login
```

3. Link your project:
```bash
cd "/Users/aruyaibukunoluwa/Desktop/web 3 content creator"
vercel link
```

4. Set DATABASE_URL locally:
```bash
export DATABASE_URL="your-postgres-connection-string"
```

5. Push schema:
```bash
npx prisma db push
```

6. Generate Prisma Client:
```bash
npx prisma generate
```

### Option B: Using Local Terminal

1. Set your DATABASE_URL:
```bash
export DATABASE_URL="your-postgres-connection-string"
```

2. Push schema:
```bash
npx prisma db push
```

3. Generate Prisma Client:
```bash
npx prisma generate
```

---

## Step 6: Create Admin User

1. Make sure DATABASE_URL is set:
```bash
export DATABASE_URL="your-postgres-connection-string"
```

2. Run the create-admin script:
```bash
npm run create-admin
```

3. Follow the prompts to create your admin account

---

## Step 7: Test Your Deployment

1. Visit your site: `https://your-project-name.vercel.app`
2. Test homepage loads
3. Test signup: `/signup`
4. Test login: `/login`
5. Test admin panel: `/admin/login` (use admin credentials from Step 6)

---

## Gmail SMTP Setup (for email notifications)

If using Gmail for SMTP:

1. Enable **2-Step Verification** on your Google account
2. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Select **"Mail"** and **"Other (Custom name)"**
4. Name it: `Vercel Deployment`
5. Click **"Generate"**
6. Copy the 16-character password (no spaces)
7. Use this as your `SMTP_PASS` value

---

## Troubleshooting

### Build Fails
- Check build logs in Vercel Dashboard
- Ensure all environment variables are set
- Verify DATABASE_URL is correct

### Database Connection Errors
- Verify DATABASE_URL in Environment Variables
- Ensure database is active in Vercel Storage
- Check connection string format

### Authentication Not Working
- Verify NEXTAUTH_URL matches your deployment URL
- Ensure NEXTAUTH_SECRET is set
- Redeploy after updating environment variables

---

## Quick Reference

**All Environment Variables Needed:**
```
DATABASE_URL=postgres://...
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-generated-secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
```

---

## Need Help?

If you encounter issues:
1. Check Vercel build logs
2. Verify all environment variables are set
3. Ensure database is accessible
4. Check browser console for errors
