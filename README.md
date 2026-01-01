# DAT WEB3 GUY - Airdrop Tracker

A comprehensive Next.js website for tracking Web3 airdrops. Built with Next.js 15, TypeScript, Prisma, and Tailwind CSS.

## Features

- **Airdrop Tracker**: Track and review upcoming airdrops with eligibility checkers
- **Personal Dashboard**: Track your airdrop progress and never miss deadlines
- **Progress Tracking**: Step-by-step participation checklist for each airdrop
- **Smart Notifications**: Get reminders for upcoming deadlines and status changes
- **Admin Panel**: Easy-to-use content management interface
- **Search**: Full-text search across all airdrops
- **SEO Optimized**: Sitemap, robots.txt, and dynamic meta tags

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: Prisma with SQLite (can upgrade to PostgreSQL)
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form with Zod validation
- **Rich Text Editor**: TipTap for content editing

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and set:
- `DATABASE_URL`: Database connection string (default: `file:./prisma/dev.db`)
- `NEXTAUTH_SECRET`: A random secret for NextAuth (generate with `openssl rand -base64 32`)
- `NEXTAUTH_URL`: Your site URL (default: `http://localhost:3000`)
- `ADMIN_EMAIL`: Your admin email
- `ADMIN_PASSWORD`: Your admin password (will be hashed)

3. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

4. Create admin user:
```bash
npm run create-admin
```

Or manually create a user in the database with a hashed password using bcrypt.

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the site.

## Admin Panel

Access the admin panel at `/admin/login` using your admin credentials.

### Creating Content

1. **Airdrops**: Go to Admin → Airdrops → New Airdrop
   - Fill in title, description, status
   - Add eligibility criteria and participation steps (with rich text editor)
   - Add social links, verification links, and reward links
   - Set status, reward type, task type, and dates
   - Toggle publish to make it live

## Project Structure

```
web3-content-creator/
├── app/
│   ├── (public)/          # Public routes
│   │   ├── airdrops/     # Airdrop pages
│   │   ├── dashboard/    # User dashboard
│   │   ├── search/       # Search page
│   │   ├── login/        # Login page
│   │   └── signup/       # Signup page
│   ├── admin/            # Admin panel
│   ├── api/              # API routes
│   └── layout.tsx        # Root layout
├── components/
│   ├── ui/               # Reusable UI components
│   ├── admin/            # Admin components
│   ├── airdrops/         # Airdrop components
│   ├── dashboard/        # Dashboard components
│   ├── notifications/    # Notification components
│   └── search/           # Search components
├── lib/                  # Utilities and helpers
├── prisma/               # Database schema
└── public/               # Static assets
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

The database will be created automatically. For production, consider using PostgreSQL instead of SQLite.

### Environment Variables for Production

- `DATABASE_URL`: PostgreSQL connection string (for production)
- `NEXTAUTH_SECRET`: Strong random secret
- `NEXTAUTH_URL`: Your production URL
- `ADMIN_EMAIL`: Admin email
- `ADMIN_PASSWORD`: Admin password (hashed)

## Customization

### Styling

The site uses Tailwind CSS. Customize colors and styles in `tailwind.config.ts`.

### Content Types

To add new content types, update:
1. Prisma schema (`prisma/schema.prisma`)
2. API routes (`app/api/`)
3. Admin forms (`components/admin/`)
4. Public pages (`app/(public)/`)

## License

MIT

