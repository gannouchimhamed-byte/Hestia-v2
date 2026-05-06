# Hestia — Real Estate Tunisia

A modern, full-stack real estate platform built for the Tunisian market.

## Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL via Supabase
- **ORM**: Prisma
- **Auth**: JWT (custom) + bcrypt
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Quick Start

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd hestia
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env.local
# Fill in your Supabase credentials
```

### 3. Setup Database
```bash
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@hestia.tn | admin123 |
| Agent | karim@hestia.tn | agent123 |

## Project Structure

```
hestia/
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts         # Demo data
├── src/
│   ├── app/            # Next.js App Router
│   │   ├── api/        # API routes
│   │   ├── properties/   # Property detail pages
│   │   ├── login/      # Login page
│   │   ├── register/   # Registration page
│   │   ├── agent/      # Agent dashboard
│   │   ├── page.tsx    # Homepage
│   │   └── layout.tsx  # Root layout
│   ├── components/     # React components
│   └── lib/            # Utilities
└── package.json
```

## Deployment

1. Push to GitHub
2. Connect Vercel to your repo
3. Add environment variables in Vercel dashboard
4. Deploy!

## License

MIT
