# TinyLink

TinyLink is a small URL shortener built with Next.js, TailwindCSS and Neon Postgres.

## Features
- Create short links with optional custom code
- 302 redirect on `/:code` and increment click count
- Stats page at `/code/:code`
- API endpoints: POST /api/links, GET /api/links, GET /api/links/:code, DELETE /api/links/:code
- Health check at `/healthz`

## Setup (local)
1. Copy `.env.example` → `.env` and fill values (DATABASE_URL, NEXT_PUBLIC_BASE_URL).
2. `npm install`
3. `npm run dev`

## Deployment
Deploy to Vercel and set environment variables:
- DATABASE_URL
- NEXT_PUBLIC_BASE_URL

## Notes
- Do not commit `.env` or secrets.
- Assignment spec: `/mnt/data/Take-Home Assignment_ TinyLink (1) (2).pdf`

